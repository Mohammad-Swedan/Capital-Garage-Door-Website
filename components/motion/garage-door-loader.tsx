"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { markIntroReady } from "@/lib/intro-ready";

/** sessionStorage key — the intro plays only on the first visit of a session. */
const SEEN_KEY = "cgd:welcomed";

/**
 * Fallback only — used when the Web Animations API is unavailable so we can't
 * observe the CSS timeline directly. Must cover the full CSS timeline in
 * globals.css (hold → curtain roll-up → housing lift), measured from when this
 * component's effect runs (which is always after first paint, so it can only
 * ever remove the overlay LATER than the CSS animation, never cut it off).
 */
const TOTAL_MS = 2800;

/**
 * Absolute safety cap for the primary (animation-driven) path: if the
 * animation's `finished` promise somehow never resolves (e.g. the tab was
 * backgrounded the whole time, which pauses CSS animations), don't keep the
 * overlay and scroll lock up forever. Generous so it never pre-empts the real
 * timeline.
 */
const SAFETY_MS = 6000;

/**
 * Height of one steel section. Scales with viewport height so a tall phone
 * screen shows more sections (more realistic) than a short one.
 */
const BAND = "clamp(52px, 9vh, 84px)";

/** Repeating steel-band surface: top highlight → body gradient → shadow → groove. */
const STEEL: CSSProperties = {
  // Solid base under the gradient so its translucent bevel lines never let the page show through.
  backgroundColor: "#3a3e46",
  backgroundImage: `repeating-linear-gradient(180deg,
    rgba(255,255,255,0.13) 0px,
    rgba(255,255,255,0.03) 1.5px,
    #4a4f58 3px,
    #3c4048 calc(var(--band) * 0.5),
    #2e323a calc(var(--band) - 5px),
    rgba(0,0,0,0.55) calc(var(--band) - 2.5px),
    #131519 calc(var(--band) - 1px),
    #131519 var(--band))`,
};

/**
 * One-time welcome intro: a sectional garage door with a brand greeting that
 * rolls up to reveal the site.
 *
 * The animation is driven entirely by CSS (see the `cgd-intro-*` keyframes and
 * `.intro-*` rules in globals.css) so it starts on the very first paint — it
 * does NOT wait for React to hydrate. This matters because the page ships a
 * large client bundle; gating the intro on a post-hydration timer (the old
 * approach) left the door frozen for seconds on slower devices.
 *
 * JavaScript here is now minimal: mark the session as welcomed, lock scroll,
 * and remove the overlay once the CSS timeline finishes. It plays once per
 * session — on any refresh the inline guard in app/layout.tsx adds `.intro-seen`
 * before first paint, which hides it with no flash. Honors prefers-reduced-motion
 * via CSS. Mobile-first.
 */
export function GarageDoorLoader() {
  const [done, setDone] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SEEN_KEY) !== null;
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* sessionStorage unavailable — just play the intro */
    }

    // Already welcomed this session → remove immediately (the inline guard in
    // app/layout.tsx has already hidden it before paint, so no flash).
    if (alreadySeen) {
      markIntroReady();
      setDone(true);
      return;
    }

    // Lock scroll/touch while the intro plays. `overflow: hidden` alone doesn't
    // stop touch scrolling on iOS/Android, so it's paired with a non-passive
    // touchmove guard (see the `.intro-locked` rule in globals.css).
    const root = document.documentElement;
    root.classList.add("intro-locked");
    const preventTouchScroll = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", preventTouchScroll, { passive: false });

    const release = () => {
      root.classList.remove("intro-locked");
      // Also flips on `html:not(.intro-seen) main`'s animation (globals.css) —
      // without this, that animation's `fill-mode: both` keeps an explicit
      // (if visually identity) `transform` on <main> for the rest of the
      // session, which makes <main> a new containing block for any
      // `position: fixed` descendant (e.g. the sticky mobile CTA bar).
      root.classList.add("intro-seen");
      document.removeEventListener("touchmove", preventTouchScroll);
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      release();
      markIntroReady();
      setDone(true);
    };

    // Remove the overlay when the CSS intro timeline actually ENDS. The door is
    // animated purely in CSS, whose clock starts at the element's first paint —
    // but `performance.now()` is anchored to navigation start. On a cold first
    // load (uncached assets, large JS bundle) those two origins diverge by the
    // big first-paint delay, so the old navigation-anchored timer fired while
    // the door was still mid-roll and yanked it away — the intro looked instant
    // or skipped entirely. Driving removal off the shell's own animation
    // (`cgd-intro-shell-hide`, the last beat at 2.7s — or `cgd-intro-fade`
    // under reduced motion) keeps JS in lockstep with the CSS, whenever first
    // paint happens. `.finished` resolves immediately if the animation has
    // already completed (very slow hydration), so the timing is robust both
    // ways. Note: query only the shell's OWN animations, not the subtree — the
    // sheen sweep on a child loops `infinite` and would never resolve.
    const shellAnimations = shellRef.current?.getAnimations?.() ?? [];
    if (shellAnimations.length > 0) {
      Promise.allSettled(shellAnimations.map((a) => a.finished)).then(finish);
    }

    // Safety net. With the animation path active this only fires if `.finished`
    // never resolves (e.g. a backgrounded tab pauses CSS animations). Without
    // it (no Web Animations API) it's the primary path. Measured from now —
    // after first paint — so it can only ever run later than the CSS timeline.
    const timer = window.setTimeout(finish, shellAnimations.length > 0 ? SAFETY_MS : TOTAL_MS);

    return () => {
      window.clearTimeout(timer);
      release();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={shellRef}
      id="garage-intro"
      aria-hidden="true"
      className="cgd-intro-shell fixed inset-0 z-200 flex flex-col overflow-hidden"
    >
      {/* Roller housing beam — lifts last */}
      <div
        className="cgd-intro-housing relative z-20 h-8 w-full sm:h-10"
        style={{
          background: "linear-gradient(180deg, #23262c 0%, #1a1d22 60%, #0f1115 100%)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex h-full items-center justify-between px-4">
          <span className="h-3 w-3 rounded-full bg-white/10 ring-1 ring-white/15" />
          <span className="mx-3 h-px flex-1 bg-white/10" />
          <span className="h-3 w-3 rounded-full bg-white/10 ring-1 ring-white/15" />
        </div>
      </div>

      {/* Door curtain — rolls straight up into the housing */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="cgd-intro-curtain absolute inset-0"
          style={{ ["--band" as string]: BAND, ...STEEL } as CSSProperties}
        >
          {/* Top-down lighting + side jamb shadows for depth */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.08), transparent 28%), linear-gradient(90deg, rgba(0,0,0,0.55), transparent 7%, transparent 93%, rgba(0,0,0,0.55))",
            }}
          />

          {/* Windows — centered in the top section */}
          <div
            className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center"
            style={{ top: 0, height: "var(--band)" }}
          >
            <WindowUnit />
          </div>

          {/* Center lift handle */}
          <div className="absolute bottom-[18%] left-1/2 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-[9%]">
            <span className="h-2 w-2 rounded-full bg-black/50 ring-1 ring-white/10" />
            <span
              className="h-1.5 rounded-full"
              style={{
                width: "clamp(64px, 16vw, 92px)",
                background: "linear-gradient(180deg, #20242a, #0c0e11)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.12), inset 0 1px 1px rgba(255,255,255,0.12)",
              }}
            />
            <span className="h-2 w-2 rounded-full bg-black/50 ring-1 ring-white/10" />
          </div>

          {/* Slow metallic sheen sweep while the greeting holds */}
          <div
            aria-hidden="true"
            className="cgd-intro-sheen pointer-events-none absolute inset-y-0 w-1/2"
            style={{
              background:
                "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.08) 50%, transparent 65%)",
            }}
          />
        </div>

        {/* Brand greeting — over the door, fades out as it opens */}
        <div className="cgd-intro-brand absolute inset-0 flex items-center justify-center px-6">
          <BrandPlate />
        </div>
      </div>
    </div>
  );
}

/** A framed, multi-lite top-section window with frosted glass + a reflection. */
function WindowUnit() {
  return (
    <div
      className="relative flex overflow-hidden rounded-[3px]"
      style={{
        width: "clamp(190px, 70vw, 340px)",
        height: "clamp(24px, calc(var(--band) * 0.46), 38px)",
        border: "1px solid rgba(255,255,255,0.20)",
        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.25), 0 2px 7px rgba(0,0,0,0.4)",
        background:
          "linear-gradient(160deg, rgba(196,214,234,0.48) 0%, rgba(126,146,170,0.22) 48%, rgba(26,31,39,0.55) 100%)",
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-full flex-1"
          style={{ borderRight: i < 3 ? "1px solid rgba(11,15,22,0.45)" : "none" }}
        />
      ))}
      {/* Diagonal glass reflection */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, transparent 42%, rgba(255,255,255,0.28) 50%, transparent 58%)",
        }}
      />
    </div>
  );
}

/** Centered welcome lockup shown on the closed door. */
function BrandPlate() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center text-center">
      <Image
        src="/images/CGD-logo-no-background.png"
        alt=""
        width={80}
        height={80}
        priority
        className="mb-5 h-16 w-16 object-contain drop-shadow-[0_14px_30px_rgba(200,34,42,0.45)] sm:h-18 sm:w-18"
      />

      <span className="mb-3 text-xs font-bold tracking-[0.38em] text-cta uppercase sm:text-sm">
        Welcome to
      </span>

      <span className="font-display text-4xl leading-none tracking-tight text-white uppercase [text-shadow:0_3px_16px_rgba(0,0,0,0.6)] sm:text-5xl">
        {siteConfig.shortName.split(" ")[0]}
      </span>
      <span className="mt-2.5 text-sm font-bold tracking-[0.32em] text-white/80 uppercase sm:text-base">
        Garage Door
      </span>

      <span className="mt-5 max-w-68 text-sm leading-relaxed font-medium text-white/60">
        {siteConfig.tagline}
      </span>
    </div>
  );
}
