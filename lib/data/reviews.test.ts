import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `getReviewsSummary()` — the live Google pair (source-tracking 1.3) over the static fallback.
 * Every collaborator is mocked: the live read, the CMS read and the local content summary.
 */
const live = vi.hoisted(() => ({ value: null as null | { rating: number; count: number; updatedAt: string | null } }));
const cms = vi.hoisted(() => ({ value: null as null | { summary: { averageRating: number; totalReviews: number }; items: [] } }));
const liveReviews = vi.hoisted(() => ({ value: [] as unknown[] }));
const curated = vi.hoisted(() => [
  {
    id: "1",
    customerName: "Jane Smith",
    rating: 5,
    text: "Fantastic service! The technician fixed our spring in no time, highly recommend.",
    suburb: "Joondalup",
    service: "Repairs",
    source: "Google",
    date: "2026-08-01",
    featured: true,
  },
]);
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
vi.mock("@/modules/source-tracking/server/google-reviews", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/modules/source-tracking/server/google-reviews")>()),
  getGoogleReviews: vi.fn(async () => liveReviews.value),
}));
vi.mock("@/lib/cms/reviews-client", () => ({
  cmsPublicReviews: vi.fn(async () => cms.value),
}));
vi.mock("@/content/reviews", () => ({
  get reviewsSummary() {
    return local.summary;
  },
  get reviews() {
    return curated;
  },
}));

import { getFeaturedReviews, getReviews, getReviewsSummary } from "./reviews";
import { reviewSchemasFromReviews } from "@/lib/seo/schema";

beforeEach(() => {
  live.value = null;
  liveReviews.value = [];
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

const google = (id: string, author: string, rating: number, text: string) => ({
  id,
  author,
  rating,
  text,
  createdAt: "2026-10-17T01:02:02Z",
});

describe("getReviews (source-tracking 1.4)", () => {
  it("is the curated set when the live read is empty (CRM down, GBP not configured)", async () => {
    expect(await getReviews()).toEqual(curated);
  });

  it("puts new Google reviews first, skips ones already published and ones under 4 stars", async () => {
    liveReviews.value = [
      google("new", "Hayley N", 5, "Absolute life saver! Prompt response, quick repair, super friendly."),
      google("dup", "Jane S", 5, "Fantastic service! The technician fixed our spring in no time."),
      google("low", "Some One", 2, "They were late and the price was higher than quoted."),
    ];
    const list = await getReviews();
    expect(list.map((r) => r.id)).toEqual(["google-new", "1"]);
    expect(list[0]).toMatchObject({ customerName: "Hayley N", source: "Google", suburb: "", service: "", date: "2026-10-17", live: true });
  });

  it("keeps featured curated-only and never marks up live reviews", async () => {
    liveReviews.value = [google("new", "Hayley N", 5, "Absolute life saver! Prompt response, quick repair.")];
    expect((await getFeaturedReviews()).map((r) => r.id)).toEqual(["1"]);
    const nodes = reviewSchemasFromReviews(await getReviews()) as Array<{ author: { name: string } }>;
    expect(nodes.map((n) => n.author.name)).toEqual(["Jane Smith"]);
  });
});
