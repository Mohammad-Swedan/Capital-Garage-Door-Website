import { CheckCircle2, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { CaseStudyDetailBlock } from "@/types/case-study";

interface DetailSectionProps {
  icon: LucideIcon;
  heading: string;
  block: CaseStudyDetailBlock;
  /** Alternates a soft tint between the three narrative sections for visual rhythm. */
  tone?: "default" | "tinted";
}

/** Reusable narrative block (intro paragraph + bullet list) — used for Customer Problem, Inspection/Diagnosis, and Solution. */
export function DetailSection({ icon: Icon, heading, block, tone = "default" }: DetailSectionProps) {
  return (
    <section className={cn("py-14 sm:py-20", tone === "tinted" ? "bg-muted/30" : "bg-background")}>
      <Container>
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {heading}
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="mt-5">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{block.intro}</p>
          </Reveal>

          <Reveal delay={0.12} className="mt-6">
            <ul className="grid gap-3 rounded-2xl border border-border bg-card p-6 sm:p-7">
              {block.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-foreground sm:text-base">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
