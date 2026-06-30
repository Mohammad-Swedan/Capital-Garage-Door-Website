import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SmartPriceCalculator } from "@/components/sections/smart-calculator";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Smart Garage Door Price Calculator | Capital Garage Doors Perth",
  description:
    "Get an instant cost estimate for garage door repairs, new door installations, motor replacements, and regular servicing across Perth. Free and no obligation.",
  alternates: {
    canonical: "/calculator",
  },
};

export default function CalculatorPage() {
  return (
    <div className="relative min-h-[80vh] w-full bg-[#f8fafc] py-8 sm:py-16 overflow-hidden">
      {/* Premium subtle light background effects */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 h-[500px] w-[500px] rounded-full bg-sky-100/50 blur-[140px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none mask-[radial-gradient(ellipse_60%_50%_at_50%_40%,black_70%,transparent_100%)]" />

      <Container className="relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page heading — the route's real <h1> (the calculator card's own header is an <h2>). */}
        <div className="mb-6 max-w-2xl">
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Garage Door Price Calculator
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
            Answer a few quick questions for a personalised Perth price estimate — free, instant and
            no obligation.
          </p>
        </div>

        {/* Smart Price Calculator Component */}
        <SmartPriceCalculator />
      </Container>
    </div>
  );
}
