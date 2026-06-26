import { SmartCta } from "@/components/sections/smart-cta";
import { FAQSection } from "@/components/sections/faq-section";
import { LandingHero } from "@/components/sections/landing/landing-hero";
import { LandingReviews } from "@/components/sections/landing/landing-reviews";
import { SuburbChips } from "@/components/sections/landing/suburb-chips";
import { ProblemCards } from "@/components/page/problem-cards";
import { TrustCards } from "@/components/page/trust-cards";
import type { LandingPage } from "@/types/landing-page";

interface LandingPageTemplateProps {
  page: LandingPage;
}

/**
 * Data-driven template for Google Ads / paid landing pages. Composes the shared
 * section components in a fixed, conversion-first order. Header/footer and the
 * sticky mobile CTA are supplied by app/lp/layout.tsx.
 */
export function LandingPageTemplate({ page }: LandingPageTemplateProps) {
  return (
    <>
      {/* JSON-LD (Service + FAQPage + Review[] + speakable) is emitted at the
          route level via <PageSchema kind="landing"> in app/lp/[slug]/page.tsx. */}
      <LandingHero page={page} />

      <ProblemCards
        eyebrow={page.problems.eyebrow}
        title={page.problems.heading}
        description={page.problems.description}
        problems={page.problems.items}
      />

      <TrustCards
        eyebrow={page.whyChoose.eyebrow}
        title={page.whyChoose.heading}
        description={page.whyChoose.description}
        reasons={page.whyChoose.items}
      />

      <LandingReviews heading={page.reviews.heading} reviews={page.reviews.items} />

      <SuburbChips
        heading={page.serviceAreas.heading}
        description={page.serviceAreas.description}
        suburbs={page.serviceAreas.suburbs}
      />

      <FAQSection faqs={page.faqs} />

      <SmartCta />
    </>
  );
}
