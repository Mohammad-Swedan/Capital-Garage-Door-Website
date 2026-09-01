import type { Metadata } from "next";
import { SmartPriceCalculator } from "@/components/sections/smart-calculator";
import {
  CalculatorSeoContent,
  TABLE_SCENARIO_IDS,
} from "@/components/sections/calculator-seo-content";
import { buildPricingRows } from "@/lib/brands/pricing";
import { cmsPublicPricing } from "@/lib/cms/pricing-client";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Prices Perth | Instant Price Calculator",
  description:
    "Real Perth garage door prices: instant estimates for repairs, new doors, motor replacements and servicing from our live price list. Free, no obligation.",
  path: "/calculator",
});

// The guide-price table below the tool reads the live CMS pricing catalog (same override rule
// as the brand pages' tables) — revalidate so price changes flow through without a deploy.
export const revalidate = 3600;

export default async function CalculatorPage() {
  const catalog = await cmsPublicPricing();
  const rows = buildPricingRows([...TABLE_SCENARIO_IDS], catalog);

  return (
    <div className="relative w-full overflow-hidden bg-[#f8fafc]">
      {/* Route's single <h1> — kept for search + screen readers. The calculator's own
          visible title is an <h2>, so this stays sr-only to keep the tool full-screen. */}
      <h1 className="sr-only">Garage Door Prices Perth — Instant Price Calculator</h1>

      {/* Full-screen tool: fills the whole viewport below the sticky header (4rem + 1px
          bottom border — without the -1px the page gets a 1px scrollbar of its own), edge-to-edge
          on every breakpoint (this is the calculator page — the tool IS the page). The
          calculator scrolls internally (overscroll-contained), so the page behind it stays put. */}
      <div
        className="relative z-10 h-[calc(100dvh-4rem-1px)] w-full
          [&>div]:h-full [&>div]:max-w-none
          [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none"
      >
        <SmartPriceCalculator />
      </div>

      {/* Crawlable content below the full-viewport tool — how it works, real
          guide prices (live CMS catalog with pricing-data.ts fallback) and a
          FAQ. Fixes the audit's "low word count": the route previously served
          zero readable text. */}
      <CalculatorSeoContent rows={rows} />
    </div>
  );
}
