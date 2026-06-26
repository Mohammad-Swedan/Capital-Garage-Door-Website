import { Container } from "@/components/layout/container";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/page/section-heading";
import type { FAQ } from "@/types";

interface FAQSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  faqs: FAQ[];
}

/**
 * FAQ accordion. Questions/answers render as real HTML for SEO/AEO; the matching
 * FAQPage JSON-LD is emitted at the route level via `<PageSchema>`
 * (components/seo/page-schema.tsx), keeping schema and visuals in separate files.
 */
export function FAQSection({
  eyebrow,
  title,
  description,
  faqs,
}: FAQSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section className="bg-background">
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
