import { servicePages } from "@/content/service-pages";
import type { CreatePagePayload, RegisterAsset } from "@/lib/cms/import/payload";
import { staticLink } from "@/lib/cms/import/payload";

/**
 * One-time transform: local `content/service-pages` → CMS `CreatePagePayload[]`.
 *
 * Inverse of `lib/cms/map-service-page.ts`. The bespoke `data` shape is rebuilt
 * EXACTLY as that mapper reads it (camelCase keys), minus the relational fields
 * (pricing rows, reviews, services), which are pinned later in the admin.
 */
export async function toServicePagePayloads(
  registerAsset: RegisterAsset,
): Promise<CreatePagePayload[]> {
  const payloads: CreatePagePayload[] = [];

  for (const page of servicePages) {
    const hero = page.hero ?? ({} as (typeof page)["hero"]);

    const heroImageAssetId = hero.image
      ? await registerAsset(hero.image, hero.imageAlt ?? page.serviceName)
      : null;

    payloads.push({
      templateType: "ServicePage",
      routeGroup: "Flat",
      slug: page.slug,
      title: page.serviceName,
      seoTitle: page.seo?.title ?? "",
      seoDescription: page.seo?.description ?? "",
      noIndex: false,
      status: "Published",
      heroImageAssetId,
      data: {
        hero: {
          h1: hero.h1 ?? "",
          subtitle: hero.subtitle ?? "",
          badges: Array.isArray(hero.badges) ? hero.badges : [],
          imageAlt: hero.imageAlt ?? "",
          floatingCardLabel: hero.floatingCardLabel ?? "",
        },
        directAnswer: page.directAnswer ?? "",
        intro: {
          heading: page.intro?.heading ?? "",
          paragraphs: Array.isArray(page.intro?.paragraphs) ? page.intro.paragraphs : [],
        },
        problems: Array.isArray(page.problems)
          ? page.problems.map((p) => ({ label: p.label ?? "", icon: p.icon ?? "" }))
          : [],
        includedItems: Array.isArray(page.includedItems) ? page.includedItems : [],
        processSteps: Array.isArray(page.processSteps)
          ? page.processSteps.map((s) => ({
              title: s.title ?? "",
              description: s.description ?? "",
              icon: s.icon ?? "",
            }))
          : [],
        costGuidanceIntro: page.costGuidance?.intro ?? "",
        whyChoose: Array.isArray(page.whyChoose)
          ? page.whyChoose.map((w) => ({
              title: w.title ?? "",
              description: w.description ?? "",
              icon: w.icon ?? "",
            }))
          : [],
        serviceAreas: Array.isArray(page.serviceAreas) ? page.serviceAreas : [],
        cta: {
          heading: page.cta?.heading ?? "",
          subtitle: page.cta?.subtitle ?? "",
        },
      },
      faqs: Array.isArray(page.faqs)
        ? page.faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i }))
        : [],
      relatedLinks: Array.isArray(page.relatedServices)
        ? page.relatedServices.map((l, i) =>
            staticLink(l.href, l.name, "RelatedServices", i),
          )
        : [],
      pricingRows: [],
      reviews: [],
      services: [],
    });
  }

  return payloads;
}
