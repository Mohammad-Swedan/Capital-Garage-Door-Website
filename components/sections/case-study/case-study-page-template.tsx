"use client";

import { SmartCta } from "@/components/sections/smart-cta";
import { AlertTriangle, Search, Wrench, Phone, FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { CTASection } from "@/components/sections/cta-section";
import { FAQSection } from "@/components/sections/faq-section";
import { InternalLinkCard } from "@/components/sections/internal-link-card";
import { IncludedChecklist } from "@/components/sections/service/included-checklist";
import { ServiceQuoteForm } from "@/components/sections/service/quote-form";
import { CaseStudyHero } from "@/components/sections/case-study/case-study-hero";
import { JobSummaryCards } from "@/components/sections/case-study/job-summary-cards";
import { DetailSection } from "@/components/sections/case-study/detail-section";
import { BeforeAfterGallery } from "@/components/sections/case-study/before-after-gallery";
import { caseStudySchema } from "@/lib/seo/schema";
import { siteConfig } from "@/config/site";
import type { CaseStudyPage } from "@/types/case-study";

interface CaseStudyPageTemplateProps {
  data: CaseStudyPage;
}

/**
 * Reusable template for completed-job case-study pages (e.g.
 * /case-studies/garage-door-motor-replacement-joondalup). Drop in a new
 * CaseStudyPage content entry (content/case-studies/) to publish another
 * completed job — no component changes needed.
 */
export function CaseStudyPageTemplate({ data }: CaseStudyPageTemplateProps) {
  const phone = siteConfig.business.phone;

  return (
    <>
      <JsonLd data={caseStudySchema(data)} />

      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Case Studies", url: "/case-studies" },
            { name: data.title, url: `/case-studies/${data.slug}` },
          ]}
        />
      </Container>

      <CaseStudyHero data={data} />

      <JobSummaryCards data={data} />

      <DetailSection icon={AlertTriangle} heading="Customer Problem" block={data.problem} tone="default" pathPrefix="problem" />

      <DetailSection icon={Search} heading="Inspection & Diagnosis" block={data.diagnosis} tone="tinted" pathPrefix="diagnosis" />

      <DetailSection icon={Wrench} heading="Solution" block={data.solution} tone="default" pathPrefix="solution" />

      <BeforeAfterGallery images={data.images} />

      <IncludedChecklist heading="Parts & Work Completed" items={data.partsUsed} />

      <SmartCta />

      <StickyMobileCta />
    </>
  );
}
