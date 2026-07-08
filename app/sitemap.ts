import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { cmsSitemap, cmsSitemapSafe, type PageSitemapItem } from "@/lib/cms/client";
import { getArticleSlugs } from "@/lib/data/articles";
import { getProblemSlugs } from "@/lib/data/problems";
import { getServicePageSlugs } from "@/lib/data/service-pages";
import { getComparisonPageSlugs } from "@/lib/data/comparison-pages";
import { getCostGuidePageSlugs } from "@/lib/data/cost-guides";
import { getServiceSuburbPageSlugs } from "@/lib/data/service-suburb-pages";
import { getCaseStudySlugs } from "@/lib/data/case-studies";

/**
 * XML sitemap for every public route.
 *
 * `lastModified` per dynamic entry comes from the CMS sitemap feed
 * (`cmsSitemap()` → `updatedAt`), looked up by absolute URL. Hub/listing pages
 * (/blog, /cost-guides, …) inherit the NEWEST child's lastmod — a real
 * freshness signal for the page whose content actually changed. The remaining
 * static pages carry the process start (≈ deploy) timestamp: their HTML is
 * genuinely regenerated each deploy, and Google uses `lastmod` (unlike
 * `changefreq`/`priority`, which it ignores — so those two fields are
 * deliberately NOT emitted; an SEO audit flagged both points).
 *
 * At RUNTIME we use the strict `cmsSitemap()` which THROWS when the CMS is
 * unreachable, so a failed regeneration keeps serving the last good sitemap
 * instead of silently dropping every CMS URL; the CMS pushes changes instantly
 * via app/api/revalidate on create/update/publish/unpublish/delete.
 * During the production BUILD there is no "last good sitemap" to fall back to,
 * so throwing would abort the whole deploy if the CMS happens to be unreachable
 * from the build container (e.g. Netlify can't see a dev-only localhost CMS).
 * There we use the lenient `cmsSitemapSafe()` (→ [] on failure): the site's
 * local-content slugs still ship, and ISR fills in CMS lastmods on the first
 * successful revalidation.
 * `noIndex` pages (e.g. paid `/lp/*` landing pages, draft/hidden pages) are
 * EXCLUDED — both by never listing /lp here and by dropping any CMS feed item
 * flagged `noIndex`.
 */

// Evaluated once per server process / build — effectively the deploy time.
const DEPLOYED_AT = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Strict at runtime (keep last-good sitemap on a transient CMS failure); lenient during
  // `next build`, where a throw would abort the whole deploy and there is no prior sitemap.
  const readCmsFeed =
    process.env.NEXT_PHASE === "phase-production-build" ? cmsSitemapSafe : cmsSitemap;

  const [
    cmsFeed,
    blogSlugs,
    problemSlugs,
    servicePageSlugs,
    comparisonPageSlugs,
    costGuidePageSlugs,
    suburbPageSlugs,
    caseStudySlugs,
  ] = await Promise.all([
    readCmsFeed(),
    getArticleSlugs(),
    getProblemSlugs(),
    getServicePageSlugs(),
    getComparisonPageSlugs(),
    getCostGuidePageSlugs(),
    getServiceSuburbPageSlugs(),
    getCaseStudySlugs(),
  ]);

  // Index the CMS feed by absolute URL for lastmod lookup, skipping noindex pages.
  // The feed `href` is a site-relative path (e.g. "/garage-door-repairs-perth").
  const lastmodByUrl = new Map<string, string>();
  const noIndexUrls = new Set<string>();
  for (const item of cmsFeed as PageSitemapItem[]) {
    const url = absolute(item.href);
    if (item.noIndex) {
      noIndexUrls.add(url);
      continue;
    }
    if (item.updatedAt) lastmodByUrl.set(url, item.updatedAt);
  }

  /** Newest lastmod among a set of slugs (each rendered at `/${prefix}${slug}`), or undefined. */
  const newestOf = (slugs: string[], prefix = ""): Date | undefined => {
    let newest: number | undefined;
    for (const slug of slugs) {
      const iso = lastmodByUrl.get(absolute(`/${prefix}${slug}`));
      if (!iso) continue;
      const t = new Date(iso).getTime();
      if (Number.isFinite(t) && (newest === undefined || t > newest)) newest = t;
    }
    return newest !== undefined ? new Date(newest) : undefined;
  };

  /** Newest lastmod across the whole CMS feed (for the home page). */
  const newestOverall = (): Date | undefined => {
    let newest: number | undefined;
    for (const iso of lastmodByUrl.values()) {
      const t = new Date(iso).getTime();
      if (Number.isFinite(t) && (newest === undefined || t > newest)) newest = t;
    }
    return newest !== undefined ? new Date(newest) : undefined;
  };

  /** Build a sitemap entry for a dynamic (CMS-known) path. */
  const entry = (path: string): MetadataRoute.Sitemap[number] | null => {
    const url = absolute(path);
    if (noIndexUrls.has(url)) return null; // never list noindex pages
    const lastModified = lastmodByUrl.get(url);
    return {
      url,
      ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    };
  };

  /** Build a static-route entry with an explicit lastmod. */
  const staticEntry = (path: string, lastModified: Date): MetadataRoute.Sitemap[number] => ({
    url: path ? `${siteConfig.url}${path}` : siteConfig.url,
    lastModified,
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    staticEntry("", newestOverall() ?? DEPLOYED_AT),
    staticEntry("/about", DEPLOYED_AT),
    staticEntry("/contact", DEPLOYED_AT),
    staticEntry("/services", newestOf(servicePageSlugs) ?? DEPLOYED_AT),
    staticEntry("/service-areas", newestOf(suburbPageSlugs) ?? DEPLOYED_AT),
    // Reserved slug: /garage-door-motors-perth is a static route (app/garage-door-motors-perth).
    // A CMS page published under the same slug would be shadowed by it — don't create one.
    staticEntry("/garage-door-motors-perth", DEPLOYED_AT),
    staticEntry("/cost-guides", newestOf(costGuidePageSlugs) ?? DEPLOYED_AT),
    staticEntry("/calculator", DEPLOYED_AT),
    staticEntry("/blog", newestOf(blogSlugs, "blog/") ?? DEPLOYED_AT),
    staticEntry("/problems", newestOf(problemSlugs, "problems/") ?? DEPLOYED_AT),
    staticEntry("/case-studies", newestOf(caseStudySlugs, "case-studies/") ?? DEPLOYED_AT),
    staticEntry("/gallery", DEPLOYED_AT),
    staticEntry("/reviews", DEPLOYED_AT),
    staticEntry("/warranty", DEPLOYED_AT),
    staticEntry("/warranty-registration", DEPLOYED_AT),
    staticEntry("/privacy", DEPLOYED_AT),
    staticEntry("/terms", DEPLOYED_AT),
  ];

  const dynamic: Array<MetadataRoute.Sitemap[number] | null> = [
    ...suburbPageSlugs.map((slug) => entry(`/${slug}`)),
    ...servicePageSlugs.map((slug) => entry(`/${slug}`)),
    ...comparisonPageSlugs.map((slug) => entry(`/${slug}`)),
    ...costGuidePageSlugs.map((slug) => entry(`/${slug}`)),
    ...blogSlugs.map((slug) => entry(`/blog/${slug}`)),
    ...problemSlugs.map((slug) => entry(`/problems/${slug}`)),
    ...caseStudySlugs.map((slug) => entry(`/case-studies/${slug}`)),
  ];

  // Dedupe by URL, static routes winning — a CMS page published under a reserved static slug
  // (e.g. /garage-door-motors-perth) must not produce a duplicate <url> entry.
  const seen = new Set<string>();
  return [...staticRoutes, ...dynamic.filter((e): e is MetadataRoute.Sitemap[number] => e !== null)].filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });
}

/** Resolve a site-relative path to an absolute URL, normalised to match siteConfig.url (no trailing slash). */
function absolute(path: string): string {
  if (/^https?:\/\//i.test(path)) return path.replace(/\/$/, "");
  const url = new URL(path, siteConfig.url).toString();
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
