/**
 * The website's slice of `modules/source-tracking/taxonomy.json`.
 *
 * Hand-copied rather than imported so the client bundle never ships the whole
 * taxonomy (outcomes, labels, colours…). `taxonomy.test.ts` fails the moment
 * this file and the JSON disagree, so the copy cannot silently drift.
 *
 * - CLIENT_ACTION_EVENTS: action types with `createsAction: true`. The ones
 *   with `createsAction: false` (manual_call, ads_call) are created server-side
 *   only and are never accepted from a browser.
 * - RAW_EVENTS: low-level events (logged for analysis, never shown in the UI).
 */

export const CLIENT_ACTION_EVENTS = [
  "call_click",
  "quote_submit",
  "quote_open",
  "chat_quote_open",
  "booking_open",
  "booking_submit",
  "chat_lead_submit",
  "chat_booking_complete",
  "email_click",
  "sms_click",
  "whatsapp_click",
  "directions_click",
] as const;

export const SERVER_ONLY_ACTION_TYPES = ["manual_call", "ads_call"] as const;

export const RAW_EVENTS = [
  "page_view",
  "page_leave",
  "web_vitals",
  "not_found",
  "outbound_click",
  "faq_open",
  "cta_click",
  "chat_open",
  "chat_message",
  "chat_cta_click",
  "calc_chat_cta_click",
  "calculator_complete",
  "suburb_search",
] as const;

export const PAGE_GROUP_VOCABULARY = [
  "home",
  "lp",
  "services",
  "suburbs",
  "service-areas",
  "blog",
  "problems",
  "cost",
  "products",
  "categories",
  "contact",
  "quote",
  "booking",
  "reviews",
  "about",
  "gallery",
  "legacy",
  "legal",
  "other",
] as const;

export type ClientActionEvent = (typeof CLIENT_ACTION_EVENTS)[number];
export type RawEvent = (typeof RAW_EVENTS)[number];
export type ClientEventType = ClientActionEvent | RawEvent;
export type PageGroup = (typeof PAGE_GROUP_VOCABULARY)[number];

/** Every event type a browser may send. */
export const CLIENT_EVENT_TYPES: readonly ClientEventType[] = [...CLIENT_ACTION_EVENTS, ...RAW_EVENTS];

const CLIENT_EVENT_SET: ReadonlySet<string> = new Set(CLIENT_EVENT_TYPES);
const PAGE_GROUP_SET: ReadonlySet<string> = new Set(PAGE_GROUP_VOCABULARY);

export function isClientEventType(value: unknown): value is ClientEventType {
  return typeof value === "string" && CLIENT_EVENT_SET.has(value);
}

export function isPageGroup(value: unknown): value is PageGroup {
  return typeof value === "string" && PAGE_GROUP_SET.has(value);
}

/**
 * Events sent the moment they happen instead of waiting for the batch timer:
 * they are the conversions, and each is often followed by the page going away
 * (the dialler opening, a dialog closing).
 */
export const IMMEDIATE_EVENTS: ReadonlySet<string> = new Set(["call_click", "quote_submit", "booking_submit"]);
