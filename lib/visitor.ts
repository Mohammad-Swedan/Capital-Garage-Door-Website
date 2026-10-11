/**
 * The first-party visitor identifier, shared by `proxy.ts` (which issues it)
 * and `config/source-tracking.ts` (whose events route reads it).
 *
 * Kept in its own module on purpose: Next's proxy docs say proxy code is
 * invoked separately from render code and should not be relied on for shared
 * modules, so both sides import the name from here instead of from proxy.ts.
 *
 * The cookie holds a random UUID and nothing else. It authenticates nothing
 * and carries no personal data; its only job is to let the source-tracking
 * module connect a later visit (and the call or quote request in it) to the
 * earlier visit that found the site.
 */

/** Name of the first-party cookie carrying the visitor id. */
export const VISITOR_COOKIE = "cgd_vid";

/** Canonical UUID. Anything else is treated as absent rather than trusted. */
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True when `value` is a well-formed visitor id. */
export function isValidVisitorId(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}
