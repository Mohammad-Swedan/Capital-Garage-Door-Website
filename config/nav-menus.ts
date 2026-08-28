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
  /**
   * Display name, duplicated from BrandEntity.name. Kept here (not looked up
   * from content/brands/entities.ts) so this data-only config never pulls the
   * 28-entity brand registry into the header's initial bundle — only the
   * lazy-loaded mega-menu/mobile-chip chunks import that file.
   */
  label: string;
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
        { entity: "steel-line", href: "/steel-line-garage-doors-perth", label: "Steel-Line" },
        { entity: "b-and-d", href: "/b-and-d-garage-doors-perth", label: "B&D" },
        { entity: "gliderol", href: "/gliderol-garage-doors-perth", label: "Gliderol" },
        { entity: "centurion", href: "/centurion-garage-doors-perth", label: "Centurion Garage Doors" },
        { entity: "danmar", href: "/danmar-garage-doors-perth", label: "Danmar" },
        { entity: "taurean", href: "/taurean-garage-doors-perth", label: "Taurean" },
        { entity: "dominator", href: "/dominator-garage-doors-perth", label: "Dominator" },
        { entity: "perth-windsor-doors", href: "/windsor-garage-doors-perth", label: "Perth Windsor Doors" },
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
        { entity: "merlin", href: "/merlin-garage-door-motors-perth", label: "Merlin" },
        { entity: "chamberlain", href: "/chamberlain-garage-door-motors-perth", label: "Chamberlain" },
        { entity: "b-and-d", href: "/b-and-d-garage-door-motors-perth", label: "B&D" },
        { entity: "gliderol", href: "/gliderol-garage-door-motors-perth", label: "Gliderol" },
        { entity: "steel-line", href: "/steel-line-garage-door-motors-perth", label: "Steel-Line" },
        { entity: "boss", href: "/boss-garage-door-motors-perth", label: "Boss Openers" },
        { entity: "centurion", href: "/centurion-garage-door-motors-perth", label: "Centurion Garage Doors" },
        { entity: "avanti", href: "/avanti-garage-door-motors-perth", label: "Avanti" },
        { entity: "ata", href: "/ata-garage-door-motors-perth", label: "ATA" },
        { entity: "superlift", href: "/superlift-garage-door-motors-perth", label: "Superlift" },
        { entity: "liftmaster", href: "/liftmaster-garage-door-motors-perth", label: "LiftMaster" },
        { entity: "grifco", href: "/grifco-garage-door-motors-perth", label: "Grifco" },
        { entity: "jaytech", href: "/jaytech-garage-door-motors-perth", label: "Jaytech" },
      ],
      allLabel: "All motor brands",
      allHref: "/garage-door-motor-brands-perth",
    },
    featured: "capital-motors",
    footer: { label: "Capital 1100N & 1500N motors", href: "/garage-door-motors-perth" },
  },
};

/**
 * Every link reachable through NAV_MENUS, deduplicated by href — feeds the
 * header's `sr-only` "Site sections" nav. Base UI mounts a mega-menu panel's
 * content only once its trigger opens, and the mobile accordion only once
 * expanded, so none of this is otherwise present in the server-rendered HTML
 * — including all 21 brand pages and hubs like /garage-doors-perth, which had
 * no other sitewide inlink.
 */
export function navMenuHrefs(): { label: string; href: string }[] {
  const seen = new Map<string, string>();
  const add = (href: string, label: string) => {
    if (!seen.has(href)) seen.set(href, label);
  };

  for (const menu of Object.values(NAV_MENUS)) {
    for (const column of menu.columns) {
      for (const link of column.links) add(link.href, link.label);
    }
    if (menu.brands) {
      for (const item of menu.brands.items) {
        add(item.href, item.label);
      }
      add(menu.brands.allHref, menu.brands.allLabel);
    }
    add(menu.footer.href, menu.footer.label);
  }

  return Array.from(seen, ([href, label]) => ({ href, label }));
}
