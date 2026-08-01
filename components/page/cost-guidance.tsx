"use client";

import { Check, MessageSquare } from "lucide-react";
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

/**
 * Cost-guidance section: a crawlable guide-price table (when the page has
 * pricing pins) plus what the final price depends on, and a clear CTA.
 *
 * Every SERP for these suburbs shows "{suburb} cost / prices / price list" in
 * its related searches, so the table answers the top follow-up question on the
 * page itself. Prices come from the CMS pricing catalog via
 * lib/cms/map-service-suburb-page.ts — never hand-written.
 */
export function CostGuidance({ title, eyebrow, data, ctaText }: CostGuidanceProps) {
  const rows = data.rows ?? [];
  return (
    <section className="bg-muted/40">
      <Container className="py-12 sm:py-16">
        {rows.length > 0 && (
          <Reveal className="mb-10 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-sm sm:text-base">
              <caption className="sr-only">{title} — guide prices</caption>
              <thead>
                <tr className="bg-primary/5">
                  <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                    Repair
                  </th>
                  <th scope="col" className="px-4 py-3 font-heading font-semibold text-foreground sm:px-6 sm:py-4">
                    Guide Price
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 py-3 font-heading font-semibold text-foreground sm:table-cell sm:px-6 sm:py-4"
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground sm:px-6 sm:py-4">{row.label}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap text-cta sm:px-6 sm:py-4">
                      {row.price}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell sm:px-6 sm:py-4">
                      {row.note ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-6">
              Guide prices only — the final cost is confirmed on inspection before any work begins.
            </p>
          </Reveal>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12">
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} description={data.intro} />
            {data.note && (
              <Reveal delay={0.1}>
                <p className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#0f4e9b]/15 bg-[#0f4e9b]/5 px-4 py-2.5 text-sm font-semibold text-[#0f4e9b]">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  <EditableText path="costGuidance.note" placeholder="Cost note…">
                    {data.note}
                  </EditableText>
                </p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-7">
              <p className="text-sm font-bold tracking-wide text-foreground/70 uppercase">
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
