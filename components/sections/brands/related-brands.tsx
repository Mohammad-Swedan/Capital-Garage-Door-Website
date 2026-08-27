import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { BrandMark } from "./brand-mark";
import type { BrandEntity, BrandHub } from "@/types/brand";

interface RelatedBrandsProps {
  hub: BrandHub;
  brands: { entity: BrandEntity; href: string }[];
}

/**
 * Sideways links to the other brands of the same kind, plus the hub. Visitors often arrive here
 * having guessed the brand on their door; these chips let them correct course in one tap, and
 * they knit the brand cluster together for crawlers.
 */
export function RelatedBrands({ hub, brands }: RelatedBrandsProps) {
  if (brands.length === 0) return null;

  return (
    <section className="bg-muted/40">
      <Container className="py-12 sm:py-16">
        <SectionHeading
          eyebrow="Other brands"
          title={`Other ${hub.kind} brands we service in Perth`}
          description="Not the brand on your door? Pick the right one — every page covers the same repairs, parts and pricing."
        />
        <nav aria-label={`Other ${hub.kind} brands`} className="mt-8">
          <ul className="flex flex-wrap gap-3">
            {/* Reveal renders a <div>, so it must sit INSIDE the <li> — ul > div > li is invalid. */}
            {brands.map(({ entity, href }, i) => (
              <li key={entity.slug}>
                <Reveal delay={0.04 * i}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-card py-2.5 pr-5 pl-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0f4e9b]/30 hover:text-[#0f4e9b] hover:shadow-md"
                  >
                    <BrandMark entity={entity} size="sm" />
                    {entity.name}
                  </Link>
                </Reveal>
              </li>
            ))}
            <li>
              <Reveal delay={0.04 * brands.length}>
                <Link
                  href={`/${hub.slug}`}
                  className="group flex h-full items-center gap-2 rounded-2xl border border-[#0f4e9b]/25 bg-[#0f4e9b]/8 px-5 py-2.5 text-sm font-bold text-[#0f4e9b] transition-all hover:-translate-y-0.5 hover:bg-[#0f4e9b]/12"
                >
                  All {hub.shortName}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Reveal>
            </li>
          </ul>
        </nav>
      </Container>
    </section>
  );
}
