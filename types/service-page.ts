import type { FAQ } from "@/types";

export interface ServicePageBadge {
  icon: string;
  label: string;
}

export interface ServicePageHero {
  h1: string;
  subtitle: string;
  badges: ServicePageBadge[];
  image: string;
  imageAlt: string;
  floatingCardLabel: string;
}

export interface ServiceProblem {
  label: string;
  icon: string;
  /** Slug of a future problem-page (e.g. "garage-door-wont-open"). Not yet routed. */
  slug?: string;
}

export interface ServiceProcessStep {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceCostRow {
  label: string;
  price: string;
  note?: string;
  /**
   * Catalog provenance — the shared PricingItem this row pins to. Present in the in-place editor
   * (so the serializer can round-trip the pin); the public render ignores it. Same pattern as
   * `faqItemId` on FAQs.
   */
  pricingItemId?: number | null;
  /** Admin-only note for the future AI assistant. Never rendered publicly; editor-only. */
  internalNote?: string | null;
}

export interface ServiceCostGuidance {
  intro: string;
  rows: ServiceCostRow[];
}

export interface ServiceWhyChooseItem {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceRelatedLink {
  name: string;
  href: string;
  description: string;
  icon: string;
}

export interface ServiceReview {
  name: string;
  rating: number;
  text: string;
  suburb?: string;
  service?: string;
}

export interface ServicePageSeo {
  title: string;
  description: string;
}

export interface ServicePageCta {
  heading: string;
  subtitle: string;
}

export interface ServicePage {
  serviceName: string;
  slug: string;
  pageType: "service";
  hero: ServicePageHero;
  directAnswer: string;
  intro: {
    heading: string;
    paragraphs: string[];
  };
  problems: ServiceProblem[];
  includedItems: string[];
  processSteps: ServiceProcessStep[];
  costGuidance: ServiceCostGuidance;
  whyChoose: ServiceWhyChooseItem[];
  relatedServices: ServiceRelatedLink[];
  serviceAreas: string[];
  reviews: ServiceReview[];
  faqs: FAQ[];
  cta: ServicePageCta;
  seo: ServicePageSeo;
}
