import { cache } from "react";
import { reviews, reviewsSummary } from "@/content/reviews";
import { getGoogleRating } from "@/modules/source-tracking/server/google-rating";
import type { Review, ReviewsSummary } from "@/types/review";
import { cmsPublicReviews, type CmsPublicReviewItem } from "@/lib/cms/reviews-client";

/**
 * Data-access layer for the /reviews page.
 *
 * When `CMS_REVIEWS === "on"` this reads the public reviews-with-summary endpoint from the ASP.NET
 * CMS API (GET /api/reviews); otherwise it falls back to the local `content/reviews.ts` module (the
 * current source of truth). This flag-guarded seam is how the site cuts over to the CMS without
 * breaking the live page (docs/cms-architecture.md §8). Call sites (app/reviews/page.tsx) do not
 * change. If the CMS read fails, we fall back to local content so the page never crashes.
 *
 * NOTE: the homepage testimonials (content/testimonials.ts + lib/data/testimonials.ts) are a
 * separate concern and are intentionally left untouched here.
 */
const CMS_ON = (process.env.CMS_REVIEWS ?? "on") === "on";

/** Map a CMS review item to the front-end `Review` shape the page/components expect. */
function mapReview(item: CmsPublicReviewItem): Review {
  return {
    id: String(item.id),
    customerName: item.customerName,
    rating: item.rating,
    text: item.text,
    // The CMS allows null service/suburb; the page expects strings, so coalesce to "".
    suburb: item.suburb ?? "",
    service: item.service ?? "",
    // sourcePlatform is the enum NAME ("Google" | "Facebook" | "Website") or omitted.
    source: item.sourcePlatform ?? "",
    date: item.reviewDate,
    featured: item.isFeatured,
  };
}

/**
 * Load every review from the CMS once (newest first), or return null to signal a fall back to the
 * local content module. Shared by all three exported accessors so the page makes a single fetch
 * (de-duped by Next's fetch cache).
 */
async function loadCmsReviews(): Promise<{ items: Review[]; summary: ReviewsSummary } | null> {
  const payload = await cmsPublicReviews();
  if (!payload) return null;

  return {
    items: payload.items.map(mapReview),
    summary: {
      averageRating: payload.summary.averageRating,
      totalReviews: payload.summary.totalReviews,
      // The Google profile / write-review deep links are not modelled in the CMS; keep them from
      // the local content config so the CTA links keep working.
      googleProfileUrl: reviewsSummary.googleProfileUrl,
      googleWriteReviewUrl: reviewsSummary.googleWriteReviewUrl,
    },
  };
}

export async function getReviews(): Promise<Review[]> {
  if (CMS_ON) {
    const cms = await loadCmsReviews();
    if (cms) return cms.items;
  }
  return reviews;
}

export async function getFeaturedReviews(): Promise<Review[]> {
  if (CMS_ON) {
    const cms = await loadCmsReviews();
    if (cms) return cms.items.filter((review) => review.featured);
  }
  return reviews.filter((review) => review.featured);
}

/**
 * The ONE source of the rating/count the site shows — the layout's schema `aggregateRating`, the hero chip, the /service-areas chip and `RatingSummaryCard` on /reviews.
 *
 * Since source-tracking 1.3 the pair is read LIVE from the Google Business Profile through the
 * CRM (`getGoogleRating()` → `GET {CRM_API_URL}/source-tracking/public/google-rating`; the CRM
 * caches ~6 h, the fetch revalidates hourly, so pages stay statically rendered with ISR). The
 * static summary below (CMS, else `content/reviews.ts`) is the FALLBACK whenever the live read
 * returns nothing (CRM down, GBP not configured → 204, Google failing).
 *
 * - Live numbers are used as a PAIR or not at all — never a live rating with a static count.
 * - A static summary of 0 reviews keeps the live pair OFF too, so every rating surface stays
 *   hidden until there is a rating to substantiate (`totalReviews > 0` guards them all).
 * - React `cache()`: the layout (schema) and the page (chips) both call this in one render;
 *   memoising here guarantees they read the SAME pair. The live fetch carries an AbortSignal
 *   timeout, which opts it out of Next's own fetch memoisation.
 */
export const getReviewsSummary = cache(async (): Promise<ReviewsSummary> => {
  const [fallback, live] = await Promise.all([getStaticSummary(), getGoogleRating()]);
  if (live && fallback.totalReviews > 0) {
    return { ...fallback, averageRating: live.rating, totalReviews: live.count };
  }
  return fallback;
});

/** The summary before the live Google pair: the CMS aggregate, else `content/reviews.ts`. */
async function getStaticSummary(): Promise<ReviewsSummary> {
  if (CMS_ON) {
    const cms = await loadCmsReviews();
    if (cms) return cms.summary;
  }
  return reviewsSummary;
}
