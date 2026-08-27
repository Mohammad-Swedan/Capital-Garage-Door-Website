import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { MOTOR_IMAGES, MOTORS_PATH } from "@/components/sections/motors/motor-data";
import type { BrandDecision as BrandDecisionData, BrandEntity } from "@/types/brand";

interface BrandDecisionProps {
  entity: BrandEntity;
  decision: BrandDecisionData;
  /** Resolved `motor-replace` guide range, e.g. "$770–$990". Absent when the catalog has no row. */
  capitalMotorRange?: string;
}

/**
 * Motor pages only: the honest repair-vs-replace call, stated as two lists rather than a sales
 * pitch, with the Capital range offered as the upgrade path when replacement is the right answer.
 * Prices are resolved from the pricing catalog upstream — never written into this component.
 */
export function BrandDecision({ entity, decision, capitalMotorRange }: BrandDecisionProps) {
  if (decision.repairWhen.length === 0 && decision.replaceWhen.length === 0) return null;

  return (
    <section className="bg-background">
      <Container className="py-12 sm:py-16">
        <SectionHeading
          eyebrow="Repair or replace"
          title={`Repair your ${entity.name}, or upgrade to a Capital motor?`}
          description="Most call-outs end in a repair. Here's how we decide — and what we'd say if it were our garage."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="grid gap-5 sm:grid-cols-2">
            {decision.repairWhen.length > 0 && (
              <Reveal className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Repair it when…
                  </h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {decision.repairWhen.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {decision.replaceWhen.length > 0 && (
              <Reveal delay={0.08} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Replace it when…
                  </h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {decision.replaceWhen.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cta/12 text-cta">
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.12} className="h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/60 to-muted/20">
                <Image
                  src={MOTOR_IMAGES.studio.src}
                  alt={MOTOR_IMAGES.studio.alt}
                  title="Capital 1100N and 1500N garage door motors"
                  fill
                  quality={75}
                  sizes="(min-width:1024px) 30vw, 90vw"
                  className="object-contain p-4"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Capital 1100N &amp; 1500N
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Our own belt-drive range — soft start and stop, app control, LED light and
                  auto-reverse safety, fitted by the same technician who quoted it.
                </p>
                {capitalMotorRange && (
                  <p className="text-sm font-bold text-cta">from {capitalMotorRange} installed</p>
                )}
                <Link
                  href={MOTORS_PATH}
                  className="group mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[#0f4e9b] hover:underline"
                >
                  See the Capital motor range
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
