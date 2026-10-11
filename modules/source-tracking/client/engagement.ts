/**
 * Engaged-time clock for one page: time the page was visible AND the visitor
 * was not idle for more than `idleMs`. Pure (time is passed in) so it is
 * unit-testable.
 */
export interface EngagementClock {
  /** Any sign of life: scroll, pointer, key. */
  activity(now: number): void;
  visibility(visible: boolean, now: number): void;
  total(now: number): number;
}

export const IDLE_MS = 30_000;

export function createEngagementClock(now: number, visible: boolean, idleMs = IDLE_MS): EngagementClock {
  let engaged = 0;
  let lastTick = now;
  let lastActivity = now;
  let isVisible = visible;

  const accrue = (t: number) => {
    if (isVisible) {
      const activeUntil = Math.min(t, lastActivity + idleMs);
      if (activeUntil > lastTick) engaged += activeUntil - lastTick;
    }
    lastTick = Math.max(lastTick, t);
  };

  return {
    activity(t) {
      accrue(t);
      lastActivity = t;
    },
    visibility(v, t) {
      accrue(t);
      isVisible = v;
      // Coming back to the tab counts as activity.
      if (v) lastActivity = t;
    },
    total(t) {
      accrue(t);
      return Math.round(engaged);
    },
  };
}

export const SCROLL_MILESTONES = [25, 50, 75, 90] as const;

/** Percentage of the document seen so far (bottom of viewport / document height). */
export function scrollPercent(scrollY: number, viewportH: number, documentH: number): number {
  if (!(documentH > 0)) return 100;
  const pct = ((scrollY + viewportH) / documentH) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function milestonesReached(maxPct: number): number[] {
  return SCROLL_MILESTONES.filter((m) => maxPct >= m);
}
