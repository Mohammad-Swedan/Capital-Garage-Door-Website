"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whenIntroReady } from "@/lib/intro-ready";

gsap.registerPlugin(ScrollTrigger);

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
 *
 * Renders nothing.
 */
export function SmoothScrollProvider() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let cancelled = false;
    let initialized = false;
    let cleanupRuntime: (() => void) | null = null;

    const init = () => {
      if (cancelled || initialized) return;
      initialized = true;

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
