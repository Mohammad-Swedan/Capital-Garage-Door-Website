import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { cmsSitemap, type PageSitemapItem } from "@/lib/cms/client";
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
 * (`cmsSitemap()` → `updatedAt`), looked up by absolute URL. When the CMS is off
 * (content-fallback mode) the feed is empty and entries simply omit `lastModified`.
 * `noIndex` pages (e.g. paid `/lp/*` landing pages, draft/hidden pages) are
 * EXCLUDED — both by never listing /lp here and by dropping any CMS feed item
 * flagged `noIndex`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    cmsSitemap(),
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

  /** Build a sitemap entry, attaching lastmod from the CMS feed when known. */
  const entry = (
    path: string,
    opts: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number },
  ): MetadataRoute.Sitemap[number] | null => {
    const url = absolute(path);
    if (noIndexUrls.has(url)) return null; // never list noindex pages
    const lastModified = lastmodByUrl.get(url);
    return {
      url,
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    };
  };

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/service-areas`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/cost-guides`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/calculator`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/problems`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/case-studies`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/reviews`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const dynamic: Array<MetadataRoute.Sitemap[number] | null> = [
    ...suburbPageSlugs.map((slug) => entry(`/${slug}`, { changeFrequency: "monthly", priority: 0.9 })),
    ...servicePageSlugs.map((slug) => entry(`/${slug}`, { changeFrequency: "monthly", priority: 0.9 })),
    ...comparisonPageSlugs.map((slug) => entry(`/${slug}`, { changeFrequency: "monthly", priority: 0.8 })),
    ...costGuidePageSlugs.map((slug) => entry(`/${slug}`, { changeFrequency: "monthly", priority: 0.8 })),
    ...blogSlugs.map((slug) => entry(`/blog/${slug}`, { changeFrequency: "monthly", priority: 0.5 })),
    ...problemSlugs.map((slug) => entry(`/problems/${slug}`, { changeFrequency: "monthly", priority: 0.8 })),
    ...caseStudySlugs.map((slug) => entry(`/case-studies/${slug}`, { changeFrequency: "monthly", priority: 0.6 })),
  ];

  return [...staticRoutes, ...dynamic.filter((e): e is MetadataRoute.Sitemap[number] => e !== null)];
}

/** Resolve a site-relative path to an absolute URL, normalised to match siteConfig.url (no trailing slash). */
function absolute(path: string): string {
  if (/^https?:\/\//i.test(path)) return path.replace(/\/$/, "");
  const url = new URL(path, siteConfig.url).toString();
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
