import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { CostGuidance } from "@/components/page/cost-guidance";
import { FAQSection } from "@/components/page/faq-section";
import { RecentWork } from "@/components/page/recent-work";
import { RelatedServices } from "@/components/page/related-services";
import { ServiceAreaGrid } from "@/components/page/service-area-grid";
import { SectionHeading } from "@/components/page/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ServiceContactPanel } from "@/components/sections/service/service-contact-panel";
import { ServiceQuoteForm } from "@/components/sections/service/quote-form";
import { BrandHero } from "./brand-hero";
import { BrandServices } from "./brand-services";
import { BrandModels } from "./brand-models";
import { BrandFaults } from "./brand-faults";
import { BrandDecision } from "./brand-decision";
import { BrandParts } from "./brand-parts";
import { BrandProductImage } from "./brand-product-image";
import { RelatedBrands } from "./related-brands";
import type { CaseStudyPage } from "@/types/case-study";
import type { ResolvedBrandPage } from "@/types/brand";

interface BrandPageTemplateProps {
  resolved: ResolvedBrandPage;
  caseStudies: CaseStudyPage[];
}

/**
 * Brand page template (e.g. /merlin-garage-door-motors-perth). One template serves both kinds —
 * motor pages get the repair-vs-replace decision block, door pages get the parts/panels block —
 * and every section renders nothing when its data is empty, so a thinner brand page simply has
 * fewer sections rather than empty headings.
 *
 * JSON-LD (Service + WebPage/Brand + FAQPage + speakable) is emitted at the route level via
 * `<PageSchema kind="brand">`; BreadcrumbList comes from `<Breadcrumbs>` below.
 */
export function BrandPageTemplate({ resolved, caseStudies }: BrandPageTemplateProps) {
  const { page, entity, hub, rendered, pricing, relatedBrands, capitalMotorRange, areaLinks } =
    resolved;
  const noun = page.kind === "motor" ? "motor" : "door";

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: hub.name, url: `/${hub.slug}` },
            { name: entity.name, url: `/${page.slug}` },
          ]}
        />
      </Container>

      <BrandHero page={page} entity={entity} />

      <section className="bg-background pt-12 sm:pt-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p id="direct-answer" className="text-pretty text-lg leading-relaxed text-foreground">
              {rendered.directAnswer}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Looking for another brand? See{" "}
              <Link href={`/${hub.slug}`} className="font-semibold text-primary hover:underline">
                every {noun} brand we service in Perth
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>

      {rendered.intro.paragraphs.length > 0 && (
        <section className="bg-background py-12 sm:py-16">
          <Container>
            <SectionHeading title={page.intro.heading} />
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {rendered.intro.paragraphs.map((paragraph, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className="text-pretty leading-relaxed text-muted-foreground">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <BrandProductImage image={page.productImage} />

      <BrandServices entity={entity} services={page.services} />
      <BrandModels entity={entity} models={page.models ?? []} />
      <BrandFaults entity={entity} faults={page.faults} />

      {page.kind === "motor" && rendered.decision && (
        <BrandDecision
          entity={entity}
          decision={rendered.decision}
          capitalMotorRange={capitalMotorRange}
        />
      )}
      {page.kind === "door" && rendered.parts && <BrandParts entity={entity} parts={rendered.parts} />}

      <CostGuidance
        eyebrow="Guide prices"
        title={`${entity.name} ${noun} repair & replacement prices in Perth`}
        data={pricing}
        ctaText={`Request a fixed quote for your ${entity.name} ${noun}.`}
      />

      <RecentWork
        eyebrow="Recent work"
        title={`Recent ${entity.name} jobs in Perth`}
        description="Real jobs, real photos — before and after."
        caseStudies={caseStudies}
      />

      <FAQSection
        eyebrow={`${entity.name} FAQ`}
        title={`${entity.name} ${noun} questions, answered`}
        faqs={rendered.faqs}
      />

      <RelatedBrands hub={hub} brands={relatedBrands} />

      {page.relatedServices.length > 0 && (
        <RelatedServices
          eyebrow="Related services"
          title="Related services & guides"
          links={page.relatedServices}
        />
      )}

      {areaLinks.length > 0 && (
        <ServiceAreaGrid
          eyebrow="Where we work"
          title={`${entity.name} ${noun} service across Perth`}
          description="Same-day slots in most suburbs — call with your address for an arrival window."
          suburbs={areaLinks}
        />
      )}

      <section className="bg-muted/40">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
            <ServiceContactPanel serviceName={`${entity.name} ${noun} service`} />
            <ServiceQuoteForm
              serviceName={`${entity.name} garage door ${noun}`}
              heading={page.cta.heading}
              subtitle={page.cta.subtitle}
            />
          </div>
        </Container>
      </section>

      <StickyMobileCta />
    </>
  );
}
