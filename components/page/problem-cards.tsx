import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { resolvePageIcon } from "@/components/page/icons";
import type { LocalProblem } from "@/types";

interface ProblemCardsProps {
  eyebrow?: string;
  title: string;
  description?: string;
  problems: LocalProblem[];
}

/** Grid of common garage-door problems in the suburb. */
export function ProblemCards({ eyebrow, title, description, problems }: ProblemCardsProps) {
  return (
    <section className="bg-muted/40">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, i) => {
            const Icon = resolvePageIcon(problem.icon);
            return (
              <Reveal key={problem.title} delay={0.04 * i} className="h-full">
                <article className="flex h-full gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-foreground/5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cta/10 text-cta">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {problem.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {problem.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
