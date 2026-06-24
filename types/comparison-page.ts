import type { FAQ } from "@/types";

export interface ComparisonPageHero {
  h1: string;
  subtitle: string;
}

export interface ComparisonTableRow {
  feature: string;
  optionA: string;
  optionB: string;
}

export interface ComparisonTable {
  optionALabel: string;
  optionBLabel: string;
  rows: ComparisonTableRow[];
}

export interface ComparisonOption {
  name: string;
  icon: string;
  summary: string;
  benefits: string[];
  limitations: string[];
  bestFor: string[];
}

export interface ComparisonDecisionCard {
  heading: string;
  icon: string;
  tone: "optionA" | "optionB" | "uncertain";
  points: string[];
}

export interface ComparisonRelatedLink {
  name: string;
  href: string;
  description: string;
  icon: string;
}

export interface ComparisonPageSeo {
  title: string;
  description: string;
}

export interface ComparisonPageCta {
  heading: string;
  subtitle: string;
}

export interface ComparisonPage {
  slug: string;
  pageType: "comparison";
  /** Short noun-phrase label for the breadcrumb, Article schema "about", and the quote-form Topic field — kept explicit rather than derived from hero.h1, which is a full question and wrong for those three uses. */
  topicLabel: string;
  hero: ComparisonPageHero;
  directAnswer: string;
  comparisonTable: ComparisonTable;
  optionA: ComparisonOption;
  optionB: ComparisonOption;
  decisionCards: ComparisonDecisionCard[];
  relatedServices: ComparisonRelatedLink[];
  faqs: FAQ[];
  cta: ComparisonPageCta;
  seo: ComparisonPageSeo;
  /** ISO date string for Article schema datePublished/dateModified. */
  updatedAt: string;
}
