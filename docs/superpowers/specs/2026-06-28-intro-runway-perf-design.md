# Welcome-intro smoothness — "clear the runway" design

**Date:** 2026-06-28
**Status:** Approved (design), pending implementation plan
**Area:** `components/motion/*`, home page motion runtime

## Problem

The welcome garage-door intro (`components/motion/garage-door-loader.tsx`, animated by
the `cgd-intro-*` CSS keyframes in `app/globals.css`) plays inconsistently on first
visit: **sometimes the door rolls up at a steady pace, sometimes it appears to jump /
finish too fast.** A second site (Nexora / EvoCrea) has a subjectively smoother opener.

## Root cause

The intro itself is the *most* performant possible: it is server-rendered, its CSS
keyframe clock starts on first paint, and the door's roll-up is a composited
`translateY`. Nothing about the mechanism is wrong, and it should not be rewritten.

The inconsistency comes from **main-thread contention during the intro window**. Even a
composited animation drops visible frames when long tasks block frame *production*: the
animation's clock keeps advancing, no frames paint, then the door snaps forward when the
thread frees up — read by the eye as "too fast." A warm reload (assets cached, no long
tasks) plays smoothly, which is why it is intermittent.

What competes for the main thread while the door plays:

1. **The global smooth-scroll runtime.** `SmoothScrollProvider`
   (`components/motion/smooth-scroll-provider.tsx`) creates Lenis and adds a *continuous*
   GSAP ticker rAF loop the instant it mounts — per-frame work running through the whole
   intro, even though scroll is locked and there is nothing to smooth yet.
2. **The one-time hydration burst** — the home page eagerly hydrates its `dynamic()`
   sections + framer-motion (via `LazyMotion`) + GSAP/ScrollTrigger registration.

Note: `components/sections/scroll-door-reveal.tsx` and its 120-frame preloader are
**already** deferred behind `LazyOnVisible` (last section, 800px rootMargin) and do **not**
run during the intro. They are not a contributor here.

**Dev vs prod caveat:** a meaningful share of the jank is `npm run dev`-only — React
Strict Mode double-render, no CSS inlining (`experimental.inlineCss` is prod-only),
unminified bundle, on-demand route compilation. Verify behavior against
`npm run build && npm run start`, not dev.

## Goals

- The first-visit door animation plays at a steady framerate across cold and warm loads.
- No change to the intro's look, timing, CSS keyframes, or its removal logic.
- No regression to SEO (no SSR content pulled client-only) or to scroll/scrub behavior.
- A reusable, correct "intro is finished" signal other code can depend on.

## Non-goals

- Rewriting the intro to a JS/Framer clock (Nexora-style). That trades *down* on raw
  performance and adds risk to a working, perf-sensitive path. Explicitly rejected.
- Wrapping SSR'd home content sections in `LazyOnVisible` (would remove them from server
  HTML and hurt SEO).
- Touching the `cgd-intro-*` keyframes, the door visual, or the `.finished`-promise
  overlay removal (already correct).

## Design

### 1. Shared "intro ready" signal — `lib/intro-ready.ts`

A small client-only module that is the single source of truth for "the intro is no
longer protecting the main thread."

API:

- `markIntroReady(): void` — idempotent; resolves the gate and notifies subscribers.
- `whenIntroReady(): Promise<void>` — resolves when ready.

Resolves **immediately** (so nothing is delayed when there is no intro to protect) when
any of these hold at call time:

- `markIntroReady()` has already been called this load, OR
- `document.documentElement.classList.contains("intro-seen")` (refresh / already-welcomed
  path — the inline guard in `app/layout.tsx` sets this before first paint), OR
- there is no DOM / SSR context (guard for safe import).

Implementation sketch: a module-level `let ready = false` + a resolved-promise cache, plus
a list of pending resolvers flushed by `markIntroReady()`. `whenIntroReady()` checks the
class/flag synchronously first and returns an already-resolved promise when appropriate.

### 2. `GarageDoorLoader` marks the signal

`components/motion/garage-door-loader.tsx`:

- In `finish()` (the real completion path, already driven off the shell's WAA `.finished`
  promise), call `markIntroReady()` after `release()`.
- In the early "already welcomed this session" return (`alreadySeen`), call
  `markIntroReady()` immediately.
- Under `prefers-reduced-motion`, the intro is a minimal fade with little to protect —
  resolve the signal immediately (the existing finish path still runs).

No change to the removal timing or the safety-net timer.

### 3. Gate the global motion runtime on the signal

`components/motion/smooth-scroll-provider.tsx`: wrap the Lenis creation + GSAP ticker
registration so it runs **after** `whenIntroReady()` resolves instead of on mount.

- Keep the existing `prefers-reduced-motion` early-out (Lenis never created).
- Preserve all current cleanup. Because init is now async, use a "cancelled" flag so the
  effect's cleanup can no-op if it unmounts before the gate resolves, and so the
  init-then-teardown ordering is safe.
- The existing `intro-locked` MutationObserver stop/start logic can be simplified or kept;
  since init now happens after the intro, Lenis starts already-unlocked. Keep a minimal
  guard so a still-present lock is respected.

### 4. (Optional, same signal) cosmetic client widgets

`ScrollProgress` and the sticky mobile CTA mounted via `SiteChrome` can also defer their
mount/effect behind `whenIntroReady()`. They are inert during a scroll-locked intro. This
is a smaller win and may be dropped if it complicates the components.

## Edge cases

- **Already welcomed this session:** signal resolves immediately; smooth-scroll inits with
  no delay on subsequent navigations.
- **Reduced motion:** signal resolves immediately.
- **No Web Animations API / signal never fired by the door:** `GarageDoorLoader`'s
  safety-net timer still calls `finish()` → `markIntroReady()`. As a belt-and-suspenders
  measure, `whenIntroReady()` consumers should not hang forever — the door always calls
  `finish()` within `SAFETY_MS` (6s), so the gate always resolves.
- **SSR import safety:** `lib/intro-ready.ts` must guard `document` access so it can be
  imported anywhere without breaking the server build.

## Verification

No automated test suite exists; `npm run build` is the correctness gate (types/routes).

Manual / measured verification:

1. `npm run build && npm run start`, hard-load `/` with cache disabled and CPU throttled
   (DevTools 4–6× slowdown) → record a performance trace; confirm the door's frames are
   produced steadily (no long gap-then-snap) and Lenis/ticker work appears **after** the
   intro releases.
2. Confirm smooth-wheel scrolling and the `ScrollDoorReveal` scrub still work normally once
   the user scrolls.
3. Confirm a same-session navigation (intro already seen) has smooth scroll immediately
   with no perceptible delay.
4. `npm run build` passes.

## Risks

- **Ordering:** Lenis must be ready before the user can reach `ScrollDoorReveal`. Reaching
  it requires scrolling, which requires the intro to release scroll — the same event that
  initializes Lenis. Ordering holds.
- **Async effect teardown:** deferred init needs a cancelled-flag guard to avoid creating
  Lenis after unmount. Covered in the design.
- Low overall risk: the change defers existing work; it does not alter the intro or the
  scrub.
