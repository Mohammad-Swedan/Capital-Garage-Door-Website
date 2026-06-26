/**
 * Self-contained client for the public CMS reviews endpoint, kept separate from lib/cms/client.ts
 * (which other work touches). The /reviews loader uses this when CMS_REVIEWS === "on". camelCase
 * DTOs; mirrors the fetch/revalidate style of lib/cms/client.ts.
 */

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:5179";
const REVALIDATE_SECONDS = 3600;

/** A single review item from GET /api/reviews (mirrors the backend ReviewDto, camelCase). */
export interface CmsPublicReviewItem {
  id: number;
  customerName: string;
  rating: number;
  text: string;
  /** ISO date "YYYY-MM-DD" (DateOnly). */
  reviewDate: string;
  service?: string | null;
  suburb?: string | null;
  /** Enum NAME string ("Google" | "Facebook" | "Website") or omitted. */
  sourcePlatform?: string | null;
  isFeatured: boolean;
}

/** The full payload from GET /api/reviews. */
export interface CmsPublicReviews {
  summary: {
    /** Average rating across all reviews, 1 decimal place. */
    averageRating: number;
    totalReviews: number;
  };
  items: CmsPublicReviewItem[];
}

/**
 * GET /api/reviews — public reviews with aggregate summary. Returns null on any failure so the
 * loader can fall back to local content and the page never crashes.
 */
export async function cmsPublicReviews(): Promise<CmsPublicReviews | null> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/reviews`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["cms-reviews"] },
    });
    if (!res.ok) return null;
    return (await res.json()) as CmsPublicReviews;
  } catch {
    return null;
  }
}
