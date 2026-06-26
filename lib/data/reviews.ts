import { reviews, reviewsSummary } from "@/content/reviews";
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
const CMS_ON = process.env.CMS_REVIEWS === "on";

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

export async function getReviewsSummary(): Promise<ReviewsSummary> {
  if (CMS_ON) {
    const cms = await loadCmsReviews();
    if (cms) return cms.summary;
  }
  return reviewsSummary;
}
