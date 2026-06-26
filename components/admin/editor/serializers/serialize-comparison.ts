import type {
  ComparisonPage,
  ComparisonOption,
  ComparisonDecisionCard,
} from "@/types/comparison-page";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { PageResolveDto } from "@/lib/cms/client";
import { mapComparisonPage } from "@/lib/cms/map-comparison-page";
import {
  type SerializerInput,
  type CreatePageCommand,
  serializeRelatedLinks,
} from "./types";

/**
 * Inverse of `lib/cms/map-comparison-page.ts`: turns the in-place editor's draft
 * (ComparisonPage *props* shape) back into the `CreatePageCommand` payload that
 * `savePageAction` expects. Mirrors `serialize-service.ts` exactly in structure.
 *
 * Relational pins (FAQs, related links, pricing rows, reviews, services) are
 * children the backend REPLACES WHOLESALE on update — so any pin this editor
 * doesn't manage in-place is echoed back from `initial` untouched to avoid
 * silently deleting it (plan §B.6, the single most important correctness rule).
 */

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

const VALID_TONES: ComparisonDecisionCard["tone"][] = ["optionA", "optionB", "uncertain"];

function asTone(v: unknown): ComparisonDecisionCard["tone"] {
  return VALID_TONES.includes(v as ComparisonDecisionCard["tone"])
    ? (v as ComparisonDecisionCard["tone"])
    : "uncertain";
}

/** Serialize an option block back to the §6 `data.optionA`/`data.optionB` shape. */
function serializeOption(o: ComparisonOption | undefined) {
  const opt = o ?? ({} as ComparisonOption);
  return {
    name: str(opt.name),
    icon: str(opt.icon),
    summary: str(opt.summary),
    benefits: (opt.benefits ?? []).map(str),
    limitations: (opt.limitations ?? []).map(str),
    bestFor: (opt.bestFor ?? []).map(str),
  };
}

export function serializeComparisonPage(
  input: SerializerInput<ComparisonPage>,
): CreatePageCommand {
  const { draft, initial, meta, relatedLinks, heroImageAssetId } = input;
  const hero = draft.hero ?? ({} as ComparisonPage["hero"]);
  const table = draft.comparisonTable ?? ({} as ComparisonPage["comparisonTable"]);

  return {
    ...(initial ? { id: initial.id } : {}),
    templateType: "ComparisonPage",
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
      comparisonTable: {
        optionALabel: str(table.optionALabel),
        optionBLabel: str(table.optionBLabel),
        rows: (table.rows ?? []).map((r) => ({
          feature: str(r.feature),
          optionA: str(r.optionA),
          optionB: str(r.optionB),
        })),
      },
      optionA: serializeOption(draft.optionA),
      optionB: serializeOption(draft.optionB),
      decisionCards: (draft.decisionCards ?? []).map((c) => ({
        heading: str(c.heading),
        icon: str(c.icon),
        tone: asTone(c.tone),
        points: (c.points ?? []).map(str),
      })),
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
    pricingRows: initial?.pricingRows ?? [],
    reviews: initial?.reviews ?? [],
    services: initial?.services ?? [],
  };
}

/** A sensible non-empty skeleton for a brand-new ComparisonPage. */
export function seedBlankComparisonPage(): ComparisonPage {
  return {
    slug: "",
    pageType: "comparison",
    topicLabel: "New comparison",
    hero: {
      h1: "Option A vs Option B: Which Is Right for You?",
      subtitle: "Describe what the visitor is choosing between and the outcome.",
    },
    directAnswer: "",
    comparisonTable: {
      optionALabel: "Option A",
      optionBLabel: "Option B",
      rows: [{ feature: "", optionA: "", optionB: "" }],
    },
    optionA: {
      name: "Option A",
      icon: "ShieldCheck",
      summary: "",
      benefits: [""],
      limitations: [""],
      bestFor: [""],
    },
    optionB: {
      name: "Option B",
      icon: "Scale",
      summary: "",
      benefits: [""],
      limitations: [""],
      bestFor: [""],
    },
    decisionCards: [{ heading: "", icon: "HelpCircle", tone: "uncertain", points: [""] }],
    relatedServices: [],
    faqs: [{ question: "", answer: "" }],
    cta: { heading: "Get in touch", subtitle: "" },
    seo: { title: "", description: "" },
    updatedAt: "",
  };
}

/** Build a ComparisonPage props draft from the admin record via the authoritative `mapComparisonPage`. */
export function buildComparisonDraft(
  initial: InitialPage,
  heroImageUrl?: string | null,
): ComparisonPage {
  const dto: PageResolveDto = {
    id: initial.id,
    templateType: "ComparisonPage",
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
  return mapComparisonPage(dto);
}
