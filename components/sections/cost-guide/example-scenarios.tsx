"use client";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import {
  EditableText,
  EditableList,
  EditableIcon,
} from "@/components/admin/editor/editable";
import type { CostScenario } from "@/types/cost-guide";

interface ExampleScenariosProps {
  heading: string;
  items: CostScenario[];
}

/** Blank scenario produced by the "+ Add" affordance. */
const blankScenario = (): CostScenario => ({ icon: "Wrench", title: "", mayAffectQuote: "" });

/** "What might my quote look like?" — common real-world scenarios with what may affect the price. */
export function ExampleScenarios({ heading, items }: ExampleScenariosProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">Real Examples</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            <EditableText path="scenarios.heading" placeholder="Section heading…">
              {heading}
            </EditableText>
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <EditableList<CostScenario>
            path="scenarios.items"
            items={items}
            itemTemplate={blankScenario}
            addLabel="Add scenario"
            getKey={(item, i) => item.title || i}
            renderItem={(item, index) => {
              const Icon = resolveIcon(item.icon);
              return (
                <Reveal delay={index * 0.05}>
                  <div className="group h-full rounded-2xl border border-brand/15 bg-brand-soft p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-elevated text-brand shadow-card transition-transform duration-300 group-hover:scale-105">
                      <EditableIcon path={`scenarios.items[${index}].icon`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </EditableIcon>
                    </span>
                    <h3 className="mt-4 cgd-h3 text-base text-foreground">
                      <EditableText path={`scenarios.items[${index}].title`} placeholder="Scenario title…">
                        {item.title}
                      </EditableText>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <EditableText
                        path={`scenarios.items[${index}].mayAffectQuote`}
                        placeholder="What may affect the quote…"
                      >
                        {item.mayAffectQuote}
                      </EditableText>
                    </p>
                  </div>
                </Reveal>
              );
            }}
          />
        </div>
      </Container>
    </section>
  );
}
