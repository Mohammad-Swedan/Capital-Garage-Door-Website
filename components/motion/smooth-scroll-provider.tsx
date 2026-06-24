"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

    // Pause Lenis while the intro holds the scroll lock; resume when released.
    const root = document.documentElement;
    const sync = () => {
      if (root.classList.contains("intro-locked")) lenis.stop();
      else lenis.start();
    };
    sync();
    const classObserver = new MutationObserver(sync);
    classObserver.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      classObserver.disconnect();
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // restore GSAP's default
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return null;
}
