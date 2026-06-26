import { costGuidePages } from "@/content/cost-guides";
import type { CostGuidePage } from "@/types/cost-guide";
import { cmsResolve, cmsSitemap } from "@/lib/cms/client";
import { mapCostGuidePage } from "@/lib/cms/map-cost-guide-page";

/**
 * Data-access layer for flat cost-guide landing pages.
 *
 * When `CMS_COST_GUIDES === "on"` this reads from the ASP.NET CMS API; otherwise it falls back to
 * the local `content/cost-guides` files (the current source of truth). This flag-guarded seam is
 * how the site cuts over to the CMS one template type at a time without ever breaking the live site
 * (docs/cms-architecture.md §8). Call sites (templates, app/sitemap.ts) do not change.
 *
 * CostGuidePage shares the flat route group ("flat") with other flat types, so `getCostGuidePageBySlug`
 * must check `dto.templateType` and return `undefined` when it doesn't match, letting the shared
 * `app/[slug]/page.tsx` resolver fall through to the next registry.
 */
const CMS_ON = process.env.CMS_COST_GUIDES === "on";

export async function getCostGuidePages(): Promise<CostGuidePage[]> {
  if (CMS_ON) {
    const slugs = await getCostGuidePageSlugs();
    const pages = await Promise.all(slugs.map((slug) => getCostGuidePageBySlug(slug)));
    return pages.filter((p): p is CostGuidePage => p !== undefined);
  }
  return costGuidePages;
}

export async function getCostGuidePageBySlug(slug: string): Promise<CostGuidePage | undefined> {
  if (CMS_ON) {
    const dto = await cmsResolve("flat", slug);
    if (!dto || dto.templateType !== "CostGuidePage") return undefined;
    return mapCostGuidePage(dto);
  }
  return costGuidePages.find((page) => page.slug === slug);
}

export async function getCostGuidePageSlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemap();
    return feed.filter((p) => p.templateType === "CostGuidePage" && !p.noIndex).map((p) => p.slug);
  }
  return costGuidePages.map((page) => page.slug);
}
