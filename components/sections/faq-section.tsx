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
import type { FAQ } from "@/types";

interface FAQSectionProps {
  faqs: FAQ[];
  heading?: string;
}

/** FAQ accordion + matching FAQPage JSON-LD — content is real server HTML for SEO/AEO. */
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
            defaultValue={[faqs[0]?.question]}
            className="rounded-2xl border border-border bg-card px-5 sm:px-7"
          >
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="font-heading text-base font-semibold text-foreground sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
