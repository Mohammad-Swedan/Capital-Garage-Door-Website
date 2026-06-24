export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  icon: string;
  /** Canonical flat SEO URL this service card links to (e.g. "/garage-door-repairs-perth"). */
  canonicalHref: string;
  faqs?: FAQ[];
}

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  rating: number;
  quote: string;
  date: string;
  service?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ProblemCause {
  icon: string;
  title: string;
  description: string;
}

export interface ProblemCostRow {
  scenario: string;
  priceRange: string;
  note?: string;
}

export interface ProblemRelatedService {
  slug: string;
  label: string;
}

export interface Problem {
  slug: string;
  name: string;
  h1: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  directAnswer: string;
  causes: ProblemCause[];
  safeChecks: string[];
  doNotDo: string[];
  callTechnicianSigns: string[];
  relatedServices: ProblemRelatedService[];
  costRows: ProblemCostRow[];
  emergency: {
    heading: string;
    body: string;
  };
  faqs: FAQ[];
  updatedAt: string;
  heroImage?: string;
}

/* ------------------------------------------------------------------ *
 * Service + Suburb landing pages (Page Type 2)
 * Drives reusable "[Service] in [Suburb]" local-SEO pages such as
 * /garage-door-repairs-joondalup. All copy lives in the content layer
 * so new suburbs/services are data entries, not new components.
 * ------------------------------------------------------------------ */

/** A simple labelled internal link (nearby suburb or related page). */
export interface LocalLink {
  label: string;
  href: string;
}

/** A service offered within a suburb (rendered as a card). */
export interface AvailableService {
  title: string;
  description: string;
  icon: string;
  href?: string;
}

/** A common local garage-door problem (rendered as a card). */
export interface LocalProblem {
  title: string;
  description: string;
  icon: string;
}

/** Cost-guidance block: what the price depends on. */
export interface CostGuidance {
  intro: string;
  factors: string[];
  note?: string;
}

/** A reason-to-choose-us trust card. */
export interface TrustReason {
  title: string;
  description: string;
  icon: string;
}

/**
 * A recent-work proof card. Placeholder until wired to CRM job /
 * case-study data — see content/service-suburb-pages.ts.
 */
export interface LocalProofItem {
  serviceType: string;
  suburb: string;
  problem: string;
  solution: string;
  beforeImage?: string;
  afterImage?: string;
}

export interface ServiceSuburbPage {
  /** URL slug, e.g. "garage-door-repairs-joondalup". */
  slug: string;
  /** Service name, e.g. "Garage Door Repairs". */
  service: string;
  /** Suburb name, e.g. "Joondalup". */
  suburb: string;
  /** Region context, e.g. "Perth, WA". */
  region: string;
  nearbySuburbs: LocalLink[];
  hero: {
    subtitle: string;
    trustBadges: string[];
  };
  directAnswer: string;
  localIntro: string[];
  availableServices: AvailableService[];
  problems: LocalProblem[];
  costGuidance: CostGuidance;
  whyChooseUs: TrustReason[];
  relatedPages: LocalLink[];
  faqs: FAQ[];
  localProof: LocalProofItem[];
  seo: {
    title: string;
    description: string;
  };
}

export type {
  ServicePage,
  ServicePageBadge,
  ServicePageHero,
  ServiceProblem,
  ServiceProcessStep,
  ServiceCostRow,
  ServiceCostGuidance,
  ServiceWhyChooseItem,
  ServiceRelatedLink,
  ServiceReview,
  ServicePageSeo,
  ServicePageCta,
} from "@/types/service-page";

export type {
  ComparisonPage,
  ComparisonPageHero,
  ComparisonTableRow,
  ComparisonTable,
  ComparisonOption,
  ComparisonDecisionCard,
  ComparisonRelatedLink,
  ComparisonPageSeo,
  ComparisonPageCta,
} from "@/types/comparison-page";

export type {
  CostGuidePage,
  CostGuideHero,
  CostGuideRow,
  CostGuideTableData,
  CostFactor,
  CostScenario,
  RepairVsReplaceData,
  CostGuideStep,
  CostGuideRelatedLink,
  CostGuidePageSeo,
  CostGuidePageCta,
} from "@/types/cost-guide";

export type {
  Article,
  TocItem,
  ContentBlock,
  ExpertTip,
  ExpertTipKind,
  ArticleLink,
  ArticleServiceLink,
  ArticleSeo,
} from "@/types/article";
