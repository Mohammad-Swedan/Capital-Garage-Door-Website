/**
 * The single place the site emits analytics events.
 *
 * ## Why there are two sinks
 *
 * Every event is pushed BOTH ways, deliberately:
 *
 * 1. `dataLayer.push({ event, ...params })` — a plain object. This is the shape
 *    **Google Tag Manager** consumes. `gtag.js` ignores plain objects (it only
 *    reads `arguments` objects — see components/analytics/deferred-analytics.tsx),
 *    so this push is inert today and becomes live the day a GTM container is
 *    added, with no code change anywhere.
 * 2. `gtag("event", name, params)` — pushed as an `arguments` object, which is
 *    what actually delivers the event to **GA4 right now**, with no GTM.
 *
 * Both are required. The pre-existing `trackChatEvent` did only #1, so every
 * chat CTA event it fired went nowhere — a GA4 query on 2026-08-02 found the
 * property held only automatic events (`page_view`, `session_start`, `scroll`,
 * `first_visit`, `user_engagement`) and not one custom event in 28 days. That
 * dead-end is the reason this module exists; `trackChatEvent` now delegates here.
 *
 * ## Conventions
 *
 * GA4 requires snake_case names ≤40 chars, and parameter names ≤40 chars. Keep
 * event names stable — renaming one silently splits its history in GA4 reports.
 * `page` is attached automatically so every event is attributable to the page it
 * happened on, which is the whole point: it lets "did the suburb pages produce
 * calls?" be answered instead of guessed.
 *
 * ## What this deliberately cannot measure
 *
 * The quote and booking widgets are a third-party app in a cross-origin iframe
 * (booking-system-cgd.netlify.app) that emits no completion message — verified
 * in its bundle, see lib/booking-embed.ts. So `quote_open`/`booking_open` record
 * *intent*, never a submission. Submissions exist only in the booking CRM. Phone
 * calls placed by reading the number off the screen rather than tapping it are
 * likewise invisible to any client-side analytics.
 */

/** Events the site emits. Keep this list and CLAUDE.md's table in sync. */
export type AnalyticsEvent =
  /** A `tel:` link was tapped anywhere on the site — the primary conversion. */
  | "call_click"
  /** The obfuscated business email was revealed/clicked. */
  | "email_click"
  /** The quote widget was opened deliberately (dialog or in-chat overlay). */
  | "quote_open"
  /** The booking widget was opened deliberately. */
  | "booking_open"
  /** The AI assistant sheet was opened. */
  | "chat_open"
  /** A visitor sent a message to the AI assistant. */
  | "chat_message"
  /** The price calculator produced a finished estimate. */
  | "calculator_complete"
  /** A settled query in the /service-areas suburb finder — `results: 0` = demand we don't list. */
  | "suburb_search";

interface DataLayerWindow extends Window {
  dataLayer?: unknown[];
}

/**
 * Emit an analytics event to GA4 (now) and GTM (whenever a container is added).
 * Safe to call anywhere: no-ops during SSR, and harmless in dev where the gtag
 * script is never loaded (layout.tsx gates it to production) — the queued
 * entries simply sit in the array unread.
 */
export function track(event: AnalyticsEvent | string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  const w = window as DataLayerWindow;
  // Create the queue if an event beats DeferredGoogleAnalytics' effect to it.
  // gtag.js drains whatever it finds when it loads, so nothing is lost.
  w.dataLayer = w.dataLayer || [];

  const payload = { page: window.location.pathname, ...params };

  // Sink 1 — GTM (inert until a container exists).
  w.dataLayer.push({ event, ...payload });

  // Sink 2 — GA4 today. gtag commands MUST be pushed as `arguments` objects;
  // a plain array is ignored by gtag.js, which is exactly the bug this avoids.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  }
  gtag("event", event, payload);
}
