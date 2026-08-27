import type { CostGuidance, FAQ, LocalLink } from "@/types";

export type BrandKind = "motor" | "door";
export type BrandTag =
  | "australian-made"
  | "wa-made"
  | "smart-app"
  | "roller"
  | "sectional"
  | "tilt"
  | "commercial";

/** One manufacturer — facts shared by its nav entry, hub tile and page(s). Client-safe data. */
export interface BrandEntity {
  /** Stable key, e.g. "merlin", "b-and-d". */
  slug: string;
  name: string;
  /** Alternative spellings for the finder and case-study matching, e.g. ["B & D", "B and D"]. */
  aliases?: string[];
  /**
   * Phrases that count as a mention in job copy. Defaults to name + aliases. Set it for brands
   * whose name is an ordinary word (Nice, Boss, Guardian, Genie) so prose never false-matches.
   */
  matchTerms?: string[];
  kinds: BrandKind[];
  /** `/images/brands/*.webp` or a CDN URL. Absent → the monogram renders. */
  logo?: string;
  /** Hex accent for the monogram + brand-plate gradient (a design choice, not a fact). */
  accent: string;
  /** VERIFIED official manufacturer site. */
  url?: string;
  /** "Australia" | "USA" | "Germany" | "Perth, WA" … */
  origin: string;
  /** Parent company — only when stated on the official site. */
  ownership?: string;
  /** Only when stated on the official site. */
  founded?: number;
  /** true ONLY for the 8 dealer brands (see plan Global Constraints). */
  dealer: boolean;
  tags: BrandTag[];
  /** ≤120 chars, shown on tiles/tooltips. */
  summary: string;
  /** What the brand is known for — product lines / families, e.g. "SilentDrive, Commander, myQ". */
  productLines: string;
  /** URLs the facts came from. Never rendered. */
  sources: string[];
}

export interface BrandQuickFact {
  label: string;
  value: string;
}

export interface BrandServiceCard {
  title: string;
  description: string;
  /** lucide icon name resolved by resolvePageIcon(). */
  icon: string;
  href: string;
}

export interface BrandModel {
  name: string;
  /** "Sectional opener" | "Roller door opener" | "Sectional door" | "Roller door" … */
  type: string;
  /** Drive/tech note, e.g. "Belt drive · myQ". */
  tech?: string;
  note: string;
}

export interface BrandFault {
  label: string;
  icon: string;
  /** Slug under /problems/ (must exist — the check script verifies). */
  problemSlug?: string;
}

export interface BrandDecision {
  repairWhen: string[];
  replaceWhen: string[];
}

export interface BrandParts {
  heading: string;
  paragraphs: string[];
}

export interface BrandPage {
  /** BrandEntity.slug */
  brand: string;
  kind: BrandKind;
  /** Full URL slug, e.g. "merlin-garage-door-motors-perth". */
  slug: string;
  /** ISO date (YYYY-MM-DD) → sitemap lastmod. */
  updatedAt: string;
  seo: { title: string; description: string };
  hero: {
    h1: string;
    subtitle: string;
    pills: { icon: string; label: string }[];
  };
  /** 4–5 rows on the brand plate. */
  quickFacts: BrandQuickFact[];
  /** May contain {{price:<scenario-id>}} tokens; never a literal $. */
  directAnswer: string;
  intro: { heading: string; paragraphs: string[] };
  services: BrandServiceCard[];
  models?: BrandModel[];
  faults: BrandFault[];
  /** Motor pages. */
  decision?: BrandDecision;
  /** Door pages. */
  parts?: BrandParts;
  /** Scenario ids from pricing-data.ts. */
  pricingPins: string[];
  costIntro: string;
  costFactors: string[];
  faqs: FAQ[];
  /** Entity slugs of the same kind. */
  relatedBrands: string[];
  relatedServices: LocalLink[];
  /** Suburb names; linked to suburb pages when one exists. */
  serviceAreas: string[];
  cta: { heading: string; subtitle: string };
}

export interface BrandHub {
  kind: BrandKind;
  /** e.g. "garage-door-brands-perth" */
  slug: string;
  name: string;
  /** Short label for breadcrumbs / nav, e.g. "Door Brands". */
  shortName: string;
  seo: { title: string; description: string };
  hero: { h1: string; subtitle: string };
  intro: string[];
  faqs: FAQ[];
}

/** A brand page with runtime data resolved (prices, tokens, related brands, area links). */
export interface ResolvedBrandPage {
  page: BrandPage;
  entity: BrandEntity;
  hub: BrandHub;
  /** Page copy with {{price:*}} tokens rendered. */
  rendered: BrandPage;
  pricing: CostGuidance;
  relatedBrands: { entity: BrandEntity; href: string }[];
  /** Motor pages: the resolved "motor-replace" range for the Capital upgrade card. */
  capitalMotorRange?: string;
  areaLinks: LocalLink[];
}
