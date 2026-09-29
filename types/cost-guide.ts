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
