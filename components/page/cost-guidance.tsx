"use client";

import { Check, Camera } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { CallNowButton, RequestQuoteButton } from "@/components/page/cta-buttons";
import { EditableText, EditableList } from "@/components/admin/editor/editable";
import type { CostGuidance as CostGuidanceData } from "@/types";

interface CostGuidanceProps {
  title: string;
  eyebrow?: string;
  data: CostGuidanceData;
  /** CTA copy, e.g. "Request a quote for your Joondalup property." */
  ctaText: string;
}

/** Cost-guidance section: explains what price depends on, with a clear CTA. */
export function CostGuidance({ title, eyebrow, data, ctaText }: CostGuidanceProps) {
  return (
    <section className="bg-surface-muted">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} description={data.intro} />
            {data.note && (
              <Reveal delay={0.1}>
                <p className="mt-5 inline-flex items-center gap-2 rounded-xl border border-brand/15 bg-brand-soft px-4 py-2.5 text-sm font-semibold text-brand shadow-card">
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  <EditableText path="costGuidance.note" placeholder="Cost note…">
                    {data.note}
                  </EditableText>
                </p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.08}>
            <div className="rounded-3xl border border-border/70 bg-surface-elevated p-6 elevate-card sm:p-7">
              <p className="cgd-eyebrow text-muted-foreground">
                Your quote depends on
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                <EditableList<string>
                  path="costGuidance.factors"
                  items={data.factors}
                  itemTemplate={() => ""}
                  addLabel="Add factor"
                  getKey={(_f, i) => i}
                  renderItem={(factor, i) => (
                    <li className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <EditableText path={`costGuidance.factors[${i}]`} singleLine placeholder="Cost factor…">
                        {factor}
                      </EditableText>
                    </li>
                  )}
                />
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <RequestQuoteButton className="w-full sm:w-auto" />
                <CallNowButton className="w-full sm:w-auto" />
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">{ctaText}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
