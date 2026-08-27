import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { HoverPrefetchLink } from "@/components/ui/hover-prefetch-link";
import { getBrandEntities, getBrandHub, brandPageHref } from "@/lib/data/brands";
import { BrandMark } from "./brand-mark";
import type { BrandKind } from "@/types/brand";

interface BrandStripProps {
  kind: BrandKind;
  title: string;
  description: string;
}

/**
 * A compact cross-link strip for a non-brand page (currently the motors product page): every
 * entity of `kind` that has a guide page, as a chip linking straight to it, plus a final chip to
 * the hub. Server component — reads the brand registry directly, no client state.
 */
export async function BrandStrip({ kind, title, description }: BrandStripProps) {
  const entities = await getBrandEntities();
  const hub = getBrandHub(kind);
  const linked = entities
    .filter((e) => e.kinds.includes(kind))
    .map((entity) => ({ entity, href: brandPageHref(entity.slug, kind) }))
    .filter((x): x is { entity: (typeof entities)[number]; href: string } => Boolean(x.href));

  if (linked.length === 0) return null;

  return (
    <section className="bg-muted/30">
      <Container className="py-12 sm:py-16">
        <SectionHeading title={title} description={description} />
        <Reveal delay={0.05}>
          <ul className="mt-8 flex flex-wrap gap-3">
            {linked.map(({ entity, href }) => (
              <li key={entity.slug}>
                <HoverPrefetchLink
                  href={href}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-card py-1.5 pr-4 pl-1.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0f4e9b]/30 hover:text-[#0f4e9b]"
                >
                  <BrandMark entity={entity} size="sm" />
                  {entity.name}
                </HoverPrefetchLink>
              </li>
            ))}
            <li>
              <HoverPrefetchLink
                href={`/${hub.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-[#0f4e9b]/30 bg-[#0f4e9b]/5 px-4 py-2.5 text-sm font-semibold text-[#0f4e9b] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0f4e9b]/10"
              >
                All {hub.shortName}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </HoverPrefetchLink>
            </li>
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
