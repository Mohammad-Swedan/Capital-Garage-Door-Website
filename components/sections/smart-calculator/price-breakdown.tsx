"use client";

import type { EstimateBreakdown } from "./estimate-logic";

/**
 * Indicative line-item split for the estimate. Light theme; used inside PricePanel (desktop side card
 * and the mobile details sheet). The headline total/range is shown by PricePanel, not here.
 */
export function PriceBreakdown({ breakdown }: { breakdown: EstimateBreakdown[] }) {
  if (breakdown.length === 0) return null;

  return (
    <ul className="space-y-2.5">
      {breakdown.map((item) => (
        <li key={item.label} className="flex items-baseline justify-between gap-3 text-sm">
          <span className="text-slate-500">{item.label}</span>
          <span className="shrink-0 font-semibold text-slate-800 tabular-nums">
            ${item.min}–${item.max}
          </span>
        </li>
      ))}
    </ul>
  );
}
