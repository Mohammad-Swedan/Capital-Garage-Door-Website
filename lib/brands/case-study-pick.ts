import { textMentionsBrand } from "./match";
import type { BrandEntity } from "@/types/brand";
import type { CaseStudyPage } from "@/types/case-study";

/** Every copy field brand matching scans — keep in sync with what a case study renders. */
export function caseStudySearchText(cs: CaseStudyPage): string {
  return [
    cs.title,
    cs.subtitle,
    cs.summary.problem,
    cs.summary.diagnosis,
    cs.summary.solution,
    cs.problem.intro,
    ...cs.problem.points,
    cs.diagnosis.intro,
    ...cs.diagnosis.points,
    cs.solution.intro,
    ...cs.solution.points,
    ...cs.partsUsed,
  ].join(" \n ");
}

/** CMS-hosted photos have absolute URLs; anything else is a placeholder the cards can't render. */
export function hasRealPhoto(cs: CaseStudyPage): boolean {
  return cs.images.some((img) => /^https?:\/\//.test(img.src));
}

/**
 * Case studies for a brand page's "Recent work": hand-picked `slugs` win, in order (unknown slugs
 * silently skipped — a hand-picked job does NOT also need to mention the brand, curator's choice,
 * same as suburb pages); otherwise fall back to brand-mention matching over the copy. Both paths
 * keep only case studies with a real photo and cap at 3.
 */
export function pickBrandCaseStudies(
  all: CaseStudyPage[],
  entity: BrandEntity,
  slugs?: string[],
): CaseStudyPage[] {
  const withPhoto = all.filter(hasRealPhoto);
  const picked = slugs?.length
    ? slugs
        .map((s) => withPhoto.find((c) => c.slug === s))
        .filter((c): c is CaseStudyPage => c !== undefined)
    : withPhoto.filter((cs) => textMentionsBrand(caseStudySearchText(cs), entity));
  return picked.slice(0, 3);
}
