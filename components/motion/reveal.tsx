"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/**
 * Fades + slides content into view once on scroll.
 *
 * Uses a native `IntersectionObserver` + a CSS transition instead of Framer
 * Motion, so it pulls no animation-library weight into the sections that use it.
 * Honors `prefers-reduced-motion` (handled in CSS — content is simply shown).
 */
export function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old browsers / SSR edge) → just show it.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      // Matches the old Framer `viewport={{ margin: "-80px" }}`.
      { rootMargin: "-80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <div
      ref={ref}
      className={cn("cgd-reveal", shown && "cgd-reveal-in", className)}
      style={
        {
          "--cgd-reveal-y": `${y}px`,
          "--cgd-reveal-delay": `${delay}s`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
