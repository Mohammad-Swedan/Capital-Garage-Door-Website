import { reviews, reviewsSummary } from "@/content/reviews";
import type { Review, ReviewsSummary } from "@/types/review";

/**
 * Data-access layer for the /reviews page. Reads from local content now; swap
 * the implementation for a live Google Reviews / CRM feed later without
 * changing call sites.
 */
export async function getReviews(): Promise<Review[]> {
  return reviews;
}

export async function getFeaturedReviews(): Promise<Review[]> {
  return reviews.filter((review) => review.featured);
}

export async function getReviewsSummary(): Promise<ReviewsSummary> {
  return reviewsSummary;
}
