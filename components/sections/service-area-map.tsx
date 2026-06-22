"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, useReducedMotion, type Variants } from "framer-motion";
import {
  Search,
  CalendarClock,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import dynamic from "next/dynamic";

const BookingDialog = dynamic(
  () => import("@/components/sections/booking-dialog").then((mod) => mod.BookingDialog),
  { ssr: false }
);

const hub = { left: 47.3, top: 48.5 };

const suburbs = [
  { name: "Joondalup", left: 38.7, top: 12 },
  { name: "Ellenbrook", left: 59.1, top: 20 },
  { name: "Midland", left: 67.9, top: 33 },
  { name: "Fremantle", left: 36.5, top: 56.8 },
  { name: "Cannington", left: 55.4, top: 56.6 },
  { name: "Armadale", left: 62.6, top: 65.9 },
  { name: "Rockingham", left: 35.9, top: 73.6 },
  { name: "Baldivis", left: 44.5, top: 83.9 },
];

const stats = [
  { icon: MapPin, value: "100+", label: "Suburbs" },
  { icon: Clock, value: "Same Day", label: "Service" },
  { icon: ShieldCheck, value: "Licensed", label: "& Insured" },
];

export function ServiceAreaMap() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden bg-[#0d1f60] py-14 sm:py-20 lg:py-28">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-[#1b3b8c]/45 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-[#07123a]/60 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#162f7a]/25 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_70%_at_50%_50%,black_30%,transparent_80%)]" />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          {/* ── Left column ── */}
          <m.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col items-start gap-5 sm:gap-6"
          >
            {/* Eyebrow badge */}
            <m.div variants={item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3.5 py-1.5 text-xs font-medium text-white/75 sm:text-sm">
                <MapPin
                  className="h-3 w-3 text-sky-300 sm:h-3.5 sm:w-3.5"
                  aria-hidden="true"
                />
                Perth Metro Coverage
              </span>
            </m.div>

            <m.h2
              variants={item}
              className="text-balance font-display text-2xl leading-[1.08] font-black tracking-tight text-white sm:text-3xl lg:text-[2.85rem]"
            >
              We Cover All of <span className="text-cta">Perth</span>
            </m.h2>

            <m.p
              variants={item}
              className="max-w-sm text-sm leading-relaxed text-white/60 sm:text-base"
            >
              From Joondalup to Rockingham — our licensed technicians reach
              every corner of the Perth metro, fast.
            </m.p>

            {/* Stat pills — single row, no wrap */}
            <m.div variants={item} className="flex w-full gap-2 sm:gap-3">
              {stats.map(({ icon: Icon, value, label }) => {
                const isPin = Icon === MapPin;
                return (
                <div
                  key={label}
                  className="group relative flex min-w-0 flex-1 flex-col items-center gap-2 overflow-hidden rounded-2xl border border-white/[0.13] bg-white/9 px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors hover:bg-white/13 sm:flex-row sm:px-4 sm:py-3.5"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent" />
                  <div
                    className={
                      isPin
                        ? "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-sky-300/25 bg-sky-300/12 shadow-[0_0_10px_rgba(125,211,252,0.18)] sm:h-9 sm:w-9 sm:rounded-xl"
                        : "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cta/25 bg-cta/12 shadow-[0_0_10px_rgba(200,34,42,0.18)] sm:h-9 sm:w-9 sm:rounded-xl"
                    }
                  >
                    <Icon
                      className={
                        isPin
                          ? "h-3.5 w-3.5 text-sky-300 sm:h-4 sm:w-4"
                          : "h-3.5 w-3.5 text-rose-300 sm:h-4 sm:w-4"
                      }
                      aria-hidden="true"
                    />
                  </div>
                  <div className="relative text-center sm:text-left">
                    <p className="text-xs font-bold leading-none text-white tracking-wide sm:text-sm">
                      {value}
                    </p>
                    <p className="mt-1 text-[10px] text-white/45 sm:text-xs">
                      {label}
                    </p>
                  </div>
                </div>
                );
              })}
            </m.div>

            {/* CTAs */}
            <m.div
              variants={item}
              className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3"
            >
              <Button
                size="lg"
                nativeButton={false}
                className="h-11 w-full cursor-pointer gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#0d1f60] shadow-[0_8px_32px_rgba(0,0,0,0.28)] transition-all hover:scale-[1.03] hover:bg-white/95 sm:h-12 sm:w-auto sm:px-8 sm:text-base"
                render={
                  <Link href="/service-areas">
                    <Search className="h-4 w-4" aria-hidden="true" />
                    Check Your Suburb
                  </Link>
                }
              />
              <Button
                size="lg"
                onClick={() => setBookingOpen(true)}
                className="h-11 w-full cursor-pointer gap-2 rounded-xl bg-cta px-6 text-sm font-semibold text-cta-foreground shadow-[0_8px_32px_rgba(200,34,42,0.3)] transition-all hover:scale-[1.03] hover:bg-cta/90 sm:h-12 sm:w-auto sm:px-8 sm:text-base"
              >
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                Book a Technician
              </Button>
            </m.div>
          </m.div>

          {/* ── Right column — map ── */}
          <Reveal
            delay={0.15}
            className="relative mx-auto w-full max-w-sm sm:max-w-md lg:mx-0 lg:max-w-xl"
          >
            <div className="relative aspect-[1448/1086] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:rounded-3xl">
              <Image
                src="/images/perth-map-white.png"
                alt="Map of Perth metro suburbs covered by Capital Garage Door"
                fill
                sizes="(min-width: 1024px) 36rem, (min-width: 640px) 28rem, 90vw"
                className="object-cover"
                priority={false}
              />

              {/* Hub pulse — 3 staggered CSS ripples */}
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${hub.left}%`, top: `${hub.top}%` }}
                aria-hidden="true"
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="cgd-map-ripple"
                    style={{
                      width: 20,
                      height: 20,
                      animationDelay: `${i * 1.33}s`,
                    }}
                  />
                ))}
              </div>

              {/* Suburb pings */}
              {suburbs.map((s, i) => (
                <span
                  key={s.name}
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${s.left}%`, top: `${s.top}%` }}
                  aria-hidden="true"
                >
                  <span
                    className="cgd-map-ping"
                    style={{
                      width: 8,
                      height: 8,
                      animationDelay: `${0.6 + i * 0.38}s`,
                    }}
                  />
                </span>
              ))}
            </div>

            {/* Floating badge — inside padding area so it never overflows */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
              className="cgd-glass-card-dark absolute -bottom-7 left-3 flex items-center gap-3 overflow-hidden px-4 py-2.5 sm:left-5 sm:px-5 sm:py-3.5 lg:-bottom-3"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent" />
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 shadow-[0_0_14px_rgba(251,191,36,0.18)] sm:h-10 sm:w-10 sm:rounded-xl">
                <Star
                  className="h-3.5 w-3.5 fill-amber-300 text-amber-300 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />
              </div>
              <div className="relative">
                <p className="text-xs font-bold leading-none tracking-wide text-white sm:text-sm">
                  2,500+ Happy Customers
                </p>
                <p className="mt-1 text-[10px] text-white/50 sm:text-xs">
                  Across Greater Perth
                </p>
              </div>
            </m.div>
          </Reveal>
        </div>
      </Container>

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </section>
  );
}
