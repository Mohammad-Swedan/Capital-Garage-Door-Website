import { afterEach, describe, expect, it, vi } from "vitest";
import { GOOGLE_RATING_PATH, GOOGLE_RATING_REVALIDATE_SECONDS, getGoogleRating, parseGoogleRating } from "./google-rating";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("parseGoogleRating", () => {
  it("accepts a well-formed body", () => {
    expect(parseGoogleRating({ rating: 4.7, count: 354, updatedAt: "2026-10-17T00:00:00Z" })).toEqual({
      rating: 4.7,
      count: 354,
      updatedAt: "2026-10-17T00:00:00Z",
    });
  });

  it.each([
    null,
    "x",
    {},
    { rating: 0, count: 3, updatedAt: "x" },
    { rating: 5.1, count: 3, updatedAt: "x" },
    { rating: "4.7", count: 3, updatedAt: "x" },
    { rating: 4.7, count: 0, updatedAt: "x" },
    { rating: 4.7, count: 3.5, updatedAt: "x" },
    { rating: Number.NaN, count: 3, updatedAt: "x" },
  ])("rejects %j", (body) => {
    expect(parseGoogleRating(body)).toBeNull();
  });

  it("keeps the rating but nulls a missing updatedAt", () => {
    expect(parseGoogleRating({ rating: 4.5, count: 10 })).toEqual({ rating: 4.5, count: 10, updatedAt: null });
  });
});

describe("getGoogleRating", () => {
  it("fetches the public endpoint on the CRM API base with ISR revalidate", async () => {
    vi.stubEnv("CRM_API_URL", "https://crm.example.com/api/");
    const fetchMock = vi.fn().mockResolvedValue(json({ rating: 4.7, count: 354, updatedAt: "2026-10-17T00:00:00Z" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getGoogleRating()).resolves.toEqual({ rating: 4.7, count: 354, updatedAt: "2026-10-17T00:00:00Z" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`https://crm.example.com/api${GOOGLE_RATING_PATH}`);
    expect(init.next).toEqual({ revalidate: GOOGLE_RATING_REVALIDATE_SECONDS });
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("passes a custom revalidate through", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ rating: 4.7, count: 354, updatedAt: null }));
    vi.stubGlobal("fetch", fetchMock);
    await getGoogleRating({ revalidate: 60 });
    expect(fetchMock.mock.calls[0][1].next).toEqual({ revalidate: 60 });
  });

  it("is null on 204 (not configured / nothing cached)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    await expect(getGoogleRating()).resolves.toBeNull();
  });

  it("is null on a non-2xx answer", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ message: "nope" }, 500)));
    await expect(getGoogleRating()).resolves.toBeNull();
  });

  it("is null when the request throws (CRM down, timeout)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    await expect(getGoogleRating()).resolves.toBeNull();
  });

  it("is null on a body that is not JSON or has the wrong shape", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>", { status: 200 })));
    await expect(getGoogleRating()).resolves.toBeNull();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ rating: 9, count: 1 })));
    await expect(getGoogleRating()).resolves.toBeNull();
  });

  it("gives up after the timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init.signal?.addEventListener("abort", () => reject(init.signal?.reason));
          }),
      ),
    );
    await expect(getGoogleRating({ timeoutMs: 20 })).resolves.toBeNull();
  });
});
