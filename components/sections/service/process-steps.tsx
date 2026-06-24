import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import type { ServiceProcessStep } from "@/types/service-page";

interface ProcessStepsProps {
  heading?: string;
  steps: ServiceProcessStep[];
}

/** Numbered "how it works" flow — builds confidence before the visitor reaches the quote form. */
export function ProcessSteps({ heading = "How Our Repair Process Works", steps }: ProcessStepsProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = resolveIcon(step.icon);
            return (
              <Reveal key={step.title} delay={index * 0.06}>
                <div className="relative flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-2xl font-black text-primary/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
