import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";

interface SuburbChipsProps {
  heading: string;
  description?: string;
  suburbs: string[];
}

/**
 * Service-area chips. On paid landing pages these scroll to the on-page form
 * (#quote) rather than linking out to other pages — keeping the visitor focused
 * on converting while still signalling strong local coverage for GEO relevance.
 */
export function SuburbChips({ heading, description, suburbs }: SuburbChipsProps) {
  return (
    <section className="bg-background">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow="Service Areas" title={heading} description={description} />
        <Reveal className="mt-8">
          <ul className="flex flex-wrap gap-2.5">
            {suburbs.map((suburb) => (
              <li key={suburb}>
                <a
                  href="#quote"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {suburb}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
