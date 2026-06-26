"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  m,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Award,
  Check,
  Clock3,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

// Brand distinct colors for each step.
// Alternating between Primary Blue and CTA Red.
const STEP_COLORS = ["#1b3b8c", "#c8222a", "#1b3b8c", "#c8222a"] as const;
const STEP_TINTS = ["#e8effa", "#fae8ea", "#e8effa", "#fae8ea"] as const;
const STEP_ICONS: LucideIcon[] = [ShieldCheck, Clock3, Tag, Award];

// Fallback card-center fractions (evenly spaced), used only until the real
// card heights are measured on mount — avoids a flash of misaligned numerals.
const FALLBACK_CENTERS = [0.125, 0.375, 0.625, 0.875];

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
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [centers, setCenters] = useState<number[]>(FALLBACK_CENTERS);
  const shouldReduceMotion = useReducedMotion();

  // The 4 cards rarely render at equal heights (titles/descriptions differ in
  // length), so assuming 4 even quarters of scroll desyncs the numeral from
  // the card actually on screen. Measure each card's real center instead.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const measure = () => {
      const panelRect = panel.getBoundingClientRect();
      if (panelRect.height === 0) return;
      const next = cardRefs.current.map((card, i) => {
        if (!card) return FALLBACK_CENTERS[i];
        const cardRect = card.getBoundingClientRect();
        const relativeCenter =
          cardRect.top - panelRect.top + cardRect.height / 2;
        return relativeCenter / panelRect.height;
      });
      if (next.every((n) => Number.isFinite(n))) setCenters(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  // Track scroll progress across the panel
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // stickyNum hits exactly k when card k is actually centered in the
  // viewport, regardless of how tall each card renders.
  const stickyNum = useTransform(scrollYProgress, centers, [1, 2, 3, 4]);

  const railColor = useTransform(
    stickyNum,
    [1, 2, 3, 4],
    [STEP_COLORS[0], STEP_COLORS[1], STEP_COLORS[2], STEP_COLORS[3]],
  );

  const haloColor = useTransform(
    stickyNum,
    [1, 2, 3, 4],
    [STEP_TINTS[0], STEP_TINTS[1], STEP_TINTS[2], STEP_TINTS[3]],
  );

  return (
    <section className="relative bg-background border-t border-border py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="grid gap-6 md:grid-cols-12 mb-8 md:mb-12">
          <Reveal className="md:col-span-12">
            <div className="max-w-2xl">
              <span className="cgd-eyebrow text-cta">
                Why Choose Us
              </span>
              <h2 className="mt-3 cgd-h2 text-balance text-foreground">
                Reasons Perth Homeowners Trust Us
              </h2>
              <p className="mt-3 cgd-lead text-muted-foreground">
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
                <m.div
                  style={{ height: lineHeight, backgroundColor: railColor }}
                  className="w-full origin-top"
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
                {/* Soft animated background halo */}
                <m.div
                  style={{ backgroundColor: haloColor }}
                  className="pointer-events-none absolute -inset-8 rounded-[4rem] blur-3xl opacity-50"
                  aria-hidden
                />

                <div className="relative">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Reason
                  </p>
                  <div className="font-heading text-[8rem] lg:text-[10rem] leading-none font-bold tabular-nums tracking-tighter">
                    <StickyDigit progress={stickyNum} />
                  </div>
                  <div className="mt-4 h-10">
                    <ActiveIcon progress={stickyNum} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----- Right: step panels ----- */}
          <div ref={panelRef} className="md:col-span-7 md:py-6 relative">
            {/* MOBILE-ONLY sticky counter strip */}
            <div className="md:hidden sticky top-16 z-20 -mx-6 mb-4 px-6 py-3 bg-background/95 border-y border-border">
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-baseline gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Reason
                  </p>
                  <div className="font-heading text-3xl font-bold leading-none">
                    <StickyDigit progress={stickyNum} prefixZero />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    / 04
                  </span>
                </div>
              </div>

              {/* Horizontal progress rail */}
              <div className="relative mt-3 h-[2px] w-full overflow-hidden bg-border rounded-full">
                <m.div
                  style={{ width: lineHeight, backgroundColor: railColor }}
                  className="h-full origin-left"
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
                        <m.span
                          initial={
                            shouldReduceMotion ? false : { scaleY: 0 }
                          }
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                          className="block h-full w-full origin-top"
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

/** Number crossfader component handling 1 to 4 steps */
function StickyDigit({
  progress,
  prefixZero = false,
}: {
  progress: MotionValue<number>;
  prefixZero?: boolean;
}) {
  const opacity1 = useTransform(progress, [1.35, 1.55], [1, 0]);
  const opacity2 = useTransform(
    progress,
    [1.45, 1.6, 2.35, 2.55],
    [0, 1, 1, 0],
  );
  const opacity3 = useTransform(
    progress,
    [2.45, 2.6, 3.35, 3.55],
    [0, 1, 1, 0],
  );
  const opacity4 = useTransform(progress, [3.45, 3.6], [0, 1]);

  const widthCh = prefixZero ? "w-[2ch]" : "w-[1ch]";
  const label = (n: 1 | 2 | 3 | 4) => (prefixZero ? `0${n}` : String(n));

  return (
    <span className={`relative inline-block h-[1em] align-top ${widthCh}`}>
      <m.span
        style={{ opacity: opacity1, color: STEP_COLORS[0] }}
        className="absolute inset-0"
      >
        {label(1)}
      </m.span>
      <m.span
        style={{ opacity: opacity2, color: STEP_COLORS[1] }}
        className="absolute inset-0"
      >
        {label(2)}
      </m.span>
      <m.span
        style={{ opacity: opacity3, color: STEP_COLORS[2] }}
        className="absolute inset-0"
      >
        {label(3)}
      </m.span>
      <m.span
        style={{ opacity: opacity4, color: STEP_COLORS[3] }}
        className="absolute inset-0"
      >
        {label(4)}
      </m.span>
    </span>
  );
}

/** Active-step icon crossfader */
function ActiveIcon({ progress }: { progress: MotionValue<number> }) {
  const opacity1 = useTransform(progress, [1.35, 1.55], [1, 0]);
  const opacity2 = useTransform(
    progress,
    [1.45, 1.6, 2.35, 2.55],
    [0, 1, 1, 0],
  );
  const opacity3 = useTransform(
    progress,
    [2.45, 2.6, 3.35, 3.55],
    [0, 1, 1, 0],
  );
  const opacity4 = useTransform(progress, [3.45, 3.6], [0, 1]);

  const items = [
    {
      Icon: STEP_ICONS[0],
      color: STEP_COLORS[0],
      tint: STEP_TINTS[0],
      o: opacity1,
    },
    {
      Icon: STEP_ICONS[1],
      color: STEP_COLORS[1],
      tint: STEP_TINTS[1],
      o: opacity2,
    },
    {
      Icon: STEP_ICONS[2],
      color: STEP_COLORS[2],
      tint: STEP_TINTS[2],
      o: opacity3,
    },
    {
      Icon: STEP_ICONS[3],
      color: STEP_COLORS[3],
      tint: STEP_TINTS[3],
      o: opacity4,
    },
  ];

  return (
    <div className="relative h-10 w-10">
      {items.map(({ Icon, color, tint, o }, i) => (
        <m.div
          key={i}
          style={{ opacity: o, backgroundColor: tint, color }}
          className="absolute inset-0 flex items-center justify-center rounded-2xl"
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </m.div>
      ))}
    </div>
  );
}
