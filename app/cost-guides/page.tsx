import type { Metadata } from "next";
import { FileText, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/sections/page-hero";
import { PriceListHub } from "@/components/sections/price-list/price-list-hub";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { getCostGuideCards } from "@/lib/data/cost-guides";
import { getPriceList } from "@/lib/data/price-list";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, priceListSchemas } from "@/lib/seo/schema";

/**
 * /cost-guides — "Garage Door Prices Perth — {year} Price List": the whole live pricing catalog
 * as grouped, crawlable tables (content/price-list.ts + lib/data/price-list.ts), plus the detailed
 * cost guides. The URL is kept because it already ranks for the price queries.
 */

const PATH = "/cost-guides";

// Prices follow the live catalog (itself fetch-cached for an hour under the "cms-pricing" tag).
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const list = await getPriceList();
  // No lastModified: the hub stays og:type "website"; its freshness shows in the sitemap lastmod.
  return buildMetadata({ title: list.title, description: list.metaDescription, path: PATH });
}

export default async function CostGuidesPage() {
  const [list, guides] = await Promise.all([getPriceList(), getCostGuideCards()]);
  const phone = siteConfig.business.phone;

  return (
    <>
      <JsonLd
        data={[
          ...priceListSchemas({
            path: PATH,
            title: list.title,
            description: list.metaDescription,
            year: list.year,
            lastUpdated: list.lastUpdated,
            groups: list.groups,
            guides,
          }),
          faqSchema(list.faqs),
        ]}
      />

      <Container className="pt-6">
        {/* Also emits the page's BreadcrumbList JSON-LD. */}
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Prices & Cost Guides", url: PATH },
          ]}
        />
      </Container>

      <PageHero
        eyebrow={list.hero.eyebrow}
        title={list.hero.h1}
        subtitle={list.hero.subtitle}
        ctas={[
          { label: "Get a Fixed Quote", href: "/quote", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
          {
            label: "Call Now",
            href: `tel:${phone}`,
            variant: "outline",
            icon: <Phone className="h-4 w-4" aria-hidden="true" />,
          },
        ]}
      />

      <PriceListHub list={list} guides={guides} />
    </>
  );
}
