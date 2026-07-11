import type { Metadata } from "next";
import { SmartPriceCalculator } from "@/components/sections/smart-calculator";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Price Calculator Perth | Capital Garage Doors",
  description:
    "Get an instant cost estimate for garage door repairs, new door installations, motor replacements, and regular servicing across Perth. Free and no obligation.",
  path: "/calculator",
});

export default function CalculatorPage() {
  return (
    <div className="relative w-full overflow-hidden bg-[#f8fafc]">
      {/* Route's single <h1> — kept for search + screen readers. The calculator's own
          visible title is an <h2>, so this stays sr-only to keep the tool full-screen. */}
      <h1 className="sr-only">Garage Door Price Calculator Perth</h1>

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
    </div>
  );
}
