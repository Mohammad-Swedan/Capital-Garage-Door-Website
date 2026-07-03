"use client";

import { LazyMotion } from "framer-motion";

// Load the DOM-animation feature set on demand (see ./dom-animation-features).
// Passing a loader function — rather than the `domAnimation` object directly —
// makes framer-motion download its features as a lazy chunk the first time an
// animated `m.*` component mounts, instead of on every page's initial hydration.
// The home page renders no `m.*` above the fold, so framer stays off its
// critical path entirely.
const loadFeatures = () =>
  import("@/components/motion/dom-animation-features").then((mod) => mod.default);

/**
 * Every animated component in the app uses `m.*` (not `motion.*`) so it defers
 * to this lazily-loaded feature set. No component uses drag or layout
 * animations, so `domAnimation` (not the larger `domMax`) is sufficient.
 */
export function LazyMotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
