import { afterEach, describe, expect, it, vi } from "vitest";
import { defineSourceTrackingConfig, type SourceTrackingConfigInput } from "./config";

const base: SourceTrackingConfigInput = {
  visitorCookie: "x_vid",
  sessionCookie: "x_sid",
  crmApiFallbackUrl: "http://localhost:5000/api/",
  pageGroups: { rules: [{ group: "home", match: "exact", value: "/" }] },
};

describe("defineSourceTrackingConfig", () => {
  afterEach(() => vi.restoreAllMocks());

  it("fills defaults", () => {
    const c = defineSourceTrackingConfig(base);
    expect(c.enabled).toBe(true);
    expect(c.sessionTimeoutMinutes).toBe(30);
    expect(c.landingPagePrefixes).toEqual(["/lp"]);
    expect(c.campaignParams).toContain("gclid");
    expect(c.campaignParams).toContain("utm_campaign");
    expect(c.endpoint).toBe("/api/source-tracking/events");
    expect(c.crmApiFallbackUrl).toBe("http://localhost:5000/api");
    expect(c.pageGroups.default).toBe("other");
    expect(c.botUserAgentPattern.test("Googlebot/2.1")).toBe(true);
    expect(c.trustCloudflareIpHeader).toBe(false);
    expect(c.errors).toEqual([]);
  });

  it("trusts cf-connecting-ip only when the instance opts in explicitly", () => {
    expect(defineSourceTrackingConfig({ ...base, trustCloudflareIpHeader: true }).trustCloudflareIpHeader).toBe(true);
    expect(defineSourceTrackingConfig({ ...base, trustCloudflareIpHeader: "yes" as never }).trustCloudflareIpHeader).toBe(false);
  });

  it("disables itself (never throws) on an invalid config", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const c = defineSourceTrackingConfig({
      ...base,
      sessionCookie: "x_vid",
      pageGroups: {
        rules: [
          { group: "not-a-group", match: "exact", value: "/" },
          { group: "blog", match: "regex", value: "([" },
          { group: "blog", match: "fuzzy" as never, value: "/blog" },
        ],
      },
    });
    expect(c.enabled).toBe(false);
    expect(c.errors.length).toBeGreaterThanOrEqual(4);
    expect(spy).toHaveBeenCalledOnce();
  });

  it("respects enabled: false without errors", () => {
    const c = defineSourceTrackingConfig({ ...base, enabled: false });
    expect(c.enabled).toBe(false);
    expect(c.errors).toEqual([]);
  });
});
