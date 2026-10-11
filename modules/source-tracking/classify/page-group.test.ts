import { afterEach, describe, expect, it, vi } from "vitest";
import { defineSourceTrackingConfig } from "../config";
import { classifyPageGroup, normalisePath } from "./page-group";

describe("rules engine", () => {
  afterEach(() => vi.restoreAllMocks());

  const rules = defineSourceTrackingConfig({
    visitorCookie: "v",
    sessionCookie: "s",
    crmApiFallbackUrl: "http://localhost/api",
    pageGroups: {
      default: "other",
      rules: [
        { group: "home", match: "exact", value: "/" },
        { group: "lp", match: "prefix", value: "/lp" },
        { group: "suburbs", match: "slugPrefix", value: "repairs-", exclude: ["repairs-head"] },
        { group: "cost", match: "regex", value: "-cost$" },
        { group: "blog", match: "prefix", value: ["/blog", "/news"] },
      ],
    },
  }).pageGroups;

  it("matches exact, whole-segment prefixes, slug prefixes and regexes; first match wins", () => {
    expect(classifyPageGroup("/", rules)).toBe("home");
    expect(classifyPageGroup("/lp", rules)).toBe("lp");
    expect(classifyPageGroup("/lp/x", rules)).toBe("lp");
    expect(classifyPageGroup("/LP/X", rules)).toBe("lp");
    expect(classifyPageGroup("/lpx", rules)).toBe("other");
    expect(classifyPageGroup("/repairs-joondalup", rules)).toBe("suburbs");
    expect(classifyPageGroup("/repairs-head", rules)).toBe("other");
    expect(classifyPageGroup("/a/repairs-joondalup", rules)).toBe("other");
    expect(classifyPageGroup("/repairs-x-cost", rules)).toBe("suburbs");
    expect(classifyPageGroup("/spring-cost", rules)).toBe("cost");
    expect(classifyPageGroup("/news/item", rules)).toBe("blog");
  });

  it("ignores query and hash and tolerates junk", () => {
    expect(classifyPageGroup("/lp/x?gclid=1#top", rules)).toBe("lp");
    expect(classifyPageGroup("", rules)).toBe("home");
    expect(classifyPageGroup(null, rules)).toBe("home");
    expect(normalisePath("Blog/Post")).toBe("/blog/post");
  });

  it("falls back to 'other' when a rule names an unknown group", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const bad = defineSourceTrackingConfig({
      visitorCookie: "v",
      sessionCookie: "s",
      crmApiFallbackUrl: "http://localhost/api",
      pageGroups: { rules: [{ group: "nope", match: "exact", value: "/" }] },
    }).pageGroups;
    expect(classifyPageGroup("/", bad)).toBe("other");
  });
});
