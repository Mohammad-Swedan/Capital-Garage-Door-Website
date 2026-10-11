/**
 * Server-side facts about the request: visitor cookie, client IP, device,
 * bot flag and Cloudflare geo headers. Pure functions over `Headers`.
 */
import { sourceTrackingConfig as config } from "@/config/source-tracking";
import { isBotUserAgent } from "../classify/bot";
import { detectDevice } from "../classify/device";
import { cleanString, isUuid } from "../shared";
import type { WireContext, WireGeo } from "../types";

export function readCookieHeader(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    const raw = part.slice(eq + 1).trim();
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return null;
}

/** The visitor id from the visitor cookie ONLY (never the body). Null when absent or malformed. */
export function visitorKeyFrom(headers: Headers, cookieName: string): string | null {
  const value = readCookieHeader(headers.get("cookie"), cookieName);
  return isUuid(value) ? value.toLowerCase() : null;
}

/**
 * The visitor's IP, used as a rate-limit key (here and, forwarded as
 * `x-client-ip`, in the CRM API) and never stored.
 *
 * - `cf-connecting-ip` only when `trustCloudflare` (config.trustCloudflareIpHeader)
 *   says the site really sits behind Cloudflare. Any client can set that header,
 *   and because the route forwards it together with the proxy secret, trusting
 *   it blindly would let a caller pick its own rate-limit bucket.
 * - Otherwise the RIGHT-MOST `x-forwarded-for` entry: the one hop our own
 *   hosting proxy appended, i.e. the address that actually connected to it.
 *   The left-most entries are whatever the client sent.
 * - Else null (dev, or no proxy in front).
 */
export function clientIpFrom(headers: Headers, trustCloudflare: boolean = config.trustCloudflareIpHeader): string | null {
  if (trustCloudflare) {
    const cf = headers.get("cf-connecting-ip")?.trim();
    if (cf) return cf.slice(0, 64);
  }
  const hops = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
  const last = hops[hops.length - 1];
  return last ? last.slice(0, 64) : null;
}

function header(headers: Headers, name: string, max: number): string | null {
  const raw = headers.get(name);
  if (!raw) return null;
  let value = raw;
  try {
    // Cloudflare percent-encodes non-ASCII city names in some setups.
    value = /%[0-9a-f]{2}/i.test(raw) ? decodeURIComponent(raw) : raw;
  } catch {
    value = raw;
  }
  return cleanString(value, max);
}

export function geoFrom(headers: Headers): WireGeo {
  const country = header(headers, "cf-ipcountry", 2);
  return {
    // XX = unknown, T1 = Tor.
    country: country && country !== "XX" && country !== "T1" ? country.toUpperCase() : null,
    region: header(headers, "cf-region-code", 64) ?? header(headers, "cf-region", 64),
    city: header(headers, "cf-ipcity", 64),
    postcode: header(headers, "cf-postal-code", 10),
  };
}

export function contextFrom(headers: Headers, botPattern: RegExp): WireContext {
  const userAgent = cleanString(headers.get("user-agent"), 500) ?? "";
  return {
    userAgent,
    deviceType: detectDevice(userAgent),
    isBot: isBotUserAgent(userAgent, botPattern),
    geo: geoFrom(headers),
  };
}
