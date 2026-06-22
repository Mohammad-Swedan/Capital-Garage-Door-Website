"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Defers rendering its children (and therefore any `next/dynamic` chunk inside
 * them) until the wrapper scrolls within `rootMargin` of the viewport. Used to
 * keep heavy, below-the-fold sections — e.g. the gsap-powered ScrollDoorReveal —
 * out of the initial main-thread work: the chunk isn't even requested until the
 * user is about to reach it.
 *
 * The wrapper div carries `className` so callers can reserve the section's
 * height (e.g. `min-h-screen`), avoiding a layout jump when children mount.
 * Renders `null` on both the server and the client's first paint, so there's no
 * hydration mismatch.
 */
export function LazyOnVisible({
  children,
  rootMargin = "800px 0px",
  className,
}: {
  children: ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, show]);

  return (
    <div ref={ref} className={className}>
      {show ? children : null}
    </div>
  );
}
