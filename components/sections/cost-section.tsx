"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { m, type Variants } from "framer-motion";
import { Wrench, Home, Cpu, ShieldCheck, Calculator, Sparkles, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";

const CalculatorDialog = dynamic(
  () => import("@/components/sections/calculator-dialog").then((mod) => mod.CalculatorDialog),
  { ssr: false }
);

const PRICE_TIERS = [
  {
    icon: Wrench,
    label: "Repair Service",
    range: "$180 – $420",
    desc: "Springs, cables, tracks, motors & noisy doors.",
    accent: "from-cta/15 to-cta/0",
    iconBg: "bg-cta",
  },
  {
    icon: Home,
    label: "New Installation",
    range: "$1,800 – $4,500",
    desc: "Sectional, roller or tilt doors, fully fitted.",
    accent: "from-primary/15 to-primary/0",
    iconBg: "bg-primary",
  },
  {
    icon: Cpu,
    label: "Motor / Opener",
    range: "$450 – $950",
    desc: "Standard, smart Wi‑Fi & battery backup units.",
    accent: "from-[#0f4e9b]/15 to-[#0f4e9b]/0",
    iconBg: "bg-[#0f4e9b]",
  },
  {
    icon: ShieldCheck,
    label: "Maintenance",
    range: "$120 – $280",
    desc: "Safety inspection, lubrication & tensioning.",
    accent: "from-emerald-500/15 to-emerald-500/0",
    iconBg: "bg-emerald-600",
  },
];

export function CostSection() {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-14 sm:py-20 lg:py-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,30,60,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,30,60,0.04)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_60%_at_50%_30%,black_30%,transparent_80%)]" />
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cta/10 blur-[110px]" />
      </div>

      <Container className="relative z-10">
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <m.div
              variants={itemVariants}
              className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary sm:gap-2 sm:px-4 sm:py-2 sm:text-xs"
            >
              <Calculator className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Transparent, no-surprise pricing
            </m.div>
            <m.h2
              variants={itemVariants}
              className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl"
            >
              What does it{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#0f4e9b]">
                actually cost?
              </span>
            </m.h2>
            <m.p variants={itemVariants} className="mt-4 text-base text-slate-600 sm:text-lg">
              Real Perth price ranges for the most common jobs — then get a quote tailored to your exact door in under a minute.
            </m.p>
          </div>

          {/* Price tier cards */}
          <div className="mb-10 grid gap-3 sm:mb-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {PRICE_TIERS.map((tier) => (
              <m.div
                key={tier.label}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,30,60,0.05)] transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(15,30,60,0.1)] sm:rounded-3xl sm:p-6"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <div className={`relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tier.iconBg} text-white shadow-lg sm:h-12 sm:w-12 sm:rounded-2xl`}>
                  <tier.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="relative z-10 font-display text-base font-bold text-slate-900 sm:text-lg">{tier.label}</h3>
                <p className="relative z-10 mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{tier.range}</p>
                <p className="relative z-10 mt-2 text-sm leading-relaxed text-slate-500">{tier.desc}</p>
              </m.div>
            ))}
          </div>

          {/* Wow CTA */}
          <m.div variants={itemVariants} className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary via-primary to-[#0f4e9b] p-8 text-center shadow-[0_20px_60px_rgba(27,59,140,0.35)] sm:p-12">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-[80px]" />
              <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-cta/25 blur-[80px]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[36px_36px]" />
            </div>

            <div className="relative z-10">
              <Sparkles className="mx-auto mb-4 h-7 w-7 text-amber-300" />
              <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Get your exact price in 60 seconds
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80 sm:text-base">
                Answer a few quick questions and our smart assistant will build a personalised estimate for your door — no call required.
              </p>

              <m.button
                onClick={() => setCalculatorOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative mx-auto mt-7 flex items-center gap-2.5 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow hover:shadow-[0_8px_32px_rgba(200,34,42,0.35)] sm:px-8 sm:py-4 sm:text-base"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cta/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Calculator className="relative z-10 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="relative z-10">Calculate My Cost</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </m.button>
            </div>
          </m.div>
        </m.div>
      </Container>

      <CalculatorDialog open={calculatorOpen} onOpenChange={setCalculatorOpen} />
    </section>
  );
}
