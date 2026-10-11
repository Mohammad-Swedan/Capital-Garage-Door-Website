import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { config, proxy, VISITOR_MAX_AGE_SECONDS } from "./proxy";
import { VISITOR_COOKIE } from "@/lib/visitor";

const matcher = new RegExp(`^${config.matcher[0]}$`);

describe("proxy: first-party visitor cookie", () => {
  it("issues a 400-day httpOnly visitor id when the request has none", () => {
    const res = proxy(new NextRequest("https://example.com/services"));
    const header = res.headers.get("set-cookie") ?? "";
    expect(header).toMatch(new RegExp(`^${VISITOR_COOKIE}=[0-9a-f-]{36};`));
    expect(header).toContain(`Max-Age=${VISITOR_MAX_AGE_SECONDS}`);
    expect(header).toContain("Path=/");
    expect(header).toMatch(/HttpOnly/i);
    expect(header).toMatch(/SameSite=lax/i);
  });

  it("leaves a request that already has a valid id untouched", () => {
    const req = new NextRequest("https://example.com/", {
      headers: { cookie: `${VISITOR_COOKIE}=3f2b8c1e-9a4d-4e7b-8c2f-1a2b3c4d5e6f` },
    });
    expect(proxy(req).headers.get("set-cookie")).toBeNull();
  });

  it("replaces a malformed id", () => {
    const req = new NextRequest("https://example.com/", { headers: { cookie: `${VISITOR_COOKIE}=forged` } });
    expect(proxy(req).headers.get("set-cookie")).toMatch(new RegExp(`^${VISITOR_COOKIE}=[0-9a-f-]{36};`));
  });

  it("runs on pages only, not on API routes, the CMS admin, assets or metadata files", () => {
    for (const page of ["/", "/services", "/lp/garage-door-repairs", "/blog/some-post", "/garage-door-repairs-joondalup"]) {
      expect(matcher.test(page), page).toBe(true);
    }
    for (const other of ["/api/source-tracking/events", "/admin", "/admin/pages", "/_next/static/chunk.js", "/favicon.ico", "/sitemap.xml", "/image-sitemap.xml", "/robots.txt", "/llms.txt", "/feed.xml", "/images/van.webp"]) {
      expect(matcher.test(other), other).toBe(false);
    }
  });
});
