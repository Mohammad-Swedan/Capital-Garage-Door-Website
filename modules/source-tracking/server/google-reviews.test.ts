import { afterEach, describe, expect, it, vi } from "vitest";
import {
  GOOGLE_REVIEWS_PATH,
  GOOGLE_REVIEWS_REVALIDATE_SECONDS,
  getGoogleReviews,
  newGoogleReviews,
  parseGoogleReviews,
  type GoogleReview,
} from "./google-reviews";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

const review = (over: Partial<GoogleReview> = {}): GoogleReview => ({
  id: "r1",
  author: "Mia Caldwell",
  rating: 5,
  text: "Our garage door broke at 6pm and the tech was here by 8pm fixing it.",
  createdAt: "2026-10-13T12:18:46Z",
  ...over,
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("parseGoogleReviews", () => {
  it("keeps well-formed entries in order and trims", () => {
    const body = { reviews: [review({ id: "a", author: " A B " }), review({ id: "b" })], updatedAt: "x" };
    expect(parseGoogleReviews(body).map((r) => [r.id, r.author])).toEqual([["a", "A B"], ["b", "Mia Caldwell"]]);
  });

  it.each([null, "x", {}, { reviews: "x" }])("is empty for %j", (body) => {
    expect(parseGoogleReviews(body)).toEqual([]);
  });

  it("drops malformed entries only", () => {
    const body = {
      reviews: [
        review({ id: "" }),
        review({ id: "2", author: " " }),
        review({ id: "3", rating: 0 }),
        review({ id: "4", rating: 4.5 }),
        review({ id: "5", text: "  " }),
        review({ id: "6", createdAt: "not a date" }),
        null,
        review({ id: "ok" }),
      ],
    };
    expect(parseGoogleReviews(body).map((r) => r.id)).toEqual(["ok"]);
  });
});

describe("getGoogleReviews", () => {
  it("reads the endpoint with ISR revalidate", async () => {
    vi.stubEnv("CRM_API_URL", "https://crm.example/api");
    const fetchMock = vi.fn(async () => json({ reviews: [review()] }));
    vi.stubGlobal("fetch", fetchMock);
    const list = await getGoogleReviews();
    expect(list).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit & { next?: { revalidate?: number } }];
    expect(url).toBe(`https://crm.example/api${GOOGLE_REVIEWS_PATH}`);
    expect(init.next?.revalidate).toBe(GOOGLE_REVIEWS_REVALIDATE_SECONDS);
  });

  it.each([
    ["204", async () => new Response(null, { status: 204 })],
    ["500", async () => json({ reviews: [review()] }, 500)],
    ["a network error", async () => { throw new Error("offline"); }],
    ["a bad body", async () => new Response("<html>", { status: 200 })],
  ])("is empty on %s", async (_label, impl) => {
    vi.stubGlobal("fetch", vi.fn(impl));
    expect(await getGoogleReviews()).toEqual([]);
  });
});

describe("newGoogleReviews", () => {
  const published = [
    { name: "Therese John", text: "Fantastic service! The technician fixed our spring in no time, highly recommend." },
    { name: "Mia C.", text: "Our garage door broke at 6pm — and the tech was here by 8pm, fixing it!" },
  ];

  it("drops reviews the site already shows, even lightly edited", () => {
    expect(newGoogleReviews([review()], published)).toEqual([]);
  });

  it("matches an edited copy by first name and shared words", () => {
    const live = review({ id: "t", author: "Therese J", text: "Wow. Fantastic service! The technician fixed our spring in no time." });
    expect(newGoogleReviews([live], published)).toEqual([]);
  });

  it("keeps a different review by someone with the same first name", () => {
    const live = review({ id: "m2", author: "Mia Smith", text: "Replaced both cables on a Saturday, very fair price and tidy work." });
    expect(newGoogleReviews([live], published).map((r) => r.id)).toEqual(["m2"]);
  });

  it("filters by stars, length and limit, keeping order", () => {
    const live = [
      review({ id: "low", rating: 3, text: "Okay but they were late to arrive on the day." }),
      review({ id: "short", text: "Great!" }),
      review({ id: "a", text: "Brilliant service and workmanship from start to finish." }),
      review({ id: "b", rating: 4, text: "Quick to respond and fixed the motor the same day." }),
      review({ id: "a", text: "Brilliant service and workmanship from start to finish." }),
    ];
    expect(newGoogleReviews(live, []).map((r) => r.id)).toEqual(["a", "b"]);
    expect(newGoogleReviews(live, [], { minRating: 5 }).map((r) => r.id)).toEqual(["a"]);
    expect(newGoogleReviews(live, [], { minRating: 1, minTextLength: 1 }).map((r) => r.id)).toEqual(["low", "short", "a", "b"]);
    expect(newGoogleReviews(live, [], { limit: 1 }).map((r) => r.id)).toEqual(["a"]);
  });
});
