import { afterEach, describe, expect, it, vi } from "vitest";
import { sourceTrackingConfig } from "@/config/source-tracking";
import { createRateLimiter } from "./rate-limit";
import { clientIpFrom, contextFrom, geoFrom, readCookieHeader, visitorKeyFrom } from "./request-context";
import { validateBatch } from "./validate";
import { CRM_WARN_INTERVAL_MS, POST, RATE_LIMIT_PER_MINUTE, warnCrmResponse } from "./events-route";

const SID = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";
const VID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const event = (over: Record<string, unknown> = {}) => ({
  type: "page_view",
  path: "/lp/x",
  pageGroup: "lp",
  label: null,
  placement: null,
  ageMs: 10,
  props: { viewportW: 390 },
  ...over,
});

describe("validateBatch", () => {
  it("accepts a well-formed batch", () => {
    const batch = validateBatch({
      sessionId: SID.toUpperCase(),
      entry: { landingPath: "/lp/x", landingQuery: "gclid=abc", referrer: "https://www.google.com/" },
      events: [event()],
    });
    expect(batch).toEqual({
      sessionId: SID,
      entry: { landingPath: "/lp/x", landingQuery: "?gclid=abc", referrer: "https://www.google.com/" },
      events: [event()],
    });
  });

  it("rejects a missing/invalid session and empty batches", () => {
    expect(validateBatch(null)).toBeNull();
    expect(validateBatch({ sessionId: "x", events: [event()] })).toBeNull();
    expect(validateBatch({ sessionId: SID, events: [] })).toBeNull();
    expect(validateBatch({ sessionId: SID, events: "nope" })).toBeNull();
  });

  it("drops events outside the allow-list, including server-only action types", () => {
    const batch = validateBatch({
      sessionId: SID,
      events: [event({ type: "manual_call" }), event({ type: "ads_call" }), event({ type: "evil" }), event()],
    });
    expect(batch?.events.map((e) => e.type)).toEqual(["page_view"]);
  });

  it("caps the batch at 20 and bounds every field", () => {
    const batch = validateBatch({
      sessionId: SID,
      entry: { landingPath: "not-a-path" },
      events: Array.from({ length: 30 }, () =>
        event({
          path: "no-slash",
          pageGroup: "made-up",
          label: "x".repeat(500),
          placement: "y".repeat(100),
          ageMs: 9_999_999,
          props: { big: "z".repeat(3000), list: [1, 2, { x: 1 }], obj: { a: 1 } },
        }),
      ),
    });
    expect(batch?.events).toHaveLength(20);
    expect(batch?.entry).toBeNull();
    const e = batch!.events[0];
    expect(e.path).toBe("/");
    expect(e.pageGroup).toBe("other");
    expect(e.label).toHaveLength(120);
    expect(e.placement).toHaveLength(60);
    expect(e.ageMs).toBe(120_000);
    expect(e.props).toEqual({ big: "z".repeat(300), list: [1, 2] });
  });

  it("clamps negative ages to 0", () => {
    expect(validateBatch({ sessionId: SID, events: [event({ ageMs: -50 })] })?.events[0].ageMs).toBe(0);
  });
});

describe("request context", () => {
  it("reads the visitor id from the cookie only", () => {
    const h = new Headers({ cookie: `a=1; xyz_vid=${VID}; b=2` });
    expect(readCookieHeader(h.get("cookie"), "b")).toBe("2");
    expect(visitorKeyFrom(h, "xyz_vid")).toBe(VID);
    expect(visitorKeyFrom(new Headers({ cookie: "xyz_vid=garbage" }), "xyz_vid")).toBeNull();
    expect(visitorKeyFrom(new Headers(), "xyz_vid")).toBeNull();
  });

  it("trusts cf-connecting-ip only when the instance says the site is behind Cloudflare", () => {
    const h = new Headers({ "cf-connecting-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" });
    expect(clientIpFrom(h, true)).toBe("1.1.1.1");
    // A client can set cf-connecting-ip itself, so without the opt-in it is ignored.
    expect(clientIpFrom(h, false)).toBe("2.2.2.2");
    expect(clientIpFrom(h)).toBe(sourceTrackingConfig.trustCloudflareIpHeader ? "1.1.1.1" : "2.2.2.2");
  });

  it("uses the right-most x-forwarded-for hop (added by our proxy), not the client-supplied left-most", () => {
    expect(clientIpFrom(new Headers({ "x-forwarded-for": "6.6.6.6, 3.3.3.3, 10.0.0.1" }), false)).toBe("10.0.0.1");
    expect(clientIpFrom(new Headers({ "x-forwarded-for": "3.3.3.3" }), true)).toBe("3.3.3.3");
    expect(clientIpFrom(new Headers(), true)).toBeNull();
    expect(clientIpFrom(new Headers(), false)).toBeNull();
  });

  it("reads Cloudflare geo headers", () => {
    expect(
      geoFrom(
        new Headers({ "cf-ipcountry": "au", "cf-region-code": "WA", "cf-ipcity": "Perth", "cf-postal-code": "6000" }),
      ),
    ).toEqual({ country: "AU", region: "WA", city: "Perth", postcode: "6000" });
    expect(geoFrom(new Headers({ "cf-ipcountry": "XX", "cf-region": "Western Australia" }))).toEqual({
      country: null,
      region: "Western Australia",
      city: null,
      postcode: null,
    });
  });

  it("classifies the device and bot flag from the User-Agent", () => {
    const ctx = contextFrom(new Headers({ "user-agent": IPHONE }), /bot/i);
    expect(ctx.deviceType).toBe("mobile");
    expect(ctx.isBot).toBe(false);
    expect(contextFrom(new Headers(), /bot/i).isBot).toBe(true);
  });
});

describe("rate limiter", () => {
  it("allows `limit` hits per window per key", () => {
    const limiter = createRateLimiter(3, 1000);
    expect([1, 2, 3].map(() => limiter.hit("a", 0))).toEqual([false, false, false]);
    expect(limiter.hit("a", 10)).toBe(true);
    expect(limiter.hit("b", 10)).toBe(false);
    expect(limiter.hit("a", 1000)).toBe(false);
  });

  it("stays bounded", () => {
    const limiter = createRateLimiter(1, 60_000, 3);
    for (const k of ["a", "b", "c", "d", "e"]) limiter.hit(k, 0);
    // No assertion on internals: it must simply not throw or grow; a fresh key is still allowed.
    expect(limiter.hit("f", 0)).toBe(false);
  });
});

describe("POST /api/source-tracking/events", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  const request = (body: unknown, headers: Record<string, string> = {}) =>
    new Request("http://localhost/api/source-tracking/events", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });

  it("forwards a clean batch with context, secret and client IP, then answers 202", async () => {
    vi.stubEnv("CRM_API_URL", "https://crm.example/api/");
    vi.stubEnv("TRACKING_PROXY_SECRET", "s3cret");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(
      request(
        { sessionId: SID, entry: null, events: [event(), event({ type: "manual_call" })], visitorKey: "attacker" },
        {
          cookie: `${sourceTrackingConfig.visitorCookie}=${VID}`,
          "user-agent": IPHONE,
          "cf-connecting-ip": "203.0.113.9",
          // Also the right-most proxy hop, so the test holds whatever trustCloudflareIpHeader an instance sets.
          "x-forwarded-for": "203.0.113.9",
          "cf-ipcountry": "AU",
          "cf-ipcity": "Perth",
        },
      ),
    );

    expect(res.status).toBe(202);
    expect(await res.json()).toEqual({ accepted: 1 });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://crm.example/api/source-tracking/events");
    const headers = init.headers as Record<string, string>;
    expect(headers["x-tracking-secret"]).toBe("s3cret");
    expect(headers["x-client-ip"]).toBe("203.0.113.9");
    const body = JSON.parse(init.body as string);
    expect(body.visitorKey).toBe(VID);
    expect(body.sessionId).toBe(SID);
    expect(body.events).toHaveLength(1);
    expect(body.context).toMatchObject({ deviceType: "mobile", isBot: false, geo: { country: "AU", city: "Perth" } });
  });

  it("accepts without a visitor cookie (visitorKey null)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    await POST(request({ sessionId: SID, events: [event()] }, { "x-forwarded-for": "198.51.100.1" }));
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.visitorKey).toBeNull();
  });

  it("answers 202 {accepted:0} for junk, without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(request("{not json", { "x-forwarded-for": "198.51.100.2" }));
    expect(res.status).toBe(202);
    expect(await res.json()).toEqual({ accepted: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("still answers 202 when the CRM API is down", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const res = await POST(request({ sessionId: SID, events: [event()] }, { "x-forwarded-for": "198.51.100.3" }));
    expect(res.status).toBe(202);
  });

  it("rate-limits per client IP", async () => {
    vi.stubGlobal("fetch", vi.fn());
    let last = 0;
    for (let i = 0; i < RATE_LIMIT_PER_MINUTE + 1; i += 1) {
      last = (await POST(request("{}", { "x-forwarded-for": "192.0.2.77" }))).status;
    }
    expect(last).toBe(429);
  });

  it("keeps its own limit at or below the CRM's default st-ingest limit", () => {
    // SourceTracking:IngestPermitLimitPerIp defaults to 240 on the API side.
    expect(RATE_LIMIT_PER_MINUTE).toBeLessThanOrEqual(240);
  });

  it("warns (once a minute) when the CRM refuses a batch, and still answers 202", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 429 })));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const res = await POST(request({ sessionId: SID, events: [event()] }, { "x-forwarded-for": "198.51.100.4" }));
      expect(res.status).toBe(202);
      // The first call this test file makes to the CRM with a bad status: warned once.
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toMatch(/CRM answered 429/);

      await POST(request({ sessionId: SID, events: [event()] }, { "x-forwarded-for": "198.51.100.4" }));
      expect(warn).toHaveBeenCalledTimes(1);

      // The throttle is time-based, not count-based.
      const later = Date.now() + CRM_WARN_INTERVAL_MS + 1;
      expect(warnCrmResponse(401, later)).toBe(true);
      expect(warnCrmResponse(401, later + 10)).toBe(false);
      expect(warn).toHaveBeenCalledTimes(2);
      expect(warn.mock.calls[1][0]).toMatch(/CRM answered 401/);
    } finally {
      warn.mockRestore();
    }
  });
});
