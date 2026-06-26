import { siteConfig } from "@/config/site";
import { createElement, type ComponentType } from "react";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { PageResolveDto } from "@/lib/cms/client";
import type { SerializerInput, CreatePageCommand } from "./serializers/types";
import { serviceItemTemplates } from "./item-templates";

// --- ServicePage (Phase 3) ---
import { ServicePageTemplate } from "@/components/sections/service/service-page-template";
import { ServicePageForm } from "@/components/admin/service-page-form";
import { mapServicePage } from "@/lib/cms/map-service-page";
import { serializeServicePage } from "./serializers/serialize-service";
import type { ServicePage } from "@/types/service-page";

// --- Phase 4 types ---
import { ComparisonPageTemplate } from "@/components/sections/comparison/comparison-page-template";
import { ComparisonPageForm } from "@/components/admin/comparison-page-form";
import { serializeComparisonPage, seedBlankComparisonPage, buildComparisonDraft } from "./serializers/serialize-comparison";
import { CostGuidePageTemplate } from "@/components/sections/cost-guide/cost-guide-page-template";
import { CostGuidePageForm } from "@/components/admin/cost-guide-page-form";
import { serializeCostGuidePage, seedBlankCostGuidePage, buildCostGuideDraft } from "./serializers/serialize-cost-guide";
import { ServiceSuburbPageTemplate } from "@/components/page/service-suburb-page-template";
import { ServiceSuburbPageForm } from "@/components/admin/service-suburb-page-form";
import { serializeServiceSuburbPage, seedBlankServiceSuburbPage, buildServiceSuburbDraft } from "./serializers/serialize-service-suburb";
import { ProblemPageTemplate } from "@/components/sections/problem/problem-page-template";
import { ProblemPageForm } from "@/components/admin/problem-page-form";
import { serializeProblemPage, seedBlankProblemPage, buildProblemDraft } from "./serializers/serialize-problem";
import { ArticlePageTemplate } from "@/components/sections/blog/article-page-template";
import { ArticleForm } from "@/components/admin/article-form";
import { serializeArticle, seedBlankArticle, buildArticleDraft } from "./serializers/serialize-article";
import { CaseStudyPageTemplate } from "@/components/sections/case-study/case-study-page-template";
import { CaseStudyPageForm } from "@/components/admin/case-study-page-form";
import { serializeCaseStudyPage, seedBlankCaseStudyPage, buildCaseStudyDraft } from "./serializers/serialize-case-study";
import { LandingPageTemplate } from "@/components/sections/landing/landing-page-template";
import { LandingPageForm } from "@/components/admin/landing-page-form";
import { serializeLandingPage, seedBlankLandingPage, buildLandingDraft } from "./serializers/serialize-landing";

/**
 * Registry: `templateType → { Template, AdvancedForm, seedBlank, buildDraft, serialize }`. Keeps
 * `<PageEditor>` and the edit/new routes thin, type-agnostic dispatchers. To add a type: wrap its
 * template's leaves with `<Editable*>`, write `serializers/serialize-<type>.ts`, and register here.
 * NOTE: templates whose prop is not `data` (ServiceSuburb=`page`, Problem=`problem`, Article=`article`,
 * Landing=`page`) must be registered via a `createElement` adapter, e.g.
 *   Template: ((p: { data: unknown }) => createElement(XTemplate, { page: p.data as never })) as EditorRegistryEntry["Template"]
 */
export interface EditorRegistryEntry<TDraft = unknown> {
  Template: ComponentType<{ data: TDraft }>;
  AdvancedForm: ComponentType<{ initial?: InitialPage }>;
  /** A seeded blank draft for "new page" so the canvas isn't empty. */
  seedBlank: () => TDraft;
  /** Build the props draft from the admin record (reuses the type's map-*.ts loader). */
  buildDraft: (initial: InitialPage, heroImageUrl?: string | null) => TDraft;
  /** Inverse of map-*.ts: draft + drawer state → the savePageAction payload. */
  serialize: (input: SerializerInput<TDraft>) => CreatePageCommand;
}

/** A sensible non-empty skeleton for a brand-new ServicePage. */
function seedBlankServicePage(): ServicePage {
  return {
    serviceName: "New service",
    slug: "",
    pageType: "service",
    hero: {
      h1: "New service in Perth",
      subtitle: "Describe the service and the outcome the customer gets.",
      badges: [serviceItemTemplates.badge()],
      image: siteConfig.ogImage,
      imageAlt: "",
      floatingCardLabel: "Same-day service available",
    },
    directAnswer: "",
    intro: { heading: "About this service", paragraphs: [""] },
    problems: [serviceItemTemplates.problem()],
    includedItems: [""],
    processSteps: [serviceItemTemplates.processStep()],
    costGuidance: { intro: "", rows: [] },
    whyChoose: [serviceItemTemplates.whyChoose()],
    relatedServices: [],
    serviceAreas: [""],
    reviews: [],
    faqs: [serviceItemTemplates.faq()],
    cta: { heading: "Get in touch", subtitle: "" },
    seo: { title: "", description: "" },
  };
}

/** Build a ServicePage props draft from the admin record via the authoritative `mapServicePage`. */
export function buildServiceDraft(initial: InitialPage, heroImageUrl?: string | null): ServicePage {
  const dto: PageResolveDto = {
    id: initial.id,
    templateType: "ServicePage",
    routeGroup: "Flat",
    slug: initial.slug,
    title: initial.title,
    seoTitle: initial.seoTitle,
    seoDescription: initial.seoDescription,
    noIndex: initial.noIndex,
    publishedAt: null,
    updatedAt: null,
    heroImage: heroImageUrl ? { cdnUrl: heroImageUrl, altText: "", width: null, height: null } : null,
    data: initial.data ?? {},
    faqs: initial.faqs ?? [],
    relatedLinks: {},
    pricingRows: [],
    reviews: [],
  };
  return mapServicePage(dto);
}

export const editorRegistry: Record<string, EditorRegistryEntry> = {
  ServicePage: {
    Template: ServicePageTemplate as EditorRegistryEntry["Template"],
    AdvancedForm: ServicePageForm,
    seedBlank: seedBlankServicePage,
    buildDraft: buildServiceDraft,
    serialize: serializeServicePage as EditorRegistryEntry["serialize"],
  },
  ComparisonPage: {
    Template: ComparisonPageTemplate as EditorRegistryEntry["Template"],
    AdvancedForm: ComparisonPageForm,
    seedBlank: seedBlankComparisonPage,
    buildDraft: buildComparisonDraft,
    serialize: serializeComparisonPage as EditorRegistryEntry["serialize"],
  },
  CostGuidePage: {
    Template: CostGuidePageTemplate as EditorRegistryEntry["Template"],
    AdvancedForm: CostGuidePageForm,
    seedBlank: seedBlankCostGuidePage,
    buildDraft: buildCostGuideDraft,
    serialize: serializeCostGuidePage as EditorRegistryEntry["serialize"],
  },
  ServiceSuburbPage: {
    // Template prop is `page`, not `data` — adapt.
    Template: ((p: { data: unknown }) =>
      createElement(ServiceSuburbPageTemplate, { page: p.data as never })) as EditorRegistryEntry["Template"],
    AdvancedForm: ServiceSuburbPageForm,
    seedBlank: seedBlankServiceSuburbPage,
    buildDraft: buildServiceSuburbDraft,
    serialize: serializeServiceSuburbPage as EditorRegistryEntry["serialize"],
  },
  ProblemPage: {
    // Template prop is `problem` — adapt.
    Template: ((p: { data: unknown }) =>
      createElement(ProblemPageTemplate, { problem: p.data as never })) as EditorRegistryEntry["Template"],
    AdvancedForm: ProblemPageForm,
    seedBlank: seedBlankProblemPage,
    buildDraft: buildProblemDraft,
    serialize: serializeProblemPage as EditorRegistryEntry["serialize"],
  },
  Article: {
    // Template prop is `article` — adapt.
    Template: ((p: { data: unknown }) =>
      createElement(ArticlePageTemplate, { article: p.data as never })) as EditorRegistryEntry["Template"],
    AdvancedForm: ArticleForm,
    seedBlank: seedBlankArticle,
    buildDraft: buildArticleDraft,
    serialize: serializeArticle as EditorRegistryEntry["serialize"],
  },
  CaseStudyPage: {
    Template: CaseStudyPageTemplate as EditorRegistryEntry["Template"],
    AdvancedForm: CaseStudyPageForm,
    seedBlank: seedBlankCaseStudyPage,
    buildDraft: buildCaseStudyDraft,
    serialize: serializeCaseStudyPage as EditorRegistryEntry["serialize"],
  },
  LandingPage: {
    // Template prop is `page` — adapt.
    Template: ((p: { data: unknown }) =>
      createElement(LandingPageTemplate, { page: p.data as never })) as EditorRegistryEntry["Template"],
    AdvancedForm: LandingPageForm,
    seedBlank: seedBlankLandingPage,
    buildDraft: buildLandingDraft,
    serialize: serializeLandingPage as EditorRegistryEntry["serialize"],
  },
};

export function isRegisteredTemplateType(t: string): boolean {
  return t in editorRegistry;
}

export { mapServicePage };
