import { landingPages } from "@/content/landing-pages";
import type { LandingPage } from "@/types/landing-page";
import { cmsResolve, cmsSitemap } from "@/lib/cms/client";
import { mapLandingPage } from "@/lib/cms/map-landing-page";

/**
 * Data-access layer for Google Ads / paid landing pages (/lp/[slug]).
 *
 * When `CMS_LANDING_PAGES === "on"` this reads from the ASP.NET CMS API; otherwise it falls back to
 * the local `content/landing-pages` files (the current source of truth). This flag-guarded seam is
 * how the site cuts over to the CMS one template type at a time without ever breaking the live site
 * (docs/cms-architecture.md §8). Call sites (templates, app/sitemap.ts) do not change.
 *
 * The "lp" route group is single-type, so resolving by slug returns the LandingPage directly.
 * NOTE: LandingPages default to no-index (paid traffic only), so the slug feed is filtered by
 * templateType ONLY — filtering out no-index here would yield zero slugs and break the route
 * (app/lp/[slug]/page.tsx sets `dynamicParams = false`).
 */
const CMS_ON = process.env.CMS_LANDING_PAGES === "on";

export async function getLandingPages(): Promise<LandingPage[]> {
  if (CMS_ON) {
    const slugs = await getLandingPageSlugs();
    const pages = await Promise.all(slugs.map((slug) => getLandingPageBySlug(slug)));
    return pages.filter((p): p is LandingPage => p !== undefined);
  }
  return landingPages;
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | undefined> {
  if (CMS_ON) {
    const dto = await cmsResolve("lp", slug);
    if (!dto || dto.templateType !== "LandingPage") return undefined;
    return mapLandingPage(dto);
  }
  return landingPages.find((page) => page.slug === slug);
}

export async function getLandingPageSlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemap();
    return feed.filter((p) => p.templateType === "LandingPage").map((p) => p.slug);
  }
  return landingPages.map((page) => page.slug);
}
