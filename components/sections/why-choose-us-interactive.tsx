"use client";

import { useEffect, useState, type ReactNode } from "react";
import { STEP_ICONS, NAVY, TINT } from "./why-choose-us-constants";

/**
 * Client island for <WhyChooseUs>. Owns the scroll-linked numeral + progress
 * rail; the reason cards are passed in as `cards` (server-rendered) so their
 * large DOM never hydrates — this island reads their positions from the DOM via
 * the `[data-why-card]` attribute instead of React refs. A passive, rAF-throttled
 * scroll listener marks the card nearest the viewport centre as active.
 */
export function WhyChooseUsInteractive({
  cards,
  count,
}: {
  cards: ReactNode;
  count: number;
}) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const els = document.querySelectorAll<HTMLElement>("[data-why-card]");
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      els.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveStep(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const progressPct = `${((activeStep + 1) / count) * 100}%`;

  return (
    <div className="grid gap-8 md:grid-cols-12">
      {/* ----- Sticky left: giant numeral — DESKTOP ONLY ----- */}
      <div className="hidden md:block md:col-span-5">
        <div className="sticky top-24 relative h-[calc(100vh-12rem)] flex items-start">
          {/* Vertical progress rail */}
          <div className="absolute left-0 top-0 h-full w-[2px] overflow-hidden bg-border rounded-full">
            <div
              style={{ height: progressPct, backgroundColor: NAVY }}
              className="w-full origin-top transition-[height] duration-500 ease-out"
            />
          </div>

          {/* Stop-dots along the rail */}
          <div className="absolute left-[-3px] top-0 h-full pointer-events-none">
            {Array.from({ length: count }).map((_, i) => (
              <span
                key={i}
                className="absolute h-2 w-2 rounded-full ring-2 ring-background"
                style={{
                  top: `${i * (100 / count)}%`,
                  transform: "translateY(-50%)",
                  backgroundColor: NAVY,
                }}
              />
            ))}
          </div>

          <div className="pl-12 relative w-full">
            {/* Soft background halo */}
            <div
              style={{ backgroundColor: TINT }}
              className="pointer-events-none absolute -inset-8 rounded-[4rem] blur-3xl opacity-50"
              aria-hidden
            />

            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                Reason
              </p>
              <div className="font-heading text-[8rem] lg:text-[10rem] leading-none font-bold tabular-nums tracking-tighter">
                <StickyDigit active={activeStep} />
              </div>
              <div className="mt-4 h-10">
                <ActiveIcon active={activeStep} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----- Right: mobile counter strip + the (server-rendered) cards ----- */}
      <div className="md:col-span-7 md:py-6 relative">
        {/* MOBILE-ONLY sticky counter strip */}
        <div className="md:hidden sticky top-16 z-20 -mx-6 mb-4 px-6 py-3 bg-background/95 border-y border-border">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-baseline gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Reason
              </p>
              <div className="font-heading text-3xl font-bold leading-none">
                <StickyDigit active={activeStep} prefixZero />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                / 04
              </span>
            </div>
          </div>

          {/* Horizontal progress rail */}
          <div className="relative mt-3 h-[2px] w-full overflow-hidden bg-border rounded-full">
            <div
              style={{ width: progressPct, backgroundColor: NAVY }}
              className="h-full origin-left transition-[width] duration-500 ease-out"
            />
          </div>
        </div>

        {cards}
      </div>
    </div>
  );
}

/** Number crossfader — shows the active step's digit via CSS opacity. */
function StickyDigit({
  active,
  prefixZero = false,
}: {
  active: number;
  prefixZero?: boolean;
}) {
  const widthCh = prefixZero ? "w-[2ch]" : "w-[1ch]";
  return (
    <span className={`relative inline-block h-[1em] align-top ${widthCh}`}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="absolute inset-0 transition-opacity duration-300 ease-out"
          style={{ opacity: active === i ? 1 : 0, color: NAVY }}
        >
          {prefixZero ? `0${i + 1}` : String(i + 1)}
        </span>
      ))}
    </span>
  );
}

/** Active-step icon crossfader — CSS opacity off `active`. */
function ActiveIcon({ active }: { active: number }) {
  return (
    <div className="relative h-10 w-10">
      {STEP_ICONS.map((Icon, i) => (
        <div
          key={i}
          style={{ opacity: active === i ? 1 : 0, backgroundColor: TINT, color: NAVY }}
          className="absolute inset-0 flex items-center justify-center rounded-2xl transition-opacity duration-300 ease-out"
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      ))}
    </div>
  );
}
