"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Phone,
  Star,
  ShieldCheck,
  CheckCircle2,
  CalendarClock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import dynamic from "next/dynamic";

const BookingDialog = dynamic(
  () => import("@/components/sections/booking-dialog").then((mod) => mod.BookingDialog),
  { ssr: false }
);
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const microItems = ["No call-out fee", "Same-day service", "All Perth suburbs"];

type VanPhase = "idle" | "shake" | "approach" | "onway";

interface HeroProps {
  /**
   * Live review aggregate (same source as the site-wide JSON-LD and /reviews).
   * Passed in from the server page so the visible widget can NEVER contradict
   * the structured data — a hardcoded "4.9 · 247" here once did exactly that,
   * which is a Google structured-data policy risk.
   */
  rating?: { value: number; count: number };
}

export function Hero({ rating }: HeroProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPath, setBookingPath] = useState<string | undefined>(undefined);
  const [vanPhase, setVanPhase] = useState<VanPhase>("idle");
  const vanLockedRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  // Tracks at most one pending "reset to idle" timer (armed by Call Now / a
  // closed booking dialog) so a later dismiss or fresh van tap can cancel it
  // outright instead of letting a stale timeout yank an unrelated cycle back
  // to idle. Still pushed onto `timeoutsRef` too, for unmount cleanup.
  const idleResetTimeoutRef = useRef<number | undefined>(undefined);
  // Pointer tilt is written straight to CSS custom properties on this node (no
  // React state → no re-render storm on mousemove, no framer-motion springs).
  const tiltRef = useRef<HTMLDivElement>(null);
  // Resolved once on mount; the idle *visual* loops honour reduced motion via CSS
  // (`@media (prefers-reduced-motion)` in globals.css), this only gates the
  // interactive tap sequence + pointer tilt.
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // The hero's mount entrance + all idle motion (van bob, glow pulse, floating
  // label, pulse rings, drive-off) are pure CSS (see the `.cgd-rise*` and
  // `.cgd-van-*` rules in globals.css) rather than framer-motion, so the
  // above-the-fold content paints on first paint instead of waiting for the
  // large client bundle to hydrate — and the idle loops run on the compositor
  // instead of a main-thread rAF (mobile TBT / LCP).

  const handleVanMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotionRef.current || vanPhase !== "idle") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const el = tiltRef.current;
    if (el) {
      el.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
    }
  };

  const resetTilt = () => {
    const el = tiltRef.current;
    if (el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
  };

  const openBooking = (path?: string) => {
    setBookingPath(path);
    setBookingOpen(true);
  };

  const clearIdleReset = () => {
    if (idleResetTimeoutRef.current !== undefined) {
      window.clearTimeout(idleResetTimeoutRef.current);
      idleResetTimeoutRef.current = undefined;
    }
  };

  const scheduleIdleReset = () => {
    clearIdleReset();
    const id = window.setTimeout(() => {
      idleResetTimeoutRef.current = undefined;
      setVanPhase("idle");
    }, 2500);
    idleResetTimeoutRef.current = id;
    timeoutsRef.current.push(id);
  };

  // Tap the van: shake → drive off to the left ("approach") → "On Our Way!" →
  // show the Call-or-Book choice card. The drive-off motion + its duration live
  // in the `.cgd-van-driveoff` rules in globals.css (kept in sync with the
  // "approach" hold below).
  const handleVanClick = () => {
    if (vanLockedRef.current || vanPhase === "onway") return;
    clearIdleReset();
    vanLockedRef.current = true;
    resetTilt();

    const queue = (fn: () => void, delay: number) => {
      timeoutsRef.current.push(window.setTimeout(fn, delay));
    };

    if (reducedMotionRef.current) {
      setVanPhase("onway");
      vanLockedRef.current = false;
      return;
    }

    setVanPhase("shake");
    queue(() => {
      setVanPhase("approach");
      // Hold in "approach" long enough for the full drive-off to play (the
      // 0.85s `cgd-van-driveoff-go` keyframe in globals.css) before the choice
      // card springs in. Keep in sync with that animation's duration.
      queue(() => {
        setVanPhase("onway");
        vanLockedRef.current = false;
      }, 850);
    }, 400);
  };

  const handleChoiceDismiss = () => {
    clearIdleReset();
    setVanPhase("idle");
  };

  const handleCallTap = () => {
    scheduleIdleReset();
  };

  const handleEmergencyBooking = () => {
    openBooking("/booking/9");
  };

  const handleBookingOpenChange = (open: boolean) => {
    setBookingOpen(open);
    if (!open && vanPhase !== "idle") {
      // Wait for a few seconds so the choice card is visible, then reset the van to idle
      scheduleIdleReset();
    }
  };

  return (
    <>
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center bg-background">
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
          <div className="absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
        </div>

        <Container className="relative z-10 w-full py-[clamp(0.75rem,2.4svh,1.25rem)] sm:py-10 lg:py-20">
          <div className="flex flex-col gap-[clamp(0.75rem,3svh,1.75rem)] sm:gap-8 md:grid md:grid-cols-[1.05fr_1fr] md:items-center md:gap-8 lg:gap-10">
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
                {/* The explicit {" "} before the <br /> matters: JSX strips the
                    newline between "Garage Door" and <br/>, and text extractors
                    (AI crawlers, RAG pipelines) were quoting the H1 as
                    "Garage DoorRepair & Installation". Visually a trailing
                    space before a line break renders identically. */}
                Perth&apos;s <span className="text-cta">#1</span> Garage Door{" "}
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
                  onClick={() => openBooking()}
                  className="h-[clamp(2.75rem,6.5svh,3rem)] w-full cursor-pointer rounded-xl border-primary/35 bg-primary/5 px-8 text-base text-primary hover:bg-primary/10 hover:text-primary sm:h-14 sm:w-auto"
                >
                  <span className="flex items-center justify-center gap-2">
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                    Book a Service
                  </span>
                </Button>
              </div>

              {/* Micro-copy trust line */}
              <div className="cgd-rise [animation-delay:580ms] w-full">
                <ul className="flex flex-wrap gap-x-2.5 gap-y-1 sm:gap-x-5">
                  {microItems.map((label) => (
                    <li
                      key={label}
                      className="flex items-center gap-1 whitespace-nowrap text-[11px] font-medium text-muted-foreground sm:gap-1.5 sm:text-sm"
                    >
                      <CheckCircle2
                        className="h-3 w-3 shrink-0 text-primary sm:h-4 sm:w-4"
                        aria-hidden="true"
                      />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust strip */}
              <div className="cgd-rise [animation-delay:700ms] flex flex-wrap items-center gap-3">
                {rating && rating.count > 0 && (
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
                      <span className="font-extrabold text-foreground">
                        {rating.value.toFixed(1)}
                      </span>{" "}
                      &middot; {rating.count} Google Reviews
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-full border border-foreground/8 bg-foreground/4 px-3.5 py-2">
                  <ShieldCheck
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Licensed &amp; Insured
                  </span>
                </div>
                {/* Real, selectable phone digits above the fold — an audit found
                    the only visible number was baked into the van image (cropped
                    below the fold on phones), leaving mobile visitors with no
                    readable number pre-scroll. */}
                <a
                  href={`tel:${siteConfig.business.phone}`}
                  className="flex items-center gap-2 rounded-full border border-cta/25 bg-cta/5 px-3.5 py-2 transition-colors hover:bg-cta/10"
                >
                  <Phone className="h-3.5 w-3.5 text-cta" aria-hidden="true" />
                  <span className="text-xs font-extrabold tracking-wide text-foreground">
                    {siteConfig.business.phoneDisplay}
                  </span>
                </a>
              </div>
            </div>

            {/* Right column — van CTA. `data-phase` drives every van animation via
                CSS (see `.cgd-van-*` in globals.css). */}
            <div
              data-phase={vanPhase}
              className={cn(
                "cgd-rise-right [animation-delay:120ms] relative mx-auto -mt-1 flex w-full max-w-[clamp(11.5rem,36svh,21rem)] flex-col items-center justify-center sm:mt-0 sm:max-w-md md:max-w-none md:mx-0 lg:max-w-xl lg:mx-0",
                // Only reserve room for the choice card while it's actually
                // showing — otherwise it'd waste space on short phones for a
                // card that's invisible 99% of the time. 20rem comfortably
                // fits the card's measured 245-310px height range across
                // 320-390px-wide mobile viewports.
                vanPhase === "onway" && "min-h-[20rem] sm:min-h-0",
              )}
            >
              {/* Ambient glow behind the van (CSS pulse) */}
              <div
                aria-hidden="true"
                className="cgd-van-glow pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
              >
                <div className="h-[70%] w-[70%] rounded-full bg-cta/15 blur-3xl" />
              </div>

              <button
                type="button"
                onClick={handleVanClick}
                onMouseMove={handleVanMove}
                onMouseLeave={resetTilt}
                aria-label="Tap for Emergency service options"
                className="cgd-van-btn group/van relative block w-full cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-cta/40"
              >
                {/* "Tap for Emergency" floating label (CSS bob; hides on drive-off).
                    The emoji is aria-hidden so the visible text ("Tap for
                    Emergency") is contained verbatim in the accessible name —
                    WCAG 2.5.3 label-in-name, needed for voice-control users on
                    the page's primary urgency CTA. */}
                <span className="cgd-van-label absolute -top-3 left-1/2 z-20">
                  <span className="cgd-van-label-bob flex flex-col items-center drop-shadow-[0_8px_16px_rgba(200,34,42,0.4)]">
                    <span className="whitespace-nowrap rounded-xl bg-cta px-3.5 py-2 text-[11px] font-black tracking-wide text-white uppercase sm:px-4 sm:text-xs">
                      <span aria-hidden="true">🚨 </span>Tap for Emergency
                    </span>
                    <span className="-mt-[1px] border-[6px] border-transparent border-t-cta border-b-0" />
                  </span>
                </span>

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

                {/* Van image — nested transform layers so drive-off (translateX),
                    idle bob (translateY/rotate) and pointer tilt (rotateX/Y +
                    hover scale) never collide on a single `transform`. */}
                <div className="cgd-van-driveoff">
                  <div className="cgd-van-bob">
                    <div ref={tiltRef} className="cgd-van-tilt">
                      <Image
                        src="/images/van-speeding-light.png"
                        alt="Capital Garage Doors service van"
                        width={2933}
                        height={1398}
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 460px"
                        quality={75}
                        className="w-full drop-shadow-[0_28px_56px_rgba(13,31,69,0.22)]"
                      />
                    </div>
                  </div>
                </div>
              </button>

              {/* Call-or-Book choice card (CSS spring-in on `onway`, same slot the
                  old auto-dispatch card used) */}
              <div className="cgd-van-success absolute top-1/2 left-1/2 z-30 flex w-[90%] flex-col gap-3 overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-5 shadow-[0_30px_60px_rgba(13,31,69,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl sm:w-80 dark:border-white/10 dark:bg-[#0d1f45]/50 dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between gap-2">
                  {/* Deliberately NOT a heading: this card title sits before the
                      page's first <h2> and was flagged as an h1→h3 heading-order
                      skip; it's UI chrome (hidden 99% of the time), not document
                      structure. */}
                  <p className="font-display text-lg font-bold text-foreground">
                    Need Us Now?
                  </p>
                  <button
                    type="button"
                    aria-label="Cancel"
                    onClick={handleChoiceDismiss}
                    className="cursor-pointer rounded-full p-1 text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <a
                  href={`tel:${siteConfig.business.phone}`}
                  onClick={handleCallTap}
                  className="flex cursor-pointer flex-col items-center gap-0.5 rounded-xl bg-cta px-4 py-2.5 text-center text-cta-foreground shadow-[0_6px_16px_rgba(200,34,42,0.25)] transition-transform hover:scale-[1.02] hover:bg-cta/90"
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call Now
                  </span>
                  <span className="text-[11px] font-medium text-cta-foreground/80">
                    Recommended &mdash; fastest response
                  </span>
                </a>

                <button
                  type="button"
                  onClick={handleEmergencyBooking}
                  className="flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 text-center text-primary transition-colors hover:bg-primary/10"
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                    Emergency Booking
                  </span>
                  <span className="text-[11px] font-medium text-primary/70">
                    Not recommended outside business hours
                  </span>
                </button>
              </div>

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
        path={bookingPath}
      />
    </>
  );
}
