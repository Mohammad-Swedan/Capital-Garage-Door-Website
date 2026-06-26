import type { SerializerInput, CreatePageCommand } from "./types";
import { serializeRelatedLinks } from "./types";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { PageResolveDto } from "@/lib/cms/client";
import { mapProblemPage } from "@/lib/cms/map-problem-page";
import type { Problem } from "@/types";

/**
 * Inverse of `lib/cms/map-problem-page.ts`: turns the in-place editor's draft
 * (Problem *props* shape) back into the `CreatePageCommand` payload
 * `savePageAction` expects.
 *
 * NOTE on field homes (§6): `h1`/`metaTitle`/`metaDescription` are NOT in `data`
 * — they map to the Pages row's `title`/`seoTitle`/`seoDescription` (the Settings
 * drawer's meta). `relatedServices` and `costRows` are relational pins
 * (`relatedLinks` / `pricingRows`) the backend replaces wholesale on update, so
 * any pin this editor doesn't manage in-place is echoed back from `initial`
 * untouched to avoid silently deleting it (plan §B.6).
 */

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function serializeProblemPage(
  input: SerializerInput<Problem>,
): CreatePageCommand {
  const { draft, initial, meta, relatedLinks, heroImageAssetId } = input;
  const emergency = draft.emergency ?? ({} as Problem["emergency"]);

  return {
    ...(initial ? { id: initial.id } : {}),
    templateType: "ProblemPage",
    routeGroup: "Problems",
    slug: meta.slug,
    // h1/meta come from the Pages row (drawer meta), NOT from `data`.
    title: meta.title,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    noIndex: meta.noIndex,
    status: meta.status,
    heroImageAssetId,
    data: {
      heroSubtitle: str(draft.heroSubtitle),
      directAnswer: str(draft.directAnswer),
      causes: (draft.causes ?? []).map((c) => ({
        icon: str(c.icon),
        title: str(c.title),
        description: str(c.description),
      })),
      safeChecks: (draft.safeChecks ?? []).map(str),
      doNotDo: (draft.doNotDo ?? []).map(str),
      callTechnicianSigns: (draft.callTechnicianSigns ?? []).map(str),
      emergency: {
        heading: str(emergency.heading),
        body: str(emergency.body),
      },
    },
    // FAQs — relational pin serialized to the `faqs` array.
    faqs: (draft.faqs ?? []).filter((f) => str(f.question).trim() !== "").map((f, i) => ({
      question: str(f.question),
      answer: str(f.answer),
      sortOrder: i,
      // Carry library provenance through (null for free-text FAQs).
      faqItemId: f.faqItemId ?? null,
    })),
    // Related services are canonical in the Settings drawer.
    relatedLinks: serializeRelatedLinks(relatedLinks),
    // Pins this editor does NOT manage → echo untouched so they aren't deleted.
    // (`costRows` ride along on `pricingRows`.)
    pricingRows: initial?.pricingRows ?? [],
    reviews: initial?.reviews ?? [],
    services: initial?.services ?? [],
  };
}

/** A sensible non-empty skeleton for a brand-new ProblemPage. */
export function seedBlankProblemPage(): Problem {
  return {
    slug: "",
    name: "New problem",
    h1: "New garage door problem",
    heroSubtitle: "Describe the urgent situation and reassure the customer.",
    metaTitle: "",
    metaDescription: "",
    directAnswer: "",
    causes: [{ icon: "AlertTriangle", title: "", description: "" }],
    safeChecks: [""],
    doNotDo: [""],
    callTechnicianSigns: [""],
    relatedServices: [],
    costRows: [],
    emergency: { heading: "Need emergency help?", body: "" },
    faqs: [{ question: "", answer: "" }],
    updatedAt: "",
    heroImage: undefined,
  };
}

/**
 * Build a Problem props draft from the admin record via the authoritative
 * `mapProblemPage` (so the edit view starts identical to the public render).
 */
export function buildProblemDraft(
  initial: InitialPage,
  heroImageUrl?: string | null,
): Problem {
  const dto: PageResolveDto = {
    id: initial.id,
    templateType: "ProblemPage",
    routeGroup: "Problems",
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
  return mapProblemPage(dto);
}
