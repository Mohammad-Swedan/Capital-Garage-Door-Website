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
          <span className="cgd-eyebrow text-cta">What Affects Price</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            <EditableText path="factors.heading" placeholder="Section heading…">
              {heading}
            </EditableText>
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <div className="group flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/10 transition-transform duration-300 group-hover:scale-105">
                      <EditableIcon path={`factors.items[${index}].icon`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </EditableIcon>
                    </span>
                    <h3 className="cgd-h3 text-base text-foreground">
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
