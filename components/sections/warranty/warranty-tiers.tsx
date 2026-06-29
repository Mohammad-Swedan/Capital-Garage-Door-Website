import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { cn } from "@/lib/utils";

export interface WarrantyTier {
  name: string;
  /** Headline length of cover, e.g. "5 Years". */
  duration: string;
  tagline: string;
  features: string[];
  /** Small qualifying line shown under the features. */
  conditions?: string;
  /** Highlights the card (primary ring + accent) — use for the upsell tier. */
  highlighted?: boolean;
  /** Optional pill shown above the name, e.g. "Requires yearly maintenance". */
  badge?: string;
}

interface WarrantyTiersProps {
  eyebrow?: string;
  title: string;
  description?: string;
  tiers: WarrantyTier[];
}

/**
 * Two-tier warranty comparison (Standard vs Extended). Bespoke to the warranty
 * page — the highlighted tier carries a primary ring and a qualifying badge.
 */
export function WarrantyTiers({ eyebrow, title, description, tiers }: WarrantyTiersProps) {
  return (
    <section className="bg-muted/30">
      <Container className="py-14 sm:py-20">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" />
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2 sm:gap-6">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={0.06 * i} className="h-full">
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border bg-card p-6 shadow-sm sm:p-8",
                  tier.highlighted
                    ? "border-primary/30 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                    : "border-border ring-1 ring-foreground/5",
                )}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    {tier.badge}
                  </span>
                )}

                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    tier.highlighted ? "bg-primary/10 text-primary" : "bg-foreground/5 text-foreground/70",
                  )}
                >
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>

                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{tier.name}</h3>
                <p className="mt-1 font-display text-4xl font-black tracking-tight text-foreground">
                  {tier.duration}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tier.tagline}</p>

                <ul className="mt-5 flex flex-1 flex-col gap-3 border-t border-border pt-5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          tier.highlighted ? "text-primary" : "text-emerald-600",
                        )}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.conditions && (
                  <p className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                    {tier.conditions}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
