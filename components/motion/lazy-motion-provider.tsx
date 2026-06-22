"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Loads Framer Motion's DOM animation features (hover/tap gestures, animate,
 * exit) as a separate async chunk instead of bundling them into the main
 * chunk eagerly. Every animated component in the app uses `m.*` (not
 * `motion.*`) so it defers to this lazily-loaded feature set. No component
 * here uses drag or layout animations, so `domAnimation` (not the larger
 * `domMax`) is sufficient.
 */
export function LazyMotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
