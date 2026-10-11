/**
 * Link classifier used by the delegated click listener. Pure: takes the raw
 * `href` and the current page's origin, returns what kind of action a click on
 * it is.
 *
 * `tel:` and `mailto:` are classified but NOT emitted by the delegated
 * listener — the host's own analytics already emits call_click/email_click,
 * and those reach the module through the analytics bridge.
 */

export type LinkKind =
  | "tel"
  | "mailto"
  | "sms"
  | "whatsapp"
  | "directions"
  | "outbound"
  | "internal"
  | "other";

export interface LinkInfo {
  kind: LinkKind;
  /** Lowercased host without `www.` for http(s) links; null otherwise. */
  host: string | null;
  /** The href, truncated, for props. */
  href: string;
}

const WHATSAPP_HOSTS = ["wa.me", "api.whatsapp.com", "web.whatsapp.com", "chat.whatsapp.com"];

function isDirections(host: string, path: string): boolean {
  if (host === "maps.google.com" || host.startsWith("maps.google.")) return true;
  if (host === "maps.app.goo.gl") return true;
  if (host === "goo.gl" && path.startsWith("/maps")) return true;
  if (host === "maps.apple.com" || host === "maps.apple") return true;
  if (host === "waze.com" || host === "ul.waze.com") return true;
  // google.com/maps, google.com.au/maps, …
  if (/^google\.[a-z.]+$/.test(host) && path.startsWith("/maps")) return true;
  return false;
}

export function classifyLink(rawHref: string | null | undefined, pageOrigin: string): LinkInfo {
  const href = (rawHref ?? "").trim();
  const short = href.slice(0, 300);
  const lower = href.toLowerCase();

  if (lower.startsWith("tel:")) return { kind: "tel", host: null, href: short };
  if (lower.startsWith("mailto:")) return { kind: "mailto", host: null, href: short };
  if (lower.startsWith("sms:") || lower.startsWith("smsto:")) return { kind: "sms", host: null, href: short };
  if (lower.startsWith("whatsapp:")) return { kind: "whatsapp", host: null, href: short };
  if (lower.startsWith("geo:") || lower.startsWith("maps:")) return { kind: "directions", host: null, href: short };
  if (!href || lower.startsWith("#") || lower.startsWith("javascript:")) {
    return { kind: "other", host: null, href: short };
  }

  let url: URL;
  try {
    url = new URL(href, pageOrigin);
  } catch {
    return { kind: "other", host: null, href: short };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return { kind: "other", host: null, href: short };

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const path = url.pathname.toLowerCase();

  let ownHost = "";
  try {
    ownHost = new URL(pageOrigin).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    // Unparseable origin — every absolute link then looks external, which is the safe side.
  }

  // Strip query and hash from what we keep: they can carry anything.
  const cleanHref = `${url.protocol}//${url.host}${url.pathname}`.slice(0, 300);

  if (WHATSAPP_HOSTS.includes(host)) return { kind: "whatsapp", host, href: cleanHref };
  if (isDirections(host, path)) return { kind: "directions", host, href: cleanHref };
  if (host === ownHost) return { kind: "internal", host, href: url.pathname.slice(0, 300) };
  return { kind: "outbound", host, href: cleanHref };
}
