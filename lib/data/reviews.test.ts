import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `getReviewsSummary()` — the live Google pair (source-tracking 1.3) over the static fallback.
 * Every collaborator is mocked: the live read, the CMS read and the local content summary.
 */
const live = vi.hoisted(() => ({ value: null as null | { rating: number; count: number; updatedAt: string | null } }));
const cms = vi.hoisted(() => ({ value: null as null | { summary: { averageRating: number; totalReviews: number }; items: [] } }));
const local = vi.hoisted(() => ({
  summary: {
    averageRating: 5,
    totalReviews: 10,
    googleProfileUrl: "https://example.com/profile",
    googleWriteReviewUrl: "https://example.com/write",
  },
}));

vi.mock("@/modules/source-tracking/server/google-rating", () => ({
  getGoogleRating: vi.fn(async () => live.value),
}));
vi.mock("@/lib/cms/reviews-client", () => ({
  cmsPublicReviews: vi.fn(async () => cms.value),
}));
vi.mock("@/content/reviews", () => ({
  get reviewsSummary() {
    return local.summary;
  },
  reviews: [],
}));

import { getReviewsSummary } from "./reviews";

beforeEach(() => {
  live.value = null;
  cms.value = null;
  local.summary = { ...local.summary, averageRating: 5, totalReviews: 10 };
});

describe("getReviewsSummary", () => {
  it("falls back to the static summary when the live read returns nothing (204, CRM down)", async () => {
    expect(await getReviewsSummary()).toEqual(local.summary);
  });

  it("takes the live rating and count together, keeping the static links", async () => {
    live.value = { rating: 4.8, count: 37, updatedAt: null };
    expect(await getReviewsSummary()).toEqual({ ...local.summary, averageRating: 4.8, totalReviews: 37 });
  });

  it("uses the CMS aggregate as the fallback when the CMS has reviews", async () => {
    cms.value = { summary: { averageRating: 4.9, totalReviews: 12 }, items: [] };
    const summary = await getReviewsSummary();
    expect(summary.averageRating).toBe(4.9);
    expect(summary.totalReviews).toBe(12);
  });

  it("keeps the live pair off while the static summary has no reviews", async () => {
    local.summary = { ...local.summary, averageRating: 0, totalReviews: 0 };
    live.value = { rating: 4.8, count: 37, updatedAt: null };
    const summary = await getReviewsSummary();
    expect(summary.averageRating).toBe(0);
    expect(summary.totalReviews).toBe(0);
  });
});
