import { getServices } from "@/lib/data/services";
import { getServicePageBySlug, getServicePageSlugs } from "@/lib/data/service-pages";
import { getArticleBySlug, getArticleSlugs } from "@/lib/data/articles";
import { getProblemBySlug, getProblemSlugs } from "@/lib/data/problems";
import { getCostGuidePageBySlug, getCostGuidePageSlugs } from "@/lib/data/cost-guides";
import { getStaticCostGuides } from "@/lib/data/static-cost-guides";
import { getComparisonPageSlugs } from "@/lib/data/comparison-pages";
import { getServiceSuburbPageSlugs } from "@/lib/data/service-suburb-pages";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/data/case-studies";
import { getBrandHub, getBrandPages } from "@/lib/data/brands";
import { buildLlmsTxt, loadLlmsData } from "@/lib/seo/llms-txt";

/**
 * `/llms.txt` — the llmstxt.org convention: a concise, markdown-shaped index of
 * the site for AI assistants and answer engines (GPTBot, ClaudeBot,
 * PerplexityBot all crawl it). An AI-readiness audit flagged its absence.
 *
 * Built from the same data layer as the sitemap, so new CMS pages appear here
 * automatically on revalidation. The route is prerendered at build, so it must
 * never throw and never open a burst of CMS connections: `loadLlmsData`
 * (lib/seo/llms-txt.ts) reads every list through one limiter (a handful of
 * requests in flight at a time) and degrades a failed read instead of failing
 * — a page whose resolve fails keeps its entry under a slug-derived title, a
 * failed list is left empty (and logged). When the CMS is unreachable the data
 * layer falls back to local content where it can.
 */
export const revalidate = 3600;

export async function GET() {
  const data = await loadLlmsData(
    {
      services: getServices,
      servicePageSlugs: getServicePageSlugs,
      servicePage: getServicePageBySlug,
      costGuideSlugs: getCostGuidePageSlugs,
      costGuide: getCostGuidePageBySlug,
      staticGuides: getStaticCostGuides,
      comparisonSlugs: getComparisonPageSlugs,
      suburbSlugs: getServiceSuburbPageSlugs,
      brandHubs: async () => [getBrandHub("door"), getBrandHub("motor")],
      brandPages: getBrandPages,
      problemSlugs: getProblemSlugs,
      problem: getProblemBySlug,
      articleSlugs: getArticleSlugs,
      article: getArticleBySlug,
      caseStudySlugs: getCaseStudySlugs,
      caseStudy: getCaseStudyBySlug,
    },
    { onError: (what, error) => console.warn(`[llms.txt] ${what} failed, degraded:`, error) },
  );

  return new Response(buildLlmsTxt(data), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
