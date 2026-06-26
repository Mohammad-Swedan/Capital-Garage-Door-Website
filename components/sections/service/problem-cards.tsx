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
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta/10 text-cta">
                    <EditableIcon path={`problems[${index}].icon`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </EditableIcon>
                  </span>
                  <span className="font-heading text-base font-semibold text-foreground group-hover:text-cta">
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
                      className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_rgba(13,31,69,0.05)] transition-shadow hover:shadow-[0_8px_32px_rgba(13,31,69,0.1)]"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_rgba(13,31,69,0.05)]">
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
