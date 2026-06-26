import { costGuidePages } from "@/content/cost-guides";
import type { CreatePagePayload, RegisterAsset } from "@/lib/cms/import/payload";
import { staticLink } from "@/lib/cms/import/payload";

/**
 * One-time transform: local `content/cost-guides` → CMS `CreatePagePayload[]`.
 *
 * Inverse of `lib/cms/map-cost-guide-page.ts`. The bespoke `data` mirrors the §6
 * cost-guide shape that mapper reads (camelCase keys) — EXCEPT `costTable.rows`,
 * which are relational (pricing rows) and skipped this pass; only the costTable
 * heading/intro/disclaimer are carried in `data`. No hero image (null) and no
 * relational pins this pass.
 *
 * `registerAsset` is accepted to keep the transform signatures uniform across types;
 * cost-guide content has no image URL to register.
 */
export async function toCostGuidePagePayloads(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerAsset: RegisterAsset,
): Promise<CreatePagePayload[]> {
  const payloads: CreatePagePayload[] = [];

  for (const page of costGuidePages) {
    const hero = page.hero ?? ({} as (typeof page)["hero"]);
    const costTable = page.costTable ?? ({} as (typeof page)["costTable"]);
    const factors = page.factors ?? ({} as (typeof page)["factors"]);
    const scenarios = page.scenarios ?? ({} as (typeof page)["scenarios"]);
    const repairVsReplace =
      page.repairVsReplace ?? ({} as (typeof page)["repairVsReplace"]);
    const howToQuote = page.howToQuote ?? ({} as (typeof page)["howToQuote"]);

    payloads.push({
      templateType: "CostGuidePage",
      routeGroup: "Flat",
      slug: page.slug,
      title: hero.h1 ?? page.topicLabel ?? "",
      seoTitle: page.seo?.title ?? "",
      seoDescription: page.seo?.description ?? "",
      noIndex: false,
      status: "Published",
      heroImageAssetId: null,
      data: {
        topicLabel: page.topicLabel ?? "",
        hero: {
          h1: hero.h1 ?? "",
          subtitle: hero.subtitle ?? "",
        },
        directAnswer: page.directAnswer ?? "",
        costTable: {
          heading: costTable.heading ?? "",
          intro: costTable.intro ?? "",
          // rows are relational (pricing rows) and skipped this pass.
          disclaimer: costTable.disclaimer ?? "",
        },
        factors: {
          heading: factors.heading ?? "",
          items: Array.isArray(factors.items)
            ? factors.items.map((i) => ({
                icon: i.icon ?? "",
                title: i.title ?? "",
                description: i.description ?? "",
              }))
            : [],
        },
        scenarios: {
          heading: scenarios.heading ?? "",
          items: Array.isArray(scenarios.items)
            ? scenarios.items.map((i) => ({
                icon: i.icon ?? "",
                title: i.title ?? "",
                mayAffectQuote: i.mayAffectQuote ?? "",
              }))
            : [],
        },
        repairVsReplace: {
          heading: repairVsReplace.heading ?? "",
          intro: repairVsReplace.intro ?? "",
          repairWhen: Array.isArray(repairVsReplace.repairWhen)
            ? repairVsReplace.repairWhen
            : [],
          replaceWhen: Array.isArray(repairVsReplace.replaceWhen)
            ? repairVsReplace.replaceWhen
            : [],
        },
        howToQuote: {
          heading: howToQuote.heading ?? "",
          steps: Array.isArray(howToQuote.steps)
            ? howToQuote.steps.map((s) => ({
                icon: s.icon ?? "",
                title: s.title ?? "",
                description: s.description ?? "",
              }))
            : [],
        },
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
