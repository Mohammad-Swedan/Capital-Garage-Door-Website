/**
 * Where on the page a click happened: the nearest `[data-cta-placement]`
 * value, else the nearest landmark (header / footer / nav / aside), else the
 * id of the enclosing `<section id>`, else "body".
 *
 * The delegated click listener records the placement of EVERY click (capture
 * phase, so before the host's own bubble-phase listeners run). An event that
 * arrives through the analytics bridge within ~1 s — call_click from the
 * host's tel: listener, quote_open from a button — takes it, once.
 */
import { MAX_PLACEMENT, cleanString } from "../shared";

const LANDMARK_SELECTOR =
  "[data-cta-placement],header,footer,nav,aside,[role=banner],[role=contentinfo],[role=navigation],[role=complementary]";

const ROLE_TO_LANDMARK: Record<string, string> = {
  banner: "header",
  contentinfo: "footer",
  navigation: "nav",
  complementary: "aside",
};

export function resolvePlacement(element: Element): string {
  const hit = element.closest(LANDMARK_SELECTOR);
  if (hit) {
    const explicit = cleanString(hit.getAttribute("data-cta-placement"), MAX_PLACEMENT);
    if (explicit) return explicit;
    const role = hit.getAttribute("role");
    if (role && ROLE_TO_LANDMARK[role]) return ROLE_TO_LANDMARK[role];
    return hit.tagName.toLowerCase();
  }
  const section = element.closest("section[id]");
  if (section && section.id) return cleanString(`section:${section.id}`, MAX_PLACEMENT) ?? "body";
  return "body";
}

export const PLACEMENT_WINDOW_MS = 1000;

let lastClick: { placement: string; at: number } | null = null;

export function recordClickPlacement(placement: string, now = Date.now()): void {
  lastClick = { placement, at: now };
}

/** The placement of a click in the last second, consumed so it cannot leak onto a later event. */
export function takeRecentClickPlacement(now = Date.now(), windowMs = PLACEMENT_WINDOW_MS): string | null {
  const click = lastClick;
  lastClick = null;
  if (!click) return null;
  return now - click.at <= windowMs ? click.placement : null;
}
