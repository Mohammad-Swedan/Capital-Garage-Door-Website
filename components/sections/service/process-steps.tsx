"use client";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import { EditableText, EditableList, EditableIcon } from "@/components/admin/editor/editable";
import { serviceItemTemplates } from "@/components/admin/editor/item-templates";
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
          <EditableList<ServiceProcessStep>
            path="processSteps"
            items={steps}
            itemTemplate={serviceItemTemplates.processStep}
            addLabel="Add step"
            getKey={(s, i) => s.title || i}
            renderItem={(step, index) => {
              const Icon = resolveIcon(step.icon);
              return (
                <Reveal delay={index * 0.06}>
                  <div className="relative flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <EditableIcon path={`processSteps[${index}].icon`}>
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </EditableIcon>
                      </span>
                      <span className="font-display text-2xl font-black text-primary/20">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      <EditableText path={`processSteps[${index}].title`} placeholder="Step title…">
                        {step.title}
                      </EditableText>
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <EditableText path={`processSteps[${index}].description`} placeholder="Step description…">
                        {step.description}
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
