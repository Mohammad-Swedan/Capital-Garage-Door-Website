import { problems } from "@/content/problems";
import type { Problem } from "@/types";
import { cmsResolve, cmsSitemap } from "@/lib/cms/client";
import { mapProblemPage } from "@/lib/cms/map-problem-page";

/**
 * Data-access layer for problem pages (/problems/[slug]).
 *
 * When `CMS_PROBLEMS === "on"` this reads from the ASP.NET CMS API; otherwise it falls back to the
 * local `content/problems` files (the current source of truth). This flag-guarded seam is how the
 * site cuts over to the CMS one template type at a time without ever breaking the live site
 * (docs/cms-architecture.md §8). Call sites (templates, app/sitemap.ts) do not change.
 *
 * The "problems" route group is single-type, so resolving by slug returns the ProblemPage directly.
 */
const CMS_ON = process.env.CMS_PROBLEMS === "on";

export async function getProblems(): Promise<Problem[]> {
  if (CMS_ON) {
    const slugs = await getProblemSlugs();
    const pages = await Promise.all(slugs.map((slug) => getProblemBySlug(slug)));
    return pages.filter((p): p is Problem => p !== undefined);
  }
  return problems;
}

export async function getProblemBySlug(slug: string): Promise<Problem | undefined> {
  if (CMS_ON) {
    const dto = await cmsResolve("problems", slug);
    if (!dto || dto.templateType !== "ProblemPage") return undefined;
    return mapProblemPage(dto);
  }
  return problems.find((problem) => problem.slug === slug);
}

export async function getProblemSlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemap();
    return feed.filter((p) => p.templateType === "ProblemPage" && !p.noIndex).map((p) => p.slug);
  }
  return problems.map((problem) => problem.slug);
}
