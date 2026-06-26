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
    <section className="bg-surface-muted">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, i) => {
            const Icon = resolvePageIcon(problem.icon);
            return (
              <Reveal key={problem.title} delay={0.04 * i} className="h-full">
                <article className="group flex h-full gap-4 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cta-soft text-cta ring-1 ring-cta/10 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="cgd-h3 text-base text-foreground">
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
