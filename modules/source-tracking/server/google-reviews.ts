/**
 * The business's newest written Google reviews, for server components (v1.4).
 *
 *   import { getGoogleReviews, newGoogleReviews } from "@/modules/source-tracking/server/google-reviews";
 *   const live = await getGoogleReviews();                       // GoogleReview[] (newest first), [] on failure
 *   const extra = newGoogleReviews(live, published, { minRating: 4 }); // only the ones the site doesn't show yet
 *
 * Reads `GET ${CRM_API_URL}/source-tracking/public/google-reviews` (anonymous; the
 * CRM reads them from Google in the SAME cached call as the rating, ~6 h). Uses
 * Next's fetch cache with `revalidate` (default 1 h), so pages stay statically
 * rendered (ISR) — never call it from client code. Returns [] on ANY failure (204
 * = GBP not configured, non-2xx, timeout, bad body), so a site simply keeps its
 * own curated reviews.
 *
 * Show the text as Google gives it (the reviewer's own words): trimming for a card
 * is fine, rewriting is not. Keep live reviews OUT of Review JSON-LD — they are a
 * visual addition, and the curated set stays what the schema describes.
 *
 * Not re-exported from the module's index.ts, which client bundles import.
 */
import { crmApiBase } from "./crm-api";

export const GOOGLE_REVIEWS_PATH = "/source-tracking/public/google-reviews";
export const GOOGLE_REVIEWS_REVALIDATE_SECONDS = 3600;
export const GOOGLE_REVIEWS_TIMEOUT_MS = 2500;

export interface GoogleReview {
  /** Google's review id (stable). */
  id: string;
  /** The reviewer's Google display name. */
  author: string;
  /** 1–5 stars. */
  rating: number;
  /** The reviewer's own words (never empty). */
  text: string;
  /** ISO time the review was posted. */
  createdAt: string;
}

export interface GoogleReviewsOptions {
  /** Next.js fetch-cache revalidate, seconds. Default 3600. */
  revalidate?: number;
  /** Abort the request after this many ms. Default 2500. */
  timeoutMs?: number;
}

/** Validates the endpoint's body; drops any malformed entry, keeps the order (newest first). */
export function parseGoogleReviews(body: unknown): GoogleReview[] {
  if (!body || typeof body !== "object") return [];
  const list = (body as Record<string, unknown>).reviews;
  if (!Array.isArray(list)) return [];
  const out: GoogleReview[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const { id, author, rating, text, createdAt } = item as Record<string, unknown>;
    if (typeof id !== "string" || !id) continue;
    if (typeof author !== "string" || !author.trim()) continue;
    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) continue;
    if (typeof text !== "string" || !text.trim()) continue;
    if (typeof createdAt !== "string" || Number.isNaN(Date.parse(createdAt))) continue;
    out.push({ id, author: author.trim(), rating, text: text.trim(), createdAt });
  }
  return out;
}

export async function getGoogleReviews(options: GoogleReviewsOptions = {}): Promise<GoogleReview[]> {
  const revalidate = options.revalidate ?? GOOGLE_REVIEWS_REVALIDATE_SECONDS;
  const timeoutMs = options.timeoutMs ?? GOOGLE_REVIEWS_TIMEOUT_MS;
  try {
    const res = await fetch(`${crmApiBase()}${GOOGLE_REVIEWS_PATH}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status !== 200) return [];
    return parseGoogleReviews(await res.json());
  } catch {
    return [];
  }
}

/** A review the site already publishes (any shape: map its name and text). */
export interface PublishedReviewLike {
  name: string;
  text: string;
}

export interface NewGoogleReviewsOptions {
  /** Lowest star value to show. Default 4. */
  minRating?: number;
  /** Shortest text (characters) worth a card. Default 20. */
  minTextLength?: number;
  /** Most to return. Default 20. */
  limit?: number;
}

/** Lower-case letters and digits only, so punctuation, emoji, spacing and line breaks never decide a match. */
export function normaliseReviewText(text: string): string {
  return text.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, "");
}

const firstName = (name: string) => normaliseReviewText(name.trim().split(/\s+/)[0] ?? "");

/**
 * The live reviews the site does NOT already publish, filtered for display (stars, length),
 * newest first. Published reviews carry no Google id, so a match is by words: the same
 * opening (first 40 letters/digits), or the same first name with one text containing the
 * other's first 20. Curated copies that were lightly edited (punctuation, spacing, case)
 * still match; a different review by the same first name does not.
 */
export function newGoogleReviews(
  live: GoogleReview[],
  published: PublishedReviewLike[],
  options: NewGoogleReviewsOptions = {},
): GoogleReview[] {
  const minRating = options.minRating ?? 4;
  const minTextLength = options.minTextLength ?? 20;
  const limit = options.limit ?? 20;
  const known = published.map((p) => ({ first: firstName(p.name), text: normaliseReviewText(p.text) }));
  const seen = new Set<string>();
  const out: GoogleReview[] = [];
  for (const r of live) {
    if (out.length >= limit) break;
    if (r.rating < minRating || r.text.trim().length < minTextLength || seen.has(r.id)) continue;
    const text = normaliseReviewText(r.text);
    const first = firstName(r.author);
    const opening = text.slice(0, 40);
    const duplicate = known.some(
      (k) =>
        (opening.length >= 10 && k.text.slice(0, 40) === opening) ||
        (k.first === first && first !== "" &&
          ((text.length >= 20 && k.text.includes(text.slice(0, 20))) || (k.text.length >= 20 && text.includes(k.text.slice(0, 20))))),
    );
    if (duplicate) continue;
    seen.add(r.id);
    out.push(r);
  }
  return out;
}
