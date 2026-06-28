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
