/**
 * One-time transform: `content/problems.ts` → CMS create payloads.
 *
 * This is the INVERSE of `lib/cms/map-problem-page.ts`. The mapper pulls h1/metaTitle/
 * metaDescription from the Pages row (title/seoTitle/seoDescription) and the bespoke §6 block
 * from `data`. Relational cost rows are NOT imported in this pass (they become relational
 * pricing pins later), so `pricingRows` is left empty.
 *
 * relatedServices: the content stores `{ slug, label }`. The mapper recovers the slug via
 * `hrefToSlug(href)` (last path segment of the href), so we emit `"/" + slug` as the static
 * href — its last segment round-trips back to the original slug.
 */
import { problems } from "@/content/problems";
import type { CreatePagePayload, RegisterAsset } from "./payload";
import { staticLink } from "./payload";

export async function toProblemPagePayloads(
  registerAsset: RegisterAsset,
): Promise<CreatePagePayload[]> {
  return Promise.all(
    problems.map(async (problem): Promise<CreatePagePayload> => {
      const heroImageAssetId = problem.heroImage
        ? await registerAsset(problem.heroImage, problem.h1)
        : null;

      const data: Record<string, unknown> = {
        heroSubtitle: problem.heroSubtitle ?? "",
        directAnswer: problem.directAnswer ?? "",
        causes: (problem.causes ?? []).map((c) => ({
          icon: c.icon,
          title: c.title,
          description: c.description,
        })),
        safeChecks: problem.safeChecks ?? [],
        doNotDo: problem.doNotDo ?? [],
        callTechnicianSigns: problem.callTechnicianSigns ?? [],
        emergency: {
          heading: problem.emergency?.heading ?? "",
          body: problem.emergency?.body ?? "",
        },
      };

      const relatedLinks = (problem.relatedServices ?? []).map((s, i) => {
        // Content provides only a slug here; the mapper derives the slug back from the href's
        // last path segment, so a leading-slash href round-trips cleanly.
        const href = (s as { href?: string }).href ?? `/${s.slug}`;
        return staticLink(href, s.label, "RelatedServices", i);
      });

      return {
        templateType: "ProblemPage",
        routeGroup: "Problems",
        slug: problem.slug,
        title: problem.h1,
        seoTitle: problem.metaTitle ?? "",
        seoDescription: problem.metaDescription ?? "",
        noIndex: false,
        status: "Published",
        heroImageAssetId,
        data,
        faqs: (problem.faqs ?? []).map((f, i) => ({
          question: f.question,
          answer: f.answer,
          sortOrder: i,
        })),
        relatedLinks,
        pricingRows: [],
        reviews: [],
        services: [],
      };
    }),
  );
}
