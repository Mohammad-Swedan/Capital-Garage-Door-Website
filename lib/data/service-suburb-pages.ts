import { serviceSuburbPages } from "@/content/service-suburb-pages";
import type { ServiceSuburbPage } from "@/types";
import { cmsResolve, cmsSitemap } from "@/lib/cms/client";
import { mapServiceSuburbPage } from "@/lib/cms/map-service-suburb-page";

/**
 * Data-access layer for Service + Suburb landing pages (Page Type 2).
 *
 * When `CMS_SUBURB_PAGES === "on"` this reads from the ASP.NET CMS API; otherwise it falls back to
 * the local `content/service-suburb-pages` files (the current source of truth). This flag-guarded
 * seam is how the site cuts over to the CMS one template type at a time without ever breaking the
 * live site (docs/cms-architecture.md §8). Call sites (templates, app/sitemap.ts) do not change.
 *
 * ServiceSuburbPage is a flat-group type (route key "flat", URL `/[slug]`), so the resolve call uses
 * the shared "flat" route group and we narrow on `templateType` to avoid colliding with other flat
 * page types (e.g. ServicePage).
 */
const CMS_ON = process.env.CMS_SUBURB_PAGES === "on";

export async function getServiceSuburbPages(): Promise<ServiceSuburbPage[]> {
  if (CMS_ON) {
    const slugs = await getServiceSuburbPageSlugs();
    const pages = await Promise.all(slugs.map((slug) => getServiceSuburbPageBySlug(slug)));
    return pages.filter((p): p is ServiceSuburbPage => p !== undefined);
  }
  return serviceSuburbPages;
}

export async function getServiceSuburbPageBySlug(
  slug: string
): Promise<ServiceSuburbPage | undefined> {
  if (CMS_ON) {
    const dto = await cmsResolve("flat", slug);
    if (!dto || dto.templateType !== "ServiceSuburbPage") return undefined;
    return mapServiceSuburbPage(dto);
  }
  return serviceSuburbPages.find((page) => page.slug === slug);
}

export async function getServiceSuburbPageSlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemap();
    return feed.filter((p) => p.templateType === "ServiceSuburbPage" && !p.noIndex).map((p) => p.slug);
  }
  return serviceSuburbPages.map((page) => page.slug);
}
