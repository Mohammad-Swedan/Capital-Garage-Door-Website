import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPageTemplate } from "@/components/sections/landing/landing-page-template";
import { getLandingPageBySlug, getLandingPageSlugs } from "@/lib/data/landing-pages";
import { buildMetadata } from "@/lib/seo/metadata";

interface LandingRouteProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getLandingPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LandingRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    return {};
  }

  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: `/lp/${page.slug}`,
    // Paid-traffic only — kept out of organic search so it never competes
    // with the equivalent full SEO page for the same keyword.
    noIndex: true,
  });
}

export default async function LandingRoute({ params }: LandingRouteProps) {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <LandingPageTemplate page={page} />;
}
