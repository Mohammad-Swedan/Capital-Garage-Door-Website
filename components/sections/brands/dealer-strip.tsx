import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { brandPageHref } from "@/lib/data/brands";
import { BrandMark } from "./brand-mark";
import type { BrandEntity, BrandKind } from "@/types/brand";

interface DealerStripProps {
  /** Every brand entity — the dealership claim isn't kind-specific, so it isn't filtered by kind. */
  entities: BrandEntity[];
  kind: BrandKind;
}

/**
 * The eight brands Capital is an authorised dealer for — the one claim on these hubs that is
 * about us rather than the manufacturers, so it sits apart from the wall.
 *
 * Each card links to the deepest thing we have for that brand: its guide for this hub's kind,
 * failing that its guide for the other kind, failing that the manufacturer's own site (an
 * outbound link an E-E-A-T audit asked for — a dealership claim should be checkable).
 */
export function DealerStrip({ entities, kind }: DealerStripProps) {
  const other: BrandKind = kind === "motor" ? "door" : "motor";
  const dealers = entities
    .filter((e) => e.dealer)
    .map((entity) => {
      const internal = brandPageHref(entity.slug, kind) ?? brandPageHref(entity.slug, other);
      return { entity, internal, external: internal ? undefined : entity.url };
    });

  if (dealers.length === 0) return null;

  return (
    <section className="bg-background py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Authorised dealer for"
          title="The brands we supply new, not just repair"
          description="For these manufacturers we're an authorised dealer — new doors and openers, warranty-backed, fitted by our own technicians. Every other brand on this page we service and repair."
        />

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {dealers.map(({ entity, internal, external }, i) => {
            const inner = (
              <>
                <BrandMark entity={entity} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-sm font-bold text-foreground">
                    {entity.name}
                  </span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                    Authorised dealer
                  </span>
                </span>
              </>
            );
            const shell =
              "flex h-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-600/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none";
            return (
              <li key={entity.slug}>
                <Reveal delay={0.03 * i} className="h-full">
                  {internal ? (
                    <Link href={internal} prefetch={false} className={shell}>
                      {inner}
                    </Link>
                  ) : external ? (
                    <a
                      href={external}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${entity.name} official website`}
                      className={shell}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={shell}>{inner}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
