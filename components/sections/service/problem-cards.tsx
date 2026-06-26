"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { resolveIcon } from "@/lib/icons";
import { EditableText, EditableList, EditableIcon } from "@/components/admin/editor/editable";
import { serviceItemTemplates } from "@/components/admin/editor/item-templates";
import type { ServiceProblem } from "@/types/service-page";

interface ServiceProblemCardsProps {
  heading?: string;
  problems: ServiceProblem[];
}

/** Grid of common problems this service resolves — links through to dedicated problem pages where available. */
export function ServiceProblemCards({ heading = "Common Problems We Fix", problems }: ServiceProblemCardsProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">Common Faults</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <EditableList<ServiceProblem>
            path="problems"
            items={problems}
            itemTemplate={serviceItemTemplates.problem}
            addLabel="Add problem"
            getKey={(p, i) => p.label || i}
            renderItem={(problem, index) => {
              const Icon = resolveIcon(problem.icon);
              const content = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cta-soft text-cta ring-1 ring-cta/10 transition-transform duration-300 group-hover:scale-105">
                    <EditableIcon path={`problems[${index}].icon`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </EditableIcon>
                  </span>
                  <span className="cgd-h3 text-base text-foreground transition-colors group-hover:text-cta">
                    <EditableText path={`problems[${index}].label`} placeholder="Problem…">
                      {problem.label}
                    </EditableText>
                  </span>
                  {problem.slug && (
                    <ArrowRight
                      className="mt-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-cta"
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              return (
                <Reveal delay={index * 0.05}>
                  {problem.slug ? (
                    <Link
                      href={`/problems/${problem.slug}`}
                      className="group flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card transition-all duration-300 hover:-translate-y-1 hover:border-cta/30 hover:shadow-float"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="group flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card">
                      {content}
                    </div>
                  )}
                </Reveal>
              );
            }}
          />
        </div>
      </Container>
    </section>
  );
}
