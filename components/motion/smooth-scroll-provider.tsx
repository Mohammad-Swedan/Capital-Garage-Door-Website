"use client";

import { useEffect } from "react";
import { whenIntroReady } from "@/lib/intro-ready";

/**
 * Global smooth scrolling (Lenis) bridged into GSAP's ticker so the pinned
 * ScrollTrigger sequence in <ScrollDoorReveal> scrubs smoothly off the same
 * clock as the rest of the page.
 *
 * Two pieces of coordination:
 *  - The welcome intro (<GarageDoorLoader>) locks scrolling by adding
 *    `intro-locked` to <html>. While that class is present, Lenis is stopped so
 *    it doesn't fight the lock; it starts the moment the class is removed.
 *  - prefers-reduced-motion users get native scrolling — Lenis isn't created.
 *  - Touch / coarse-pointer devices (phones, tablets) also get native scrolling:
 *    Lenis only smooths wheel/trackpad input (no `syncTouch`), so on touch it
 *    adds nothing a user can feel while running a perpetual rAF loop every frame
 *    for the life of the page — which keeps the main thread from ever going idle
 *    and wrecks mobile TBT / Core Web Vitals. Skipping it there is a no-op for
 *    the experience and a large win for the score.
 *
 * The runtime itself (gsap + ScrollTrigger + lenis) is imported lazily inside
 * `init()` so those libraries stay OUT of the initial hydration bundle — they
 * only load once the intro is over (desktop), and never load at all on mobile.
 *
 * Renders nothing.
 */
export function SmoothScrollProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = (q: string) => window.matchMedia(q).matches;
    // A touch device scrolls natively; Lenis (wheel-only, no syncTouch) smooths
    // nothing there but runs a perpetual rAF that tanks mobile TBT. Detect it via
    // media features AND user-agent: Lighthouse's emulated-mobile audit sets a
    // mobile viewport + mobile UA but does NOT emulate `pointer: coarse`/`hover:
    // none`, so the UA check is what makes the lab match how a real phone (which
    // reports coarse pointer) actually behaves. Real desktops keep smooth-scroll.
    const isTouchDevice =
      mq("(pointer: coarse)") ||
      mq("(hover: none)") ||
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (mq("(prefers-reduced-motion: reduce)") || isTouchDevice) return;

    let cancelled = false;
    let initialized = false;
    let cleanupRuntime: (() => void) | null = null;

    const init = async () => {
      if (cancelled || initialized) return;
      initialized = true;

      // Lazy-load the smooth-scroll runtime so gsap/ScrollTrigger/lenis are code
      // -split out of the critical first-load bundle (they're only needed once
      // the user starts wheel-scrolling on desktop).
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // `lerp` 0.08 gives a slightly smoother glide than the 0.1 default while
      // staying responsive (lower = floatier/laggier — don't go below ~0.07).
      // Touch is left native (no `syncTouch`): smoothing mobile touch scroll
      // feels laggy and fights the OS, so we only smooth wheel/trackpad input.
      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.08,
        smoothWheel: true,
      });

      // Keep ScrollTrigger in sync with Lenis' smoothed scroll position.
      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      // Drive Lenis from GSAP's ticker (single rAF loop for the whole page).
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // The intro releases scroll before this runs, but keep the lock guard so a
      // still-present lock (fallback path) is respected.
      const root = document.documentElement;
      const sync = () => {
        if (root.classList.contains("intro-locked")) lenis.stop();
        else lenis.start();
      };
      sync();
      const classObserver = new MutationObserver(sync);
      classObserver.observe(root, { attributes: true, attributeFilter: ["class"] });

      cleanupRuntime = () => {
        classObserver.disconnect();
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33); // restore GSAP's default
        lenis.off("scroll", onScroll);
        lenis.destroy();
      };
    };

    // Defer the smooth-scroll runtime until the welcome intro has finished so its
    // continuous rAF loop doesn't compete with the door animation for frame
    // production. Resolves immediately when there's no intro (refresh / reduced
    // motion / already-seen). The fallback guarantees init even if the signal
    // never fires (e.g. the loader unmounts mid-intro); `initialized` keeps the
    // two paths from double-initializing.
    const fallback = window.setTimeout(init, 6500);
    whenIntroReady().then(() => {
      window.clearTimeout(fallback);
      init();
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      cleanupRuntime?.();
    };
  }, []);

  return null;
}
