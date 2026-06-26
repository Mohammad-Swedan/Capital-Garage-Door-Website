import type { CaseStudyPage } from "@/types/case-study";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { PageResolveDto } from "@/lib/cms/client";
import { mapCaseStudyPage } from "@/lib/cms/map-case-study-page";
import {
  type SerializerInput,
  type CreatePageCommand,
  serializeRelatedLinks,
} from "./types";

/**
 * Inverse of `lib/cms/map-case-study-page.ts`: turns the in-place editor's draft
 * (CaseStudyPage *props* shape) back into the `CreatePageCommand` payload that
 * `savePageAction` expects (mirrors `serialize-service.ts`).
 *
 * Relational pins the backend REPLACES WHOLESALE on update (FAQs, related
 * links, pricing rows, reviews, services) are echoed back from `initial`
 * untouched whenever this editor doesn't manage them in place, so they aren't
 * silently deleted (plan §B.6).
 *
 * v1 scope: `images[]` is NOT edited in place — it is passed straight through
 * from the draft so it round-trips unchanged.
 */

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function block(b: CaseStudyPage["problem"] | undefined) {
  return {
    intro: str(b?.intro),
    points: (b?.points ?? []).map(str),
  };
}

export function serializeCaseStudyPage(
  input: SerializerInput<CaseStudyPage>,
): CreatePageCommand {
  const { draft, initial, meta, relatedLinks, heroImageAssetId } = input;

  return {
    ...(initial ? { id: initial.id } : {}),
    templateType: "CaseStudyPage",
    routeGroup: "CaseStudies",
    slug: meta.slug,
    title: meta.title,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    noIndex: meta.noIndex,
    status: meta.status,
    heroImageAssetId,
    data: {
      title: str(draft.title),
      subtitle: str(draft.subtitle),
      service: str(draft.service),
      suburb: str(draft.suburb),
      doorType: str(draft.doorType),
      jobType: str(draft.jobType),
      result: str(draft.result),
      summary: {
        problem: str(draft.summary?.problem),
        diagnosis: str(draft.summary?.diagnosis),
        solution: str(draft.summary?.solution),
      },
      problem: block(draft.problem),
      diagnosis: block(draft.diagnosis),
      solution: block(draft.solution),
      // Not edited in place (v1) — round-tripped through unchanged.
      images: draft.images ?? [],
      partsUsed: (draft.partsUsed ?? []).map(str),
    },
    // FAQs — relational pin (edited in place via EditableFaqList → draft.faqs).
    faqs: (draft.faqs ?? []).filter((f) => str(f.question).trim() !== "").map((f, i) => ({
      question: str(f.question),
      answer: str(f.answer),
      sortOrder: i,
    })),
    // Related links — canonical management in the Settings drawer.
    relatedLinks: serializeRelatedLinks(relatedLinks),
    // Pins this editor does NOT manage → echo untouched so they aren't deleted.
    pricingRows: initial?.pricingRows ?? [],
    reviews: initial?.reviews ?? [],
    services: initial?.services ?? [],
  };
}

/** A sensible non-empty skeleton for a brand-new CaseStudyPage. */
export function seedBlankCaseStudyPage(): CaseStudyPage {
  return {
    slug: "",
    pageType: "case-study",
    title: "New completed job",
    subtitle: "Describe the job and the outcome the customer got.",
    service: "",
    suburb: "",
    doorType: "",
    jobType: "",
    result: "",
    summary: { problem: "", diagnosis: "", solution: "" },
    problem: { intro: "", points: [""] },
    diagnosis: { intro: "", points: [""] },
    solution: { intro: "", points: [""] },
    images: [],
    partsUsed: [""],
    relatedServices: [],
    faqs: [{ question: "", answer: "" }],
    seo: { title: "", description: "" },
    updatedAt: "",
  };
}

/** Build a CaseStudyPage props draft from the admin record via the authoritative `mapCaseStudyPage`. */
export function buildCaseStudyDraft(
  initial: InitialPage,
  heroImageUrl?: string | null,
): CaseStudyPage {
  const dto: PageResolveDto = {
    id: initial.id,
    templateType: "CaseStudyPage",
    routeGroup: "CaseStudies",
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
  return mapCaseStudyPage(dto);
}
