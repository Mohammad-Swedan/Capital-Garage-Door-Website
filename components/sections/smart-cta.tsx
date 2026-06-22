"use client";

import { useState } from "react";
import { m, type Variants } from "framer-motion";
import { CalendarCheck, MessageCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import dynamic from "next/dynamic";

const BookingDialog = dynamic(
  () => import("@/components/sections/booking-dialog").then((mod) => mod.BookingDialog),
  { ssr: false }
);

const AiChatWidget = dynamic(
  () => import("@/components/sections/ai-chat-widget").then((mod) => mod.AiChatWidget),
  { ssr: false }
);
import { cn } from "@/lib/utils";

export function SmartCta() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative overflow-hidden bg-primary py-14 text-primary-foreground sm:py-20 lg:py-28">
      {/* Background elements for wow factor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_60%_at_50%_40%,black_30%,transparent_80%)]" />
        
        {/* Glowing orbs */}
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-cta/15 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#0f4e9b]/30 blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-8"
        >
          {/* Left Column - Text Content */}
          <div className="flex flex-col items-start gap-4 sm:gap-6">
            <m.div variants={itemVariants} className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary-foreground backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4" />
              Trusted by 5,000+ Perth homeowners
            </m.div>

            <m.h2 variants={itemVariants} className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ready to upgrade your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">garage door experience?</span>
            </m.h2>

            <m.p variants={itemVariants} className="max-w-xl text-base text-primary-foreground/80 sm:text-lg lg:text-xl">
              Whether you need an emergency repair right now or a smart quote for a new installation, we&apos;ve made getting help faster and easier than ever.
            </m.p>
          </div>

          {/* Right Column - Interactive Cards */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-6">
            {/* Card 1: Booking */}
            <m.button
              variants={itemVariants}
              onClick={() => setBookingOpen(true)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex cursor-pointer flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:border-cta/40 hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(200,34,42,0.2)] sm:gap-6 sm:rounded-3xl sm:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cta/0 to-cta/0 transition-colors duration-500 group-hover:from-cta/10 group-hover:to-transparent" />

              <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-cta text-white shadow-lg ring-1 ring-white/20 sm:h-14 sm:w-14 sm:rounded-2xl">
                <CalendarCheck className="h-5 w-5 sm:h-7 sm:w-7" />
              </div>

              <div className="relative z-10">
                <h3 className="mb-1.5 font-display text-lg font-bold text-white sm:mb-2 sm:text-2xl">Instant Booking</h3>
                <p className="mb-4 text-sm leading-relaxed text-primary-foreground/70 sm:mb-6">
                  Pick a time that works for you. Schedule a technician to visit your home immediately.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-cta-foreground">
                  Book now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </m.button>

            {/* Card 2: Smart Quote */}
            <m.button
              variants={itemVariants}
              onClick={() => setChatOpen(true)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex cursor-pointer flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:border-[#0f4e9b]/40 hover:bg-white/10 hover:shadow-[0_8px_32px_rgba(15,78,155,0.2)] sm:gap-6 sm:rounded-3xl sm:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f4e9b]/0 to-[#0f4e9b]/0 transition-colors duration-500 group-hover:from-[#0f4e9b]/10 group-hover:to-transparent" />

              <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f4e9b] text-white shadow-lg ring-1 ring-white/20 sm:h-14 sm:w-14 sm:rounded-2xl">
                <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7" />
                <Sparkles className="absolute -right-1.5 -top-1.5 h-4 w-4 text-amber-300 animate-pulse sm:-right-2 sm:-top-2 sm:h-5 sm:w-5" />
              </div>

              <div className="relative z-10">
                <h3 className="mb-1.5 font-display text-lg font-bold text-white sm:mb-2 sm:text-2xl">Smart Quote</h3>
                <p className="mb-4 text-sm leading-relaxed text-primary-foreground/70 sm:mb-6">
                  Chat with our AI assistant to get instant estimates, check service areas, and more.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                  Ask assistant <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </m.button>
          </div>
        </m.div>
      </Container>

      {/* Render the dialogs */}
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
      <AiChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </section>
  );
}
