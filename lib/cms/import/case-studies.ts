/**
 * One-time transform: `content/case-studies/*` → CMS `CreatePagePayload[]`.
 *
 * Inverse of `lib/cms/map-case-study-page.ts`: rebuilds the §6 bespoke `data` blob (camelCase,
 * minus relational fields), registers every embedded image as an Asset, and maps FAQs + related
 * services to the create-command shape. Case studies have no dedicated hero image, so
 * `heroImageAssetId` is always null.
 */
import { caseStudies } from "@/content/case-studies";
import type { CreatePagePayload, RegisterAsset } from "@/lib/cms/import/payload";
import { staticLink } from "@/lib/cms/import/payload";

export async function toCaseStudyPagePayloads(
  registerAsset: RegisterAsset,
): Promise<CreatePagePayload[]> {
  const payloads: CreatePagePayload[] = [];

  for (const cs of caseStudies) {
    // Register each embedded image (alt fallback mirrors the mapper's caption/alt handling).
    const images: { assetId: number; caption: string }[] = [];
    for (const img of cs.images ?? []) {
      const caption = img.caption ?? "";
      const assetId = await registerAsset(img.src, caption || img.alt || "");
      images.push({ assetId, caption });
    }

    const data = {
      title: cs.title,
      subtitle: cs.subtitle,
      service: cs.service,
      suburb: cs.suburb,
      doorType: cs.doorType,
      jobType: cs.jobType,
      result: cs.result,
      summary: {
        problem: cs.summary?.problem ?? "",
        diagnosis: cs.summary?.diagnosis ?? "",
        solution: cs.summary?.solution ?? "",
      },
      problem: {
        intro: cs.problem?.intro ?? "",
        points: cs.problem?.points ?? [],
      },
      diagnosis: {
        intro: cs.diagnosis?.intro ?? "",
        points: cs.diagnosis?.points ?? [],
      },
      solution: {
        intro: cs.solution?.intro ?? "",
        points: cs.solution?.points ?? [],
      },
      images,
      partsUsed: cs.partsUsed ?? [],
    };

    payloads.push({
      templateType: "CaseStudyPage",
      routeGroup: "CaseStudies",
      slug: cs.slug,
      title: cs.title,
      seoTitle: cs.seo?.title ?? "",
      seoDescription: cs.seo?.description ?? "",
      noIndex: false,
      status: "Published",
      heroImageAssetId: null,
      data,
      faqs: (cs.faqs ?? []).map((f, i) => ({
        question: f.question,
        answer: f.answer,
        sortOrder: i,
      })),
      relatedLinks: (cs.relatedServices ?? []).map((l, i) =>
        staticLink(l.href, l.label, "RelatedServices", i),
      ),
      pricingRows: [],
      reviews: [],
      services: [],
    });
  }

  return payloads;
}
