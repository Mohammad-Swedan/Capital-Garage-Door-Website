import { SmartCta } from "@/components/sections/smart-cta";
import { AlertTriangle, Search, Wrench } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { IncludedChecklist } from "@/components/sections/service/included-checklist";
import { CaseStudyHero } from "@/components/sections/case-study/case-study-hero";
import { JobSummaryCards } from "@/components/sections/case-study/job-summary-cards";
import { DetailSection } from "@/components/sections/case-study/detail-section";
import { BeforeAfterGallery } from "@/components/sections/case-study/before-after-gallery";
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
  return (
    <>
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

      <DetailSection icon={<AlertTriangle className="h-5.5 w-5.5" aria-hidden="true" />} heading="Customer Problem" block={data.problem} tone="default" pathPrefix="problem" />

      <DetailSection icon={<Search className="h-5.5 w-5.5" aria-hidden="true" />} heading="Inspection & Diagnosis" block={data.diagnosis} tone="tinted" pathPrefix="diagnosis" />

      <DetailSection icon={<Wrench className="h-5.5 w-5.5" aria-hidden="true" />} heading="Solution" block={data.solution} tone="default" pathPrefix="solution" />

      <BeforeAfterGallery images={data.images} />

      <IncludedChecklist heading="Parts & Work Completed" items={data.partsUsed} />

      <SmartCta />

      <StickyMobileCta />
    </>
  );
}
