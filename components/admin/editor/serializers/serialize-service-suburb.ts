import type { SerializerInput, CreatePageCommand } from "./types";
import { serializeRelatedLinks } from "./types";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { PageResolveDto } from "@/lib/cms/client";
import { mapServiceSuburbPage } from "@/lib/cms/map-service-suburb-page";
import type { ServiceSuburbPage } from "@/types";

/**
 * Inverse of `lib/cms/map-service-suburb-page.ts`: turns the in-place editor's
 * draft (ServiceSuburbPage *props* shape) back into the `CreatePageCommand`
 * payload `savePageAction` expects. The bespoke parts go in `data` (§6); the
 * relational pins (FAQs, nearby suburbs / related pages) round-trip via `faqs`
 * and `relatedLinks`.
 *
 * Relational pins this editor does NOT manage in-place (pricingRows / reviews /
 * services) are echoed back from `initial` untouched, because the backend
 * REPLACES all children on update — omitting them would silently delete them
 * (plan §B.6).
 */

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function serializeServiceSuburbPage(
  input: SerializerInput<ServiceSuburbPage>,
): CreatePageCommand {
  const { draft, initial, meta, relatedLinks, heroImageAssetId } = input;
  const hero = draft.hero ?? ({} as ServiceSuburbPage["hero"]);
  const costGuidance = draft.costGuidance ?? ({} as ServiceSuburbPage["costGuidance"]);

  return {
    ...(initial ? { id: initial.id } : {}),
    templateType: "ServiceSuburbPage",
    routeGroup: "Flat",
    slug: meta.slug,
    title: meta.title,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    noIndex: meta.noIndex,
    status: meta.status,
    heroImageAssetId,
    data: {
      service: str(draft.service),
      suburb: str(draft.suburb),
      region: str(draft.region),
      hero: {
        subtitle: str(hero.subtitle),
        trustBadges: (hero.trustBadges ?? []).map(str),
      },
      directAnswer: str(draft.directAnswer),
      localIntro: (draft.localIntro ?? []).map(str),
      availableServices: (draft.availableServices ?? []).map((s) => ({
        title: str(s.title),
        description: str(s.description),
        icon: str(s.icon),
      })),
      problems: (draft.problems ?? []).map((p) => ({
        title: str(p.title),
        description: str(p.description),
        icon: str(p.icon),
      })),
      costGuidance: {
        intro: str(costGuidance.intro),
        factors: (costGuidance.factors ?? []).map(str),
        // map-* reads `asString(note) || undefined`; persist an empty string when unset.
        note: str(costGuidance.note),
      },
      whyChooseUs: (draft.whyChooseUs ?? []).map((w) => ({
        title: str(w.title),
        description: str(w.description),
        icon: str(w.icon),
      })),
      localProof: (draft.localProof ?? []).map((p) => ({
        serviceType: str(p.serviceType),
        suburb: str(p.suburb),
        problem: str(p.problem),
        solution: str(p.solution),
      })),
    },
    // FAQs — relational pin serialized to the `faqs` array.
    faqs: (draft.faqs ?? []).filter((f) => str(f.question).trim() !== "").map((f, i) => ({
      question: str(f.question),
      answer: str(f.answer),
      sortOrder: i,
    })),
    // Nearby suburbs + related pages are canonical in the Settings drawer.
    relatedLinks: serializeRelatedLinks(relatedLinks),
    // Pins this editor does NOT manage → echo untouched so they aren't deleted.
    pricingRows: initial?.pricingRows ?? [],
    reviews: initial?.reviews ?? [],
    services: initial?.services ?? [],
  };
}

/** A sensible non-empty skeleton for a brand-new ServiceSuburbPage. */
export function seedBlankServiceSuburbPage(): ServiceSuburbPage {
  return {
    slug: "",
    service: "Garage Door Repairs",
    suburb: "New Suburb",
    region: "Perth, WA",
    nearbySuburbs: [],
    hero: {
      subtitle: "Describe the local service and the outcome the customer gets.",
      trustBadges: [""],
    },
    directAnswer: "",
    localIntro: [""],
    availableServices: [{ title: "", description: "", icon: "Wrench" }],
    problems: [{ title: "", description: "", icon: "AlertTriangle" }],
    costGuidance: { intro: "", factors: [""], note: undefined },
    whyChooseUs: [{ title: "", description: "", icon: "ShieldCheck" }],
    relatedPages: [],
    faqs: [{ question: "", answer: "" }],
    localProof: [{ serviceType: "", suburb: "", problem: "", solution: "" }],
    seo: { title: "", description: "" },
  };
}

/**
 * Build a ServiceSuburbPage props draft from the admin record via the
 * authoritative `mapServiceSuburbPage` (so the edit view starts identical to
 * the public render).
 */
export function buildServiceSuburbDraft(
  initial: InitialPage,
  heroImageUrl?: string | null,
): ServiceSuburbPage {
  const dto: PageResolveDto = {
    id: initial.id,
    templateType: "ServiceSuburbPage",
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
  return mapServiceSuburbPage(dto);
}
