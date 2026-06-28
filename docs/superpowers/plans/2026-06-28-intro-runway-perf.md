# Welcome-intro "Clear the Runway" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the global smooth-scroll/motion runtime from competing with the welcome garage-door intro for main-thread frame production, so the door rolls up at a steady framerate on every first visit.

**Architecture:** Introduce one tiny client-only signal module (`lib/intro-ready.ts`) that reports when the intro has finished — resolving *immediately* when there is no intro to protect. `GarageDoorLoader` fires the signal on completion; `SmoothScrollProvider` waits for it before creating Lenis and adding the continuous GSAP ticker. The intro's CSS keyframes, visual, and `.finished`-promise removal are left untouched.

**Tech Stack:** Next.js 16 / React 19, TypeScript, Lenis, GSAP + ScrollTrigger. Import alias `@/*` → repo root.

## Global Constraints

- **No test runner exists.** The correctness gate is `npm run build` (it fails on type/route errors). Per-task verification is `npm run build` + a precise manual browser check. Do not add a test framework.
- **Do not modify** the `cgd-intro-*` keyframes in `app/globals.css`, the door visual in `garage-door-loader.tsx`, or the overlay-removal `.finished`-promise logic.
- **SSR safety:** `lib/intro-ready.ts` is imported into client components but must guard every `document` access so it never throws if evaluated server-side.
- **Reduced motion / already-seen sessions must incur zero delay** — the signal resolves synchronously in those cases.
- Commit after each task. Branch is already `perf/intro-runway`.

---

### Task 1: Intro-ready signal module

**Files:**
- Create: `lib/intro-ready.ts`

**Interfaces:**
- Produces:
  - `markIntroReady(): void` — idempotent; resolves the gate and flushes all pending waiters.
  - `whenIntroReady(): Promise<void>` — resolves when the intro is finished, or immediately when there is none to protect (SSR, `<html>.intro-seen` already present, or `markIntroReady()` already called).

- [ ] **Step 1: Create the module**

Create `lib/intro-ready.ts`:

```ts
/**
 * Single source of truth for "the welcome intro is no longer holding the main
 * thread." Consumers that do heavy or continuous work on load (e.g. the global
 * smooth-scroll runtime) await `whenIntroReady()` so they don't compete with the
 * intro's CSS animation for frame production.
 *
 * Resolves immediately when there is no intro to protect:
 *  - a non-DOM (SSR) context,
 *  - a refresh / already-welcomed session — the inline guard in app/layout.tsx
 *    adds `.intro-seen` to <html> before first paint,
 *  - `markIntroReady()` has already been called this load.
 *
 * Client-only by usage, but safe to import anywhere — every DOM access is guarded.
 */

let ready = false;
let resolvers: Array<() => void> = [];

/** True when the intro is already over (or there was never one to wait for). */
function alreadyDone(): boolean {
  if (ready) return true;
  if (typeof document === "undefined") return true; // SSR — nothing to wait for
  // Refresh / already-welcomed: the inline guard set this before first paint.
  if (document.documentElement.classList.contains("intro-seen")) return true;
  return false;
}

/** Mark the intro finished and release every pending `whenIntroReady()` caller. */
export function markIntroReady(): void {
  if (ready) return;
  ready = true;
  const pending = resolvers;
  resolvers = [];
  for (const resolve of pending) resolve();
}

/** Resolves once the intro has finished (or immediately if there is none). */
export function whenIntroReady(): Promise<void> {
  if (alreadyDone()) {
    ready = true; // cache so subsequent calls stay synchronous
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    resolvers.push(resolve);
  });
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run build`
Expected: build completes with no type errors (the module is not yet imported anywhere, so this just confirms it compiles).

- [ ] **Step 3: Commit**

```bash
git add lib/intro-ready.ts
git commit -m "Add intro-ready signal module

Resolves immediately when there is no intro to protect (SSR, already-seen
session via .intro-seen, or reduced motion handled by callers).

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Fire the signal from the intro loader

**Files:**
- Modify: `components/motion/garage-door-loader.tsx`

**Interfaces:**
- Consumes: `markIntroReady` from `@/lib/intro-ready`.

- [ ] **Step 1: Import the signal**

At the top of `components/motion/garage-door-loader.tsx`, add the import alongside the existing imports:

```ts
import { markIntroReady } from "@/lib/intro-ready";
```

- [ ] **Step 2: Mark ready on the already-welcomed early return**

In the `useEffect`, the existing block is:

```ts
    if (alreadySeen) {
      setDone(true);
      return;
    }
```

Change it to:

```ts
    if (alreadySeen) {
      markIntroReady();
      setDone(true);
      return;
    }
```

- [ ] **Step 3: Mark ready when the intro finishes**

The existing `finish` callback is:

```ts
    const finish = () => {
      if (finished) return;
      finished = true;
      release();
      setDone(true);
    };
```

Change it to:

```ts
    const finish = () => {
      if (finished) return;
      finished = true;
      release();
      markIntroReady();
      setDone(true);
    };
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build completes, no type errors.

- [ ] **Step 5: Commit**

```bash
git add components/motion/garage-door-loader.tsx
git commit -m "Fire intro-ready signal when the welcome intro completes

Covers both completion paths: the .finished-driven finish() and the
already-welcomed early return.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Defer the smooth-scroll runtime until the intro is done

**Files:**
- Modify: `components/motion/smooth-scroll-provider.tsx`

**Interfaces:**
- Consumes: `whenIntroReady` from `@/lib/intro-ready`.

**Why:** The current effect creates Lenis and adds a continuous GSAP ticker rAF loop on mount — per-frame main-thread work that runs through the entire intro for no benefit (scroll is locked). Deferring init behind `whenIntroReady()` removes that contention. A fallback timer guarantees init even if the signal never fires (e.g. the loader unmounts mid-intro on a route change), and an `initialized` guard prevents the fallback and the signal from both initializing.

- [ ] **Step 1: Import the signal**

At the top of `components/motion/smooth-scroll-provider.tsx`, add:

```ts
import { whenIntroReady } from "@/lib/intro-ready";
```

- [ ] **Step 2: Replace the effect body with a deferred-init version**

Replace the entire `useEffect(() => { ... }, []);` body with:

```ts
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
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build completes, no type errors.

- [ ] **Step 4: Manual verification (production build)**

Run:
```bash
npm run build && npm run start
```

Then, in a browser at `http://localhost:3000`:

1. **Smoothness (the fix):** Open DevTools → Performance, enable 4–6× CPU throttle and "Disable cache", then record while hard-reloading `/` in a fresh session (clear `sessionStorage` first, or use a new incognito window). Expected: the door curtain's `translateY` frames are produced steadily — no long freeze-then-snap. In the trace, Lenis/GSAP ticker activity should appear **after** the intro releases, not during it.
2. **Scroll still works:** After the intro, wheel/trackpad scrolling is smooth (Lenis active).
3. **Scrub still works:** Scroll to the final `ScrollDoorReveal` section; the pinned door-reveal scrubs normally.
4. **Already-seen path:** Navigate within the site (e.g. to a service page) and back; smooth scrolling is active immediately with no perceptible delay (intro does not replay; `whenIntroReady()` resolved synchronously).
5. **Reduced motion:** With OS "reduce motion" on, reload `/`; smooth scroll is disabled (native scroll) and no errors in console.

- [ ] **Step 5: Commit**

```bash
git add components/motion/smooth-scroll-provider.tsx
git commit -m "Defer Lenis + GSAP ticker until the welcome intro finishes

Removes the continuous smooth-scroll rAF loop from the intro window so it
no longer competes with the door animation for frame production. Fallback
timer + initialized guard keep init robust if the signal never fires.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Spec §Design.1 (signal module) → Task 1. ✓
- Spec §Design.2 (`GarageDoorLoader` marks signal, both paths, reduced-motion) → Task 2. Reduced motion: `finish()` still runs under the reduced-motion CSS fade and calls `markIntroReady()`; already-seen resolves synchronously via `.intro-seen`. ✓
- Spec §Design.3 (gate `SmoothScrollProvider`) → Task 3, including the cancelled-flag guard and the lock-respecting `sync`. ✓
- Spec §Design.4 (optional cosmetic widget deferral) → **intentionally dropped** per the approved decision to keep the change minimal. Not a gap.
- Spec §Edge cases — already-welcomed (Task 2 Step 2), reduced motion (Task 3 early-out + synchronous resolve), no-WAA / signal-never-fires (Task 3 fallback timer), SSR import safety (Task 1 `typeof document` guard). ✓
- Spec §Verification → Task 3 Step 4 (build + start, throttled trace, scroll/scrub/already-seen/reduced-motion checks). ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"; every code step shows complete code. ✓

**Type consistency:** `markIntroReady(): void` and `whenIntroReady(): Promise<void>` are defined in Task 1 and consumed with those exact names/signatures in Tasks 2 and 3. ✓
