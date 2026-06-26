import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import type { LocalLink } from "@/types";

interface ServiceAreaGridProps {
  eyebrow?: string;
  title: string;
  description?: string;
  suburbs: LocalLink[];
}

/** Nearby-suburb internal links — local-SEO interlinking as a tidy pill grid. */
export function ServiceAreaGrid({ eyebrow, title, description, suburbs }: ServiceAreaGridProps) {
  return (
    <section className="bg-background">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <nav aria-label="Nearby suburbs" className="mt-8">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {suburbs.map((suburb, i) => (
              <Reveal key={suburb.label} delay={0.03 * i}>
                <li>
                  <Link
                    href={suburb.href}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-surface-elevated px-4 py-3 text-sm font-semibold text-foreground shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:text-brand hover:shadow-elevated"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand" aria-hidden="true" />
                      {suburb.label}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
