/**
 * In-memory fixed-window limiter, per client IP. A cheap first line only —
 * the CRM API's own limiter (keyed on x-client-ip) is the authority. Per
 * process, so it resets on deploy; that is fine for its purpose.
 */
export interface RateLimiter {
  /** True when this hit is over the limit. */
  hit(key: string, now?: number): boolean;
}

export function createRateLimiter(limit: number, windowMs: number, maxKeys = 10_000): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    hit(key, now = Date.now()) {
      const entry = hits.get(key);
      if (!entry || now >= entry.resetAt) {
        if (hits.size >= maxKeys) {
          for (const [k, v] of hits) if (now >= v.resetAt) hits.delete(k);
          // Still full of live windows: drop the oldest insertions rather than grow without bound.
          if (hits.size >= maxKeys) {
            const excess = hits.size - maxKeys + 1;
            let i = 0;
            for (const k of hits.keys()) {
              if (i++ >= excess) break;
              hits.delete(k);
            }
          }
        }
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return false;
      }
      entry.count += 1;
      return entry.count > limit;
    },
  };
}
