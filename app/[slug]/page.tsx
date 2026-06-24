import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/sections/service/service-page-template";
import { ComparisonPageTemplate } from "@/components/sections/comparison/comparison-page-template";
import { CostGuidePageTemplate } from "@/components/sections/cost-guide/cost-guide-page-template";
import { ServiceSuburbPageTemplate } from "@/components/page/service-suburb-page-template";
import { getServicePageBySlug, getServicePageSlugs } from "@/lib/data/service-pages";
import { getComparisonPageBySlug, getComparisonPageSlugs } from "@/lib/data/comparison-pages";
import { getCostGuidePageBySlug, getCostGuidePageSlugs } from "@/lib/data/cost-guides";
import {
  getServiceSuburbPageBySlug,
  getServiceSuburbPageSlugs,
} from "@/lib/data/service-suburb-pages";
import { buildMetadata } from "@/lib/seo/metadata";

interface FlatLandingPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Shared root-level dynamic segment for all flat top-level landing pages.
 *
 * Four content registries are flattened onto the same URL shape — service
 * pages (e.g. /garage-door-repairs-perth), comparison/guide pages (e.g.
 * /roller-door-vs-sectional-door), cost-guide pages (e.g.
 * /garage-door-repair-cost-perth), and service+suburb pages (e.g.
 * /garage-door-repairs-joondalup) — so they're resolved by a single dynamic
 * route rather than competing `[param]` segments (Next.js rejects two
 * differently-named dynamic segments at the same path level as ambiguous).
 * Add a new registry here following the same pattern for future page types.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const [serviceSlugs, comparisonSlugs, costGuideSlugs, suburbSlugs] = await Promise.all([
    getServicePageSlugs(),
    getComparisonPageSlugs(),
    getCostGuidePageSlugs(),
    getServiceSuburbPageSlugs(),
  ]);
  const slugs = new Set([...serviceSlugs, ...comparisonSlugs, ...costGuideSlugs, ...suburbSlugs]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: FlatLandingPageProps): Promise<Metadata> {
  const { slug } = await params;

  const servicePage = await getServicePageBySlug(slug);
  if (servicePage) {
    return buildMetadata({
      title: servicePage.seo.title,
      description: servicePage.seo.description,
      path: `/${servicePage.slug}`,
      image: servicePage.hero.image,
    });
  }

  const comparisonPage = await getComparisonPageBySlug(slug);
  if (comparisonPage) {
    return buildMetadata({
      title: comparisonPage.seo.title,
      description: comparisonPage.seo.description,
      path: `/${comparisonPage.slug}`,
    });
  }

  const costGuidePage = await getCostGuidePageBySlug(slug);
  if (costGuidePage) {
    return buildMetadata({
      title: costGuidePage.seo.title,
      description: costGuidePage.seo.description,
      path: `/${costGuidePage.slug}`,
    });
  }

  const suburbPage = await getServiceSuburbPageBySlug(slug);
  if (suburbPage) {
    return buildMetadata({
      title: suburbPage.seo.title,
      description: suburbPage.seo.description,
      path: `/${suburbPage.slug}`,
    });
  }

  return {};
}

export default async function FlatLandingPage({ params }: FlatLandingPageProps) {
  const { slug } = await params;

  const servicePage = await getServicePageBySlug(slug);
  if (servicePage) {
    return <ServicePageTemplate data={servicePage} />;
  }

  const comparisonPage = await getComparisonPageBySlug(slug);
  if (comparisonPage) {
    return <ComparisonPageTemplate data={comparisonPage} />;
  }

  const costGuidePage = await getCostGuidePageBySlug(slug);
  if (costGuidePage) {
    return <CostGuidePageTemplate data={costGuidePage} />;
  }

  const suburbPage = await getServiceSuburbPageBySlug(slug);
  if (suburbPage) {
    return <ServiceSuburbPageTemplate page={suburbPage} />;
  }

  notFound();
}
