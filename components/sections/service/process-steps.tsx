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
          <span className="cgd-eyebrow text-cta">Our Process</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
                  <div className="group relative flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand ring-1 ring-brand/10 transition-transform duration-300 group-hover:scale-105">
                        <EditableIcon path={`processSteps[${index}].icon`}>
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </EditableIcon>
                      </span>
                      <span className="font-display text-3xl font-black text-gradient-brand opacity-30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="cgd-h3 text-base text-foreground">
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
