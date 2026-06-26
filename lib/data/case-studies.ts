import { caseStudies } from "@/content/case-studies";
import type { CaseStudyPage } from "@/types/case-study";
import { cmsResolve, cmsSitemap } from "@/lib/cms/client";
import { mapCaseStudyPage } from "@/lib/cms/map-case-study-page";

/**
 * Data-access layer for case-study pages.
 *
 * When `CMS_CASE_STUDIES === "on"` this reads from the ASP.NET CMS API (route key "case-studies");
 * otherwise it falls back to the local `content/case-studies` files (the current source of truth).
 * This flag-guarded seam is how the site cuts over to the CMS one template type at a time without
 * ever breaking the live site (docs/cms-architecture.md §8). Call sites do not change.
 */
const CMS_ON = process.env.CMS_CASE_STUDIES === "on";

export async function getCaseStudies(): Promise<CaseStudyPage[]> {
  if (CMS_ON) {
    const slugs = await getCaseStudySlugs();
    const pages = await Promise.all(slugs.map((slug) => getCaseStudyBySlug(slug)));
    return pages.filter((p): p is CaseStudyPage => p !== undefined);
  }
  return caseStudies;
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyPage | undefined> {
  if (CMS_ON) {
    const dto = await cmsResolve("case-studies", slug);
    return dto ? mapCaseStudyPage(dto) : undefined;
  }
  return caseStudies.find((page) => page.slug === slug);
}

export async function getCaseStudySlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemap();
    return feed.filter((p) => p.templateType === "CaseStudyPage" && !p.noIndex).map((p) => p.slug);
  }
  return caseStudies.map((page) => page.slug);
}
