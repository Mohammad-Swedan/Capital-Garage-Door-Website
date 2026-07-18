import Link from "next/link";
import { Wrench, MapPin, ArrowRight } from "lucide-react";
import { CaseStudyImageFrame, pickBeforeAfter } from "@/components/page/case-study-image";
import type { CaseStudyPage } from "@/types/case-study";

interface CaseStudyCardProps {
  caseStudy: CaseStudyPage;
}

/**
 * Shared case-study card — the job's before/after photos (before-only, after-only
 * or both, derived from the image captions), the service + suburb, and a link
 * through to the full `/case-studies/{slug}` page. Used by both the suburb
 * "Recent work" section and the /case-studies listing so they stay in sync.
 */
export function CaseStudyCard({ caseStudy: cs }: CaseStudyCardProps) {
  const { before, after, single } = pickBeforeAfter(cs.images);
  const both = before && after;
  return (
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
  );
}
