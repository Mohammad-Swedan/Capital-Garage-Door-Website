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
                className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:border-[#0f4e9b]/30 hover:shadow-[0_14px_30px_rgba(13,31,69,0.1)]"
              >
                <span className="font-heading text-base font-semibold text-foreground group-hover:text-[#0f4e9b]">
                  {link.label}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f4e9b]/10 text-[#0f4e9b] transition-colors group-hover:bg-[#0f4e9b] group-hover:text-white">
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
