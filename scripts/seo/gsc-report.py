#!/usr/bin/env python3
"""Search Console measurement report for capitalgaragedoors.com.au.

Pulls a rolling N-day window (default 28) from Search Console, ending 3 days
before today by default (GSC data lags a few days), for all countries and for
Australia alone:

* totals, from a dimensionless query - never a sum of query rows, because the
  query dimension hides anonymised queries (about 65% of Capital's clicks);
* daily clicks/impressions;
* clicks/impressions/position by page-type group (see `classify_page`);
* the top 25 pages and the top 50 queries;
* a brand vs non-brand split of the identifiable queries (brand regex:
  `capital|capitol`, case-insensitive), plus the anonymised remainder;
* a separate GBP line: page URLs carrying `utm_campaign=gbp` or
  `utm_source=google` (the Google Business Profile website link - it measures
  local-pack clicks separately once the owner adds the UTM);
* a per-page table for the money pages in `docs/seo/tracked-pages.json`:
  clicks, impressions, position, and the position for each page's primary query.

Totals are exact, but the rows under them are not: Search Console leaves
anonymised-query clicks out of page and query rows, and once a country filter
is combined with the page dimension it leaves out nearly all of them (the
frozen baseline's Australia page groups add up to 61 of its 174 clicks). Every
rows-based block therefore prints, and the snapshot stores as `rows_sum`, the
clicks its rows add up to beside the exact total. Treat Australia rows as
relative comparisons only; take click counts from the all-country rows.

Writes a full snapshot to `docs/seo/gsc-snapshots/<label>.json` and appends one
summary row to `docs/seo/measurement.md` (re-running a label replaces its row),
unless `--no-write` is given.

Usage (from the repo root):
    npm run seo:report -- --label YYYY-MM-DD
    npm run seo:report -- --end 2026-09-27 --label 2026-09-27-baseline
    npm run seo:report -- --no-write
    py -3.12 scripts/seo/gsc-report.py --days 28

Always targets the property `sc-domain:capitalgaragedoors.com.au`, passed
explicitly - never the shared seo-skill config's default property. Credentials:
the service-account JSON named by the env var GSC_SERVICE_ACCOUNT_FILE if set,
else ~/.config/claude-seo/service_account.json (read-only `webmasters.readonly`
scope). Credentials are never read from, or written to, the repo.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from datetime import date, timedelta
from pathlib import Path
from urllib.parse import urlparse

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

PROPERTY = "sc-domain:capitalgaragedoors.com.au"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
SERVICE_ACCOUNT_ENV = "GSC_SERVICE_ACCOUNT_FILE"

# Any query containing this (case-insensitive) counts as "brand". Everything
# else is "non-brand" - the metric that says whether new pages are earning new
# search demand, not just recall of our own name.
BRAND_RE = re.compile(r"capital|capitol", re.I)

# Page URLs carrying either marker are the Google Business Profile website
# link (owner adds ?utm_source=google&utm_medium=organic&utm_campaign=gbp).
GBP_MARKERS = ("utm_campaign=gbp", "utm_source=google")

# If the page rows add up to less than this share of the exact total clicks
# (Australia's do: about 35%), the printout warns under every rows-based block.
LOW_COVERAGE = 0.9

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
DOCS_SEO_DIR = REPO_ROOT / "docs" / "seo"
SNAPSHOTS_DIR = DOCS_SEO_DIR / "gsc-snapshots"
MEASUREMENT_FILE = DOCS_SEO_DIR / "measurement.md"
TRACKED_PAGES_FILE = DOCS_SEO_DIR / "tracked-pages.json"
BRAND_CONTENT_DIRS = (
    REPO_ROOT / "content" / "brands" / "motors",
    REPO_ROOT / "content" / "brands" / "doors",
)

# --- page classification ----------------------------------------------------

COST_PATHS = frozenset({
    "/cost-guides",
    "/calculator",
    "/garage-door-installation-cost-perth",
})
BRAND_HUB_PATHS = frozenset({
    "/garage-door-brands-perth",
    "/garage-door-motor-brands-perth",
})
DOOR_TYPE_PATHS = frozenset({
    "/garage-doors-perth",
    "/roller-doors-perth",
    "/sectional-garage-doors-perth",
    "/tilt-garage-doors-perth",
    "/custom-garage-doors-perth",
    "/commercial-garage-doors-perth",
    "/commercial-roller-doors-perth",
    "/industrial-roller-doors-perth",
    "/garage-door-motors-perth",
})
SERVICE_PATHS = frozenset({
    "/garage-door-repairs-perth",
    "/emergency-garage-door-repairs-perth",
    "/garage-door-spring-repair-perth",
    "/garage-door-opener-repair-perth",
    "/garage-door-maintenance-perth",
    "/roller-door-repairs-perth",
    "/garage-door-remote-replacement-perth",
    "/garage-door-panel-replacement-perth",
    "/garage-door-installation-perth",
    "/roller-door-installation-perth",
    "/roller-door-vs-sectional-door",
})
# Leading words that make a "-garage-doors-perth" slug a door-type page, not a
# brand page (used only by the naming-convention fallback below).
DOOR_TYPE_WORDS = frozenset({"roller", "sectional", "tilt", "custom", "commercial", "industrial"})

_SLUG_FIELD_RE = re.compile(r'^\s*slug:\s*"([a-z0-9-]+)"', re.M)
_BRAND_SLUG_RE = re.compile(r"^(?P<brand>.+)-garage-(?:door-motors|doors)-perth$")


def load_brand_slugs() -> frozenset[str]:
    """Brand page slugs, read from the brand registry's content files.

    Brand pages are local content (content/brands/{motors,doors}/<x>.ts, each
    with one `slug: "..."` field), so reading the files means a newly added
    brand page is classified without editing this script. Returns an empty set
    when the folders can't be read; `is_brand_slug` then falls back to the
    naming convention.
    """
    slugs: set[str] = set()
    for folder in BRAND_CONTENT_DIRS:
        if not folder.is_dir():
            continue
        for file in sorted(folder.glob("*.ts")):
            m = _SLUG_FIELD_RE.search(file.read_text(encoding="utf-8"))
            if m and _BRAND_SLUG_RE.match(m.group(1)):
                slugs.add(m.group(1))
    return frozenset(slugs)


BRAND_SLUGS = load_brand_slugs()
if not BRAND_SLUGS:
    print("warning: content/brands not readable - classifying brand pages by naming convention",
          file=sys.stderr)


def is_brand_slug(slug: str) -> bool:
    if BRAND_SLUGS:
        return slug in BRAND_SLUGS
    m = _BRAND_SLUG_RE.match(slug)
    return bool(m) and m.group("brand").split("-")[0] not in DOOR_TYPE_WORDS


def page_path(url: str) -> str:
    """Host-less, query-less path without a trailing slash ("/" for the home page)."""
    path = urlparse(url).path or "/"
    return path.rstrip("/") or "/"


def classify_page(url: str) -> str:
    """Bucket a GSC page URL into one of the fixed page groups.

    Groups: home, cost, suburb, brand, door-type, service, blog, case-study,
    problem, static. Capital's flat pages (brand, service, door-type, cost and
    suburb pages) all live at one top-level slug, so the more specific
    patterns are checked first. `/?...` query variants (for example the GBP
    UTM link) count as the home page.
    """
    path = page_path(url)
    if path == "/":
        return "home"
    is_blog = path.startswith(("/blog/", "/blogs/"))
    if (
        path in COST_PATHS
        or path.startswith("/cost-guides/")
        or path.endswith("-cost-perth")
        or (is_blog and "cost" in path.rsplit("/", 1)[-1])
    ):
        return "cost"
    m = re.match(r"^/garage-door-repairs-([^/]+)$", path)
    if m and m.group(1) != "perth":
        return "suburb"
    if path in BRAND_HUB_PATHS or (path.count("/") == 1 and is_brand_slug(path[1:])):
        return "brand"
    if path in DOOR_TYPE_PATHS:
        return "door-type"
    if path in SERVICE_PATHS:
        return "service"
    if is_blog:
        return "blog"
    if path.startswith("/case-studies/"):
        return "case-study"
    if path.startswith("/problems/"):
        return "problem"
    return "static"


def is_gbp_url(url: str) -> bool:
    lowered = url.lower()
    return any(marker in lowered for marker in GBP_MARKERS)


def norm_query(q: str) -> str:
    return " ".join(q.lower().split())


# --- Search Console access --------------------------------------------------


def service_account_file() -> Path:
    override = os.environ.get(SERVICE_ACCOUNT_ENV)
    if override:
        return Path(override).expanduser()
    return Path.home() / ".config" / "claude-seo" / "service_account.json"


def gsc_service():
    sa_file = service_account_file()
    if not sa_file.is_file():
        raise SystemExit(
            f"Service account file not found: {sa_file}\n"
            f"Set {SERVICE_ACCOUNT_ENV} to its path, or put it at ~/.config/claude-seo/service_account.json."
        )
    creds = service_account.Credentials.from_service_account_file(str(sa_file), scopes=SCOPES)
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False).searchanalytics()


RETRYABLE_STATUSES = {429, 500, 502, 503, 504}


def _execute(request):
    """Execute an API request, retrying transient failures (fail fast on 4xx)."""
    for attempt in range(4):
        try:
            return request.execute()
        except HttpError as exc:
            if exc.resp.status not in RETRYABLE_STATUSES or attempt == 3:
                raise
        except OSError:
            if attempt == 3:
                raise
        time.sleep(5 * (attempt + 1))
    return {}


def query(svc, start: str, end: str, dimensions: list[str], *, aus_only: bool,
          row_limit: int = 25000) -> list[dict]:
    """Run one searchAnalytics query, paging past the API's 25,000-row cap.

    With no dimensions the API returns a single property-level row (the
    accurate total, anonymised queries included).
    """
    body: dict = {"startDate": start, "endDate": end, "rowLimit": row_limit}
    if dimensions:
        body["dimensions"] = dimensions
    if aus_only:
        body["dimensionFilterGroups"] = [{
            "filters": [{"dimension": "country", "expression": "aus", "operator": "equals"}],
        }]
    rows: list[dict] = []
    start_row = 0
    while True:
        batch = _execute(svc.query(siteUrl=PROPERTY, body={**body, "startRow": start_row})).get("rows", [])
        rows.extend(batch)
        if len(batch) < row_limit:
            return rows
        start_row += row_limit


# --- aggregation ------------------------------------------------------------


def sums(rows: list[dict]) -> dict:
    """Clicks/impressions summed; position is impression-weighted."""
    clicks = int(round(sum(r["clicks"] for r in rows)))
    impressions = int(round(sum(r["impressions"] for r in rows)))
    weighted = sum(r["position"] * r["impressions"] for r in rows)
    return {
        "clicks": clicks,
        "impressions": impressions,
        "ctr": round(clicks / impressions, 4) if impressions else 0.0,
        "position": round(weighted / impressions, 1) if impressions else None,
    }


def property_totals(svc, start: str, end: str, aus_only: bool) -> dict:
    rows = query(svc, start, end, [], aus_only=aus_only)
    if not rows:
        return {"clicks": 0, "impressions": 0, "ctr": 0.0, "position": None}
    r = rows[0]
    return {
        "clicks": int(round(r["clicks"])),
        "impressions": int(round(r["impressions"])),
        "ctr": round(r["ctr"], 4),
        "position": round(r["position"], 1),
    }


def group_by_page(rows: list[dict]) -> dict:
    groups: dict[str, list[dict]] = {}
    for r in rows:
        groups.setdefault(classify_page(r["keys"][0]), []).append(r)
    return {g: sums(rs) for g, rs in groups.items()}


def brand_split(query_rows: list[dict], total: dict) -> dict:
    """Brand / non-brand over the identifiable queries, plus what GSC hides.

    `anonymised` is the property total minus every identifiable query row -
    the long-tail queries GSC never returns. Those are overwhelmingly
    non-brand, so "non-brand clicks" elsewhere means total minus brand.
    """
    brand = [r for r in query_rows if BRAND_RE.search(r["keys"][0])]
    non_brand = [r for r in query_rows if not BRAND_RE.search(r["keys"][0])]
    b, n = sums(brand), sums(non_brand)
    return {
        "brand": b,
        "non_brand": n,
        "anonymised": {
            "clicks": max(total["clicks"] - b["clicks"] - n["clicks"], 0),
            "impressions": max(total["impressions"] - b["impressions"] - n["impressions"], 0),
        },
    }


def gbp_line(page_rows: list[dict]) -> dict:
    rows = [r for r in page_rows if is_gbp_url(r["keys"][0])]
    pages = sorted(
        ({"page": r["keys"][0], "clicks": int(round(r["clicks"])), "impressions": int(round(r["impressions"])),
          "position": round(r["position"], 1)} for r in rows),
        key=lambda p: (-p["clicks"], -p["impressions"]),
    )
    return {**sums(rows), "pages": pages}


def load_tracked_pages() -> list[dict]:
    if not TRACKED_PAGES_FILE.is_file():
        return []
    data = json.loads(TRACKED_PAGES_FILE.read_text(encoding="utf-8"))
    return [p for p in data if isinstance(p, dict) and p.get("path")]


def tracked_report(tracked: list[dict], page_rows: list[dict], pair_rows: list[dict]) -> list[dict]:
    """Per money page: page-level totals plus its primary query's position.

    Query-string URL variants (the GBP UTM link) are left out here - they are
    reported on the GBP line - so a page's position isn't blended with the
    local-pack position. `top_page` names the page Google shows most for the
    primary query when that isn't the tracked page (cannibalisation flag).
    """
    pages: dict[str, list[dict]] = {}
    for r in page_rows:
        if not urlparse(r["keys"][0]).query:
            pages.setdefault(page_path(r["keys"][0]), []).append(r)

    pairs: dict[tuple[str, str], list[dict]] = {}
    for r in pair_rows:
        q, url = r["keys"]
        if not urlparse(url).query:
            pairs.setdefault((norm_query(q), page_path(url)), []).append(r)

    report = []
    for t in tracked:
        path, q = t["path"], t.get("primaryQuery", "")
        nq = norm_query(q)
        q_rows = pairs.get((nq, path), [])
        q_stats = sums(q_rows) if q_rows else None
        rivals = {p: sums(rs) for (pq, p), rs in pairs.items() if pq == nq}
        top_page = None
        if rivals:
            top_path, top = max(rivals.items(), key=lambda kv: (kv[1]["impressions"], -(kv[1]["position"] or 999)))
            if top_path != path:
                top_page = {"page": top_path, **top}
        report.append({
            "path": path,
            "group": t.get("group") or classify_page(path),
            **sums(pages.get(path, [])),
            "primary_query": {
                "query": q,
                "clicks": q_stats["clicks"] if q_stats else 0,
                "impressions": q_stats["impressions"] if q_stats else 0,
                "position": q_stats["position"] if q_stats else None,
                "top_page": top_page,
            },
        })
    return report


def rows_sums(win: dict) -> dict:
    """Clicks summed over the rows of each rows-based block, to set beside `totals.clicks`.

    `totals` (dimensionless query) is exact; page and query rows can add up to
    less, because Search Console leaves anonymised-query clicks out of them -
    nearly all of them once a country filter is combined with the page
    dimension. Derived only from the window's own blocks, so it can be
    recomputed for a snapshot that predates it.
    """
    return {
        "page_groups": sum(g["clicks"] for g in win["page_groups"].values()),
        "top_pages": sum(p["clicks"] for p in win["top_pages"]),
        "tracked_pages": sum(t["clicks"] for t in win["tracked_pages"]),
        "top_queries": sum(q["clicks"] for q in win["top_queries"]),
    }


def build_window(svc, start: str, end: str, aus_only: bool, tracked: list[dict]) -> dict:
    total = property_totals(svc, start, end, aus_only)
    daily_rows = query(svc, start, end, ["date"], aus_only=aus_only)
    page_rows = query(svc, start, end, ["page"], aus_only=aus_only)
    query_rows = query(svc, start, end, ["query"], aus_only=aus_only)
    pair_rows = query(svc, start, end, ["query", "page"], aus_only=aus_only) if tracked else []

    daily = sorted(
        ({"date": r["keys"][0], "clicks": int(round(r["clicks"])), "impressions": int(round(r["impressions"]))}
         for r in daily_rows),
        key=lambda d: d["date"],
    )
    top_pages = sorted(
        ({"page": r["keys"][0], "group": classify_page(r["keys"][0]), "clicks": int(round(r["clicks"])),
          "impressions": int(round(r["impressions"])), "position": round(r["position"], 1)} for r in page_rows),
        key=lambda r: (-r["clicks"], -r["impressions"]),
    )[:25]
    top_queries = sorted(
        ({"query": r["keys"][0], "clicks": int(round(r["clicks"])), "impressions": int(round(r["impressions"])),
          "position": round(r["position"], 1)} for r in query_rows),
        key=lambda r: (-r["clicks"], -r["impressions"]),
    )[:50]

    win = {
        "totals": total,
        "daily": daily,
        "page_groups": group_by_page(page_rows),
        "top_pages": top_pages,
        "top_queries": top_queries,
        "brand_split": brand_split(query_rows, total),
        "gbp": gbp_line(page_rows),
        "tracked_pages": tracked_report(tracked, page_rows, pair_rows),
    }
    win["rows_sum"] = rows_sums(win)
    return win


# --- output -----------------------------------------------------------------


def fmt_pos(p) -> str:
    return "-" if p is None else f"{p:.1f}"


def print_rows_sum(win: dict, block: str, what: str) -> None:
    """Under a rows-based block: the clicks its rows add up to, beside the exact total.

    Warns when the page rows cover under LOW_COVERAGE of the total (the
    Australia window), because the block's numbers are then only good for
    comparing rows with each other.
    """
    total = win["totals"]["clicks"]
    rs = win.get("rows_sum") or rows_sums(win)  # a snapshot older than rows_sum has none
    share = f"{rs[block] / total:.0%}; " if total else ""
    warn = ""
    if block != "top_queries" and total and rs["page_groups"] < LOW_COVERAGE * total:
        warn = ("  <- Search Console left anonymised-query clicks out of these rows: "
                "compare rows with each other, not with the total")
    print(f"  rows sum {rs[block]} of {total} total clicks ({share}{what}){warn}")


def print_groups(title: str, win: dict) -> None:
    total = win["totals"]["clicks"]
    print(f"-- {title} --")
    for g, v in sorted(win["page_groups"].items(), key=lambda kv: (-kv[1]["clicks"], -kv[1]["impressions"])):
        share = f"{v['clicks'] / total:>4.0%}" if total else "   -"
        print(f"  {g:<11} clicks={v['clicks']:<5} {share}  impressions={v['impressions']:<7} "
              f"position={fmt_pos(v['position'])}")
    print_rows_sum(win, "page_groups", "all page rows")
    print()


def print_report(label: str, start: str, end: str, days: int, all_win: dict, aus_win: dict) -> None:
    t, ta = all_win["totals"], aus_win["totals"]
    print(f"\n=== GSC report: {label} ({start} .. {end}, {days} days) ===")
    print(f"property: {PROPERTY}\n")

    print("-- Totals (dimensionless query, all countries) --")
    print(f"  clicks: {t['clicks']} ({t['clicks'] / days:.2f}/day)   impressions: {t['impressions']}   "
          f"ctr: {t['ctr']:.2%}   avg position: {fmt_pos(t['position'])}")
    print("-- Totals (Australia) --")
    print(f"  clicks: {ta['clicks']} ({ta['clicks'] / days:.2f}/day)   impressions: {ta['impressions']}   "
          f"ctr: {ta['ctr']:.2%}   avg position: {fmt_pos(ta['position'])}\n")

    split = all_win["brand_split"]
    print("-- Brand vs non-brand queries (all countries, brand regex: 'capital|capitol') --")
    print(f"  brand:      clicks={split['brand']['clicks']:<5} impressions={split['brand']['impressions']}")
    print(f"  non-brand:  clicks={split['non_brand']['clicks']:<5} impressions={split['non_brand']['impressions']}"
          f"   (identifiable queries only)")
    print(f"  anonymised: clicks={split['anonymised']['clicks']:<5} impressions={split['anonymised']['impressions']}"
          f"   (total minus identifiable queries)")
    print(f"  => non-brand clicks incl. anonymised: {t['clicks'] - split['brand']['clicks']}\n")

    print_groups("Page groups (all countries)", all_win)
    print_groups("Page groups (Australia)", aus_win)

    g = all_win["gbp"]
    print("-- GBP line (page URLs with utm_campaign=gbp or utm_source=google; also counted in the groups above) --")
    print(f"  clicks={g['clicks']}  impressions={g['impressions']}  position={fmt_pos(g['position'])}  "
          f"urls={len(g['pages'])}")
    for p in g["pages"]:
        print(f"    {p['clicks']:<4} clicks  {p['impressions']:<6} imp  pos {p['position']:<5} {p['page']}")
    print()

    if all_win["tracked_pages"]:
        print("-- Tracked pages (all countries; query-pos = primary query on this page) --")
        print(f"  {'clicks':>6} {'impr':>7} {'pos':>6} {'q-pos':>6} {'q-impr':>6}  {'page':<44} primary query")
        for r in all_win["tracked_pages"]:
            pq = r["primary_query"]
            rival = pq["top_page"]
            note = f"  [most impressions for it: {rival['page']}, pos {fmt_pos(rival['position'])}]" if rival else ""
            print(f"  {r['clicks']:>6} {r['impressions']:>7} {fmt_pos(r['position']):>6} "
                  f"{fmt_pos(pq['position']):>6} {pq['impressions']:>6}  {r['path']:<44} {pq['query']}{note}")
        print_rows_sum(all_win, "tracked_pages", f"{len(all_win['tracked_pages'])} tracked pages")
        print()

    print("-- Top 25 pages (all countries) --")
    for p in all_win["top_pages"]:
        print(f"  {p['clicks']:<5} clicks  {p['impressions']:<7} imp  pos {p['position']:<6} "
              f"{p['group']:<10} {p['page']}")
    print_rows_sum(all_win, "top_pages", f"top {len(all_win['top_pages'])} pages")

    print("\n-- Top 50 queries (all countries; identifiable queries only) --")
    for q in all_win["top_queries"]:
        print(f"  {q['clicks']:<5} clicks  {q['impressions']:<7} imp  pos {q['position']:<6} {q['query']}")
    print_rows_sum(all_win, "top_queries", f"top {len(all_win['top_queries'])} identifiable queries")
    print()


def write_text(path: Path, text: str) -> None:
    # LF line endings regardless of platform: the repo index is LF.
    with path.open("w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def write_snapshot(label: str, payload: dict) -> Path:
    SNAPSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    out = SNAPSHOTS_DIR / f"{label}.json"
    write_text(out, json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    return out


MEASUREMENT_HEADER = """# Measurement log

Weekly Search Console tracking for capitalgaragedoors.com.au (property
`sc-domain:capitalgaragedoors.com.au`) while the 2026-10 SEO growth program
(`docs/seo/growth-plan-2026-10.md`) runs. One row per report run: a trailing
28-day window ending about 3 days before the run (Search Console data lags a
few days), all countries unless a column says AU.

## Target

**Double organic clicks: 187 -> 380 clicks per 28 days (13.6/day)**, all
countries, on the `sc-domain` property. Compare the `clicks` column of the
28-day rows below against 380.

## How to run

```
npm run seo:report -- --label YYYY-MM-DD
```

The window ends 3 days before today (`--end YYYY-MM-DD` overrides it, `--days N`
changes the length, `--no-write` prints without writing). Each run writes
`docs/seo/gsc-snapshots/<label>.json` and appends a row here. The per-page
table for the money pages in `docs/seo/tracked-pages.json` is in the printout
and the snapshot.

## Columns

- **clicks / impressions / avg pos**: property totals from a dimensionless
  query. They include the ~65% of clicks Search Console hides as anonymised
  queries, so never compare them with sums of query rows.
- **clicks/day**: clicks divided by the window length.
- **AU clicks**: the same window filtered to country = Australia. The total is
  exact (dimensionless query), but Australia page rows are for relative
  comparison only: Search Console drops anonymised-query clicks from page rows
  once a country filter is applied, so the baseline's Australia page groups add
  up to 61 of its 174 clicks (each block prints its `rows sum`); take
  page-level click counts from the all-country rows.
- **brand**: clicks from identifiable queries containing `capital` or `capitol`.
- **non-brand**: clicks minus brand (includes anonymised queries).
- **GBP-UTM (clicks / impr / pos)**: page URLs containing `utm_campaign=gbp` or
  `utm_source=google`, i.e. the Google Business Profile website link once it
  carries the UTM. These clicks are also inside `clicks`. Expect 0 until the
  link is tagged.

## Baseline

The first row, `2026-09-27-baseline` (window 2026-08-31..2026-09-27), is the
frozen baseline; never re-run the script with that label. Full detail is in
`docs/seo/gsc-snapshots/2026-09-27-baseline.json`.

## Runs

| label | window | clicks | clicks/day | impressions | avg pos | AU clicks | brand | non-brand | GBP-UTM (clicks / impr / pos) |
|---|---|---|---|---|---|---|---|---|---|
"""


def append_measurement_row(label: str, start: str, end: str, days: int, all_win: dict, aus_win: dict) -> None:
    DOCS_SEO_DIR.mkdir(parents=True, exist_ok=True)
    if not MEASUREMENT_FILE.exists():
        write_text(MEASUREMENT_FILE, MEASUREMENT_HEADER)

    t = all_win["totals"]
    brand_clicks = all_win["brand_split"]["brand"]["clicks"]
    g = all_win["gbp"]
    row = (
        f"| {label} | {start}..{end} | {t['clicks']} | {t['clicks'] / days:.2f} | {t['impressions']:,} | "
        f"{fmt_pos(t['position'])} | {aus_win['totals']['clicks']} | {brand_clicks} | "
        f"{t['clicks'] - brand_clicks} | {g['clicks']} / {g['impressions']:,} / {fmt_pos(g['position'])} |\n"
    )

    lines = MEASUREMENT_FILE.read_text(encoding="utf-8").splitlines(keepends=True)
    for i, line in enumerate(lines):
        if line.startswith(f"| {label} |"):  # re-running a label replaces its row
            lines[i] = row
            break
    else:
        if lines and not lines[-1].endswith("\n"):
            lines[-1] += "\n"
        lines.append(row)
    write_text(MEASUREMENT_FILE, "".join(lines))


def main() -> None:
    # Queries can contain non-ASCII characters; don't die on a cp1252 console.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--end", help="Window end date YYYY-MM-DD (default: today - 3 days)")
    ap.add_argument("--days", type=int, default=28, help="Window length in days (default: 28)")
    ap.add_argument("--label", help="Snapshot label / filename stem (default: the end date)")
    ap.add_argument("--no-write", action="store_true", help="Print the report but don't write files")
    args = ap.parse_args()
    if args.days < 1:
        ap.error("--days must be at least 1")

    try:
        end_date = date.fromisoformat(args.end) if args.end else date.today() - timedelta(days=3)
    except ValueError:
        ap.error("--end must be a date in YYYY-MM-DD form")
    start_date = end_date - timedelta(days=args.days - 1)
    end, start = end_date.isoformat(), start_date.isoformat()
    label = args.label or end
    if not re.fullmatch(r"[A-Za-z0-9._-]+", label):  # it becomes a filename and a table cell
        ap.error("--label may only contain letters, digits, '.', '_' and '-'")

    tracked = load_tracked_pages()
    svc = gsc_service()
    try:
        all_win = build_window(svc, start, end, aus_only=False, tracked=tracked)
        aus_win = build_window(svc, start, end, aus_only=True, tracked=tracked)
    except HttpError as exc:
        raise SystemExit(f"Search Console API error {exc.resp.status}: {exc.reason}")

    print_report(label, start, end, args.days, all_win, aus_win)

    if args.no_write:
        print("(--no-write: snapshot and measurement.md not updated)")
        return

    payload = {
        "label": label,
        "property": PROPERTY,
        "start": start,
        "end": end,
        "days": args.days,
        "generated": date.today().isoformat(),
        "all": all_win,
        "aus": aus_win,
    }
    out_path = write_snapshot(label, payload)
    append_measurement_row(label, start, end, args.days, all_win, aus_win)
    print(f"Wrote {out_path.relative_to(REPO_ROOT).as_posix()}")
    print(f"Updated {MEASUREMENT_FILE.relative_to(REPO_ROOT).as_posix()}")


if __name__ == "__main__":
    main()
