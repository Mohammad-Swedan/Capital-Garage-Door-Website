import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import type { CostScenario } from "@/types/cost-guide";

interface ExampleScenariosProps {
  heading: string;
  items: CostScenario[];
}

/** "What might my quote look like?" — common real-world scenarios with what may affect the price. */
export function ExampleScenarios({ heading, items }: ExampleScenariosProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = resolveIcon(item.icon);
            return (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="h-full rounded-2xl border border-primary/15 bg-primary/5 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.mayAffectQuote}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
