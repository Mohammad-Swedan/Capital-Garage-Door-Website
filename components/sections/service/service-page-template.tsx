import { SmartCta } from "@/components/sections/smart-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { DirectAnswer } from "@/components/sections/direct-answer";
import { FAQSection } from "@/components/sections/faq-section";
import { ServiceHero } from "@/components/sections/service/service-hero";
import { IntroSection } from "@/components/sections/service/intro-section";
import { ServiceProblemCards } from "@/components/sections/service/problem-cards";
import { IncludedChecklist } from "@/components/sections/service/included-checklist";
import { ProcessSteps } from "@/components/sections/service/process-steps";
import { ServiceCostTable } from "@/components/sections/service/cost-table";
import { WhyChoose } from "@/components/sections/service/why-choose";
import { ServiceRelatedLinks } from "@/components/sections/service/related-links";
import { ServiceAreaGrid } from "@/components/sections/service/service-area-grid";
import { ReviewCards } from "@/components/sections/service/review-cards";
import { ServiceQuoteForm } from "@/components/sections/service/quote-form";
import { ServiceContactPanel } from "@/components/sections/service/service-contact-panel";
import { RecentWork } from "@/components/page/recent-work";
import { priceLinksFor } from "@/lib/pricing/guide-links";
import type { ServicePage } from "@/types/service-page";
import type { CaseStudyPage } from "@/types/case-study";

interface ServicePageTemplateProps {
  data: ServicePage;
  /** Suburb-page links for the service-area grid, keyed by lowercased suburb name. */
  areaLinks?: Record<string, string>;
  /**
   * Real completed jobs for the "Recent work" section (resolved in the route by
   * `getCaseStudiesForServicePage`). Optional so the admin live-editor can render the template
   * with just `data`; the section hides itself when the list is empty.
   */
  caseStudies?: CaseStudyPage[];
}

/**
 * Reusable template for flat "[service] in Perth" landing pages. Drop in a
 * new ServicePage content entry (content/service-pages/) to ship another
 * page — no component changes needed.
 */
export function ServicePageTemplate({ data, areaLinks, caseStudies = [] }: ServicePageTemplateProps) {
  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: data.serviceName, url: `/${data.slug}` },
          ]}
        />
      </Container>

      <ServiceHero hero={data.hero} />

      <DirectAnswer answer={data.directAnswer} />

      <IntroSection heading={data.intro.heading} paragraphs={data.intro.paragraphs} />

      <ServiceProblemCards problems={data.problems} />

      <IncludedChecklist items={data.includedItems} />

      <ProcessSteps steps={data.processSteps} />

      <ServiceCostTable costGuidance={data.costGuidance} links={priceLinksFor(data.slug)} />

      <WhyChoose items={data.whyChoose} />

      <RecentWork
        eyebrow="Recent work"
        title={`Recent Jobs — ${data.serviceName}`}
        description="Real completed jobs from around Perth — tap through for the photos and the full story."
        caseStudies={caseStudies}
      />

      <ServiceRelatedLinks links={data.relatedServices} />

      <ServiceAreaGrid areas={data.serviceAreas} areaLinks={areaLinks} />

      <ReviewCards reviews={data.reviews} />

      <FAQSection faqs={data.faqs} />

      {/* Lead-capture form — the #quote target for every "Request a Quote"
          CTA on the page (hero, service-area grid, sticky bar). */}
      <section className="bg-muted/40">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
            <ServiceContactPanel serviceName={data.serviceName} />
            <ServiceQuoteForm serviceName={data.serviceName} />
          </div>
        </Container>
      </section>

      <SmartCta />

      <StickyMobileCta />
    </>
  );
}
