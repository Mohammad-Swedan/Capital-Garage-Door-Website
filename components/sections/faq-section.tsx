"use client";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/seo/schema";
import { EditableFaqList } from "@/components/admin/editor/editable";
import type { FAQ } from "@/types";

interface FAQSectionProps {
  faqs: FAQ[];
  heading?: string;
}

/**
 * FAQ accordion + matching FAQPage JSON-LD — content is real server HTML for SEO/AEO.
 *
 * FAQs are a relational pin. The accordion itself is left UNTOUCHED so its
 * `<button>` trigger structure stays valid and the public render is byte-identical.
 * In the in-place editor, `EditableFaqList` renders an editing-only Q/A editor
 * (with add/remove/reorder) below the accordion; it renders nothing when not
 * editing. The list serializes to the editor's `faqs` array, not to `data`.
 */
export function FAQSection({ faqs, heading = "Frequently Asked Questions" }: FAQSectionProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <JsonLd data={faqSchema(faqs)} />
      <Container className="max-w-3xl">
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-6">
          <Accordion
            multiple
            defaultValue={faqs.length ? ["faq-0"] : []}
            className="rounded-2xl border border-border bg-card px-5 sm:px-7"
          >
            {faqs.map((faq, index) => (
              // Key/value by index, not question text: a freshly seeded blank page
              // has empty (and therefore duplicate) questions until the editor fills them.
              <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
                <AccordionTrigger className="font-heading text-base font-semibold text-foreground sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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
