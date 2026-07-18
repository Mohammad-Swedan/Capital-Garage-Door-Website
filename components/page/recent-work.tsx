import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { CaseStudyCard } from "@/components/sections/case-study/case-study-card";
import type { CaseStudyPage } from "@/types/case-study";

interface RecentWorkProps {
  eyebrow?: string;
  title: string;
  description?: string;
  caseStudies: CaseStudyPage[];
}

/**
 * "Recent work near {suburb}" — real completed-job case studies (replaces the
 * old placeholder LocalProof). Each card shows the job's before/after photos
 * (before-only, after-only, or both — whatever the case study carries), the
 * service + suburb, and links through to the full `/case-studies/{slug}` page.
 *
 * Renders nothing when there are no case studies for the page, so suburbs
 * without local proof simply omit the section.
 */
export function RecentWork({ eyebrow, title, description, caseStudies }: RecentWorkProps) {
  if (caseStudies.length === 0) return null;

  return (
    <section className="bg-muted/40">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={0.05 * i} className="h-full">
              <CaseStudyCard caseStudy={cs} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
