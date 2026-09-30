import { test } from "node:test";
import assert from "node:assert/strict";
import { hasRealPhoto, normaliseHref, pickCaseStudiesForService } from "../service-pick";
import type { CaseStudyPage } from "../../../types/case-study";

const PHOTO = [{ src: "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/x.webp", alt: "", caption: "After" }];

function cs(slug: string, hrefs: string[], over: Partial<CaseStudyPage> = {}): CaseStudyPage {
  return {
    slug,
    pageType: "case-study",
    title: `Job ${slug}`,
    subtitle: "",
    service: "Repairs",
    suburb: "Perth",
    doorType: "Sectional",
    jobType: "Repair",
    result: "",
    summary: { problem: "", diagnosis: "", solution: "" },
    problem: { intro: "", points: [] },
    diagnosis: { intro: "", points: [] },
    solution: { intro: "", points: [] },
    images: PHOTO,
    partsUsed: [],
    relatedServices: hrefs.map((href) => ({ label: href, href })),
    faqs: [],
    seo: { title: "", description: "" },
    updatedAt: "2026-08-01T00:00:00+00:00",
    ...over,
  };
}

const slugs = (list: CaseStudyPage[]) => list.map((c) => c.slug);

test("normaliseHref strips the origin, query, hash and trailing slash, and adds a leading slash", () => {
  assert.equal(normaliseHref("/garage-door-spring-repair-perth"), "/garage-door-spring-repair-perth");
  assert.equal(normaliseHref("/garage-door-spring-repair-perth/"), "/garage-door-spring-repair-perth");
  assert.equal(
    normaliseHref("https://capitalgaragedoors.com.au/garage-door-spring-repair-perth/"),
    "/garage-door-spring-repair-perth",
  );
  assert.equal(normaliseHref("https://www.capitalgaragedoors.com.au/x?utm=1#quote"), "/x");
  assert.equal(normaliseHref("garage-door-spring-repair-perth"), "/garage-door-spring-repair-perth");
  assert.equal(normaliseHref("/Garage-Door-Spring-Repair-Perth"), "/garage-door-spring-repair-perth");
  assert.equal(normaliseHref("https://capitalgaragedoors.com.au"), "/");
});

test("matches a relative href to the page's own slug", () => {
  const all = [cs("spring", ["/garage-door-spring-repair-perth"]), cs("other", ["/garage-door-repairs-perth"])];
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "garage-door-spring-repair-perth")), ["spring"]);
});

test("matches absolute and trailing-slash hrefs", () => {
  const all = [
    cs("absolute", ["https://capitalgaragedoors.com.au/garage-door-spring-repair-perth"]),
    cs("trailing", ["/garage-door-spring-repair-perth/"]),
    cs("both", ["https://capitalgaragedoors.com.au/garage-door-spring-repair-perth/"]),
  ];
  assert.deepEqual(
    slugs(pickCaseStudiesForService(all, "garage-door-spring-repair-perth")).sort(),
    ["absolute", "both", "trailing"],
  );
});

test("matching is whole-path equality, never a substring or prefix", () => {
  const all = [
    cs("blog", ["/blog/garage-door-spring-repair-perth"]),
    cs("cost", ["/garage-door-spring-replacement-cost-perth"]),
    cs("suburb", ["/garage-door-repairs-perth-hills"]),
  ];
  assert.deepEqual(pickCaseStudiesForService(all, "garage-door-spring-repair-perth"), []);
  assert.deepEqual(pickCaseStudiesForService(all, "garage-door-repairs-perth"), []);
});

test("the page slug may be passed as an href", () => {
  const all = [cs("spring", ["/garage-door-spring-repair-perth"])];
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "/garage-door-spring-repair-perth/")), ["spring"]);
});

test("aliases: /garage-doors-perth also takes installation jobs, but not the other way round", () => {
  const all = [cs("install", ["/garage-door-installation-perth"]), cs("hub", ["/garage-doors-perth"])];
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "garage-doors-perth")).sort(), ["hub", "install"]);
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "garage-door-installation-perth")), ["install"]);
});

test("aliases: the commercial hub and the industrial page take commercial roller-door jobs", () => {
  const all = [cs("commercial-roller", ["/commercial-roller-doors-perth"]), cs("residential", ["/roller-door-repairs-perth"])];
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "commercial-garage-doors-perth")), ["commercial-roller"]);
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "industrial-roller-doors-perth")), ["commercial-roller"]);
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "commercial-roller-doors-perth")), ["commercial-roller"]);
});

test("aliases: roller door installation takes roller-door and installation jobs", () => {
  const all = [
    cs("roller", ["/roller-doors-perth"]),
    cs("install", ["/garage-door-installation-perth"]),
    cs("direct", ["/roller-door-installation-perth"]),
    cs("repair", ["/roller-door-repairs-perth"]),
  ];
  assert.deepEqual(
    slugs(pickCaseStudiesForService(all, "roller-door-installation-perth", 10)).sort(),
    ["direct", "install", "roller"],
  );
});

test("a case study matching the slug and an alias is listed once", () => {
  const all = [cs("twice", ["/garage-doors-perth", "/garage-door-installation-perth"])];
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "garage-doors-perth")), ["twice"]);
});

test("matches without a real (http) photo are dropped", () => {
  const all = [
    cs("local", ["/roller-door-repairs-perth"], { images: [{ src: "/images/placeholder.webp", alt: "", caption: "" }] }),
    cs("empty", ["/roller-door-repairs-perth"], { images: [{ src: "", alt: "", caption: "" }] }),
    cs("none", ["/roller-door-repairs-perth"], { images: [] }),
    cs("real", ["/roller-door-repairs-perth"]),
  ];
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "roller-door-repairs-perth")), ["real"]);
  assert.equal(hasRealPhoto(all[0]), false);
  assert.equal(hasRealPhoto(all[3]), true);
});

test("newest first by updatedAt, then capped at the limit (default 3)", () => {
  const href = ["/garage-door-repairs-perth"];
  const all = [
    cs("july", href, { updatedAt: "2026-07-18T15:34:22.4992755+00:00" }),
    cs("sept", href, { updatedAt: "2026-09-09T10:48:54.9606078+00:00" }),
    cs("undated", href, { updatedAt: "" }),
    cs("aug", href, { updatedAt: "2026-08-20T09:08:59.2861266+00:00" }),
    cs("aug-late", href, { updatedAt: "2026-08-25T15:38:24.3137433+00:00" }),
  ];
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "garage-door-repairs-perth")), ["sept", "aug-late", "aug"]);
  assert.deepEqual(
    slugs(pickCaseStudiesForService(all, "garage-door-repairs-perth", 10)),
    ["sept", "aug-late", "aug", "july", "undated"],
  );
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "garage-door-repairs-perth", 1)), ["sept"]);
  assert.deepEqual(pickCaseStudiesForService(all, "garage-door-repairs-perth", 0), []);
});

test("equal dates fall back to slug order, so the pick is deterministic", () => {
  const href = ["/garage-door-repairs-perth"];
  const same = "2026-08-01T00:00:00+00:00";
  const all = [cs("c", href, { updatedAt: same }), cs("a", href, { updatedAt: same }), cs("b", href, { updatedAt: same })];
  assert.deepEqual(slugs(pickCaseStudiesForService(all, "garage-door-repairs-perth")), ["a", "b", "c"]);
});

test("does not mutate the input list", () => {
  const href = ["/garage-door-repairs-perth"];
  const all = [cs("old", href, { updatedAt: "2026-01-01" }), cs("new", href, { updatedAt: "2026-09-01" })];
  pickCaseStudiesForService(all, "garage-door-repairs-perth");
  assert.deepEqual(slugs(all), ["old", "new"]);
});
