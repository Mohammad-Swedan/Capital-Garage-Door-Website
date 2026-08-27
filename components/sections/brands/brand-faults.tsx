import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { resolvePageIcon } from "@/components/page/icons";
import type { BrandEntity, BrandFault } from "@/types/brand";

interface BrandFaultsProps {
  entity: BrandEntity;
  faults: BrandFault[];
}

/**
 * The symptoms people actually search for, each pointing at the matching `/problems/{slug}` page.
 * A fault with no problem page renders as a plain (unlinked) card rather than a dead link.
 */
export function BrandFaults({ entity, faults }: BrandFaultsProps) {
  if (faults.length === 0) return null;

  return (
    <section className="bg-muted/40">
      <Container className="py-12 sm:py-16">
        <SectionHeading
          eyebrow="Symptoms"
          title={`Common ${entity.name} faults we fix`}
          description="Recognise one of these? Tap through for what causes it and what the repair involves."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faults.map((fault, i) => {
            const Icon = resolvePageIcon(fault.icon);
            const inner = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cta/10 text-cta">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-heading text-[15px] leading-snug font-semibold text-foreground">
                  {fault.label}
                </span>
              </>
            );
            return (
              <Reveal key={fault.label} delay={0.04 * i} className="h-full">
                <li className="h-full">
                  {fault.problemSlug ? (
                    <Link
                      href={`/problems/${fault.problemSlug}`}
                      className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:border-[#0f4e9b]/30 hover:shadow-[0_14px_30px_rgba(13,31,69,0.1)]"
                    >
                      {inner}
                      <ArrowUpRight
                        className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[#0f4e9b]"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <div className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-foreground/5">
                      {inner}
                    </div>
                  )}
                </li>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
