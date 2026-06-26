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
        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-border/70 bg-surface-elevated px-5 elevate-card sm:px-7">
          <Accordion>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={i}>
                <AccordionTrigger className="py-5 cgd-h3 text-base text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="cgd-lead text-[0.975rem] text-muted-foreground">
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
