#!/usr/bin/env python3
"""GA4 lead-attribution report for capitalgaragedoors.com.au.

Answers "which channels and which landing pages produce leads?" from the GA4
Data API (property 544287277, read-only `analytics.readonly` scope):

  (a) sessions by default channel group
  (b) lead and intent events by event name x channel group
  (c) lead events by landing page, Organic Search only - the table that
      answers "which pages produce customers"
  (d) organic sessions by landing page (top 30)
  (e) AI-assistant referrals (channel "AI Assistant") by source and landing page

Events (fired by lib/analytics.ts `track()`):
  leads  - quote_submit, booking_submit (real leads), call_click, email_click (taps)
  intent - quote_open, booking_open, chat_open, chat_message, calculator_complete

Usage (from the repo root):
    npm run seo:ga4                                   # last 28 days, ending yesterday
    npm run seo:ga4 -- --days 56
    npm run seo:ga4 -- --start 2026-08-02 --end 2026-09-28
    npm run seo:ga4 -- --json                         # same data as JSON on stdout
    py -3.12 scripts/seo/ga4-leads.py --days 28

Read-only: it writes nothing anywhere. `--json` only changes what is printed to
stdout (redirect it yourself if you want a file). If only one of --start/--end
is given the other is derived (end defaults to yesterday, start to end minus
--days + 1); --start wins over --days.

Credentials: the service-account JSON named by the env var
GSC_SERVICE_ACCOUNT_FILE if set, else ~/.config/claude-seo/service_account.json.
The account needs Viewer access to the GA4 property. Run with `py -3.12`
(the interpreter that has google-analytics-data installed).
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import date, timedelta
from pathlib import Path

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Filter,
    FilterExpression,
    FilterExpressionList,
    Metric,
    OrderBy,
    RunReportRequest,
)
from google.api_core.exceptions import GoogleAPICallError
from google.oauth2 import service_account

PROPERTY = "properties/544287277"
SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
SERVICE_ACCOUNT_ENV = "GSC_SERVICE_ACCOUNT_FILE"

ORGANIC = "Organic Search"
AI_CHANNEL = "AI Assistant"

LEAD_EVENTS = ["quote_submit", "booking_submit", "call_click", "email_click"]
INTENT_EVENTS = ["quote_open", "booking_open", "chat_open", "chat_message", "calculator_complete"]
EVENTS = LEAD_EVENTS + INTENT_EVENTS


# --- GA4 access -------------------------------------------------------------


def service_account_file() -> Path:
    override = os.environ.get(SERVICE_ACCOUNT_ENV)
    if override:
        return Path(override).expanduser()
    return Path.home() / ".config" / "claude-seo" / "service_account.json"


def ga4_client() -> BetaAnalyticsDataClient:
    sa_file = service_account_file()
    if not sa_file.is_file():
        raise SystemExit(
            f"Service account file not found: {sa_file}\n"
            f"Set {SERVICE_ACCOUNT_ENV} to its path, or put it at ~/.config/claude-seo/service_account.json."
        )
    creds = service_account.Credentials.from_service_account_file(str(sa_file), scopes=SCOPES)
    return BetaAnalyticsDataClient(credentials=creds)


def _string_is(field: str, value: str) -> FilterExpression:
    return FilterExpression(filter=Filter(
        field_name=field,
        string_filter=Filter.StringFilter(value=value, match_type=Filter.StringFilter.MatchType.EXACT),
    ))


def _in_list(field: str, values: list[str]) -> FilterExpression:
    return FilterExpression(filter=Filter(field_name=field, in_list_filter=Filter.InListFilter(values=values)))


def _all_of(*expressions: FilterExpression) -> FilterExpression:
    return FilterExpression(and_group=FilterExpressionList(expressions=list(expressions)))


def run_report(client, start: str, end: str, dimensions: list[str], metric: str, *,
               dimension_filter: FilterExpression | None = None, limit: int = 10000) -> list[tuple[list[str], int]]:
    """One GA4 report -> [(dimension values, metric value)], largest first."""
    request = RunReportRequest(
        property=PROPERTY,
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[Dimension(name=d) for d in dimensions],
        metrics=[Metric(name=metric)],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=metric), desc=True)],
        limit=limit,
    )
    if dimension_filter is not None:
        request.dimension_filter = dimension_filter
    response = client.run_report(request)
    return [
        ([v.value for v in row.dimension_values], int(float(row.metric_values[0].value)))
        for row in response.rows
    ]


# --- the five reports -------------------------------------------------------


def share(part: int, whole: int) -> float:
    return round(part / whole, 4) if whole else 0.0


def report_channels(client, start: str, end: str) -> dict:
    rows = run_report(client, start, end, ["sessionDefaultChannelGroup"], "sessions")
    total = sum(n for _, n in rows)
    return {
        "total_sessions": total,
        "channels": [{"channel": d[0], "sessions": n, "share": share(n, total)} for d, n in rows],
    }


def report_events_by_channel(client, start: str, end: str) -> dict:
    rows = run_report(client, start, end, ["eventName", "sessionDefaultChannelGroup"], "eventCount",
                      dimension_filter=_in_list("eventName", EVENTS))
    counts: dict[str, dict[str, int]] = {e: {} for e in EVENTS}
    channel_totals: dict[str, int] = {}
    for (event, channel), n in rows:
        counts[event][channel] = counts[event].get(channel, 0) + n
        channel_totals[channel] = channel_totals.get(channel, 0) + n
    channels = sorted(channel_totals, key=lambda c: -channel_totals[c])
    return {
        "channels": channels,
        "events": [
            {"event": e, "total": sum(counts[e].values()), "by_channel": counts[e]}
            for e in EVENTS
        ],
    }


def report_organic(client, start: str, end: str) -> tuple[list[dict], dict]:
    """(c) lead events by landing page and (d) organic sessions by landing page."""
    organic = _string_is("sessionDefaultChannelGroup", ORGANIC)
    sessions = {
        d[0]: n
        for d, n in run_report(client, start, end, ["landingPage"], "sessions", dimension_filter=organic)
    }
    event_rows = run_report(client, start, end, ["landingPage", "eventName"], "eventCount",
                            dimension_filter=_all_of(organic, _in_list("eventName", EVENTS)))
    by_page: dict[str, dict[str, int]] = {}
    for (page, event), n in event_rows:
        by_page.setdefault(page, {})[event] = n

    def leads_of(events: dict[str, int]) -> int:
        return sum(events.get(e, 0) for e in LEAD_EVENTS)

    lead_pages = [
        {
            "landing_page": page,
            "sessions": sessions.get(page, 0),
            "events": {e: events.get(e, 0) for e in EVENTS},
            "leads": leads_of(events),
            "intent": sum(events.get(e, 0) for e in INTENT_EVENTS),
        }
        for page, events in by_page.items()
    ]
    # Real leads first (quote/booking), then taps, then intent signals.
    lead_pages.sort(key=lambda p: (
        -(p["events"]["quote_submit"] + p["events"]["booking_submit"]),
        -(p["events"]["call_click"] + p["events"]["email_click"]),
        -p["intent"],
        -p["sessions"],
    ))

    total = sum(sessions.values())
    top_sessions = [
        {"landing_page": page, "sessions": n, "share": share(n, total), "leads": leads_of(by_page.get(page, {}))}
        for page, n in sorted(sessions.items(), key=lambda kv: -kv[1])[:30]
    ]
    return lead_pages, {"total_sessions": total, "landing_pages": top_sessions}


def report_ai_assistants(client, start: str, end: str) -> dict:
    rows = run_report(client, start, end, ["sessionSource", "landingPage"], "sessions",
                      dimension_filter=_string_is("sessionDefaultChannelGroup", AI_CHANNEL))
    by_source: dict[str, int] = {}
    for (source, _), n in rows:
        by_source[source] = by_source.get(source, 0) + n
    return {
        "total_sessions": sum(by_source.values()),
        "by_source": [{"source": s, "sessions": n} for s, n in sorted(by_source.items(), key=lambda kv: -kv[1])],
        "by_source_and_landing_page": [
            {"source": d[0], "landing_page": d[1], "sessions": n} for d, n in rows
        ],
    }


def build_report(client, start: str, end: str) -> dict:
    lead_pages, organic_sessions = report_organic(client, start, end)
    return {
        "property": PROPERTY,
        "start": start,
        "end": end,
        "sessions_by_channel": report_channels(client, start, end),
        "events_by_channel": report_events_by_channel(client, start, end),
        "organic_lead_events_by_landing_page": lead_pages,
        "organic_sessions_by_landing_page": organic_sessions,
        "ai_assistant_referrals": report_ai_assistants(client, start, end),
    }


# --- output -----------------------------------------------------------------


def format_table(headers: list[str], rows: list[list], left: tuple[int, ...] = (0,)) -> str:
    cells = [[str(c) for c in r] for r in rows]
    widths = [max([len(h)] + [len(r[i]) for r in cells]) for i, h in enumerate(headers)]

    def line(values: list[str]) -> str:
        return "  ".join(v.ljust(w) if i in left else v.rjust(w) for i, (v, w) in enumerate(zip(values, widths)))

    out = [line(headers), line(["-" * w for w in widths])] + [line(r) for r in cells]
    return "\n".join("  " + row for row in out)


def pct(x: float) -> str:
    return f"{x:.1%}"


def print_report(report: dict) -> None:
    print(f"\n=== GA4 lead report ({report['start']} .. {report['end']}, {report['property']}) ===")

    ch = report["sessions_by_channel"]
    print(f"\n(a) Sessions by channel group  (total {ch['total_sessions']})")
    print(format_table(["channel", "sessions", "share"],
                       [[c["channel"], c["sessions"], pct(c["share"])] for c in ch["channels"]]))

    ev = report["events_by_channel"]
    print("\n(b) Lead and intent events by channel group  (event count)")
    if ev["channels"]:
        rows = [[e["event"]] + [e["by_channel"].get(c, 0) for c in ev["channels"]] + [e["total"]]
                for e in ev["events"]]
        print(format_table(["event"] + ev["channels"] + ["total"], rows))
    else:
        print("  (no lead or intent events in range)")

    print(f"\n(c) Lead events by landing page - {ORGANIC} only  (which pages produce customers)")
    print("    leads = quote_submit + booking_submit + call_click + email_click; "
          "intent = quote_open + booking_open + chat_open + chat_message + calculator_complete")
    lead_pages = report["organic_lead_events_by_landing_page"]
    if lead_pages:
        headers = ["landing page"] + LEAD_EVENTS + ["intent", "org sessions"]
        rows = [[p["landing_page"]] + [p["events"][e] for e in LEAD_EVENTS] + [p["intent"], p["sessions"]]
                for p in lead_pages]
        print(format_table(headers, rows))
    else:
        print("  (no lead or intent events from organic sessions in range)")

    org = report["organic_sessions_by_landing_page"]
    print(f"\n(d) {ORGANIC} sessions by landing page - top 30  (organic total {org['total_sessions']})")
    print(format_table(["landing page", "sessions", "share", "leads"],
                       [[p["landing_page"], p["sessions"], pct(p["share"]), p["leads"]] for p in org["landing_pages"]]))

    ai = report["ai_assistant_referrals"]
    print(f"\n(e) AI-assistant referrals - channel \"{AI_CHANNEL}\"  (total {ai['total_sessions']} sessions)")
    if ai["by_source"]:
        print(format_table(["source", "sessions"], [[s["source"], s["sessions"]] for s in ai["by_source"]]))
        print()
        print(format_table(["source", "landing page", "sessions"],
                           [[r["source"], r["landing_page"], r["sessions"]] for r in ai["by_source_and_landing_page"]],
                           left=(0, 1)))
    else:
        print("  (no AI-assistant sessions in range)")
    print()


def resolve_range(args: argparse.Namespace, parser: argparse.ArgumentParser) -> tuple[str, str]:
    try:
        end = date.fromisoformat(args.end) if args.end else date.today() - timedelta(days=1)
        start = date.fromisoformat(args.start) if args.start else end - timedelta(days=args.days - 1)
    except ValueError:
        parser.error("--start and --end must be dates in YYYY-MM-DD form")
    if start > end:
        parser.error("--start must not be after --end")
    return start.isoformat(), end.isoformat()


def main() -> None:
    # Landing pages can contain non-ASCII characters; don't die on a cp1252 console.
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--days", type=int, default=28, help="Window length in days, ending yesterday (default: 28)")
    ap.add_argument("--start", help="Window start date YYYY-MM-DD (overrides --days)")
    ap.add_argument("--end", help="Window end date YYYY-MM-DD (default: yesterday)")
    ap.add_argument("--json", action="store_true", help="Print the report as JSON on stdout instead of tables")
    args = ap.parse_args()
    if args.days < 1:
        ap.error("--days must be at least 1")
    start, end = resolve_range(args, ap)

    client = ga4_client()
    try:
        report = build_report(client, start, end)
    except GoogleAPICallError as exc:
        raise SystemExit(f"GA4 Data API error: {exc.message}")

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print_report(report)


if __name__ == "__main__":
    main()
