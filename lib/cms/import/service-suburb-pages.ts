/**
 * One-time transform: `content/service-suburb-pages.ts` → CMS create payloads.
 *
 * This is the INVERSE of `lib/cms/map-service-suburb-page.ts` (which reads the resolve DTO
 * back into the `ServiceSuburbPage` shape). The bespoke §6 `data` block is rebuilt in the
 * exact camelCase shape that mapper reads, MINUS relational fields (FAQs, nearby suburbs,
 * related pages) which are emitted as `faqs` / `relatedLinks` instead.
 */
import { serviceSuburbPages } from "@/content/service-suburb-pages";
import type { CreatePagePayload, RegisterAsset } from "./payload";
import { staticLink } from "./payload";

export async function toServiceSuburbPagePayloads(
  registerAsset: RegisterAsset,
): Promise<CreatePagePayload[]> {
  // registerAsset is currently unused (these pages carry no hero image URL) but is part of the
  // shared transform contract; reference it so the signature stays honest.
  void registerAsset;

  return serviceSuburbPages.map((page): CreatePagePayload => {
    const title = `${page.service} ${page.suburb}`;

    const data: Record<string, unknown> = {
      service: page.service,
      suburb: page.suburb,
      region: page.region,
      hero: {
        subtitle: page.hero?.subtitle ?? "",
        trustBadges: page.hero?.trustBadges ?? [],
      },
      directAnswer: page.directAnswer ?? "",
      localIntro: page.localIntro ?? [],
      availableServices: (page.availableServices ?? []).map((s) => ({
        title: s.title,
        description: s.description,
        icon: s.icon,
      })),
      problems: (page.problems ?? []).map((p) => ({
        title: p.title,
        description: p.description,
        icon: p.icon,
      })),
      costGuidance: {
        intro: page.costGuidance?.intro ?? "",
        factors: page.costGuidance?.factors ?? [],
        note: page.costGuidance?.note ?? "",
      },
      whyChooseUs: (page.whyChooseUs ?? []).map((w) => ({
        title: w.title,
        description: w.description,
        icon: w.icon,
      })),
      localProof: (page.localProof ?? []).map((p) => ({
        serviceType: p.serviceType,
        suburb: p.suburb,
        problem: p.problem,
        solution: p.solution,
      })),
    };

    const relatedLinks = [
      ...(page.nearbySuburbs ?? []).map((l, i) =>
        staticLink(l.href, l.label, "NearbySuburbs", i),
      ),
      ...(page.relatedPages ?? []).map((l, i) =>
        staticLink(l.href, l.label, "RelatedPages", i),
      ),
    ];

    return {
      templateType: "ServiceSuburbPage",
      routeGroup: "Flat",
      slug: page.slug,
      title,
      seoTitle: page.seo?.title ?? "",
      seoDescription: page.seo?.description ?? "",
      noIndex: false,
      status: "Published",
      heroImageAssetId: null,
      data,
      faqs: (page.faqs ?? []).map((f, i) => ({
        question: f.question,
        answer: f.answer,
        sortOrder: i,
      })),
      relatedLinks,
      pricingRows: [],
      reviews: [],
      services: [],
    };
  });
}
