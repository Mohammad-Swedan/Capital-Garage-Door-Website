"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Info,
  Phone,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { PriceBreakdown } from "./price-breakdown";
import type { EstimateResult } from "./estimate-logic";

/** Smoothly tween an integer when it changes (respects reduced-motion). */
function useCountUp(target: number, duration = 450): number {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Under reduced-motion we don't animate — the hook returns `target` directly below, so there's
    // nothing to do here but remember where we are for a future toggle.
    if (reduce) {
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(Math.round(from + (target - from) * eased)); // inside rAF, not a sync effect setState
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, reduce]);

  return reduce ? target : display;
}

export function AnimatedAmount({ value }: { value: number }) {
  const display = useCountUp(value);
  return <span className="tabular-nums">${display.toLocaleString()}</span>;
}

/** The big animated price range. `onDark` flips text colours for the gradient header. */
function PriceRange({ estimate, onDark }: { estimate: EstimateResult; onDark?: boolean }) {
  const dash = onDark ? "text-white/40" : "text-slate-300";
  const from = onDark ? "text-white/60" : "text-slate-400";
  const single = !estimate.openEnded && estimate.minPrice === estimate.maxPrice;
  return (
    <div className="text-4xl font-black tracking-tight sm:text-5xl">
      {estimate.openEnded ? (
        <>
          <span className={cn("align-middle text-base font-bold", from)}>From </span>
          <AnimatedAmount value={estimate.minPrice} />
        </>
      ) : single ? (
        <AnimatedAmount value={estimate.minPrice} />
      ) : (
        <>
          <AnimatedAmount value={estimate.minPrice} />
          <span className={cn("mx-1 text-3xl font-medium", dash)}>–</span>
          <AnimatedAmount value={estimate.maxPrice} />
        </>
      )}
    </div>
  );
}

export const CONFIDENCE_META: Record<EstimateResult["confidence"], { label: string; dot: string; text: string }> = {
  High: { label: "High confidence", dot: "bg-emerald-500", text: "text-emerald-700" },
  Medium: { label: "Good estimate", dot: "bg-amber-500", text: "text-amber-700" },
  Low: { label: "Rough guide", dot: "bg-slate-400", text: "text-slate-600" },
};

interface PricePanelProps {
  estimate: EstimateResult;
  /** False until the user picks a service — show a friendly prompt instead of a $0 estimate. */
  hasSelection: boolean;
  onBook: () => void;
  onQuote: () => void;
  className?: string;
}

export function PricePanel({ estimate, hasSelection, onBook, onQuote, className }: PricePanelProps) {
  const confidence = CONFIDENCE_META[estimate.confidence];

  if (!hasSelection) {
    return (
      <div className={cn("flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center", className)}>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ReceiptText className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="text-base font-bold text-slate-900">Your instant estimate</p>
        <p className="max-w-[15rem] text-sm text-slate-500">
          Pick a service to see a live price range — built from our real Perth job pricing.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Headline range */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-[#0f4e9b] p-4 text-center text-white shadow-lg shadow-primary/20">
        <p className="mb-1 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
          Estimated range
        </p>
        {estimate.priceSource === "catalog" && (
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white ring-1 ring-white/25">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            Live price{estimate.catalogLabel ? ` · ${estimate.catalogLabel}` : ""}
          </span>
        )}
        <PriceRange estimate={estimate} onDark />
        <p className="mt-2 text-[12.5px] leading-snug text-white/80">{estimate.likelyIssue}</p>
      </div>

      {/* Confidence */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold">
        <span className={cn("inline-flex items-center gap-1.5", confidence.text)}>
          <span className={cn("h-2 w-2 rounded-full", confidence.dot)} />
          {confidence.label}
        </span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-500">Add details to sharpen it</span>
      </div>

      {/* Smart note for the chosen scenario */}
      {estimate.note && (
        <div className="flex items-start gap-2 rounded-xl bg-sky-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600 ring-1 ring-sky-100">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" aria-hidden="true" />
          <span>{estimate.note}</span>
        </div>
      )}

      {/* Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
        <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Indicative breakdown
        </h4>
        <PriceBreakdown breakdown={estimate.breakdown} />
        {estimate.includes && (
          <p className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Includes:</span> {estimate.includes}
          </p>
        )}
      </div>

      {/* Trust badges */}
      <ul className="grid grid-cols-1 gap-1.5">
        {[
          { icon: CheckCircle2, text: "No hidden call-out fees" },
          { icon: ShieldCheck, text: "Licensed & insured technicians" },
          { icon: BadgeCheck, text: "12-month workmanship warranty" },
        ].map((b) => (
          <li key={b.text} className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <b.icon className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
            {b.text}
          </li>
        ))}
      </ul>

      {/* CTAs — the exact-quote is the hero (it opens a form pre-filled with this selection). */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onQuote}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-cta to-[#c2410c] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cta/25 transition-all hover:brightness-105 active:scale-[0.99]"
        >
          <ReceiptText className="h-4 w-4" aria-hidden="true" />
          Get my exact quote
        </button>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onBook}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Book service
          </button>
          <a
            href={`tel:${siteConfig.business.phone}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call now
          </a>
        </div>
      </div>

      <p className="text-center text-[11px] leading-relaxed text-slate-400">
        These prices are indicative guides — not a final quote. Your exact price is confirmed free &amp; on-site, with no obligation.
      </p>
    </div>
  );
}

// The always-visible bottom price bar lives in ./sticky-price-bar.tsx (it replaced the old
// mobile-only MobilePriceBar when the calculator became a single-column step wizard).
