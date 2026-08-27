export type NavMenuKey = "services" | "doors" | "motors";

export interface NavMenuLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavMenuColumn {
  title: string;
  links: NavMenuLink[];
}

export interface NavBrandEntry {
  /** BrandEntity.slug from content/brands/entities.ts. */
  entity: string;
  href: string;
}

export interface NavMenu {
  key: NavMenuKey;
  columns: NavMenuColumn[];
  brands?: { title: string; items: NavBrandEntry[]; allLabel: string; allHref: string };
  /** Motors only — the Capital product card. */
  featured?: "capital-motors";
  footer: NavMenuLink;
}

/**
 * Mega-menu content, keyed by `menu` on siteConfig.nav items (data-keyed, never label-keyed).
 * Every href here must resolve with a 200 — scripts/check-brand-content.ts validates them.
 */
export const NAV_MENUS: Record<NavMenuKey, NavMenu> = {
  services: {
    key: "services",
    columns: [
      {
        title: "Repairs",
        links: [
          { label: "Garage door repairs", href: "/garage-door-repairs-perth" },
          { label: "Roller door repairs", href: "/roller-door-repairs-perth" },
          { label: "Spring repair", href: "/garage-door-spring-repair-perth" },
          { label: "Opener & motor repair", href: "/garage-door-opener-repair-perth" },
          { label: "Remote replacement", href: "/garage-door-remote-replacement-perth" },
          { label: "Panel replacement", href: "/garage-door-panel-replacement-perth" },
          { label: "Maintenance & service", href: "/garage-door-maintenance-perth" },
        ],
      },
      {
        title: "Install & supply",
        links: [
          { label: "New garage doors", href: "/garage-doors-perth" },
          { label: "Garage door installation", href: "/garage-door-installation-perth" },
          { label: "Roller door installation", href: "/roller-door-installation-perth" },
          { label: "Commercial garage doors", href: "/commercial-garage-doors-perth" },
          { label: "Custom garage doors", href: "/custom-garage-doors-perth" },
        ],
      },
      {
        title: "Guides",
        links: [
          { label: "Cost guides", href: "/cost-guides" },
          { label: "Common problems", href: "/problems" },
          { label: "Price calculator", href: "/calculator" },
          { label: "Roller vs sectional", href: "/roller-door-vs-sectional-door" },
        ],
      },
    ],
    footer: { label: "All services", href: "/services" },
  },
  doors: {
    key: "doors",
    columns: [
      {
        title: "Door types",
        links: [
          { label: "All garage doors", href: "/garage-doors-perth" },
          { label: "Roller doors", href: "/roller-doors-perth" },
          { label: "Sectional doors", href: "/sectional-garage-doors-perth" },
          { label: "Tilt doors", href: "/tilt-garage-doors-perth" },
          { label: "Custom doors", href: "/custom-garage-doors-perth" },
          { label: "Commercial roller doors", href: "/commercial-roller-doors-perth" },
          { label: "Industrial roller doors", href: "/industrial-roller-doors-perth" },
        ],
      },
    ],
    brands: {
      title: "Door brands",
      items: [
        { entity: "steel-line", href: "/steel-line-garage-doors-perth" },
        { entity: "b-and-d", href: "/b-and-d-garage-doors-perth" },
        { entity: "gliderol", href: "/gliderol-garage-doors-perth" },
        { entity: "centurion", href: "/centurion-garage-doors-perth" },
        { entity: "danmar", href: "/danmar-garage-doors-perth" },
        { entity: "taurean", href: "/taurean-garage-doors-perth" },
      ],
      allLabel: "All door brands",
      allHref: "/garage-door-brands-perth",
    },
    footer: { label: "Get a new-door quote", href: "/quote" },
  },
  motors: {
    key: "motors",
    columns: [
      {
        title: "Motors & remotes",
        links: [
          { label: "Opener & motor repair", href: "/garage-door-opener-repair-perth" },
          { label: "Remote replacement", href: "/garage-door-remote-replacement-perth" },
          { label: "Motor replacement cost", href: "/garage-door-motor-replacement-cost-perth" },
        ],
      },
    ],
    brands: {
      title: "Motor brands we service",
      items: [
        { entity: "merlin", href: "/merlin-garage-door-motors-perth" },
        { entity: "chamberlain", href: "/chamberlain-garage-door-motors-perth" },
        { entity: "b-and-d", href: "/b-and-d-garage-door-motors-perth" },
        { entity: "gliderol", href: "/gliderol-garage-door-motors-perth" },
        { entity: "steel-line", href: "/steel-line-garage-door-motors-perth" },
        { entity: "boss", href: "/boss-garage-door-motors-perth" },
      ],
      allLabel: "All motor brands",
      allHref: "/garage-door-motor-brands-perth",
    },
    featured: "capital-motors",
    footer: { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
  },
};
