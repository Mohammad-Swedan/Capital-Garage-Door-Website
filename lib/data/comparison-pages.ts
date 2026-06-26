import { comparisonPages } from "@/content/comparison-pages";
import type { ComparisonPage } from "@/types/comparison-page";
import { cmsResolve, cmsSitemap } from "@/lib/cms/client";
import { mapComparisonPage } from "@/lib/cms/map-comparison-page";

/**
 * Data-access layer for flat comparison landing pages.
 *
 * When `CMS_COMPARISON_PAGES === "on"` this reads from the ASP.NET CMS API; otherwise it falls back
 * to the local `content/comparison-pages` files (the current source of truth). This flag-guarded
 * seam is how the site cuts over to the CMS one template type at a time without ever breaking the
 * live site (docs/cms-architecture.md §8). Call sites (templates, app/sitemap.ts) do not change.
 *
 * ComparisonPage shares the flat route group ("flat") with other flat types, so `getComparisonPageBySlug`
 * must check `dto.templateType` and return `undefined` when it doesn't match, letting the shared
 * `app/[slug]/page.tsx` resolver fall through to the next registry.
 */
const CMS_ON = process.env.CMS_COMPARISON_PAGES === "on";

export async function getComparisonPages(): Promise<ComparisonPage[]> {
  if (CMS_ON) {
    const slugs = await getComparisonPageSlugs();
    const pages = await Promise.all(slugs.map((slug) => getComparisonPageBySlug(slug)));
    return pages.filter((p): p is ComparisonPage => p !== undefined);
  }
  return comparisonPages;
}

export async function getComparisonPageBySlug(slug: string): Promise<ComparisonPage | undefined> {
  if (CMS_ON) {
    const dto = await cmsResolve("flat", slug);
    if (!dto || dto.templateType !== "ComparisonPage") return undefined;
    return mapComparisonPage(dto);
  }
  return comparisonPages.find((page) => page.slug === slug);
}

export async function getComparisonPageSlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemap();
    return feed.filter((p) => p.templateType === "ComparisonPage" && !p.noIndex).map((p) => p.slug);
  }
  return comparisonPages.map((page) => page.slug);
}
