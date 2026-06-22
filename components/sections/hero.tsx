"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  m,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useInView,
  useScroll,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import {
  Phone,
  Star,
  Siren,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const microItems = ["No call-out fee", "Same-day service", "All Perth suburbs"];

type VanPhase = "idle" | "shake" | "approach" | "onway";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [vanPhase, setVanPhase] = useState<VanPhase>("idle");
  const vanLockedRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  // Idle animations (van bob, glow pulse, floating label) only loop while the
  // hero is actually on screen — otherwise they'd keep running via rAF in the
  // background for the rest of the visit, burning CPU/battery for nothing.
  const inView = useInView(sectionRef, { amount: 0, initial: true });
  const loopIdle = inView && !shouldReduceMotion;

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // The hero's mount entrance is done in pure CSS (see `.cgd-rise` /
  // `.cgd-rise-right` in globals.css) rather than Framer Motion, so the
  // above-the-fold content animates in on the first paint instead of staying
  // invisible until the large client bundle hydrates.

  // Pointer-driven tilt on the van (disabled for reduced motion / mid-sequence).
  const tiltX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  const handleVanMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || vanPhase !== "idle") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltY.set(px * 6);
    tiltX.set(-py * 6);
  };

  const resetVan = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // Tap the van: shake → "approach" the viewer (stand-in for the reference
  // design's drive-up video, since no video asset exists here) → "On Our
  // Way!" → open the booking dialog.
  const handleVanClick = () => {
    if (vanLockedRef.current || vanPhase === "onway") return;
    vanLockedRef.current = true;

    const queue = (fn: () => void, delay: number) => {
      timeoutsRef.current.push(window.setTimeout(fn, delay));
    };

    if (shouldReduceMotion) {
      setVanPhase("onway");
      queue(() => {
        vanLockedRef.current = false;
        setBookingOpen(true);
      }, 900);
      return;
    }

    setVanPhase("shake");
    queue(() => {
      setVanPhase("approach");
      queue(() => {
        setVanPhase("onway");
        queue(() => {
          vanLockedRef.current = false;
          setBookingOpen(true);
        }, 800);
      }, 600);
    }, 400);
  };

  const handleBookingOpenChange = (open: boolean) => {
    setBookingOpen(open);
    if (!open && vanPhase !== "idle") {
      // Wait for a few seconds so the success UI is visible, then reset the van to idle
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setVanPhase("idle");
        }, 2500),
      );
    }
  };

  const vanImageVariants: Variants = {
    idle: {
      x: 0,
      y: shouldReduceMotion ? 0 : -2,
      scale: 1,
      rotate: shouldReduceMotion ? 0 : 0.3,
      opacity: 1,
      transition: {
        y: {
          duration: 1.3,
          repeat: loopIdle ? Infinity : 0,
          repeatType: "mirror",
          ease: "easeInOut",
        },
        rotate: {
          duration: 1.3,
          repeat: loopIdle ? Infinity : 0,
          repeatType: "mirror",
          ease: "easeInOut",
        },
        x: { type: "tween", duration: 0 },
        opacity: { duration: 0.3 },
      },
    },
    shake: {
      x: 0,
      y: [0, -8, 6, -4, 2, 0],
      rotate: [0, -2, 1.5, -1, 0.5, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    approach: {
      x: "-120vw",
      opacity: 0,
      transition: { duration: 0.6, ease: "easeIn" },
    },
    onway: { x: "-120vw", opacity: 0, transition: { duration: 0 } },
  };

  const glowVariants: Variants = {
    idle: { opacity: [0.35, 0.55, 0.35], scale: [1, 1.1, 1] },
    shake: { opacity: 0.55, scale: 1.05 },
    approach: { opacity: 0.85, scale: 1.3 },
    onway: { opacity: 0.7, scale: 1.2 },
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative flex min-h-[calc(100svh-4rem)] items-center bg-background"
      >
        {/* Decorative background layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Grid pattern, fading out toward the edges */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.07)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_90%_70%_at_50%_0%,black_30%,transparent_85%)]" />

          {/* Single soft ambient glow behind the headline */}
          <div className="absolute -top-24 left-1/2 h-90 w-200 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />

          {/* Secondary blue glow, weighted toward the van */}
          <div className="absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-[#0f4e9b]/10 blur-3xl sm:h-80 sm:w-80" />
        </div>

        <Container className="relative z-10 w-full py-[clamp(0.75rem,2.4svh,1.25rem)] sm:py-10 lg:py-20">
          <div className="flex flex-col gap-[clamp(0.75rem,3svh,1.75rem)] sm:gap-8 lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10">
            {/* Left column — copy */}
            <div className="flex flex-col items-start gap-[clamp(0.625rem,2.2svh,1.25rem)] sm:gap-7">
              <span
                className="cgd-rise [animation-delay:100ms] inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-emerald-700 uppercase"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available Now &mdash; 24/7 Emergency Service
              </span>

              <h1
                className="cgd-rise [animation-delay:220ms] text-balance font-display text-[clamp(1.625rem,4.2svh,2rem)] leading-[1.05] font-black tracking-tight text-foreground sm:text-4xl sm:leading-[1.05] lg:text-5xl"
              >
                Perth&apos;s <span className="text-cta">#1</span> Garage Door
                <br />
                <span className="relative inline-block text-cta">
                  Repair &amp; Installation
                  <span className="absolute inset-x-0 -bottom-0.5 -z-10 h-2 rounded-full bg-cta/30 sm:h-3" />
                </span>
              </h1>

              <p
                className="cgd-rise [animation-delay:340ms] text-pretty max-w-md text-[clamp(0.875rem,1.8svh,1rem)] leading-snug text-muted-foreground sm:max-w-xl sm:text-base"
              >
                Same-day emergency repairs, new installs &amp; motor
                replacements across all Perth suburbs. We&apos;re available
                right now &mdash; call for a free quote.
              </p>

              <div className="cgd-rise [animation-delay:460ms] flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Button
                  size="lg"
                  nativeButton={false}
                  className="group h-[clamp(2.75rem,6.5svh,3rem)] w-full cursor-pointer gap-2 rounded-xl bg-cta px-8 text-base text-cta-foreground shadow-[0_3px_10px_rgba(200,34,42,0.25)] transition-transform hover:scale-[1.03] hover:bg-cta/90 sm:h-14 sm:w-auto"
                  render={
                    <a href={`tel:${siteConfig.business.phone}`}>
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      Call Now &mdash; Free Quote
                    </a>
                  }
                />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setBookingOpen(true)}
                  className="h-[clamp(2.75rem,6.5svh,3rem)] w-full cursor-pointer rounded-xl border-[#0f4e9b]/35 bg-[#0f4e9b]/5 px-8 text-base text-[#0f4e9b] hover:bg-[#0f4e9b]/10 hover:text-[#0f4e9b] sm:h-14 sm:w-auto"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Siren className="h-4 w-4" aria-hidden="true" />
                    Book Emergency Repair
                  </span>
                </Button>
              </div>

              {/* Micro-copy trust line */}
              <div className="cgd-rise [animation-delay:580ms] w-full">
                <ul className="flex flex-nowrap gap-x-2.5 sm:gap-x-5">
                  {microItems.map((label) => (
                    <li
                      key={label}
                      className="flex items-center gap-1 whitespace-nowrap text-[11px] font-medium text-muted-foreground sm:gap-1.5 sm:text-sm"
                    >
                      <CheckCircle2
                        className="h-3 w-3 shrink-0 text-[#0f4e9b] sm:h-4 sm:w-4"
                        aria-hidden="true"
                      />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust strip */}
              <div className="cgd-rise [animation-delay:700ms] flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-foreground/8 bg-foreground/4 px-3.5 py-2">
                  <span className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    <span className="font-extrabold text-foreground">4.9</span>{" "}
                    &middot; 247 Google Reviews
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-foreground/8 bg-foreground/4 px-3.5 py-2">
                  <ShieldCheck
                    className="h-4 w-4 text-[#0f4e9b]"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Licensed &amp; Insured
                  </span>
                </div>
              </div>
            </div>

            {/* Right column — van CTA */}
            <div
              className={cn(
                "cgd-rise-right [animation-delay:120ms] relative mx-auto -mt-1 flex w-full max-w-[clamp(11.5rem,36svh,21rem)] flex-col items-center justify-center sm:mt-0 sm:max-w-md lg:max-w-xl lg:mx-0",
                // Only reserve room for the success overlay while it's actually
                // showing — otherwise it'd waste space on short phones for a
                // card that's invisible 99% of the time.
                vanPhase === "onway" && "min-h-[clamp(8.5rem,30svh,13rem)] sm:min-h-0",
              )}
            >
              {/* Ambient glow behind the van */}
              <m.div
                // Framer Motion won't restart an in-progress infinite loop just
                // because `transition.repeat` changed while the active variant
                // name stays "idle" — keying on loopIdle forces a clean
                // remount so the pause/resume below actually takes effect.
                key={loopIdle ? "glow-loop" : "glow-paused"}
                aria-hidden="true"
                variants={glowVariants}
                animate={vanPhase}
                transition={
                  vanPhase === "idle"
                    ? {
                        duration: 3,
                        repeat: loopIdle ? Infinity : 0,
                        ease: "easeInOut",
                      }
                    : { duration: 0.5, ease: "easeOut" }
                }
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
              >
                <div className="h-[70%] w-[70%] rounded-full bg-cta/15 blur-3xl" />
              </m.div>

              <button
                type="button"
                onClick={handleVanClick}
                onMouseMove={handleVanMove}
                onMouseLeave={resetVan}
                aria-label="Tap for emergency service — opens the booking form"
                className="group/van relative block w-full cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-cta/40"
              >
                {/* "Tap for Emergency" floating label */}
                <m.span
                  key={loopIdle ? "label-loop" : "label-paused"}
                  animate={
                    vanPhase === "idle"
                      ? { y: [0, -8, 0], opacity: 1, scale: 1 }
                      : { opacity: 0, y: -6, scale: 0.9 }
                  }
                  transition={
                    vanPhase === "idle"
                      ? {
                          y: {
                            duration: 2.4,
                            repeat: loopIdle ? Infinity : 0,
                            ease: "easeInOut",
                          },
                          opacity: { duration: 0.3 },
                          scale: { duration: 0.3 },
                        }
                      : { duration: 0.25 }
                  }
                  className="absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center drop-shadow-[0_8px_16px_rgba(200,34,42,0.4)] scale-90 sm:scale-100"
                >
                  <span className="whitespace-nowrap rounded-xl bg-cta px-3.5 py-2 text-[11px] font-black tracking-wide text-white uppercase sm:px-4 sm:text-xs">
                    🚨 Tap for Emergency
                  </span>
                  <span className="-mt-[1px] border-[6px] border-transparent border-t-cta border-b-0" />
                </m.span>

                {/* Pulse rings - Centered and modernized */}
                {vanPhase === "idle" && (
                  <span
                    className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  >
                    <span className="absolute inset-0 size-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-cta opacity-20 duration-[2500ms]" />
                    <span className="absolute inset-0 size-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-cta opacity-20 duration-[2500ms] [animation-delay:0.8s]" />
                    <span className="absolute inset-0 size-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-cta opacity-20 duration-[2500ms] [animation-delay:1.6s]" />
                  </span>
                )}

                {/* Speed lines */}
                {(vanPhase === "idle" || vanPhase === "approach") && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-0 z-2 h-[60%] w-[45%] -translate-y-1/2 overflow-hidden"
                  >
                    <span className="absolute top-[25%] left-0 h-[1.5px] w-15 animate-[cgd-speed-dash_0.8s_linear_infinite] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
                    <span className="absolute top-[45%] left-0 h-[1.5px] w-20 animate-[cgd-speed-dash_0.8s_linear_infinite] bg-gradient-to-r from-transparent via-foreground/20 to-transparent [animation-delay:0.2s]" />
                    <span className="absolute top-[65%] left-0 h-[1.5px] w-12 animate-[cgd-speed-dash_0.8s_linear_infinite] bg-gradient-to-r from-transparent via-foreground/20 to-transparent [animation-delay:0.4s]" />
                  </span>
                )}

                {/* Headlight glow — pulses to hint the van's lights are on while it's moving */}
                {(vanPhase === "idle" || vanPhase === "approach") && (
                  <span
                    aria-hidden="true"
                    className="absolute top-[60%] left-[12%] z-3 h-2.5 w-2.5 rounded-full bg-amber-200 blur-[2px] animate-[cgd-headlight-glow_0.8s_ease-in-out_infinite_alternate] [box-shadow:0_0_6px_2px_rgba(253,230,138,0.55)]"
                  />
                )}

                <m.div
                  key={loopIdle ? "van-loop" : "van-paused"}
                  variants={vanImageVariants}
                  animate={vanPhase}
                  whileHover={vanPhase === "idle" ? { scale: 1.02 } : undefined}
                  whileTap={vanPhase === "idle" ? { scale: 0.99 } : undefined}
                  style={{
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformPerspective: 900,
                  }}
                >
                  <Image
                    src="/images/van-speeding-light.png"
                    alt="Capital Garage Door service van"
                    width={2933}
                    height={1398}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 460px"
                    quality={75}
                    className="w-full drop-shadow-[0_28px_56px_rgba(13,31,69,0.22)]"
                  />
                </m.div>
              </button>

              {/* Technician Dispatched Success UI */}
              <m.div
                initial={false}
                animate={
                  vanPhase === "onway"
                    ? { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" }
                    : { opacity: 0, y: 20, scale: 0.95, pointerEvents: "none" }
                }
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2,
                }}
                className="absolute top-1/2 left-1/2 z-30 flex w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-5 shadow-[0_30px_60px_rgba(13,31,69,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl sm:w-80 dark:border-white/10 dark:bg-[#0d1f45]/50 dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Technician Dispatched!
                  </h3>
                  <p className="mt-1 text-xs font-medium text-muted-foreground/80">
                    ETA: &lt; 30 minutes
                  </p>
                </div>
                {/* Animated progress bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/5 dark:bg-white/10">
                  <m.div
                    initial={{ x: "-100%" }}
                    animate={
                      vanPhase === "onway" ? { x: "0%" } : { x: "-100%" }
                    }
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full w-full rounded-full bg-emerald-500"
                  />
                </div>
              </m.div>

              {/* Road strip under the van */}
              <div
                aria-hidden="true"
                className={cn(
                  "relative mx-auto -mt-1 h-[clamp(0.625rem,1.5svh,1rem)] w-3/4 overflow-hidden rounded-full bg-foreground/4 transition-opacity duration-300",
                  vanPhase === "idle" ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="absolute top-1/2 left-0 h-[2px] w-[250%] -translate-y-1/2 animate-[cgd-road-scroll_0.5s_linear_infinite] bg-[repeating-linear-gradient(90deg,rgba(13,31,69,0.25)_0px,rgba(13,31,69,0.25)_24px,transparent_24px,transparent_48px)]" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Sticky mobile CTA bar — rendered outside the hero's overflow-hidden/relative
        section, since position: fixed would otherwise be clipped to its bounds. */}
      <StickyMobileCta />

      {/* Shared booking dialog — opened by the van, the CTA button, and the sticky bar */}
      <BookingDialog
        open={bookingOpen}
        onOpenChange={handleBookingOpenChange}
      />
    </>
  );
}

function StickyMobileCta() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const hasShownTooltipRef = useRef(false);
  const tooltipTimeoutRef = useRef<number | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 150);
  });

  useEffect(() => {
    if (visible && !hasShownTooltipRef.current) {
      tooltipTimeoutRef.current = window.setTimeout(() => {
        setShowTooltip(true);
        setBadgeVisible(true);
        hasShownTooltipRef.current = true;
      }, 3000);
    }
    return () => window.clearTimeout(tooltipTimeoutRef.current);
  }, [visible]);

  // Dismiss after 7s if ignored, or on an actual outside tap. Outside taps
  // are tracked via "click" rather than "pointerdown" — a scroll gesture
  // also fires pointerdown the instant a finger touches the screen, which
  // was closing the tooltip the moment the user tried to keep scrolling.
  // "click" only fires for an actual tap, not a touch-and-drag/scroll.
  useEffect(() => {
    if (!showTooltip) return;

    function handleClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    }
    const autoHide = window.setTimeout(() => setShowTooltip(false), 7000);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      window.clearTimeout(autoHide);
    };
  }, [showTooltip]);

  function openChat() {
    setChatOpen(true);
    setShowTooltip(false);
    setBadgeVisible(false);
  }

  return (
    <m.div
      ref={wrapperRef}
      initial={false}
      animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-sm items-center gap-2 lg:hidden"
    >
      <AnimatePresence>
        {showTooltip && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute right-0 bottom-full mb-3 w-64"
          >
            {/* The pointer sits outside this card on purpose — the card needs
                overflow-hidden so its glass background respects the rounded
                corners, but that would also clip the pointer's protruding
                tip, leaving only an unclipped sliver that reads as an
                upward chevron instead of a downward-pointing tail. */}
            <div className="cgd-glass-tooltip relative overflow-hidden p-4 text-foreground">
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setShowTooltip(false)}
                className="absolute top-2.5 right-2.5 z-10 rounded-full p-1 text-foreground/45 transition-colors hover:bg-white/50 hover:text-foreground/70"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <p className="relative z-10 flex items-center gap-1.5 text-sm font-bold text-foreground">
                <span aria-hidden="true">👋</span> Smart Chat
              </p>
              <p className="relative z-10 mt-1.5 text-xs leading-snug text-foreground/70">
                Need a quote or repair advice? Ask me instantly.
              </p>
              <button
                type="button"
                onClick={openChat}
                className="relative z-10 mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-cta"
              >
                Ask now <span aria-hidden="true">→</span>
              </button>
            </div>
            <span className="cgd-glass-tooltip-pointer absolute right-6 -bottom-1.5 h-3 w-3 rotate-45" />
          </m.div>
        )}
      </AnimatePresence>

      <div className="flex w-full items-center gap-2 rounded-full border bg-card/95 p-2 shadow-[0_10px_30px_rgba(13,31,69,0.16)]">
        <a
          href={`tel:${siteConfig.business.phone}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-[0_6px_16px_rgba(200,34,42,0.25)] transition-colors hover:bg-cta/90"
        >
          <Phone className="h-4.5 w-4.5" aria-hidden="true" />
          Call Us
        </a>
        <button
          type="button"
          aria-label="Open smart chat assistant"
          onClick={openChat}
          className="relative flex h-11.5 w-11.5 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-muted text-foreground transition-colors hover:bg-muted/70"
        >
          {showTooltip && !shouldReduceMotion && (
            <span className="absolute inset-0 rounded-full" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full border-2 border-cta/70" />
              <span className="absolute inset-0 animate-ping rounded-full border-2 border-cta/70 [animation-delay:0.7s]" />
            </span>
          )}
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {badgeVisible && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cta text-[10px] font-bold text-white ring-2 ring-card">
              1
            </span>
          )}
        </button>
      </div>

      <AiChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </m.div>
  );
}
