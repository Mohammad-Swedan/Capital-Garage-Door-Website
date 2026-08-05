import { caseStudies } from "@/content/case-studies";
import type { CaseStudyPage } from "@/types/case-study";
import { cmsResolve, cmsSitemapSafe } from "@/lib/cms/client";
import { mapCaseStudyPage } from "@/lib/cms/map-case-study-page";

/**
 * Data-access layer for case-study pages.
 *
 * When `CMS_CASE_STUDIES === "on"` this reads from the ASP.NET CMS API (route key "case-studies");
 * otherwise it falls back to the local `content/case-studies` files (the current source of truth).
 * This flag-guarded seam is how the site cuts over to the CMS one template type at a time without
 * ever breaking the live site (docs/cms-architecture.md §8). Call sites do not change.
 */
const CMS_ON = (process.env.CMS_CASE_STUDIES ?? "on") === "on";

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

/** True when a case study has at least one real (remote) job photo to show. */
function hasRealPhoto(cs: CaseStudyPage): boolean {
  return cs.images.some((img) => !!img.src && /^https?:\/\//.test(img.src));
}

/**
 * Case studies to feature in a suburb page's "Recent work" section.
 *
 * If the page hand-picks `caseStudySlugs`, those are used in that order;
 * otherwise every case study whose `suburb` matches the page is used
 * (case-insensitive). In both cases only case studies with a real job photo are
 * returned — placeholder-only entries are skipped so the section never shows an
 * empty card. Empty result → the section hides itself.
 */
export async function getCaseStudiesForSuburbPage(page: {
  suburb: string;
  caseStudySlugs?: string[];
}): Promise<CaseStudyPage[]> {
  const all = await getCaseStudies();
  const matched = page.caseStudySlugs?.length
    ? page.caseStudySlugs
        .map((slug) => all.find((c) => c.slug === slug))
        .filter((c): c is CaseStudyPage => c !== undefined)
    : (() => {
        const suburb = page.suburb.trim().toLowerCase();
        if (!suburb) return [];
        return all.filter((c) => c.suburb.trim().toLowerCase() === suburb);
      })();
  return matched.filter(hasRealPhoto);
}

/**
 * Latest completed jobs for the home page's "Recent work" section — newest
 * first by `updatedAt`, real-photo entries only. Failure-safe (`[]` on any
 * CMS error) so the home page never depends on this section rendering.
 */
export async function getRecentCaseStudies(limit = 3): Promise<CaseStudyPage[]> {
  try {
    const all = await getCaseStudies();
    return all
      .filter(hasRealPhoto)
      .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getCaseStudySlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemapSafe();
    return feed.filter((p) => p.templateType === "CaseStudyPage" && !p.noIndex).map((p) => p.slug);
  }
  return caseStudies.map((page) => page.slug);
}
