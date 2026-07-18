import Link from "next/link";
import { Wrench, MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { CaseStudyImageFrame, pickBeforeAfter } from "@/components/page/case-study-image";
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
          {caseStudies.map((cs, i) => {
            const { before, after, single } = pickBeforeAfter(cs.images);
            const both = before && after;
            return (
              <Reveal key={cs.slug} delay={0.05 * i} className="h-full">
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5 transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  {both ? (
                    <div className="grid aspect-[16/9] grid-cols-2 gap-px bg-border">
                      <CaseStudyImageFrame image={before} label="Before" sizes="(max-width: 640px) 50vw, 20vw" />
                      <CaseStudyImageFrame image={after} label="After" sizes="(max-width: 640px) 50vw, 20vw" />
                    </div>
                  ) : (
                    <CaseStudyImageFrame
                      image={before ?? after ?? single}
                      label={before ? "Before" : after ? "After" : undefined}
                      className="aspect-[16/9]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-[#0f4e9b] uppercase">
                      <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{cs.service}</span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        {cs.suburb}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-foreground">{cs.title}</h3>
                    {cs.result ? (
                      <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                        {cs.result}
                      </p>
                    ) : null}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-1.5">
                      View case study
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
