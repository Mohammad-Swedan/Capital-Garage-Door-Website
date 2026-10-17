/**
 * The business's live Google rating, for server components (v1.3).
 *
 *   import { getGoogleRating } from "@/modules/source-tracking/server/google-rating";
 *   const live = await getGoogleRating();          // { rating, count, updatedAt } | null
 *   const rating = live?.rating ?? STATIC_RATING;  // always keep a static fallback
 *
 * Reads `GET ${CRM_API_URL}/source-tracking/public/google-rating` (anonymous; the
 * CRM caches Google's answer for ~6 h). Uses Next's fetch cache with
 * `revalidate` (default 1 h), so a page that calls it stays statically rendered
 * (ISR) — never call it from client code. Returns null on ANY failure (204 = GBP
 * not configured, non-2xx, timeout, bad body), so callers fall back to their own
 * static numbers. Use the pair together: never mix a live rating with a static count.
 *
 * Not re-exported from the module's index.ts, which client bundles import.
 */
import { crmApiBase } from "./crm-api";

export const GOOGLE_RATING_PATH = "/source-tracking/public/google-rating";
export const GOOGLE_RATING_REVALIDATE_SECONDS = 3600;
export const GOOGLE_RATING_TIMEOUT_MS = 2500;

export interface GoogleRating {
  /** Google's average, 1 decimal (1–5). */
  rating: number;
  /** Google's total review count (> 0). */
  count: number;
  /** ISO time the CRM read it from Google, or null. */
  updatedAt: string | null;
}

export interface GoogleRatingOptions {
  /** Next.js fetch-cache revalidate, seconds. Default 3600. */
  revalidate?: number;
  /** Abort the request after this many ms. Default 2500. */
  timeoutMs?: number;
}

/** Validates the endpoint's body; null unless rating is a number in 1..5 and count a positive integer. */
export function parseGoogleRating(body: unknown): GoogleRating | null {
  if (!body || typeof body !== "object") return null;
  const { rating, count, updatedAt } = body as Record<string, unknown>;
  if (typeof rating !== "number" || !Number.isFinite(rating) || rating < 1 || rating > 5) return null;
  if (typeof count !== "number" || !Number.isInteger(count) || count <= 0) return null;
  return { rating, count, updatedAt: typeof updatedAt === "string" ? updatedAt : null };
}

export async function getGoogleRating(options: GoogleRatingOptions = {}): Promise<GoogleRating | null> {
  const revalidate = options.revalidate ?? GOOGLE_RATING_REVALIDATE_SECONDS;
  const timeoutMs = options.timeoutMs ?? GOOGLE_RATING_TIMEOUT_MS;
  try {
    const res = await fetch(`${crmApiBase()}${GOOGLE_RATING_PATH}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status !== 200) return null;
    return parseGoogleRating(await res.json());
  } catch {
    return null;
  }
}
