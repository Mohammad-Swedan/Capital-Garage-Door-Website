"use client";

import { EstimateBreakdown } from "./estimate-logic";

interface PriceBreakdownProps {
  breakdown: EstimateBreakdown[];
  minTotal: number;
  maxTotal: number;
}

export function PriceBreakdown({ breakdown, minTotal, maxTotal }: PriceBreakdownProps) {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-white/[0.01] p-5">
      <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
        Price Breakdown Summary
      </h4>
      
      <div className="space-y-3">
        {breakdown.map((item) => (
          <div key={item.label} className="flex justify-between items-center text-sm py-1">
            <span className="text-white/60 font-medium">{item.label}</span>
            <span className="font-semibold text-white">
              ${item.min} – ${item.max}
            </span>
          </div>
        ))}
        
        {/* Separator Line */}
        <div className="h-px bg-white/10 my-3" />
        
        {/* Estimated Total */}
        <div className="flex justify-between items-center py-1">
          <span className="text-base font-bold text-white">Estimated Total</span>
          <span className="text-lg font-black text-blue-400">
            ${minTotal} – ${maxTotal}
          </span>
        </div>
      </div>
    </div>
  );
}
