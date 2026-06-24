import type { Metadata } from "next";
import { Phone, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getCostGuidePages } from "@/lib/data/cost-guides";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Cost Guides Perth | Capital Garage Door",
  description:
    "Browse our garage door cost guides — transparent pricing guidance for repairs, installation, motor replacement, and emergency call-outs across Perth.",
  path: "/cost-guides",
});

export default async function CostGuidesPage() {
  const phone = siteConfig.business.phone;
  const costGuides = await getCostGuidePages();

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Cost Guides", url: "/cost-guides" }]} />
      </Container>

      <PageHero
        eyebrow="Transparent Pricing"
        title="Garage Door Cost Guides"
        subtitle="Understand what affects garage door pricing in Perth before you book — repairs, installation, motor replacement, and more, explained clearly."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <section className="bg-background py-14 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              All Cost Guides
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {costGuides.map((page, index) => (
              <Reveal key={page.slug} delay={index * 0.05}>
                <InternalLinkCard
                  href={`/${page.slug}`}
                  title={page.hero.h1}
                  description={page.directAnswer}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
