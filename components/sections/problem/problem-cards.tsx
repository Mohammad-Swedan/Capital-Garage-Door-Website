"use client";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import {
  EditableText,
  EditableList,
  EditableIcon,
} from "@/components/admin/editor/editable";
import type { ProblemCause } from "@/types";

interface ProblemCardsProps {
  heading?: string;
  causes: ProblemCause[];
}

/** Grid of "Common Causes" cards, icon-led for quick scanning. */
export function ProblemCards({ heading = "Common Causes", causes }: ProblemCardsProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">Diagnosis</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <EditableList<ProblemCause>
            path="causes"
            items={causes}
            itemTemplate={() => ({ icon: "AlertTriangle", title: "", description: "" })}
            addLabel="Add cause"
            getKey={(c, i) => c.title || i}
            renderItem={(cause, index) => {
              const Icon = resolveIcon(cause.icon);
              return (
                <Reveal delay={index * 0.05}>
                  <div className="group flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cta-soft text-cta ring-1 ring-cta/10 transition-transform duration-300 group-hover:scale-105">
                      <EditableIcon path={`causes[${index}].icon`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </EditableIcon>
                    </span>
                    <h3 className="cgd-h3 text-base text-foreground">
                      <EditableText path={`causes[${index}].title`} placeholder="Cause title…">
                        {cause.title}
                      </EditableText>
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <EditableText path={`causes[${index}].description`} placeholder="Cause description…">
                        {cause.description}
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
