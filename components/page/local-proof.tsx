"use client";

import { ImageIcon, ArrowRight, Wrench } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { EditableText, EditableList } from "@/components/admin/editor/editable";
import type { LocalProofItem } from "@/types";

interface LocalProofProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: LocalProofItem[];
}

/**
 * "Recent work near [suburb]" social-proof cards.
 *
 * PLACEHOLDER: these render from static content for now. Once CRM job /
 * case-study data is available, bind `items` to real records (service
 * performed, suburb, problem, solution, before/after photos). The
 * before/after image area below is already structured for that swap.
 */
export function LocalProof({ eyebrow, title, description, items }: LocalProofProps) {
  return (
    <section className="bg-muted/40">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <EditableList<LocalProofItem>
            path="localProof"
            items={items}
            itemTemplate={() => ({ serviceType: "", suburb: "", problem: "", solution: "" })}
            addLabel="Add proof"
            getKey={(item, i) => `${item.serviceType}-${i}`}
            renderItem={(item, i) => (
              <Reveal delay={0.05 * i} className="h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5">
                  {/* Before/after image placeholder — swap for real CRM photos. */}
                  <div className="relative grid aspect-[16/9] grid-cols-2 gap-px bg-border">
                    {(["Before", "After"] as const).map((label) => (
                      <div
                        key={label}
                        className="relative flex items-center justify-center bg-gradient-to-br from-muted to-muted/50"
                      >
                        {item.beforeImage || item.afterImage ? null : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground/40" aria-hidden="true" />
                        )}
                        <span className="absolute bottom-2 left-2 rounded-md bg-foreground/70 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-[#0f4e9b] uppercase">
                      <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                      <EditableText path={`localProof[${i}].serviceType`} singleLine placeholder="Service type…">
                        {item.serviceType}
                      </EditableText>
                      <span className="text-muted-foreground">
                        ·{" "}
                        <EditableText path={`localProof[${i}].suburb`} singleLine placeholder="Suburb…">
                          {item.suburb}
                        </EditableText>
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      <EditableText path={`localProof[${i}].problem`} placeholder="Problem…">
                        {item.problem}
                      </EditableText>
                    </p>
                    <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                      <EditableText path={`localProof[${i}].solution`} placeholder="Solution…">
                        {item.solution}
                      </EditableText>
                    </p>
                  </div>
                </article>
              </Reveal>
            )}
          />
        </div>
      </Container>
    </section>
  );
}
