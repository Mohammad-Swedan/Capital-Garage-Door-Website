"use client";

import { CheckCircle2, RefreshCw } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableText, EditableList } from "@/components/admin/editor/editable";
import type { RepairVsReplaceData } from "@/types/cost-guide";

interface RepairVsReplaceProps {
  data: RepairVsReplaceData;
}

const blankString = (): string => "";

/** Two-column guidance: when a repair makes sense vs. when replacement is the better call. */
export function RepairVsReplace({ data }: RepairVsReplaceProps) {
  const { heading, intro, repairWhen, replaceWhen } = data;

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">Make the Call</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            <EditableText path="repairVsReplace.heading" placeholder="Section heading…">
              {heading}
            </EditableText>
          </h2>
          <p className="mt-3 max-w-2xl cgd-lead text-muted-foreground">
            <EditableText path="repairVsReplace.intro" placeholder="Intro…">
              {intro}
            </EditableText>
          </p>
        </Reveal>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-emerald-600/15 bg-emerald-600/5 p-6 shadow-card">
              <h3 className="flex items-center gap-2 cgd-h3 text-base text-emerald-700">
                <RefreshCw className="h-4.5 w-4.5" aria-hidden="true" />
                Repair is usually better when
              </h3>
              <ul className="mt-4 space-y-3">
                <EditableList<string>
                  path="repairVsReplace.repairWhen"
                  items={repairWhen}
                  itemTemplate={blankString}
                  addLabel="Add reason"
                  getKey={(_item, i) => i}
                  renderItem={(item, index) => (
                    <li className="flex items-start gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" aria-hidden="true" />
                      <EditableText path={`repairVsReplace.repairWhen[${index}]`} placeholder="Reason…">
                        {item}
                      </EditableText>
                    </li>
                  )}
                />
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-brand/15 bg-brand-soft p-6 shadow-card">
              <h3 className="flex items-center gap-2 cgd-h3 text-base text-brand">
                <RefreshCw className="h-4.5 w-4.5" aria-hidden="true" />
                Replacement may be better when
              </h3>
              <ul className="mt-4 space-y-3">
                <EditableList<string>
                  path="repairVsReplace.replaceWhen"
                  items={replaceWhen}
                  itemTemplate={blankString}
                  addLabel="Add reason"
                  getKey={(_item, i) => i}
                  renderItem={(item, index) => (
                    <li className="flex items-start gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
                      <EditableText path={`repairVsReplace.replaceWhen[${index}]`} placeholder="Reason…">
                        {item}
                      </EditableText>
                    </li>
                  )}
                />
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
