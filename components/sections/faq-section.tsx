"use client";

import { HelpCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditableFaqList } from "@/components/admin/editor/editable";
import type { FAQ } from "@/types";

interface FAQSectionProps {
  faqs: FAQ[];
  heading?: string;
}

/**
 * FAQ accordion — content is real server HTML for SEO/AEO.
 *
 * FAQPage JSON-LD is no longer emitted here: structured data is emitted at the
 * route level via `<PageSchema>` (components/seo/page-schema.tsx) so schema and
 * visuals never share a file. The accordion itself is left UNTOUCHED so its
 * `<button>` trigger structure stays valid and the public render is byte-identical.
 * In the in-place editor, `EditableFaqList` renders an editing-only Q/A editor
 * (with add/remove/reorder) below the accordion; it renders nothing when not
 * editing. The list serializes to the editor's `faqs` array, not to `data`.
 */
export function FAQSection({ faqs, heading = "Frequently Asked Questions" }: FAQSectionProps) {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Reveal className="flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-brand">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="cgd-eyebrow">Questions &amp; Answers</span>
          </span>
          <h2 className="cgd-h2 text-balance text-foreground">
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <Accordion
            multiple
            defaultValue={faqs.length ? ["faq-0"] : []}
            className="overflow-hidden rounded-3xl border border-border/70 bg-surface-elevated px-5 elevate-card sm:px-7"
          >
            {faqs.map((faq, index) => (
              // Key/value by index, not question text: a freshly seeded blank page
              // has empty (and therefore duplicate) questions until the editor fills them.
              <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
                <AccordionTrigger className="cgd-h3 text-base text-foreground sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="cgd-lead text-[0.975rem] text-muted-foreground">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <EditableFaqList path="faqs" count={faqs.length} />
        </Reveal>
      </Container>
    </section>
  );
}
