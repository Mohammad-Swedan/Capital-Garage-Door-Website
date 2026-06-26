import { comparisonPages } from "@/content/comparison-pages";
import type { CreatePagePayload, RegisterAsset } from "@/lib/cms/import/payload";
import { staticLink } from "@/lib/cms/import/payload";

/**
 * One-time transform: local `content/comparison-pages` → CMS `CreatePagePayload[]`.
 *
 * Inverse of `lib/cms/map-comparison-page.ts`. The bespoke `data` mirrors the full
 * §6 comparison shape that mapper reads (camelCase keys). Comparison pages have no
 * hero image (heroImageAssetId: null) and no relational pins this pass.
 *
 * `registerAsset` is accepted to keep the transform signatures uniform across types;
 * comparison content has no image URL to register.
 */
export async function toComparisonPagePayloads(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerAsset: RegisterAsset,
): Promise<CreatePagePayload[]> {
  const payloads: CreatePagePayload[] = [];

  for (const page of comparisonPages) {
    const hero = page.hero ?? ({} as (typeof page)["hero"]);
    const table = page.comparisonTable ?? ({} as (typeof page)["comparisonTable"]);

    const mapOption = (o: (typeof page)["optionA"] | undefined) => ({
      name: o?.name ?? "",
      icon: o?.icon ?? "",
      summary: o?.summary ?? "",
      benefits: Array.isArray(o?.benefits) ? o.benefits : [],
      limitations: Array.isArray(o?.limitations) ? o.limitations : [],
      bestFor: Array.isArray(o?.bestFor) ? o.bestFor : [],
    });

    payloads.push({
      templateType: "ComparisonPage",
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
        comparisonTable: {
          optionALabel: table.optionALabel ?? "",
          optionBLabel: table.optionBLabel ?? "",
          rows: Array.isArray(table.rows)
            ? table.rows.map((r) => ({
                feature: r.feature ?? "",
                optionA: r.optionA ?? "",
                optionB: r.optionB ?? "",
              }))
            : [],
        },
        optionA: mapOption(page.optionA),
        optionB: mapOption(page.optionB),
        decisionCards: Array.isArray(page.decisionCards)
          ? page.decisionCards.map((c) => ({
              heading: c.heading ?? "",
              icon: c.icon ?? "",
              tone: c.tone ?? "uncertain",
              points: Array.isArray(c.points) ? c.points : [],
            }))
          : [],
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
