import { SmartCta } from "@/components/sections/smart-cta";
import { Camera, FileText, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { PageHero } from "@/components/sections/page-hero";
import { DirectAnswer } from "@/components/sections/direct-answer";
import { CTASection } from "@/components/sections/cta-section";
import { FAQSection } from "@/components/sections/faq-section";
import { ProcessSteps } from "@/components/sections/service/process-steps";
import { CostGuideTable } from "@/components/sections/cost-guide/cost-guide-table";
import { CostFactorsGrid } from "@/components/sections/cost-guide/cost-factors-grid";
import { ExampleScenarios } from "@/components/sections/cost-guide/example-scenarios";
import { RepairVsReplace } from "@/components/sections/cost-guide/repair-vs-replace";
import { CostGuideRelatedLinks } from "@/components/sections/cost-guide/related-links";
import { CostGuideQuoteForm } from "@/components/sections/cost-guide/quote-form";
import { siteConfig } from "@/config/site";
import type { CostGuidePage } from "@/types/cost-guide";

interface CostGuidePageTemplateProps {
  data: CostGuidePage;
}

/**
 * Reusable template for flat "[repair/service] cost in Perth" pricing-guide
 * landing pages. Drop in a new CostGuidePage content entry
 * (content/cost-guides/) to ship another page — no component changes
 * needed.
 */
export function CostGuidePageTemplate({ data }: CostGuidePageTemplateProps) {
  const phone = siteConfig.business.phone;

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Cost Guides", url: "/cost-guides" },
            { name: data.topicLabel, url: `/${data.slug}` },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Pricing Overview"
        title={data.hero.h1}
        subtitle={data.hero.subtitle}
        ctas={[
          { label: "Request Quote", href: "#quote", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
          {
            label: "Upload Photo for Estimate",
            href: "#quote",
            variant: "outline",
            icon: <Camera className="h-4 w-4" aria-hidden="true" />,
          },
          {
            label: "Call Now",
            href: `tel:${phone}`,
            variant: "outline",
            icon: <Phone className="h-4 w-4" aria-hidden="true" />,
          },
        ]}
      />

      <DirectAnswer answer={data.directAnswer} />

      <CostGuideTable table={data.costTable} />

      <CostFactorsGrid heading={data.factors.heading} items={data.factors.items} />

      <ExampleScenarios heading={data.scenarios.heading} items={data.scenarios.items} />

      <RepairVsReplace data={data.repairVsReplace} />

      <ProcessSteps heading={data.howToQuote.heading} steps={data.howToQuote.steps} />

      <CostGuideRelatedLinks links={data.relatedServices} />

      <FAQSection faqs={data.faqs} />

      <section id="quote" className="bg-background py-14 sm:py-20">
        <Container className="max-w-2xl">
          <CostGuideQuoteForm topicLabel={data.topicLabel} />
        </Container>
      </section>

      <SmartCta />

      <StickyMobileCta />
    </>
  );
}
