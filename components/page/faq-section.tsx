import { Container } from "@/components/layout/container";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/page/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/seo/schema";
import type { FAQ } from "@/types";

interface FAQSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  faqs: FAQ[];
  /** Emit FAQPage JSON-LD (default true). Disable if another node covers it. */
  emitSchema?: boolean;
}

/** FAQ accordion + FAQPage JSON-LD. Questions/answers render as real HTML. */
export function FAQSection({
  eyebrow,
  title,
  description,
  faqs,
  emitSchema = true,
}: FAQSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="bg-background">
      {emitSchema && <JsonLd data={faqSchema(faqs)} />}
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-card px-5 shadow-sm ring-1 ring-foreground/5 sm:px-7">
          <Accordion>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={i}>
                <AccordionTrigger className="py-5 text-base font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
