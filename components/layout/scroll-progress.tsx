"use client";

import { useEffect, useRef } from "react";

/**
 * Top scroll-progress bar. A tiny passive scroll listener (rAF-throttled) that
 * writes `scaleX` straight to the element — no framer-motion `useScroll`/
 * `useSpring`, so it pulls no animation-library weight into the global chrome's
 * hydration (mobile TBT). The bar tracks scroll directly; the `transition`
 * keeps it visually smooth without a JS spring.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ transform: "scaleX(0)" }}
      className="fixed inset-x-0 top-0 z-60 h-0.75 origin-left bg-linear-to-r from-cta via-primary to-cta transition-transform duration-100 ease-out"
    />
  );
}
