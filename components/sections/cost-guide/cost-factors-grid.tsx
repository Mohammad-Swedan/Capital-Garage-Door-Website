"use client";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import {
  EditableText,
  EditableList,
  EditableIcon,
} from "@/components/admin/editor/editable";
import type { CostFactor } from "@/types/cost-guide";

interface CostFactorsGridProps {
  heading: string;
  items: CostFactor[];
}

/** Blank cost factor produced by the "+ Add" affordance. */
const blankFactor = (): CostFactor => ({ icon: "FileText", title: "", description: "" });

/** Grid of "what affects the price" cards, icon-led for quick scanning. */
export function CostFactorsGrid({ heading, items }: CostFactorsGridProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <EditableText path="factors.heading" placeholder="Section heading…">
              {heading}
            </EditableText>
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <EditableList<CostFactor>
            path="factors.items"
            items={items}
            itemTemplate={blankFactor}
            addLabel="Add factor"
            getKey={(item, i) => item.title || i}
            renderItem={(item, index) => {
              const Icon = resolveIcon(item.icon);
              return (
                <Reveal delay={index * 0.05}>
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_rgba(13,31,69,0.05)] transition-shadow hover:shadow-[0_8px_32px_rgba(13,31,69,0.1)]">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <EditableIcon path={`factors.items[${index}].icon`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </EditableIcon>
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      <EditableText path={`factors.items[${index}].title`} placeholder="Factor title…">
                        {item.title}
                      </EditableText>
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <EditableText path={`factors.items[${index}].description`} placeholder="Description…">
                        {item.description}
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
