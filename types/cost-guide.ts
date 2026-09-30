import type { FAQ } from "@/types";

export interface CostGuideHero {
  h1: string;
  subtitle: string;
}

export interface CostGuideRow {
  repairType: string;
  includes: string;
  costFactors: string;
  nextStep: string;
  /** Optional indicative price — column only renders if any row in the table supplies one. */
  priceRange?: string;
  /**
   * The catalog numbers behind `priceRange` (CMS pricing row), used for the JSON-LD Offer so a
   * label such as "$95 each + $120 to attend & program" is never parsed into a range. Null when the
   * row is label-only; absent on rows without catalog data (the Offer then parses `priceRange`).
   */
  priceMin?: number | null;
  priceMax?: number | null;
}

export interface CostGuideTableData {
  heading: string;
  intro: string;
  /** First-column header; the table renders "Repair Type" when unset. */
  rowHeader?: string;
  rows: CostGuideRow[];
  disclaimer?: string;
}

export interface CostFactor {
  icon: string;
  title: string;
  description: string;
}

export interface CostScenario {
  icon: string;
  title: string;
  mayAffectQuote: string;
}

export interface RepairVsReplaceData {
  heading: string;
  intro: string;
  repairWhen: string[];
  replaceWhen: string[];
}

export interface CostGuideStep {
  icon: string;
  title: string;
  description: string;
}

export interface CostGuideRelatedLink {
  name: string;
  href: string;
  description: string;
  icon: string;
}

export interface CostGuidePageSeo {
  title: string;
  description: string;
}

export interface CostGuidePageCta {
  heading: string;
  subtitle: string;
}

export interface CostGuidePage {
  slug: string;
  pageType: "cost-guide";
  /** Short noun-phrase label for the breadcrumb and quote-form repair-type field, e.g. "Garage Door Repair". */
  topicLabel: string;
  hero: CostGuideHero;
  directAnswer: string;
  costTable: CostGuideTableData;
  factors: {
    heading: string;
    items: CostFactor[];
  };
  scenarios: {
    heading: string;
    items: CostScenario[];
  };
  repairVsReplace: RepairVsReplaceData;
  howToQuote: {
    heading: string;
    steps: CostGuideStep[];
  };
  relatedServices: CostGuideRelatedLink[];
  faqs: FAQ[];
  cta: CostGuidePageCta;
  seo: CostGuidePageSeo;
  /** ISO date string for Article schema datePublished/dateModified. */
  updatedAt: string;
}

/**
 * One price row of a static cost guide: a pinned price key plus the text its table cells fall back
 * to when the matching live catalog row leaves a column blank (or the catalog is unreachable).
 */
export interface StaticCostGuideRowSource {
  /** A `resolvePriceRows` key (scenario id, `<id>-x<n>` or "after-hours"); must be in `pricingPins`. */
  key: string;
  /** First-column label; defaults to the catalog scenario name. */
  label?: string;
  includes: string;
  costFactors: string;
  nextStep: string;
}

/**
 * Source of a repo-only ("static") cost guide in content/static-cost-guides: the CostGuidePage
 * shape, except that every price is a `{{price:<key>}}` token that lib/data/static-cost-guides.ts
 * resolves from the live price catalog at render time. The copy never holds a literal price, the
 * table rows come from `costTable.rows`, and the disclaimer is always the catalog's pricing-policy
 * note, so it isn't authored here.
 */
export interface StaticCostGuideSource extends Omit<CostGuidePage, "costTable" | "seo" | "updatedAt"> {
  /** ISO date (YYYY-MM-DD) the copy was last reviewed: sets the title year and the earliest `updatedAt`. */
  reviewedAt: string;
  /** Every price key the table or the copy uses. A pin without a table row is used in the copy only. */
  pricingPins: string[];
  costTable: Omit<CostGuideTableData, "rows" | "disclaimer"> & {
    /** Table rows, in display order. */
    rows: StaticCostGuideRowSource[];
  };
  seo: {
    title: string;
    /** May carry price tokens; used when it renders to 160 characters or fewer. */
    description: string;
    /** Token-free, 160 characters or fewer: used when the rendered `description` runs long. */
    descriptionFallback: string;
  };
}
