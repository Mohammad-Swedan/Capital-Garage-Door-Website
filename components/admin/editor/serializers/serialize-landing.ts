import type { LandingPage } from "@/types/landing-page";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { PageResolveDto } from "@/lib/cms/client";
import { mapLandingPage } from "@/lib/cms/map-landing-page";
import {
  type SerializerInput,
  type CreatePageCommand,
  serializeRelatedLinks,
} from "./types";

/**
 * Inverse of `lib/cms/map-landing-page.ts`: turns the in-place editor's draft
 * (LandingPage *props* shape) back into the `CreatePageCommand` payload that
 * `savePageAction` expects. The §6 bespoke fields go in `data`; the relational
 * pins (FAQs, related links, reviews) round-trip per the same rules as
 * `serialize-service.ts`.
 *
 * Two type-specific rules (per spec):
 *  - Landing pages are NEVER indexed → `noIndex` is forced to `true`, overriding
 *    whatever the Settings drawer holds.
 *  - Reviews on landing are pins this editor doesn't manage in place → echoed
 *    back from `initial` untouched so a save doesn't silently delete them.
 */

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function seedBlankLandingPage(): LandingPage {
  return {
    slug: "",
    pageType: "LandingPage:New",
    serviceLabel: "Garage Door Service",
    hero: {
      eyebrow: "Limited-time offer",
      h1: "Fast garage door service in Perth",
      subtitle: "Describe the offer and the outcome the visitor gets when they book.",
      badges: [{ icon: "ShieldCheck", label: "Licensed & insured" }],
    },
    directAnswer: "Add a concise, direct answer to the visitor's main question here.",
    form: {
      heading: "Request a fast quote",
      subheading: "We'll get back to you shortly.",
    },
    problems: {
      eyebrow: "Common issues",
      heading: "Problems we fix",
      description: "The issues this page's service resolves.",
      items: [
        {
          title: "New problem",
          description: "Describe the problem the customer is facing.",
          icon: "AlertTriangle",
        },
      ],
    },
    whyChoose: {
      eyebrow: "Why us",
      heading: "Why choose us",
      description: "What sets this service apart.",
      items: [
        {
          title: "New reason",
          description: "Describe a reason to choose us.",
          icon: "ShieldCheck",
        },
      ],
    },
    reviews: {
      heading: "What customers say",
      items: [],
    },
    serviceAreas: {
      heading: "Areas we service",
      description: "Suburbs covered by this offer.",
      suburbs: ["Perth"],
    },
    faqs: [],
    finalCta: {
      heading: "Ready to get started?",
      body: "Call now or request a quote and we'll take care of the rest.",
    },
    seo: { title: "", description: "" },
  };
}

/** Build a LandingPage props draft from the admin record via the authoritative `mapLandingPage`. */
function buildLandingDraft(initial: InitialPage, heroImageUrl?: string | null): LandingPage {
  const dto: PageResolveDto = {
    id: initial.id,
    templateType: "LandingPage",
    routeGroup: "Lp",
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
  return mapLandingPage(dto);
}

function serializeLandingPage(input: SerializerInput<LandingPage>): CreatePageCommand {
  const { draft, initial, meta, relatedLinks, heroImageAssetId } = input;
  const hero = draft.hero ?? ({} as LandingPage["hero"]);
  const form = draft.form ?? ({} as LandingPage["form"]);
  const problems = draft.problems ?? ({} as LandingPage["problems"]);
  const whyChoose = draft.whyChoose ?? ({} as LandingPage["whyChoose"]);
  const serviceAreas = draft.serviceAreas ?? ({} as LandingPage["serviceAreas"]);
  const finalCta = draft.finalCta ?? ({} as LandingPage["finalCta"]);

  return {
    ...(initial ? { id: initial.id } : {}),
    templateType: "LandingPage",
    routeGroup: "Lp",
    slug: meta.slug,
    title: meta.title,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    // Landing pages are never indexed — force it regardless of the drawer state.
    noIndex: true,
    status: meta.status,
    heroImageAssetId,
    data: {
      pageType: str(draft.pageType),
      serviceLabel: str(draft.serviceLabel),
      hero: {
        eyebrow: str(hero.eyebrow),
        h1: str(hero.h1),
        subtitle: str(hero.subtitle),
        badges: (hero.badges ?? []).map((b) => ({
          icon: str(b.icon),
          label: str(b.label),
        })),
      },
      directAnswer: str(draft.directAnswer),
      form: {
        heading: str(form.heading),
        subheading: str(form.subheading),
      },
      problems: {
        eyebrow: str(problems.eyebrow),
        heading: str(problems.heading),
        description: str(problems.description),
        items: (problems.items ?? []).map((p) => ({
          title: str(p.title),
          description: str(p.description),
          icon: str(p.icon),
        })),
      },
      whyChoose: {
        eyebrow: str(whyChoose.eyebrow),
        heading: str(whyChoose.heading),
        description: str(whyChoose.description),
        items: (whyChoose.items ?? []).map((w) => ({
          title: str(w.title),
          description: str(w.description),
          icon: str(w.icon),
        })),
      },
      serviceAreas: {
        heading: str(serviceAreas.heading),
        description: str(serviceAreas.description),
        suburbs: (serviceAreas.suburbs ?? []).map(str),
      },
      // map-landing-page reads `data.reviewsHeading` → draft.reviews.heading.
      reviewsHeading: str(draft.reviews?.heading),
      finalCta: {
        heading: str(finalCta.heading),
        body: str(finalCta.body),
      },
    },
    // FAQs — relational pin edited in place but serialized to the `faqs` array.
    faqs: (draft.faqs ?? []).filter((f) => str(f.question).trim() !== "").map((f, i) => ({
      question: str(f.question),
      answer: str(f.answer),
      sortOrder: i,
    })),
    relatedLinks: serializeRelatedLinks(relatedLinks),
    // Pins this editor does NOT manage → echo untouched so they aren't deleted.
    pricingRows: initial?.pricingRows ?? [],
    reviews: initial?.reviews ?? [],
    services: initial?.services ?? [],
  };
}

export { serializeLandingPage, seedBlankLandingPage, buildLandingDraft };
