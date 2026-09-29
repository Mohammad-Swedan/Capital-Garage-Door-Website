/**
 * Internal links into the pricing content: the Perth price-list hub (/cost-guides) and the five
 * cost guides. Money pages, problem pages and the guides themselves render these as a short
 * "More on pricing" row, so every page that shows a price links to the page that ranks for it.
 *
 * This module deliberately has NO imports: the admin editor renders the Service, CostGuide and
 * Problem templates in the browser, and those templates call these helpers. Keep it plain data.
 */

export interface GuideLink {
  label: string;
  href: string;
}

/** The price-list hub. The labels below become anchor text, so they describe the destination. */
export const PRICE_LIST_LINK: GuideLink = {
  label: "Full Perth garage door price list",
  href: "/cost-guides",
};

export type CostGuideKey = "installation" | "repair" | "springs" | "motor" | "service";

/** The five cost guides, in display order (siblingGuideLinks keeps this order). */
export const COST_GUIDE_LINKS: Record<CostGuideKey, GuideLink> = {
  installation: { label: "Garage door installation cost", href: "/garage-door-installation-cost-perth" },
  repair: { label: "Garage door repair cost guide", href: "/garage-door-repair-cost-perth" },
  springs: { label: "Spring & cable replacement cost", href: "/garage-door-spring-replacement-cost-perth" },
  motor: { label: "Motor replacement cost", href: "/garage-door-motor-replacement-cost-perth" },
  service: { label: "Service & maintenance cost", href: "/garage-door-service-cost-perth" },
};

/**
 * Page key → the cost guide that prices its jobs. A service page's key is its slug; a problem
 * page's key is `problems/<slug>`. Pages not listed here link to the hub alone.
 */
const PAGE_GUIDE = new Map<string, CostGuideKey>([
  // Repair money pages
  ["garage-door-repairs-perth", "repair"],
  ["emergency-garage-door-repairs-perth", "repair"],
  ["roller-door-repairs-perth", "repair"],
  ["garage-door-panel-replacement-perth", "repair"],
  ["garage-door-spring-repair-perth", "springs"],
  ["garage-door-opener-repair-perth", "motor"],
  ["garage-door-remote-replacement-perth", "motor"],
  ["garage-door-maintenance-perth", "service"],
  // New doors and installation
  ["garage-door-installation-perth", "installation"],
  ["roller-door-installation-perth", "installation"],
  ["garage-doors-perth", "installation"],
  ["roller-doors-perth", "installation"],
  ["sectional-garage-doors-perth", "installation"],
  ["tilt-garage-doors-perth", "installation"],
  ["custom-garage-doors-perth", "installation"],
  ["commercial-garage-doors-perth", "installation"],
  ["commercial-roller-doors-perth", "installation"],
  ["industrial-roller-doors-perth", "installation"],
  // Problem pages
  ["problems/garage-door-wont-open", "repair"],
  ["problems/garage-door-wont-close", "repair"],
  ["problems/garage-door-stuck-halfway", "repair"],
  ["problems/garage-door-off-track", "repair"],
  ["problems/garage-door-remote-not-working", "motor"],
  ["problems/garage-door-motor-not-responding", "motor"],
  ["problems/garage-door-spring-or-cable-broken", "springs"],
  ["problems/noisy-garage-door", "service"],
]);

/** Accept a slug or an href: "/problems/x/" and "problems/x" name the same page. */
const trimSlashes = (key: string) => key.replace(/^\/+|\/+$/g, "");

/** The page's matching cost guide (if any), then the price-list hub. */
export function priceLinksFor(pageKey: string): GuideLink[] {
  const guide = PAGE_GUIDE.get(trimSlashes(pageKey));
  return guide ? [COST_GUIDE_LINKS[guide], PRICE_LIST_LINK] : [PRICE_LIST_LINK];
}

/** For a cost guide: the price-list hub, then the other guides (never the guide itself). */
export function siblingGuideLinks(guideSlug: string): GuideLink[] {
  const self = `/${trimSlashes(guideSlug)}`;
  return [PRICE_LIST_LINK, ...Object.values(COST_GUIDE_LINKS).filter((link) => link.href !== self)];
}
