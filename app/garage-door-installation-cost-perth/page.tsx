import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CostGuidePageTemplate } from "@/components/sections/cost-guide/cost-guide-page-template";
import { PageSchema } from "@/components/seo/page-schema";
import { getStaticCostGuide } from "@/lib/data/static-cost-guides";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * Static cost guide (content/static-cost-guides): repo-only copy, live catalog prices. It renders
 * exactly like the CMS cost guides in app/[slug], but this folder route takes precedence over the
 * [slug] segment, so the slug is reserved: a CMS page published under it would be shadowed.
 */
const SLUG = "garage-door-installation-cost-perth";

// Prices follow the live catalog (itself fetch-cached for an hour under the "cms-pricing" tag).
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticCostGuide(SLUG);
  if (!page) return {};
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: `/${page.slug}`,
    lastModified: page.updatedAt || undefined,
  });
}

export default async function GarageDoorInstallationCostPage() {
  const page = await getStaticCostGuide(SLUG);
  if (!page) notFound();
  return (
    <>
      <PageSchema kind="cost-guide" data={page} />
      <CostGuidePageTemplate data={page} />
    </>
  );
}
