import type { Metadata } from "next";
import { Phone, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getServicePages } from "@/lib/data/service-pages";
import { resolveIcon } from "@/lib/icons";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Services Perth | Capital Garage Door",
  description:
    "Browse all garage door services available across Perth — repairs, installation, motor replacement, roller doors, emergency response, and servicing.",
  path: "/services",
});

export default async function ServicesPage() {
  const phone = siteConfig.business.phone;
  const servicePages = await getServicePages();

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }]} />
      </Container>

      <PageHero
        eyebrow="Perth-Wide Coverage"
        title="Garage Door Services in Perth"
        subtitle="From everyday repairs to full installations, Capital Garage Door covers the full range of residential and commercial garage door services across Perth."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <section className="bg-background py-14 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              All Services
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {servicePages.map((page, index) => (
              <Reveal key={page.slug} delay={index * 0.05}>
                <InternalLinkCard
                  href={`/${page.slug}`}
                  title={page.serviceName}
                  description={page.directAnswer}
                  icon={resolveIcon(page.hero.badges[0]?.icon ?? "Wrench")}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
