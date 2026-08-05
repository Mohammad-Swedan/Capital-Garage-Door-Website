import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { CaseStudyCard } from "@/components/sections/case-study/case-study-card";
import type { CaseStudyPage } from "@/types/case-study";

interface HomeRecentWorkProps {
  caseStudies: CaseStudyPage[];
}

/**
 * Home-page "Recent work" — the latest real completed jobs (from
 * `getRecentCaseStudies()`), reusing the shared CaseStudyCard so it stays in
 * sync with the /case-studies hub and the suburb-page RecentWork section.
 *
 * SEO intent: the home page's internal links are the strongest on the site,
 * and case studies are the entry points for suburb queries — this section
 * pushes home-page equity (and Perth suburb names) at them, refreshing
 * automatically whenever a new job page ships. Server-rendered, images lazy
 * (below the fold), no client JS.
 *
 * Renders nothing when there are no photo-backed case studies.
 */
export function HomeRecentWork({ caseStudies }: HomeRecentWorkProps) {
  if (caseStudies.length === 0) return null;

  return (
    <section className="bg-muted/30 py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Recent Work"
          title="Real Jobs, Real Photos, Across Perth"
          description="The latest garage door repairs and installations our technicians have completed — with the before and after photos to prove it."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={0.05 * i} className="h-full">
              <CaseStudyCard caseStudy={cs} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold">
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-1.5 text-primary hover:underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
          >
            View all case studies
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-1.5 text-primary hover:underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            Browse the photo gallery
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
