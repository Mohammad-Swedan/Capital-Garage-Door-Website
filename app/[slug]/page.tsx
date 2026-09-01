import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/sections/service/service-page-template";
import { ComparisonPageTemplate } from "@/components/sections/comparison/comparison-page-template";
import { CostGuidePageTemplate } from "@/components/sections/cost-guide/cost-guide-page-template";
import { ServiceSuburbPageTemplate } from "@/components/page/service-suburb-page-template";
import { BrandPageTemplate } from "@/components/sections/brands/brand-page-template";
import { PageSchema } from "@/components/seo/page-schema";
import { getServicePageBySlug, getServicePageSlugs } from "@/lib/data/service-pages";
import { getComparisonPageBySlug, getComparisonPageSlugs } from "@/lib/data/comparison-pages";
import { getCostGuidePageBySlug, getCostGuidePageSlugs } from "@/lib/data/cost-guides";
import {
  getServiceSuburbPageBySlug,
  getServiceSuburbPageSlugs,
} from "@/lib/data/service-suburb-pages";
import {
  getBrandPageBySlug,
  getBrandPageSlugs,
  getCaseStudiesForBrand,
  resolveBrandPage,
} from "@/lib/data/brands";
import { getCaseStudiesForSuburbPage } from "@/lib/data/case-studies";
import { buildMetadata } from "@/lib/seo/metadata";

interface FlatLandingPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Shared root-level dynamic segment for all flat top-level landing pages.
 *
 * Five content registries are flattened onto the same URL shape — brand pages
 * (e.g. /merlin-garage-door-motors-perth), service pages (e.g.
 * /garage-door-repairs-perth), comparison/guide pages (e.g.
 * /roller-door-vs-sectional-door), cost-guide pages (e.g.
 * /garage-door-repair-cost-perth), and service+suburb pages (e.g.
 * /garage-door-repairs-joondalup) — so they're resolved by a single dynamic
 * route rather than competing `[param]` segments (Next.js rejects two
 * differently-named dynamic segments at the same path level as ambiguous).
 * Add a new registry here following the same pattern for future page types.
 *
 * Brands are checked FIRST and are the only local-content-only registry (no
 * network call), so a CMS page published under a brand slug is shadowed by the
 * brand page — don't create one.
 */
// Allow on-demand rendering so pages published in the CMS admin resolve without a rebuild. Pages in
// generateStaticParams still render statically; unknown slugs fall through to notFound() (404) as
// before. (Next requires this to be a statically-parseable boolean, so it can't be env-gated.)
export const dynamicParams = true;

export async function generateStaticParams() {
  const [brandSlugs, serviceSlugs, comparisonSlugs, costGuideSlugs, suburbSlugs] =
    await Promise.all([
      getBrandPageSlugs(),
      getServicePageSlugs(),
      getComparisonPageSlugs(),
      getCostGuidePageSlugs(),
      getServiceSuburbPageSlugs(),
    ]);
  const slugs = new Set([
    ...brandSlugs,
    ...serviceSlugs,
    ...comparisonSlugs,
    ...costGuideSlugs,
    ...suburbSlugs,
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: FlatLandingPageProps): Promise<Metadata> {
  const { slug } = await params;

  const brandPage = await getBrandPageBySlug(slug);
  if (brandPage) {
    return buildMetadata({
      title: brandPage.seo.title,
      description: brandPage.seo.description,
      path: `/${brandPage.slug}`,
      lastModified: brandPage.updatedAt,
    });
  }

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
      lastModified: comparisonPage.updatedAt || undefined,
    });
  }

  const costGuidePage = await getCostGuidePageBySlug(slug);
  if (costGuidePage) {
    return buildMetadata({
      title: costGuidePage.seo.title,
      description: costGuidePage.seo.description,
      path: `/${costGuidePage.slug}`,
      lastModified: costGuidePage.updatedAt || undefined,
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

  const brandPage = await getBrandPageBySlug(slug);
  if (brandPage) {
    const resolved = await resolveBrandPage(brandPage);
    const caseStudies = await getCaseStudiesForBrand(resolved.page, resolved.entity);
    return (
      <>
        <PageSchema kind="brand" data={resolved} />
        <BrandPageTemplate resolved={resolved} caseStudies={caseStudies} />
      </>
    );
  }

  const servicePage = await getServicePageBySlug(slug);
  if (servicePage) {
    // Link matching chips in the "Areas We Service" grid to their suburb pages
    // (hub→spoke internal links so suburb pages can outrank the homepage for
    // "garage door repairs {suburb}"). Keyed by lowercased suburb name.
    const suburbSlugs = await getServiceSuburbPageSlugs();
    const areaLinks = Object.fromEntries(
      suburbSlugs
        .filter((s) => s.startsWith("garage-door-repairs-"))
        .map((s) => [s.replace("garage-door-repairs-", "").replace(/-/g, " "), `/${s}`]),
    );
    return (
      <>
        <PageSchema kind="service" data={servicePage} />
        <ServicePageTemplate data={servicePage} areaLinks={areaLinks} />
      </>
    );
  }

  const comparisonPage = await getComparisonPageBySlug(slug);
  if (comparisonPage) {
    return (
      <>
        <PageSchema kind="comparison" data={comparisonPage} />
        <ComparisonPageTemplate data={comparisonPage} />
      </>
    );
  }

  const costGuidePage = await getCostGuidePageBySlug(slug);
  if (costGuidePage) {
    return (
      <>
        <PageSchema kind="cost-guide" data={costGuidePage} />
        <CostGuidePageTemplate data={costGuidePage} />
      </>
    );
  }

  const suburbPage = await getServiceSuburbPageBySlug(slug);
  if (suburbPage) {
    const caseStudies = await getCaseStudiesForSuburbPage(suburbPage);
    return (
      <>
        <PageSchema kind="service-suburb" data={suburbPage} />
        <ServiceSuburbPageTemplate page={suburbPage} caseStudies={caseStudies} />
      </>
    );
  }

  notFound();
}
