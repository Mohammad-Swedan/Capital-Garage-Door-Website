import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import type { LocalLink } from "@/types";

interface RelatedServicesProps {
  eyebrow?: string;
  title: string;
  description?: string;
  links: LocalLink[];
}

/** Internal-link cards to related service / location pages (SEO interlinking). */
export function RelatedServices({ eyebrow, title, description, links }: RelatedServicesProps) {
  return (
    <section className="bg-background">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link, i) => (
            <Reveal key={link.href + i} delay={0.04 * i} className="h-full">
              <Link
                href={link.href}
                className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-5 elevate-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-float"
              >
                <span className="cgd-h3 text-base text-foreground transition-colors group-hover:text-brand">
                  {link.label}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRight className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
