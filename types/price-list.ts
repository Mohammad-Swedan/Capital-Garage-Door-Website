import type { FAQ } from "@/types";
import type { CostFactor, RepairVsReplaceData } from "@/types/cost-guide";
import type { ResolvedPriceRow } from "@/lib/brands/pricing";
import type { GuideLink } from "@/lib/pricing/guide-links";

/**
 * The /cost-guides price list ("Garage Door Prices Perth — {year} Price List"). The copy lives in
 * content/price-list.ts with every price written as a `{{price:<key>}}` token; lib/data/price-list.ts
 * resolves the keys against the live CMS pricing catalog (baked pricing-data.ts figures as the
 * fallback) and renders the tokens, so no figure is ever hand-written.
 */

/** One table row: a price key, the page that explains the job, and an optional friendly label. */
export interface PriceListRowDef {
  /** A `resolvePriceRows` key: a pricing-data.ts scenario id, `<id>-x<n>` or "after-hours". */
  key: string;
  /** Site-relative link to the page that details the job (starts with "/"). */
  href: string;
  /** Job name shown in the table; defaults to the catalog scenario name. */
  label?: string;
}

/** One price group: its own anchored section, heading and table. */
export interface PriceListGroupDef {
  /** Section anchor (`#id`), lowercase and hyphenated. */
  id: string;
  heading: string;
  /** Short label for the jump nav; defaults to the heading. */
  navLabel?: string;
  /** One or two sentences specific to the group. May carry price tokens. */
  intro: string;
  rows: PriceListRowDef[];
  /** The cost guide (or hub page) linked under the group's table. */
  guide?: GuideLink;
}

export interface PriceListContent {
  /** ISO date (YYYY-MM-DD) the owner last confirmed the list: the earliest "updated" date and year. */
  reviewedAt: string;
  hero: {
    /** Rendered after "Updated {Mon YYYY} · ". */
    eyebrow: string;
    subtitle: string;
  };
  directAnswer: string;
  groups: PriceListGroupDef[];
  factors: { heading: string; items: CostFactor[] };
  repairVsReplace: RepairVsReplaceData;
  faqs: FAQ[];
  seo: {
    /** May carry price tokens; used when it renders to 160 characters or fewer. */
    descriptionTemplate: string;
    /** Token-free, 160 characters or fewer: used when the rendered template runs long. */
    descriptionFallback: string;
  };
}

/** A resolved table row: the catalog price row plus its link (label = the friendly job name). */
export type PriceListRow = ResolvedPriceRow & { href: string };

export interface ResolvedPriceListGroup extends Omit<PriceListGroupDef, "rows"> {
  rows: PriceListRow[];
}

export interface ResolvedPriceList {
  /** Year of `lastUpdated`: shown in the title and H1. */
  year: number;
  /** YYYY-MM-DD: the later of `reviewedAt` and the newest `updatedAt` among the catalog rows shown. */
  lastUpdated: string;
  /** Meta title (≤60 characters). */
  title: string;
  hero: { eyebrow: string; h1: string; subtitle: string };
  directAnswer: string;
  groups: ResolvedPriceListGroup[];
  factors: { heading: string; items: CostFactor[] };
  repairVsReplace: RepairVsReplaceData;
  faqs: FAQ[];
  /** The catalog's pricing-policy note, shown as the tables' disclaimer. */
  policyNote: string;
  /** The rendered description template when it fits in 160 characters, else the static fallback. */
  metaDescription: string;
  /** "catalog" when at least one row took its price from the live catalog. */
  source: "catalog" | "baked";
}
