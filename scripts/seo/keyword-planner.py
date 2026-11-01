#!/usr/bin/env python3
"""Google Ads Keyword Planner, from this repo (read-only).

Google's own numbers for a keyword: average monthly searches, the 12-month
series, competition, and the low/high top-of-page bid. Volumes are for Perth
unless --geo says otherwise. Free: it uses API quota, not DataForSEO credit.

Usage (from the repo root):
    npm run seo:keywords -- metrics "garage door repairs perth,garage door prices perth"
    npm run seo:keywords -- ideas --seeds "garage door repairs,roller door repairs" --limit 50
    npm run seo:keywords -- ideas --url https://capitalgaragedoors.com.au/cost-guides
    npm run seo:keywords -- ideas --seeds "garage door motor" --geo australia --min-volume 50
    npm run seo:keywords -- geo "Joondalup"       # look up a location's geo ID for --geo
    py -3.12 scripts/seo/keyword-planner.py metrics "garage doors perth" --json

  metrics  exact figures for keywords you already have (close variants are
           merged by Google, so two spellings can return one row)
  ideas    new keywords from up to 20 seeds and/or a page URL
  geo      find the numeric ID of a suburb, city or state for --geo

Reading the figures: volumes are rounded buckets, and Google groups close
variants, so several `ideas` rows can repeat one figure (never add them up).
"-" means Google has no figure for that keyword, which is not the same as zero.

Read-only by construction: the only API methods it can reach are the three in
this file (generateKeywordIdeas, generateKeywordHistoricalMetrics,
geoTargetConstants:suggest). None of them can change an account or spend money.
Nothing is written anywhere; --json only changes what is printed to stdout.

Credentials: the read-only file ~/.ads-platform/google-ads.yaml owned by the
Google Ads System project, or the path in GOOGLE_ADS_YAML. No credential is
copied here, and the executor's credential file is never read. If the refresh
token has expired (invalid_grant), re-run `ads-platform auth setup` there.

The planner needs an account to call through, but its figures are market data,
not that account's data. The account ID is kept out of this public repo, in
~/.config/claude-seo/google-ads-planner.json:
    {"customer_id": "1234567890", "login_customer_id": "optional manager ID"}
or in the env vars GOOGLE_ADS_PLANNER_CUSTOMER_ID and
GOOGLE_ADS_PLANNER_LOGIN_CUSTOMER_ID. Bids are in that account's currency.

Run with `py -3.12`, which has requests and PyYAML.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests
import yaml

# Keep in step with GOOGLE_ADS_API_VERSION in the Google Ads System project.
API_VERSION = "v25"
API_BASE = f"https://googleads.googleapis.com/{API_VERSION}"
TOKEN_URL = "https://oauth2.googleapis.com/token"

LANGUAGE_ENGLISH = "languageConstants/1000"
GEO_PRESETS = {"perth": "1000676", "australia": "2036"}
MAX_SEEDS = 20  # Google's limit for a keyword seed
PAGE_SIZE = 1000
# Keyword planning has its own low per-minute limit, so a 429 is routine.
RETRY_WAITS = (5, 15, 30, 60)


class PlannerError(RuntimeError):
    """A problem with a specific remedy; printed without a stack trace."""


def load_credentials() -> dict:
    path = Path(os.environ.get("GOOGLE_ADS_YAML") or Path.home() / ".ads-platform" / "google-ads.yaml")
    if not path.is_file():
        raise PlannerError(
            f"Credentials not found at {path}. Create them with `ads-platform auth setup` "
            "in the Google Ads System project, or set GOOGLE_ADS_YAML."
        )
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    missing = [k for k in ("developer_token", "client_id", "client_secret", "refresh_token") if not data.get(k)]
    if missing:
        raise PlannerError(f"{path} is missing: {', '.join(missing)}")
    return data


def load_account() -> tuple[str, str | None]:
    """Return (customer_id, login_customer_id), digits only."""
    path = Path.home() / ".config" / "claude-seo" / "google-ads-planner.json"
    stored = json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {}
    customer = os.environ.get("GOOGLE_ADS_PLANNER_CUSTOMER_ID") or stored.get("customer_id")
    login = os.environ.get("GOOGLE_ADS_PLANNER_LOGIN_CUSTOMER_ID") or stored.get("login_customer_id")
    if not customer:
        raise PlannerError(
            f"No account to call through. Add {path} containing "
            '{"customer_id": "1234567890"}, or set GOOGLE_ADS_PLANNER_CUSTOMER_ID.'
        )
    digits = lambda value: "".join(ch for ch in str(value) if ch.isdigit())  # noqa: E731
    return digits(customer), digits(login) if login else None


def access_token(creds: dict) -> str:
    resp = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "refresh_token",
            "client_id": creds["client_id"],
            "client_secret": creds["client_secret"],
            "refresh_token": creds["refresh_token"],
        },
        timeout=30,
    )
    if resp.status_code != 200:
        code = resp.json().get("error", resp.status_code) if resp.content else resp.status_code
        hint = " Re-run `ads-platform auth setup` in the Google Ads System project." if code == "invalid_grant" else ""
        raise PlannerError(f"Google refused the refresh token: {code}.{hint}")
    return resp.json()["access_token"]


def explain(resp: requests.Response) -> str:
    """Reduce a Google Ads error response to its error codes and messages."""
    try:
        error = resp.json()
        error = error[0] if isinstance(error, list) else error
        error = error["error"]
    except (ValueError, KeyError, IndexError, TypeError):
        return f"HTTP {resp.status_code}: {resp.text[:300]}"
    parts = []
    for detail in error.get("details", []):
        for item in detail.get("errors", []):
            codes = "/".join(str(v) for v in item.get("errorCode", {}).values())
            parts.append(f"{codes}: {item.get('message', '')}".strip(": "))
    return f"HTTP {resp.status_code}: " + ("; ".join(parts) or error.get("message", "unknown error"))


class Planner:
    def __init__(self) -> None:
        creds = load_credentials()
        self.headers = {
            "Authorization": f"Bearer {access_token(creds)}",
            "developer-token": str(creds["developer_token"]),
        }
        self.customer_id: str | None = None

    def use_account(self) -> None:
        self.customer_id, login = load_account()
        if login:
            self.headers["login-customer-id"] = login

    def _post(self, url: str, body: dict) -> dict:
        for wait in (*RETRY_WAITS, None):
            resp = requests.post(url, headers=self.headers, json=body, timeout=120)
            if resp.status_code == 200:
                return resp.json()
            if resp.status_code not in (429, 500, 503) or wait is None:
                raise PlannerError(explain(resp))
            print(f"Google returned {resp.status_code}; retrying in {wait}s", file=sys.stderr)
            time.sleep(wait)
        raise AssertionError("unreachable")

    def historical_metrics(self, keywords: list[str], geo: str) -> list[dict]:
        data = self._post(
            f"{API_BASE}/customers/{self.customer_id}:generateKeywordHistoricalMetrics",
            {
                "keywords": keywords,
                "language": LANGUAGE_ENGLISH,
                "geoTargetConstants": [f"geoTargetConstants/{geo}"],
                "keywordPlanNetwork": "GOOGLE_SEARCH",
                "historicalMetricsOptions": {"includeAverageCpc": True},
            },
        )
        return [row(r["text"], r.get("keywordMetrics"), r.get("closeVariants")) for r in data.get("results", [])]

    def keyword_ideas(self, seeds: list[str], url: str | None, geo: str, limit: int) -> list[dict]:
        if seeds and url:
            seed = {"keywordAndUrlSeed": {"keywords": seeds, "url": url}}
        elif url:
            seed = {"urlSeed": {"url": url}}
        else:
            seed = {"keywordSeed": {"keywords": seeds}}
        body = {
            "language": LANGUAGE_ENGLISH,
            "geoTargetConstants": [f"geoTargetConstants/{geo}"],
            "keywordPlanNetwork": "GOOGLE_SEARCH",
            "includeAdultKeywords": False,
            "historicalMetricsOptions": {"includeAverageCpc": True},
            "pageSize": PAGE_SIZE,
            **seed,
        }
        rows: list[dict] = []
        while True:
            data = self._post(f"{API_BASE}/customers/{self.customer_id}:generateKeywordIdeas", body)
            rows += [row(r["text"], r.get("keywordIdeaMetrics")) for r in data.get("results", [])]
            token = data.get("nextPageToken")
            if not token or len(rows) >= limit:
                return rows
            body["pageToken"] = token

    def suggest_geo(self, name: str, country: str) -> list[dict]:
        data = self._post(
            f"{API_BASE}/geoTargetConstants:suggest",
            {"locale": "en", "countryCode": country, "locationNames": {"names": [name]}},
        )
        found = []
        for item in data.get("geoTargetConstantSuggestions", []):
            geo = item.get("geoTargetConstant", {})
            found.append(
                {
                    "id": str(geo.get("id", "")),
                    "name": geo.get("canonicalName") or geo.get("name", ""),
                    "type": geo.get("targetType", ""),
                    "status": geo.get("status", ""),
                }
            )
        return found


def dollars(micros) -> float | None:
    return round(int(micros) / 1_000_000, 2) if micros not in (None, "") else None


def row(text: str, metrics: dict | None, variants: list[str] | None = None) -> dict:
    """One keyword. Volume is None when Google has no figure (not the same as 0)."""
    metrics = metrics or {}
    volume = metrics.get("avgMonthlySearches")
    result = {
        "keyword": text,
        "avg_monthly_searches": int(volume) if volume is not None else None,
        "competition": metrics.get("competition"),
        "competition_index": int(metrics["competitionIndex"]) if "competitionIndex" in metrics else None,
        "low_top_of_page_bid": dollars(metrics.get("lowTopOfPageBidMicros")),
        "high_top_of_page_bid": dollars(metrics.get("highTopOfPageBidMicros")),
        "average_cpc": dollars(metrics.get("averageCpcMicros")),
        "monthly_searches": [
            {
                "year": int(m["year"]) if "year" in m else None,
                "month": m.get("month"),
                "searches": int(m.get("monthlySearches", 0)),
            }
            for m in metrics.get("monthlySearchVolumes", [])
        ],
    }
    if variants:
        result["close_variants"] = variants
    return result


def by_volume(rows: list[dict]) -> list[dict]:
    return sorted(rows, key=lambda r: (-(r["avg_monthly_searches"] or -1), r["keyword"]))


def print_keywords(rows: list[dict]) -> None:
    if not rows:
        print("No results.")
        return
    width = min(max(len(r["keyword"]) for r in rows), 60)
    print(f"{'Keyword':<{width}}  {'Avg/mo':>7}  {'Competition':<11}  {'Idx':>3}  {'Low bid':>8}  {'High bid':>8}")
    fmt = lambda v: "-" if v is None else f"${v:,.2f}"  # noqa: E731
    for r in rows:
        volume = "-" if r["avg_monthly_searches"] is None else f"{r['avg_monthly_searches']:,}"
        index = "-" if r["competition_index"] is None else str(r["competition_index"])
        competition = r["competition"] if r["competition"] not in (None, "UNSPECIFIED") else "-"
        print(
            f"{r['keyword'][:width]:<{width}}  {volume:>7}  {competition:<11}  {index:>3}"
            f"  {fmt(r['low_top_of_page_bid']):>8}  {fmt(r['high_top_of_page_bid']):>8}"
        )
    print(f"\n{len(rows)} keywords")


def split_list(text: str) -> list[str]:
    return [part.strip() for part in text.split(",") if part.strip()]


def resolve_geo(value: str) -> str:
    geo = GEO_PRESETS.get(value.lower(), value)
    if not geo.isdigit():
        raise PlannerError(f'Unknown --geo "{value}". Use perth, australia or a numeric ID (see the geo command).')
    return geo


def main() -> int:
    shared = argparse.ArgumentParser(add_help=False)
    shared.add_argument("--json", action="store_true", help="print JSON, including the 12-month series")

    planner = argparse.ArgumentParser(add_help=False, parents=[shared])
    planner.add_argument("--geo", default="perth", help="perth (default), australia or a numeric geo ID")

    parser = argparse.ArgumentParser(description="Google Ads Keyword Planner (read-only).")
    commands = parser.add_subparsers(dest="command", required=True)

    metrics = commands.add_parser("metrics", parents=[planner], help="figures for keywords you already have")
    metrics.add_argument("keywords", help="comma-separated keywords")

    ideas = commands.add_parser("ideas", parents=[planner], help="new keywords from seeds and/or a URL")
    ideas.add_argument("--seeds", default="", help=f"comma-separated seeds, up to {MAX_SEEDS}")
    ideas.add_argument("--url", help="a page to take ideas from")
    ideas.add_argument("--limit", type=int, default=100, help="most keywords to show (default 100)")
    ideas.add_argument("--min-volume", type=int, default=0, help="hide keywords below this monthly volume")

    geo = commands.add_parser("geo", parents=[shared], help="look up a location's geo ID")
    geo.add_argument("name", help='a suburb, city or state, such as "Joondalup"')
    geo.add_argument("--country", default="AU", help="two-letter country code (default AU)")

    args = parser.parse_args()
    # Windows consoles default to cp1252, which cannot print every keyword.
    sys.stdout.reconfigure(encoding="utf-8")

    client = Planner()

    if args.command == "geo":
        found = client.suggest_geo(args.name, args.country)
        if args.json:
            print(json.dumps(found, indent=2, ensure_ascii=False))
        else:
            for item in found:
                print(f"{item['id']:>9}  {item['type']:<16}  {item['name']}  [{item['status']}]")
            if not found:
                print("No matches.")
        return 0

    client.use_account()
    geo_id = resolve_geo(args.geo)

    if args.command == "metrics":
        keywords = split_list(args.keywords)
        if not keywords:
            raise PlannerError("Give at least one keyword.")
        rows = by_volume(client.historical_metrics(keywords, geo_id))
    else:
        seeds = split_list(args.seeds)
        if not seeds and not args.url:
            raise PlannerError("Give --seeds, --url or both.")
        if len(seeds) > MAX_SEEDS:
            raise PlannerError(f"Google accepts at most {MAX_SEEDS} seeds; got {len(seeds)}.")
        rows = client.keyword_ideas(seeds, args.url, geo_id, args.limit)
        rows = [r for r in rows if (r["avg_monthly_searches"] or 0) >= args.min_volume]
        rows = by_volume(rows)[: args.limit]

    if args.json:
        print(json.dumps(rows, indent=2, ensure_ascii=False))
    else:
        print_keywords(rows)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except PlannerError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
    except requests.RequestException as exc:
        # The name only: request errors can quote the URL and request details.
        print(f"Error: could not reach Google ({type(exc).__name__}).", file=sys.stderr)
        sys.exit(1)
