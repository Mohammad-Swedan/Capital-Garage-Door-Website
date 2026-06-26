import { SmartCta } from "@/components/sections/smart-cta";
import { Camera, MessageCircleQuestion, Phone, Siren } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHero } from "@/components/sections/page-hero";
import { DirectAnswer } from "@/components/sections/direct-answer";
import { CTASection } from "@/components/sections/cta-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CostTable } from "@/components/sections/cost-table";
import { RelatedServices } from "@/components/sections/related-services";
import { ProblemCards } from "@/components/sections/problem/problem-cards";
import { SafetyChecklist } from "@/components/sections/problem/safety-checklist";
import { CallTechnician } from "@/components/sections/problem/call-technician";
import { QuoteForm } from "@/components/sections/problem/quote-form";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import type { Problem } from "@/types";

interface ProblemPageTemplateProps {
  problem: Problem;
}

/**
 * Reusable template for "garage door [problem]" landing pages — educates,
 * builds trust, and converts urgent searches into leads. Drop in a new
 * `Problem` content entry to ship a new page; no component changes needed.
 *
 * JSON-LD (Article + Service + HowTo + FAQPage + speakable) is emitted at the
 * route level via <PageSchema kind="problem"> (app/problems/[slug]/page.tsx).
 */
export function ProblemPageTemplate({ problem }: ProblemPageTemplateProps) {
  const phone = siteConfig.business.phone;

  return (
    <>
      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Problems", url: "/problems" },
            { name: problem.name, url: `/problems/${problem.slug}` },
          ]}
        />
      </Container>

      <PageHero
        eyebrow="Need Help Right Now?"
        tone="warning"
        title={problem.h1}
        subtitle={problem.heroSubtitle}
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request Help", href: "#get-quote", variant: "outline", icon: <MessageCircleQuestion className="h-4 w-4" aria-hidden="true" /> },
          { label: "Upload Photo/Video", href: "#get-quote", variant: "outline", icon: <Camera className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <DirectAnswer answer={problem.directAnswer} />

      <ProblemCards causes={problem.causes} />

      <SafetyChecklist safeChecks={problem.safeChecks} doNotDo={problem.doNotDo} />

      <CallTechnician signs={problem.callTechnicianSigns} />

      <RelatedServices services={problem.relatedServices} />

      <CostTable rows={problem.costRows} />

      <CTASection
        tone="emergency"
        heading={problem.emergency.heading}
        body={problem.emergency.body}
        buttons={[
          { label: "Call Emergency Repair", href: `tel:${phone}`, icon: <Siren className="h-4 w-4" aria-hidden="true" /> },
          { label: "Send Photo Now", href: "#get-quote", variant: "outline", icon: <Camera className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <FAQSection faqs={problem.faqs} />

      <SmartCta />

      <StickyMobileCta />
    </>
  );
}
