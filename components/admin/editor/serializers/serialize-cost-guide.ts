import type {
  CostGuidePage,
  CostFactor,
  CostScenario,
  CostGuideStep,
} from "@/types/cost-guide";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { PageResolveDto } from "@/lib/cms/client";
import { mapCostGuidePage } from "@/lib/cms/map-cost-guide-page";
import {
  type SerializerInput,
  type CreatePageCommand,
  serializeRelatedLinks,
} from "./types";

/**
 * Inverse of `lib/cms/map-cost-guide-page.ts`: turns the in-place editor's draft
 * (CostGuidePage *props* shape) back into the `CreatePageCommand` payload that
 * `savePageAction` expects. Mirrors `serialize-service.ts` exactly in structure.
 *
 * Relational pins (FAQs, related links, pricing rows, reviews, services) are
 * children the backend REPLACES WHOLESALE on update — so any pin this editor
 * doesn't manage in-place is echoed back from `initial` untouched to avoid
 * silently deleting it (plan §B.6, the single most important correctness rule).
 *
 * IMPORTANT: the cost-table rows are pricing-row PINS (`PagePricingRows`), not
 * `data`. They're echoed via `initial.pricingRows` untouched — `data.costTable`
 * carries only the heading/intro/disclaimer narrative (§6).
 */

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function serializeCostGuidePage(
  input: SerializerInput<CostGuidePage>,
): CreatePageCommand {
  const { draft, initial, meta, relatedLinks, heroImageAssetId } = input;
  const hero = draft.hero ?? ({} as CostGuidePage["hero"]);
  const costTable = draft.costTable ?? ({} as CostGuidePage["costTable"]);

  return {
    ...(initial ? { id: initial.id } : {}),
    templateType: "CostGuidePage",
    routeGroup: "Flat",
    slug: meta.slug,
    title: meta.title,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    noIndex: meta.noIndex,
    status: meta.status,
    heroImageAssetId,
    data: {
      topicLabel: str(draft.topicLabel),
      hero: {
        h1: str(hero.h1),
        subtitle: str(hero.subtitle),
      },
      directAnswer: str(draft.directAnswer),
      // Cost-table ROWS are pricing-row pins (echoed below), not data — only the narrative here.
      costTable: {
        heading: str(costTable.heading),
        intro: str(costTable.intro),
        disclaimer: str(costTable.disclaimer),
      },
      factors: {
        heading: str(draft.factors?.heading),
        items: (draft.factors?.items ?? []).map((i) => ({
          icon: str(i.icon),
          title: str(i.title),
          description: str(i.description),
        })),
      },
      scenarios: {
        heading: str(draft.scenarios?.heading),
        items: (draft.scenarios?.items ?? []).map((i) => ({
          icon: str(i.icon),
          title: str(i.title),
          mayAffectQuote: str(i.mayAffectQuote),
        })),
      },
      repairVsReplace: {
        heading: str(draft.repairVsReplace?.heading),
        intro: str(draft.repairVsReplace?.intro),
        repairWhen: (draft.repairVsReplace?.repairWhen ?? []).map(str),
        replaceWhen: (draft.repairVsReplace?.replaceWhen ?? []).map(str),
      },
      howToQuote: {
        heading: str(draft.howToQuote?.heading),
        steps: (draft.howToQuote?.steps ?? []).map((s) => ({
          icon: str(s.icon),
          title: str(s.title),
          description: str(s.description),
        })),
      },
      cta: {
        heading: str(draft.cta?.heading),
        subtitle: str(draft.cta?.subtitle),
      },
    },
    // FAQs — relational pin edited in place (in the shared FAQ section) and serialized to `faqs`.
    faqs: (draft.faqs ?? []).filter((f) => str(f.question).trim() !== "").map((f, i) => ({
      question: str(f.question),
      answer: str(f.answer),
      sortOrder: i,
      // Carry library provenance through (null for free-text FAQs).
      faqItemId: f.faqItemId ?? null,
    })),
    // Related links — canonical management in the Settings drawer.
    relatedLinks: serializeRelatedLinks(relatedLinks),
    // Pins this editor does NOT manage → echo untouched so they aren't deleted.
    // (cost-table rows live in pricingRows — echoed here, NOT rebuilt from `data`.)
    pricingRows: initial?.pricingRows ?? [],
    reviews: initial?.reviews ?? [],
    services: initial?.services ?? [],
  };
}

/** A sensible non-empty skeleton for a brand-new CostGuidePage. */
export function seedBlankCostGuidePage(): CostGuidePage {
  const blankFactor: CostFactor = { icon: "FileText", title: "", description: "" };
  const blankScenario: CostScenario = { icon: "Wrench", title: "", mayAffectQuote: "" };
  const blankStep: CostGuideStep = { icon: "FileText", title: "", description: "" };

  return {
    slug: "",
    pageType: "cost-guide",
    topicLabel: "New cost guide",
    hero: {
      h1: "How Much Does [Service] Cost in Perth?",
      subtitle: "Describe what the page prices and who it's for.",
    },
    directAnswer: "",
    costTable: {
      heading: "Typical Costs",
      intro: "What you can expect to pay and why.",
      // Rows are pricing-row pins managed outside the in-place editor.
      rows: [],
      disclaimer: "Indicative pricing only — your exact quote depends on your specific job.",
    },
    factors: { heading: "What Affects the Price", items: [blankFactor] },
    scenarios: { heading: "Example Scenarios", items: [blankScenario] },
    repairVsReplace: {
      heading: "Repair or Replace?",
      intro: "",
      repairWhen: [""],
      replaceWhen: [""],
    },
    howToQuote: { heading: "How to Get an Accurate Quote", steps: [blankStep] },
    relatedServices: [],
    faqs: [{ question: "", answer: "" }],
    cta: { heading: "Get in touch", subtitle: "" },
    seo: { title: "", description: "" },
    updatedAt: "",
  };
}

/** Build a CostGuidePage props draft from the admin record via the authoritative `mapCostGuidePage`. */
export function buildCostGuideDraft(
  initial: InitialPage,
  heroImageUrl?: string | null,
): CostGuidePage {
  const dto: PageResolveDto = {
    id: initial.id,
    templateType: "CostGuidePage",
    routeGroup: "Flat",
    slug: initial.slug,
    title: initial.title,
    seoTitle: initial.seoTitle,
    seoDescription: initial.seoDescription,
    noIndex: initial.noIndex,
    publishedAt: null,
    updatedAt: null,
    heroImage: heroImageUrl
      ? { cdnUrl: heroImageUrl, altText: "", width: null, height: null }
      : null,
    data: initial.data ?? {},
    faqs: initial.faqs ?? [],
    relatedLinks: {},
    pricingRows: [],
    reviews: [],
  };
  return mapCostGuidePage(dto);
}
