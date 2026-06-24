import type { Metadata } from "next";
import { Phone, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { CoverageRegions } from "@/components/sections/service-areas/coverage-regions";
import { getServiceAreaRegions } from "@/lib/data/service-area-regions";
import { serviceAreasSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Service Areas Perth | Capital Garage Door",
  description:
    "Capital Garage Door services Perth and surrounding suburbs — from Joondalup to Rockingham, Fremantle to Midland. Find your suburb and get a fast quote.",
  path: "/service-areas",
});

export default async function ServiceAreasPage() {
  const phone = siteConfig.business.phone;
  const regions = await getServiceAreaRegions();

  return (
    <>
      <JsonLd data={serviceAreasSchema(regions)} />

      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Service Areas", url: "/service-areas" }]} />
      </Container>

      <PageHero
        eyebrow="Perth-Wide Coverage"
        title="Garage Door Services Across Perth"
        subtitle="Capital Garage Door services Perth and the surrounding suburbs — fast response, local technicians, and the same trusted standard wherever you are."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <section className="bg-background pb-2 sm:pb-4">
        <Container>
          <Reveal>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              From the inner city to the coast, and the northern corridor to the southern suburbs, our technicians
              cover the full Perth metro area for repairs, installations, motor replacements, and servicing.
            </p>
          </Reveal>
        </Container>
      </section>

      <CoverageRegions regions={regions} />

      <CTASection
        heading="Don't See Your Suburb?"
        body="We likely still cover it — contact us and we'll confirm availability for your area."
        buttons={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Contact Us", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <StickyMobileCta />
    </>
  );
}
