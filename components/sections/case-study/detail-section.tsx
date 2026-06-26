"use client";

import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { EditableText, EditableList } from "@/components/admin/editor/editable";
import type { CaseStudyDetailBlock } from "@/types/case-study";

interface DetailSectionProps {
  /** Rendered icon element (a ReactNode, not a component) so it serializes across the server→client boundary. */
  icon: ReactNode;
  heading: string;
  block: CaseStudyDetailBlock;
  /** Alternates a soft tint between the three narrative sections for visual rhythm. */
  tone?: "default" | "tinted";
  /**
   * Draft dot-path prefix for this block (e.g. "problem" | "diagnosis" |
   * "solution"). When provided, the in-place editor binds `intro`/`points`
   * under it. Omit it (public render) and the editor primitives pass through.
   */
  pathPrefix?: string;
}

/** Reusable narrative block (intro paragraph + bullet list) — used for Customer Problem, Inspection/Diagnosis, and Solution. */
export function DetailSection({ icon, heading, block, tone = "default", pathPrefix }: DetailSectionProps) {
  return (
    <section className={cn("py-14 sm:py-20", tone === "tinted" ? "bg-surface-muted" : "bg-background")}>
      <Container>
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-elevated ring-1 ring-white/15">
                {icon}
              </span>
              <h2 className="cgd-h2 text-balance text-foreground">
                {heading}
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="mt-5">
            <p className="cgd-lead text-muted-foreground">
              <EditableText path={`${pathPrefix}.intro`} placeholder="Intro paragraph…">
                {block.intro}
              </EditableText>
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-6">
            <ul className="grid gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-6 elevate-card sm:p-7">
              <EditableList<string>
                path={`${pathPrefix}.points`}
                items={block.points}
                itemTemplate={() => ""}
                addLabel="Add point"
                getKey={(_p, i) => i}
                renderItem={(point, index) => (
                  <li className="flex items-start gap-2.5 text-sm text-foreground sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <EditableText path={`${pathPrefix}.points[${index}]`} placeholder="Point…">
                      {point}
                    </EditableText>
                  </li>
                )}
              />
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
