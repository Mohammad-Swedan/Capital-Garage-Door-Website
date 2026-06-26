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
import type { ServicePage } from "@/types/service-page";

interface ServicePageTemplateProps {
  data: ServicePage;
}

/**
 * Reusable template for flat "[service] in Perth" landing pages. Drop in a
 * new ServicePage content entry (content/service-pages/) to ship another
 * page — no component changes needed.
 */
export function ServicePageTemplate({ data }: ServicePageTemplateProps) {
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

      <ServiceCostTable costGuidance={data.costGuidance} />

      <WhyChoose items={data.whyChoose} />

      <ServiceRelatedLinks links={data.relatedServices} />

      <ServiceAreaGrid areas={data.serviceAreas} />

      <ReviewCards reviews={data.reviews} />

      <FAQSection faqs={data.faqs} />

      <SmartCta />

      <StickyMobileCta />
    </>
  );
}
