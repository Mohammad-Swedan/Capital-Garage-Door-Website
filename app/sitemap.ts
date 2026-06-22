import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getServiceSlugs } from "@/lib/data/services";
import { getServiceAreaSlugs } from "@/lib/data/service-areas";
import { getBlogPostSlugs } from "@/lib/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceSlugs, areaSlugs, blogSlugs] = await Promise.all([
    getServiceSlugs(),
    getServiceAreaSlugs(),
    getBlogPostSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/service-areas`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${siteConfig.url}/services/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const areaRoutes: MetadataRoute.Sitemap = areaSlugs.map((slug) => ({
    url: `${siteConfig.url}/service-areas/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${siteConfig.url}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...areaRoutes, ...blogRoutes];
}
