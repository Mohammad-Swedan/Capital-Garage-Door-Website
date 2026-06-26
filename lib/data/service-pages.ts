import { servicePages } from "@/content/service-pages";
import type { ServicePage } from "@/types/service-page";
import { cmsResolve, cmsSitemap } from "@/lib/cms/client";
import { mapServicePage } from "@/lib/cms/map-service-page";

/**
 * Data-access layer for flat service landing pages.
 *
 * When `CMS_SERVICE_PAGES === "on"` this reads from the ASP.NET CMS API; otherwise it falls back to
 * the local `content/service-pages` files (the current source of truth). This flag-guarded seam is
 * how the site cuts over to the CMS one template type at a time without ever breaking the live site
 * (docs/cms-architecture.md §8). Call sites (templates, app/sitemap.ts) do not change.
 */
const CMS_ON = process.env.CMS_SERVICE_PAGES === "on";

export async function getServicePages(): Promise<ServicePage[]> {
  if (CMS_ON) {
    const slugs = await getServicePageSlugs();
    const pages = await Promise.all(slugs.map((slug) => getServicePageBySlug(slug)));
    return pages.filter((p): p is ServicePage => p !== undefined);
  }
  return servicePages;
}

export async function getServicePageBySlug(slug: string): Promise<ServicePage | undefined> {
  if (CMS_ON) {
    // The flat route group is shared by several template types; only claim this slug if it is
    // actually a ServicePage, otherwise return undefined so app/[slug] falls through to the next loader.
    const dto = await cmsResolve("flat", slug);
    return dto && dto.templateType === "ServicePage" ? mapServicePage(dto) : undefined;
  }
  return servicePages.find((page) => page.slug === slug);
}

export async function getServicePageSlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemap();
    return feed.filter((p) => p.templateType === "ServicePage" && !p.noIndex).map((p) => p.slug);
  }
  return servicePages.map((page) => page.slug);
}
