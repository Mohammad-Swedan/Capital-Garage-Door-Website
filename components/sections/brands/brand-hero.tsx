import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/layout/container";
import { CallNowButton, RequestQuoteButton } from "@/components/page/cta-buttons";
import { resolvePageIcon } from "@/components/page/icons";
import { BrandPlate } from "./brand-plate";
import type { BrandEntity, BrandPage } from "@/types/brand";

interface BrandHeroProps {
  page: BrandPage;
  entity: BrandEntity;
}

/**
 * Brand page hero. Same light, grid-and-glow ground as `PageHero`, but the right column is the
 * brand's own identity card (`BrandPlate`) instead of the Perth map — on a brand page the first
 * question is "is this my brand?", and the plate answers it with the logo/monogram and the facts.
 *
 * Server-rendered: the H1, subtitle and pills are in the initial HTML.
 */
export function BrandHero({ page, entity }: BrandHeroProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.06)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_70%_at_50%_0%,black_30%,transparent_85%)]" />
        <div className="absolute -top-24 left-1/3 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute top-1/4 -right-16 h-72 w-72 rounded-full bg-[#0f4e9b]/10 blur-3xl" />
      </div>

      <Container className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="flex max-w-xl flex-col items-start gap-5 sm:gap-6">
            <Reveal>
              <p className="text-[11px] font-bold tracking-[0.22em] text-cta uppercase">
                {page.kind === "motor" ? "Motor" : "Door"} brand guide · Perth
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="text-balance font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.06] font-black tracking-tight text-foreground">
                {page.hero.h1}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                {page.hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <CallNowButton />
                <RequestQuoteButton />
              </div>
            </Reveal>

            {page.hero.pills.length > 0 && (
              <Reveal delay={0.24}>
                <ul className="flex flex-wrap gap-2 pt-1">
                  {page.hero.pills.map((pill) => {
                    const Icon = resolvePageIcon(pill.icon);
                    return (
                      <li
                        key={pill.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground/80"
                      >
                        <Icon className="h-3.5 w-3.5 text-[#0f4e9b]" aria-hidden="true" />
                        {pill.label}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.1} className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <BrandPlate entity={entity} quickFacts={page.quickFacts} kind={page.kind} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
