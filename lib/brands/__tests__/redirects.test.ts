import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import nextConfig from "../../../next.config";
import { siteConfig } from "../../../config/site";

/**
 * Guards for next.config.ts `redirects()`: legacy-URL redirects are load-bearing SEO (see
 * CLAUDE.md), so the structural rules are pinned here — no duplicate or chained rules, and the
 * `/blogs/*` catch-all stays last among its siblings — along with the topic-matched retargets.
 * Whether each destination returns a plain 200 needs the network: curl it before changing one.
 */

interface Rule {
  source: string;
  destination: string;
  permanent: boolean;
}

async function loadRules(): Promise<Rule[]> {
  assert.ok(nextConfig.redirects, "next.config.ts must define redirects()");
  return (await nextConfig.redirects()) as Rule[];
}

function rule(rules: Rule[], source: string): Rule {
  const found = rules.find((r) => r.source === source);
  assert.ok(found, `no redirect rule for ${source}`);
  return found;
}

test("each legacy /services/* link lands on the page for its own topic", async () => {
  const rules = await loadRules();
  const expected: Record<string, string> = {
    "/services/garage-door-repair": "/garage-door-repairs-perth",
    "/services/garage-door-installation": "/garage-door-installation-perth",
    "/services/spring-repair": "/garage-door-spring-repair-perth",
    "/services/garage-door-opener-repair": "/garage-door-opener-repair-perth",
    "/services/emergency-garage-door-service": "/emergency-garage-door-repairs-perth",
    "/services/garage-door-maintenance": "/garage-door-maintenance-perth",
    "/garage-door-repairs": "/garage-door-repairs-perth",
  };
  for (const [source, destination] of Object.entries(expected)) {
    const r = rule(rules, source);
    assert.equal(r.destination, destination, source);
    assert.equal(r.permanent, true, `${source} is a permanent redirect`);
  }
});

test("quote-request URLs go to /quote, not /contact", async () => {
  const rules = await loadRules();
  for (const source of ["/request-quote", "/request-a-quote"]) {
    const r = rule(rules, source);
    assert.equal(r.destination, "/quote", source);
    assert.equal(r.permanent, true, source);
  }
});

test("/review is a TEMPORARY redirect to the Google write-review URL in siteConfig", async () => {
  const r = rule(await loadRules(), "/review");
  assert.equal(r.destination, siteConfig.googleWriteReviewUrl);
  assert.equal(r.permanent, false, "a 307, never a cached 308");
  assert.match(r.destination, /^https:\/\/search\.google\.com\/local\/writereview\?placeid=[\w-]+$/);
  // The redirect only works while no page owns the path; the reviews page is /reviews.
  assert.equal(existsSync(new URL("../../../app/review", import.meta.url)), false, "app/review must not exist");
});

test("the write-review URL is not in siteConfig.social (which feeds schema sameAs)", () => {
  const socialUrls: string[] = Object.values(siteConfig.social);
  assert.equal(socialUrls.includes(siteConfig.googleWriteReviewUrl), false);
});

test("the mistyped /tilt-garage_doors-perth redirects to the real page", async () => {
  const r = rule(await loadRules(), "/tilt-garage_doors-perth");
  assert.equal(r.destination, "/tilt-garage-doors-perth");
  assert.equal(r.permanent, true);
});

test("no duplicate sources", async () => {
  const sources = (await loadRules()).map((r) => r.source);
  const dupes = sources.filter((s, i) => sources.indexOf(s) !== i);
  assert.deepEqual(dupes, []);
});

test("no redirect chains: a destination is never itself a redirect source", async () => {
  const rules = await loadRules();
  const sources = new Set(rules.map((r) => r.source));
  for (const r of rules) {
    if (r.destination.includes(":")) continue; // pattern destination or an absolute URL
    assert.equal(sources.has(r.destination), false, `${r.source} -> ${r.destination} is itself redirected`);
  }
});

test("every /blogs/* rule sits before the /blogs/:slug* catch-all", async () => {
  const rules = await loadRules();
  const catchAll = rules.findIndex((r) => r.source === "/blogs/:slug*");
  assert.notEqual(catchAll, -1, "the /blogs/:slug* catch-all exists");
  rules.forEach((r, i) => {
    if (r.source.startsWith("/blogs/") && r.source !== "/blogs/:slug*") {
      assert.ok(i < catchAll, `${r.source} must precede the catch-all or it never fires`);
    }
  });
});
