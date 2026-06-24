import { SmartCta } from "@/components/sections/smart-cta";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { PageHero } from "@/components/page/page-hero";
import { DirectAnswer } from "@/components/page/direct-answer";
import { ContentSection } from "@/components/page/content-section";
import { ServiceCards } from "@/components/page/service-cards";
import { ProblemCards } from "@/components/page/problem-cards";
import { ServiceAreaGrid } from "@/components/page/service-area-grid";
import { CostGuidance } from "@/components/page/cost-guidance";
import { TrustCards } from "@/components/page/trust-cards";
import { LocalProof } from "@/components/page/local-proof";
import { RelatedServices } from "@/components/page/related-services";
import { FAQSection } from "@/components/page/faq-section";
import { CTASection } from "@/components/page/cta-section";
import { SectionHeading } from "@/components/page/section-heading";
import { QuoteForm } from "@/components/forms/quote-form";
import { localBusinessSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/config/site";
import type { BreadcrumbItem, ServiceSuburbPage } from "@/types";

interface ServiceSuburbPageTemplateProps {
  page: ServiceSuburbPage;
}

/**
 * Service + Suburb landing page template (Page Type 2), e.g.
 * /garage-door-repairs-joondalup. Extracted from the route file so the same
 * root-level dynamic segment can also serve flat service pages (Page Type 1)
 * — see app/[slug]/page.tsx, which picks this template or
 * ServicePageTemplate depending on which content registry matches the slug.
 */
export function ServiceSuburbPageTemplate({ page }: ServiceSuburbPageTemplateProps) {
  const titleWithSuburb = `${page.service} ${page.suburb}`;

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", url: "/" },
    { name: "Service Areas", url: "/service-areas" },
    { name: page.suburb, url: "/service-areas" },
    { name: titleWithSuburb, url: `/${page.slug}` },
  ];

  // Service-in-suburb JSON-LD (LocalBusiness + FAQPage + BreadcrumbList are
  // emitted by their own components below). Built inline to keep the shared
  // schema module untouched.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: titleWithSuburb,
    serviceType: page.service,
    description: page.directAnswer,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
      telephone: siteConfig.business.phone,
      url: siteConfig.url,
    },
    areaServed: {
      "@type": "City",
      name: `${page.suburb}, ${page.region}`,
    },
  };

  return (
    <main>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={serviceLd} />

      <Container className="pt-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <PageHero
        eyebrow={`${page.service} · ${page.region}`}
        title={titleWithSuburb}
        subtitle={page.hero.subtitle}
        trustBadges={page.hero.trustBadges}
        areaLabel={`Servicing ${page.suburb} & Nearby Suburbs`}
      />

      <DirectAnswer label={titleWithSuburb} answer={page.directAnswer} />

      <ContentSection
        eyebrow={`Local ${page.service}`}
        title={`Trusted ${page.service} in ${page.suburb}`}
        paragraphs={page.localIntro}
      />

      <ServiceCards
        eyebrow="What we fix"
        title={`Services Available in ${page.suburb}`}
        description={`From quick fixes to full replacements — here's how we help ${page.suburb} homes and businesses.`}
        services={page.availableServices}
      />

      <ProblemCards
        eyebrow="Common issues"
        title={`Common Garage Door Problems in ${page.suburb}`}
        description="If your door is doing any of these, we can diagnose and repair it — often the same day."
        problems={page.problems}
      />

      <ServiceAreaGrid
        eyebrow="Nearby areas"
        title={`We Also Service Suburbs Near ${page.suburb}`}
        description="Local technicians covering the wider area — tap your suburb to learn more."
        suburbs={page.nearbySuburbs}
      />

      <CostGuidance
        eyebrow="Pricing"
        title={`${page.service} Cost in ${page.suburb}`}
        data={page.costGuidance}
        ctaText={`Request a quote for your ${page.suburb} property.`}
      />

      <TrustCards
        eyebrow="Why choose us"
        title={`Why ${page.suburb} Chooses Capital Garage Doors`}
        reasons={page.whyChooseUs}
      />

      <LocalProof
        eyebrow="Recent work"
        title={`Recent Garage Door Work Near ${page.suburb}`}
        description="A snapshot of the kind of jobs we handle locally."
        items={page.localProof}
      />

      <RelatedServices
        eyebrow="Explore more"
        title="Related Services Across Perth"
        links={page.relatedPages}
      />

      <FAQSection
        eyebrow="FAQs"
        title={`${page.service} in ${page.suburb} — FAQs`}
        faqs={page.faqs}
      />

      {/* Quote form */}
      <section id="quote" className="scroll-mt-24 bg-muted/40">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
            <SectionHeading
              eyebrow="Get a quote"
              title={`Request a Quote in ${page.suburb}`}
              description={`Tell us what's going on and we'll get back to you fast. Prefilled for ${page.service.toLowerCase()} in ${page.suburb} — add a photo for an even quicker estimate.`}
            />
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-8">
              <QuoteForm service={page.service} suburb={page.suburb} />
            </div>
          </div>
        </Container>
      </section>

      <SmartCta />

      <StickyMobileCta />
    </main>
  );
}
