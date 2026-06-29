import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";

export interface WarrantyStep {
  title: string;
  description: string;
}

interface WarrantyStepsProps {
  eyebrow?: string;
  title: string;
  description?: string;
  steps: WarrantyStep[];
}

/** Numbered "how the warranty works" walkthrough. */
export function WarrantySteps({ eyebrow, title, description, steps }: WarrantyStepsProps) {
  return (
    <section className="bg-muted/30">
      <Container className="py-14 sm:py-20">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" />
        <ol className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={0.06 * i} className="h-full">
              <li className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-foreground/5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
