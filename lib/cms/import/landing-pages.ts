/**
 * One-time transform: `content/landing-pages` → CMS create payloads.
 *
 * This is the INVERSE of `lib/cms/map-landing-page.ts`. Landing pages are paid (Google Ads)
 * pages served at /lp/[slug] and are always `noIndex: true`. Reviews are relational pins that
 * are NOT imported in this pass (`reviews: []`); the mapper reads the reviews heading from the
 * flat `data.reviewsHeading` key, which we preserve. These pages carry no internal related
 * links, so `relatedLinks` is empty.
 */
import { landingPages } from "@/content/landing-pages";
import type { CreatePagePayload, RegisterAsset } from "./payload";

export async function toLandingPagePayloads(
  registerAsset: RegisterAsset,
): Promise<CreatePagePayload[]> {
  // Landing pages carry no hero image URL; registerAsset is part of the shared contract only.
  void registerAsset;

  return landingPages.map((page): CreatePagePayload => {
    const title = page.hero?.h1 || page.serviceLabel;

    const data: Record<string, unknown> = {
      pageType: page.pageType ?? "",
      serviceLabel: page.serviceLabel ?? "",
      hero: {
        eyebrow: page.hero?.eyebrow ?? "",
        h1: page.hero?.h1 ?? "",
        subtitle: page.hero?.subtitle ?? "",
        badges: (page.hero?.badges ?? []).map((b) => ({
          icon: b.icon,
          label: b.label,
        })),
      },
      directAnswer: page.directAnswer ?? "",
      form: {
        heading: page.form?.heading ?? "",
        subheading: page.form?.subheading ?? "",
      },
      problems: {
        eyebrow: page.problems?.eyebrow ?? "",
        heading: page.problems?.heading ?? "",
        description: page.problems?.description ?? "",
        items: (page.problems?.items ?? []).map((p) => ({
          title: p.title,
          description: p.description,
          icon: p.icon,
        })),
      },
      whyChoose: {
        eyebrow: page.whyChoose?.eyebrow ?? "",
        heading: page.whyChoose?.heading ?? "",
        description: page.whyChoose?.description ?? "",
        items: (page.whyChoose?.items ?? []).map((w) => ({
          title: w.title,
          description: w.description,
          icon: w.icon,
        })),
      },
      reviewsHeading: page.reviews?.heading ?? "",
      serviceAreas: {
        heading: page.serviceAreas?.heading ?? "",
        description: page.serviceAreas?.description ?? "",
        suburbs: page.serviceAreas?.suburbs ?? [],
      },
      finalCta: {
        heading: page.finalCta?.heading ?? "",
        body: page.finalCta?.body ?? "",
      },
    };

    return {
      templateType: "LandingPage",
      routeGroup: "Lp",
      slug: page.slug,
      title,
      seoTitle: page.seo?.title ?? "",
      seoDescription: page.seo?.description ?? "",
      noIndex: true,
      status: "Published",
      heroImageAssetId: null,
      data,
      faqs: (page.faqs ?? []).map((f, i) => ({
        question: f.question,
        answer: f.answer,
        sortOrder: i,
      })),
      relatedLinks: [],
      pricingRows: [],
      reviews: [],
      services: [],
    };
  });
}
