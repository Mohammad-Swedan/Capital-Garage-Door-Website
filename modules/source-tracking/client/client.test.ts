import { describe, expect, it } from "vitest";
import { mapAnalyticsEvent } from "./analytics-bridge";
import { createEngagementClock, milestonesReached, scrollPercent } from "./engagement";
import { recordClickPlacement, takeRecentClickPlacement } from "./placement";
import { buildEntry, cookieExpired, decideSessionStart, hasCampaignParams, type StartDecisionInput } from "./session";
import { PAGE_GROUP_VOCABULARY } from "../taxonomy";
import { bindQueue, buildQueuedEvent, toWireEvent } from "./sink";

const KEYS = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid", "utm_source", "utm_medium", "utm_campaign"];
const SID = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";

describe("session start", () => {
  const base: StartDecisionInput = {
    existingId: SID,
    pathname: "/",
    search: "",
    referrer: "",
    ownHost: "www.example.com.au",
    campaignKeys: KEYS,
    landingPrefixes: ["/lp"],
    lastStartSignature: null,
  };

  it("detects campaign params", () => {
    expect(hasCampaignParams("?gclid=abc", KEYS)).toBe(true);
    expect(hasCampaignParams("utm_source=gbp", KEYS)).toBe(true);
    expect(hasCampaignParams("?gclid=", KEYS)).toBe(false);
    expect(hasCampaignParams("?page=2", KEYS)).toBe(false);
    expect(hasCampaignParams("", KEYS)).toBe(false);
  });

  it("starts when the cookie is missing or malformed", () => {
    expect(decideSessionStart({ ...base, existingId: null }).start).toBe(true);
    expect(decideSessionStart({ ...base, existingId: "nope" }).start).toBe(true);
  });

  it("continues an existing session on a plain page load", () => {
    expect(decideSessionStart(base)).toEqual({ start: false, signature: null });
    // Internal navigation into /lp is not a new visit.
    expect(decideSessionStart({ ...base, pathname: "/lp/x", referrer: "https://example.com.au/" }).start).toBe(false);
  });

  it("starts on a new ad click, but not on a reload of the same one", () => {
    const click = { ...base, pathname: "/lp/x", search: "?gclid=abc" };
    const first = decideSessionStart(click);
    expect(first.start).toBe(true);
    expect(decideSessionStart({ ...click, lastStartSignature: first.signature }).start).toBe(false);
    expect(decideSessionStart({ ...click, search: "?gclid=def", lastStartSignature: first.signature }).start).toBe(true);
  });

  it("starts when a paid landing page is reached from another site", () => {
    const fromGoogle = { ...base, pathname: "/lp/x", referrer: "https://www.google.com/" };
    expect(decideSessionStart(fromGoogle).start).toBe(true);
    expect(decideSessionStart({ ...fromGoogle, pathname: "/lpx" }).start).toBe(false);
  });

  it("tells an expired cookie from a blocked one", () => {
    const timeout = 30 * 60_000;
    expect(cookieExpired(0, 1000, timeout)).toBe(true);
    expect(cookieExpired(1000, 1000 + timeout, timeout)).toBe(true);
    // Written a minute ago yet unreadable: cookies are blocked — keep the in-memory session.
    expect(cookieExpired(1000, 61_000, timeout)).toBe(false);
  });

  it("builds a capped entry", () => {
    expect(buildEntry("/lp/x", "?gclid=abc", "https://www.google.com/")).toEqual({
      landingPath: "/lp/x",
      landingQuery: "?gclid=abc",
      referrer: "https://www.google.com/",
    });
    expect(buildEntry("/", "", "")).toEqual({ landingPath: "/", landingQuery: "", referrer: "" });
    expect(buildEntry("/", `?q=${"x".repeat(2000)}`, "").landingQuery).toHaveLength(1000);
  });
});

describe("engagement clock", () => {
  it("counts visible, non-idle time only", () => {
    const clock = createEngagementClock(0, true, 30_000);
    clock.activity(10_000);
    // Idle from 10 s: engagement stops accruing at 40 s.
    expect(clock.total(100_000)).toBe(40_000);
    clock.activity(100_000);
    clock.visibility(false, 105_000); // hidden: +5 s
    expect(clock.total(200_000)).toBe(45_000);
    clock.visibility(true, 200_000);
    expect(clock.total(210_000)).toBe(55_000);
  });

  it("computes scroll depth and milestones", () => {
    expect(scrollPercent(0, 800, 4000)).toBe(20);
    expect(scrollPercent(3200, 800, 4000)).toBe(100);
    expect(scrollPercent(0, 800, 0)).toBe(100);
    expect(milestonesReached(20)).toEqual([]);
    expect(milestonesReached(60)).toEqual([25, 50]);
    expect(milestonesReached(100)).toEqual([25, 50, 75, 90]);
  });
});

describe("click placement hand-off", () => {
  it("is taken once, within the window", () => {
    recordClickPlacement("hero", 1000);
    expect(takeRecentClickPlacement(1500)).toBe("hero");
    expect(takeRecentClickPlacement(1600)).toBeNull();
    recordClickPlacement("footer", 1000);
    expect(takeRecentClickPlacement(2500)).toBeNull();
  });
});

describe("analytics bridge mapping", () => {
  it("ignores events that are not allow-listed", () => {
    expect(mapAnalyticsEvent("page_view", {})).toBeNull();
    expect(mapAnalyticsEvent("manual_call", {})).toBeNull();
    expect(mapAnalyticsEvent("something_else", { a: 1 })).toBeNull();
  });

  it("drops call_click link text that carries digits (the number is already the label)", () => {
    expect(mapAnalyticsEvent("call_click", { phone: "+61400000000", link_text: "Call Now: 0400 000 000" })).toEqual({
      type: "call_click",
      label: "+61400000000",
      props: null,
    });
  });

  it("labels call_click with the dialled business number", () => {
    expect(mapAnalyticsEvent("call_click", { page: "/", phone: "+61 400 000 000", link_text: "Call now" })).toEqual({
      type: "call_click",
      label: "+61400000000",
      props: { link_text: "Call now" },
    });
  });

  it("labels quote and booking events from service/source", () => {
    expect(mapAnalyticsEvent("quote_open", { service_id: 3 })).toEqual({
      type: "quote_open",
      label: null,
      props: { service_id: 3 },
    });
    expect(mapAnalyticsEvent("booking_open", { source: "lp_switch" })?.label).toBe("lp_switch");
    expect(mapAnalyticsEvent("booking_submit", { page: "/booking-confirmed", source: "timely", service_id: "4" })).toEqual({
      type: "booking_submit",
      label: "timely",
      props: { service_id: "4", source: "timely" },
    });
  });

  it("never forwards personal data", () => {
    const mapped = mapAnalyticsEvent("chat_booking_complete", { ref: "BK-1", name: "Jane", phone: "0400 000 000" });
    expect(mapped).toEqual({ type: "chat_booking_complete", label: null, props: null });
    expect(mapAnalyticsEvent("suburb_search", { query: "jane@example.com", results: 0 })).toEqual({
      type: "suburb_search",
      label: null,
      props: { results: 0 },
    });
    expect(mapAnalyticsEvent("suburb_search", { query: "0400 123 456" })?.label).toBeNull();
    expect(mapAnalyticsEvent("suburb_search", { query: "Joondalup", results: 1 })?.label).toBe("Joondalup");
    expect(mapAnalyticsEvent("chat_cta_click", { type: "quote", label: "Get a quote" })).toEqual({
      type: "chat_cta_click",
      label: "quote",
      props: { type: "quote" },
    });
  });

  it("keeps calculator results but nothing else", () => {
    const mapped = mapAnalyticsEvent("calculator_complete", {
      service_type: "repair",
      problem_id: "spring",
      emergency: false,
      price_source: "catalog",
      price_min: 240,
      price_max: 280,
      email: "x@y.z",
    });
    expect(mapped?.label).toBe("repair");
    expect(mapped?.props).toEqual({
      service_type: "repair",
      problem_id: "spring",
      emergency: false,
      price_source: "catalog",
      price_min: 240,
      price_max: 280,
    });
  });
});

describe("queue binding to the session", () => {
  const entry = { landingPath: "/lp/x", landingQuery: "?gclid=abc", referrer: "https://www.google.com/" };
  const OTHER = "9c1a1a1a-2b2b-4c3c-8d4d-5e5e5e5e5e5e";

  it("keeps the entry within one session and adopts one that arrives late", () => {
    expect(bindQueue({ sessionId: SID, entry }, { id: SID, entry: null }, 3)).toEqual({
      binding: { sessionId: SID, entry },
      flushFirst: false,
    });
    expect(bindQueue({ sessionId: SID, entry: null }, { id: SID, entry }, 0).binding.entry).toEqual(entry);
  });

  it("drops the old session's entry when another tab's session is adopted", () => {
    // Queue empty (already flushed): the old entry must not ride on the adopted session's batches.
    const adopted = bindQueue({ sessionId: SID, entry }, { id: OTHER, entry: null }, 0);
    expect(adopted).toEqual({ binding: { sessionId: OTHER, entry: null }, flushFirst: false });
  });

  it("flushes the old session's events first, then binds to the new session's own entry", () => {
    const expired = { landingPath: "/contact", landingQuery: "", referrer: "" };
    const next = bindQueue({ sessionId: SID, entry }, { id: OTHER, entry: expired }, 2);
    expect(next).toEqual({ binding: { sessionId: OTHER, entry: expired }, flushFirst: true });
  });

  it("binds a fresh queue to the first session it sees", () => {
    expect(bindQueue({ sessionId: null, entry: null }, { id: SID, entry }, 0)).toEqual({
      binding: { sessionId: SID, entry },
      flushFirst: false,
    });
  });
});

describe("event building", () => {
  it("bounds every field and computes ageMs at send time", () => {
    const queued = buildQueuedEvent(
      "page_view",
      "/lp/x?gclid=1",
      { label: "x".repeat(500), placement: "y".repeat(100), props: { title: "T", nested: { a: 1 } } },
      1000,
    );
    expect(queued.path).toBe("/lp/x");
    // The group itself comes from the host's rules; the module only guarantees the vocabulary.
    expect(PAGE_GROUP_VOCABULARY).toContain(queued.pageGroup);
    expect(queued.label).toHaveLength(120);
    expect(queued.placement).toHaveLength(60);
    expect(queued.props).toEqual({ title: "T" });
    expect(toWireEvent(queued, 1340).ageMs).toBe(340);
    expect(toWireEvent(queued, 999_999).ageMs).toBe(120_000);
    expect(toWireEvent(queued, 0).ageMs).toBe(0);
  });
});
