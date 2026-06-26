import { SmartCta } from "@/components/sections/smart-cta";
import { FileText, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { PageHero } from "@/components/sections/page-hero";
import { DirectAnswer } from "@/components/sections/direct-answer";
import { FAQSection } from "@/components/sections/faq-section";
import { ComparisonTable } from "@/components/sections/comparison/comparison-table";
import { OptionSection } from "@/components/sections/comparison/option-section";
import { DecisionCards } from "@/components/sections/comparison/decision-cards";
import { ComparisonRelatedLinks } from "@/components/sections/comparison/related-links";
import { ComparisonQuoteForm } from "@/components/sections/comparison/quote-form";
import { siteConfig } from "@/config/site";
import type { ComparisonPage } from "@/types/comparison-page";

interface ComparisonPageTemplateProps {
  data: ComparisonPage;
}

/**
 * Reusable template for flat "[X] vs [Y]" comparison/guide landing pages.
 * Drop in a new ComparisonPage content entry (content/comparison-pages/) to
 * ship another page — no component changes needed.
 */
export function ComparisonPageTemplate({ data }: ComparisonPageTemplateProps) {
  const phone = siteConfig.business.phone;

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Guides", url: "/guides" },
            { name: data.topicLabel, url: `/${data.slug}` },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Buying Guide"
        title={data.hero.h1}
        subtitle={data.hero.subtitle}
        ctas={[
          { label: "Get Expert Advice", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          {
            label: "Request Quote",
            href: "#quote",
            variant: "outline",
            icon: <FileText className="h-4 w-4" aria-hidden="true" />,
          },
        ]}
      />

      <DirectAnswer heading="Quick Recommendation" answer={data.directAnswer} />

      <ComparisonTable table={data.comparisonTable} />

      <OptionSection option={data.optionA} pathPrefix="optionA" />
      <OptionSection option={data.optionB} tone="subtle" pathPrefix="optionB" />

      <DecisionCards cards={data.decisionCards} />

      <ComparisonRelatedLinks links={data.relatedServices} />

      <FAQSection faqs={data.faqs} />

      <section className="bg-background py-14 sm:py-20">
        <Container className="max-w-2xl">
          <ComparisonQuoteForm topicLabel={data.topicLabel} />
        </Container>
      </section>

      <SmartCta />

      <StickyMobileCta />
    </>
  );
}
