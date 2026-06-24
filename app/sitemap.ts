import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getArticleSlugs } from "@/lib/data/articles";
import { getProblemSlugs } from "@/lib/data/problems";
import { getServicePageSlugs } from "@/lib/data/service-pages";
import { getComparisonPageSlugs } from "@/lib/data/comparison-pages";
import { getCostGuidePageSlugs } from "@/lib/data/cost-guides";
import { getServiceSuburbPageSlugs } from "@/lib/data/service-suburb-pages";
import { getCaseStudySlugs } from "@/lib/data/case-studies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    blogSlugs,
    problemSlugs,
    servicePageSlugs,
    comparisonPageSlugs,
    costGuidePageSlugs,
    suburbPageSlugs,
    caseStudySlugs,
  ] = await Promise.all([
    getArticleSlugs(),
    getProblemSlugs(),
    getServicePageSlugs(),
    getComparisonPageSlugs(),
    getCostGuidePageSlugs(),
    getServiceSuburbPageSlugs(),
    getCaseStudySlugs(),
  ]);

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

  const suburbPageRoutes: MetadataRoute.Sitemap = suburbPageSlugs.map((slug) => ({
    url: `${siteConfig.url}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${siteConfig.url}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const problemRoutes: MetadataRoute.Sitemap = problemSlugs.map((slug) => ({
    url: `${siteConfig.url}/problems/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const servicePageRoutes: MetadataRoute.Sitemap = servicePageSlugs.map((slug) => ({
    url: `${siteConfig.url}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const comparisonPageRoutes: MetadataRoute.Sitemap = comparisonPageSlugs.map((slug) => ({
    url: `${siteConfig.url}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const costGuidePageRoutes: MetadataRoute.Sitemap = costGuidePageSlugs.map((slug) => ({
    url: `${siteConfig.url}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudySlugs.map((slug) => ({
    url: `${siteConfig.url}/case-studies/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...problemRoutes,
    ...servicePageRoutes,
    ...comparisonPageRoutes,
    ...costGuidePageRoutes,
    ...suburbPageRoutes,
    ...caseStudyRoutes,
  ];
}
