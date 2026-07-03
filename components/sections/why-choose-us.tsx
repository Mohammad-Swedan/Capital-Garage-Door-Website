"use client";

import { useEffect, useRef, useState } from "react";
import {
  Award,
  Check,
  Clock3,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

// Unified brand navy for every step's icon, numeral and bullets (red is reserved for CTAs).
const STEP_COLORS = ["#1b3b8c", "#1b3b8c", "#1b3b8c", "#1b3b8c"] as const;
const STEP_TINTS = ["#e8effa", "#e8effa", "#e8effa", "#e8effa"] as const;
const STEP_ICONS: LucideIcon[] = [ShieldCheck, Clock3, Tag, Award];

interface Reason {
  title: string;
  tagline: string;
  description: string;
  points: string[];
  icon: LucideIcon;
}

const reasons: Reason[] = [
  {
    title: "Licensed, Bonded & Insured",
    tagline: "Work you can trust",
    description:
      "Every technician we send is fully licensed and insured, so you're protected from the moment we step onto your property.",
    points: [
      "Background-checked, factory-trained technicians",
      "Fully insured for your peace of mind",
      "Workmanship that meets manufacturer standards",
    ],
    icon: ShieldCheck,
  },
  {
    title: "Same-Day Emergency Service",
    tagline: "Fast when it matters",
    description:
      "A garage door that won't open is a security risk and a hassle. We prioritize urgent calls and aim to be at your door the same day.",
    points: [
      "Emergency callouts 7 days a week",
      "Stocked vans for on-the-spot repairs",
      "Upfront arrival windows, not vague promises",
    ],
    icon: Clock3,
  },
  {
    title: "Honest, Upfront Pricing",
    tagline: "No surprises",
    description:
      "You'll know the full cost before any work begins. We quote the job, not the hours, so there's never a surprise on the invoice.",
    points: [
      "Free, no-obligation estimates",
      "Flat-rate pricing agreed before we start",
      "No hidden callout or travel fees",
    ],
    icon: Tag,
  },
  {
    title: "Lifetime Workmanship Warranty",
    tagline: "Backed for the long run",
    description:
      "We stand behind every repair and installation with a warranty that protects your investment long after we've left the driveway.",
    points: [
      "Lifetime warranty on workmanship",
      "Manufacturer warranties honored on parts",
      "Free follow-up if anything isn't right",
    ],
    icon: Award,
  },
];

export function WhyChooseUs() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Framer-free scroll tracking: a passive, rAF-throttled listener marks the
  // reason card nearest the viewport centre as active. No animation library
  // here means nothing extra to hydrate (mobile TBT); the numeral, icon and
  // rail crossfade/fill purely in CSS off `activeStep`.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const cards = cardRefs.current;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (!c) continue;
        const r = c.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
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

  const progressPct = `${((activeStep + 1) / reasons.length) * 100}%`;

  return (
    <section className="relative bg-background border-t border-border py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="grid gap-6 md:grid-cols-12 mb-8 md:mb-12">
          <Reveal className="md:col-span-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-[0.2em] text-cta uppercase">
                Why Choose Us
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-foreground">
                Reasons Perth Homeowners Trust Us
              </h2>
              <p className="mt-3 text-muted-foreground text-base">
                Four reasons to call us first when something goes wrong with
                your garage door.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          {/* ----- Sticky left: giant numeral — DESKTOP ONLY ----- */}
          <div className="hidden md:block md:col-span-5">
            <div className="sticky top-24 relative h-[calc(100vh-12rem)] flex items-start">
              {/* Vertical progress rail */}
              <div className="absolute left-0 top-0 h-full w-[2px] overflow-hidden bg-border rounded-full">
                <div
                  style={{ height: progressPct, backgroundColor: STEP_COLORS[0] }}
                  className="w-full origin-top transition-[height] duration-500 ease-out"
                />
              </div>

              {/* Stop-dots along the rail */}
              <div className="absolute left-[-3px] top-0 h-full pointer-events-none">
                {STEP_COLORS.map((c, i) => (
                  <span
                    key={c + i}
                    className="absolute h-2 w-2 rounded-full ring-2 ring-background"
                    style={{
                      top: `${i * 33.33}%`,
                      transform: "translateY(-50%)",
                      backgroundColor: c,
                    }}
                  />
                ))}
              </div>

              <div className="pl-12 relative w-full">
                {/* Soft background halo */}
                <div
                  style={{ backgroundColor: STEP_TINTS[0] }}
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

          {/* ----- Right: step panels ----- */}
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
                  style={{ width: progressPct, backgroundColor: STEP_COLORS[0] }}
                  className="h-full origin-left transition-[width] duration-500 ease-out"
                />
              </div>
            </div>

            <div className="space-y-10 md:space-y-16">
              {reasons.map((reason, i) => {
                const Icon = STEP_ICONS[i];
                const color = STEP_COLORS[i];
                const tint = STEP_TINTS[i];

                return (
                  <Reveal key={reason.title} delay={0.05}>
                    <article
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                      className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-(--card-accent) hover:shadow-xl md:p-6 lg:p-7"
                      style={{ ["--card-accent" as string]: color }}
                    >
                      {/* Soft brand-tinted wash in the corner */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-60"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${tint}, transparent 55%)`,
                        }}
                      />

                      {/* Left accent ribbon */}
                      <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] overflow-hidden">
                        <span
                          className="cgd-why-ribbon block h-full w-full origin-top"
                          style={{ backgroundColor: color }}
                        />
                      </div>

                      <div className="relative z-10">
                        {/* Header: icon badge + meta */}
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-105 md:h-12 md:w-12"
                            style={{
                              backgroundColor: tint,
                              color,
                              boxShadow: `inset 0 0 0 1px ${color}1f`,
                            }}
                          >
                            <Icon
                              className="h-5 w-5 md:h-6 md:w-6"
                              strokeWidth={2.25}
                            />
                          </span>
                          <div className="flex flex-col gap-1">
                            <span
                              className="inline-flex w-fit items-center justify-center h-5 px-2 rounded-full font-mono text-[10px] font-semibold uppercase tracking-widest"
                              style={{ backgroundColor: tint, color }}
                            >
                              0{i + 1} / 04
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                              {reason.tagline}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-heading text-[clamp(1.25rem,2.6vw,1.75rem)] font-bold leading-[1.15] mb-3">
                          {reason.title}
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
                          {reason.description}
                        </p>

                        {/* Deliverables/points */}
                        <ul className="mt-5 grid gap-3 border-t border-border/70 pt-5 sm:grid-cols-1">
                          {reason.points.map((point) => (
                            <li key={point} className="flex items-start gap-3">
                              <div
                                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                                style={{ backgroundColor: tint, color }}
                              >
                                <Check className="h-3 w-3" strokeWidth={3} />
                              </div>
                              <span className="text-sm text-foreground font-medium leading-relaxed">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
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
          style={{ opacity: active === i ? 1 : 0, color: STEP_COLORS[i] }}
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
          style={{
            opacity: active === i ? 1 : 0,
            backgroundColor: STEP_TINTS[i],
            color: STEP_COLORS[i],
          }}
          className="absolute inset-0 flex items-center justify-center rounded-2xl transition-opacity duration-300 ease-out"
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      ))}
    </div>
  );
}
