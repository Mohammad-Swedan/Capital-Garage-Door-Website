/**
 * POST /api/source-tracking/events — the same-origin ingest route
 * (docs/source-tracking/DESIGN.md §1).
 *
 * Browser → here → `${CRM_API_URL}/source-tracking/events`. This route:
 *  - bounds the body (validate.ts) — session uuid, ≤20 allow-listed events, capped strings;
 *  - reads the visitor id from the visitor cookie ONLY, never the body
 *    (absent → visitorKey null, still accepted);
 *  - adds context the browser cannot be trusted with: User-Agent, device,
 *    bot flag, Cloudflare geo;
 *  - forwards with x-tracking-secret and x-client-ip (so the API's limiter
 *    keys on the visitor, not on this server), awaiting at most 2.5 s;
 *  - always answers 202 {accepted:n} (no validation detail leaks), except 429
 *    from the per-IP limiter.
 *
 * Same-origin on purpose: filter lists block third-party "track" requests,
 * and the secret stays server-side.
 *
 * The host's route stub must declare `runtime = "nodejs"` and
 * `dynamic = "force-dynamic"` itself (segment config cannot be re-exported).
 */
import { sourceTrackingConfig as config } from "@/config/source-tracking";
import type { ForwardedBatch } from "../types";
import { createRateLimiter } from "./rate-limit";
import { clientIpFrom, contextFrom, visitorKeyFrom } from "./request-context";
import { MAX_BODY_BYTES, validateBatch } from "./validate";

export const FORWARD_TIMEOUT_MS = 2500;
/**
 * Per client IP per minute. Must be ≤ the CRM's `st-ingest` per-IP limit
 * (SourceTracking:IngestPermitLimitPerIp, default 240): a batch this route
 * accepts but the API refuses is lost without the browser ever knowing.
 */
export const RATE_LIMIT_PER_MINUTE = 240;
/** The CRM answering non-2xx is logged at most this often, so a sustained 429 cannot flood the server log. */
export const CRM_WARN_INTERVAL_MS = 60_000;

const limiter = createRateLimiter(RATE_LIMIT_PER_MINUTE, 60_000);
let lastCrmWarnAt = 0;

function accepted(n: number): Response {
  return new Response(JSON.stringify({ accepted: n }), {
    status: 202,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

async function readJson(request: Request): Promise<unknown> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) return null;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function crmApiBase(): string {
  return (process.env.CRM_API_URL || config.crmApiFallbackUrl).replace(/\/+$/, "");
}

/**
 * The CRM refused or failed a batch. The browser never learns (always 202), so
 * this is the only place the loss is visible: warn, rate-limited to once per
 * minute. A 429 here means the two limiters disagree (or one NAT address is
 * genuinely hot); a 401 means the proxy secrets differ.
 */
export function warnCrmResponse(status: number, now: number = Date.now()): boolean {
  if (now - lastCrmWarnAt < CRM_WARN_INTERVAL_MS) return false;
  lastCrmWarnAt = now;
  if (typeof console !== "undefined") {
    console.warn(
      `[source-tracking] CRM answered ${status} for an events batch` +
        (status === 429 ? " (rate-limited: check st-ingest vs the website limit, or the proxy secret)" : "") +
        "; further warnings suppressed for 60 s",
    );
  }
  return true;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const ip = clientIpFrom(request.headers);
    if (limiter.hit(ip ?? "unknown")) {
      return new Response(null, { status: 429, headers: { "Retry-After": "60" } });
    }
    if (!config.enabled) return accepted(0);

    const batch = validateBatch(await readJson(request));
    if (!batch) return accepted(0);

    const forwarded: ForwardedBatch = {
      visitorKey: visitorKeyFrom(request.headers, config.visitorCookie),
      sessionId: batch.sessionId,
      entry: batch.entry,
      events: batch.events,
      context: contextFrom(request.headers, config.botUserAgentPattern),
    };

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const secret = process.env.TRACKING_PROXY_SECRET;
    if (secret) headers["x-tracking-secret"] = secret;
    if (ip) headers["x-client-ip"] = ip;

    try {
      // Awaited (bounded) so the request is really sent before the handler returns.
      const res = await fetch(`${crmApiBase()}/source-tracking/events`, {
        method: "POST",
        headers,
        body: JSON.stringify(forwarded),
        cache: "no-store",
        signal: AbortSignal.timeout(FORWARD_TIMEOUT_MS),
      });
      if (!res.ok) warnCrmResponse(res.status);
    } catch {
      // CRM down or slow: the event is lost, the visitor never notices.
    }

    return accepted(batch.events.length);
  } catch {
    return accepted(0);
  }
}
