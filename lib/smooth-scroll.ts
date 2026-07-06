/**
 * Bridge for programmatic scrolling that cooperates with Lenis.
 *
 * <SmoothScrollProvider> runs Lenis on desktop (non-touch, motion-allowed). Lenis
 * hijacks the scroll position and re-applies its own target every frame, so a
 * native `element.scrollIntoView()` / `window.scrollTo()` is cancelled on the next
 * tick — a page-level scroll must go THROUGH Lenis while it's active. On touch and
 * reduced-motion there is no Lenis instance, and native scrolling works, so we fall
 * back to `scrollIntoView` there.
 */

type LenisLike = {
  scrollTo: (
    target: HTMLElement | number | string,
    options?: { offset?: number; immediate?: boolean },
  ) => void;
};

let lenis: LenisLike | null = null;

/** Called by <SmoothScrollProvider> with the live Lenis instance (or null on teardown). */
export function registerLenis(instance: LenisLike | null): void {
  lenis = instance;
}

/** Sticky-header height to clear so the target doesn't land under it. */
const HEADER_OFFSET = 96;

/**
 * Scroll an element to the top of the viewport, honouring reduced motion. Uses
 * Lenis when it's driving the page; otherwise native scroll (the element should
 * also carry `scroll-mt-24` so the native path clears the header too).
 */
export function scrollToElement(el: HTMLElement | null): void {
  if (!el) return;
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) {
    lenis.scrollTo(el, { offset: -HEADER_OFFSET, immediate: reduce });
    return;
  }
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
