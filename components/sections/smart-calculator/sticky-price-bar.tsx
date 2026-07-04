"use client";

import { ChevronUp, ReceiptText } from "lucide-react";
import { AnimatedAmount, CONFIDENCE_META } from "./price-panel";
import type { EstimateResult } from "./estimate-logic";
import { cn } from "@/lib/utils";

interface StickyPriceBarProps {
  estimate: EstimateResult;
  /** False until a service is picked — show a prompt instead of a $0 range. */
  hasSelection: boolean;
  /** Opens the full-breakdown details sheet. */
  onDetails: () => void;
  /** Opens the pre-filled exact-quote form (the calculator's hero conversion). */
  onQuote: () => void;
}

/**
 * The always-visible price bar pinned to the bottom of the calculator on every
 * breakpoint (the wizard has no side panel). Live animated range + confidence,
 * a Details expander, and the primary "Get my exact quote" CTA.
 */
export function StickyPriceBar({ estimate, hasSelection, onDetails, onQuote }: StickyPriceBarProps) {
  const confidence = CONFIDENCE_META[estimate.confidence];

  return (
    // max-w-2xl keeps the bar's content aligned with the wizard column when the
    // calculator is full-bleed; the parent's border/background still span full width.
    <div className="mx-auto flex w-full max-w-2xl items-center gap-2.5 px-4 py-3 sm:gap-3 sm:px-6">
      <div className="min-w-0 flex-1" aria-live="polite">
        {hasSelection ? (
          <>
            <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
              Your estimate
              <span className={cn("h-1.5 w-1.5 rounded-full", confidence.dot)} aria-hidden="true" />
              <span className={cn("hidden normal-case tracking-normal sm:inline", confidence.text)}>
                {confidence.label}
              </span>
            </p>
            <div className="text-lg font-black leading-none text-slate-900 sm:text-xl">
              {estimate.openEnded ? (
                <>
                  <span className="text-xs font-bold text-slate-400">From </span>
                  <AnimatedAmount value={estimate.minPrice} />
                </>
              ) : estimate.minPrice === estimate.maxPrice ? (
                <AnimatedAmount value={estimate.minPrice} />
              ) : (
                <>
                  <AnimatedAmount value={estimate.minPrice} />
                  <span className="mx-0.5 text-slate-300">–</span>
                  <AnimatedAmount value={estimate.maxPrice} />
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm font-semibold text-slate-500">Pick a service to see your price</p>
        )}
      </div>

      {hasSelection && (
        <>
          <button
            type="button"
            onClick={onDetails}
            className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            Details
          </button>
          <button
            type="button"
            onClick={onQuote}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-cta to-[#c2410c] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-cta/25 transition-all hover:brightness-105 active:scale-[0.98]"
          >
            <ReceiptText className="h-4 w-4" aria-hidden="true" />
            <span className="sm:hidden">Get quote</span>
            <span className="hidden sm:inline">Get my exact quote</span>
          </button>
        </>
      )}
    </div>
  );
}
