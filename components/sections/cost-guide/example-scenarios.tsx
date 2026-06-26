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
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <EditableText path="scenarios.heading" placeholder="Section heading…">
              {heading}
            </EditableText>
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <div className="h-full rounded-2xl border border-primary/15 bg-primary/5 p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary">
                      <EditableIcon path={`scenarios.items[${index}].icon`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </EditableIcon>
                    </span>
                    <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
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
