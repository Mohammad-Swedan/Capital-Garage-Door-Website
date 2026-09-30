import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_IN_FLIGHT,
  buildLlmsTxt,
  createLimiter,
  loadLlmsData,
  newestFirst,
  pathOf,
  resolvePages,
  titleFromSlug,
  type LlmsData,
  type LlmsSources,
  type ResolvedPage,
} from "../../seo/llms-txt";
import { siteConfig } from "../../../config/site";

/**
 * /llms.txt is prerendered at build from ~90 CMS reads. It must never throw, must never open a
 * burst of connections (the CMS host drops them, which is what failed builds), and must not
 * silently drop entries. These tests use fakes, so they need no network.
 */

/** Resolves after `ms` (real timers keep the concurrency tests honest). */
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Wraps a task so the peak number running at once is recorded. */
function tracker() {
  let active = 0;
  let peak = 0;
  return {
    get peak() {
      return peak;
    },
    track: async <T>(work: () => Promise<T> | T): Promise<T> => {
      active++;
      peak = Math.max(peak, active);
      try {
        await sleep(2);
        return await work();
      } finally {
        active--;
      }
    },
  };
}

/* ------------------------------------------------------------------ *
 * createLimiter
 * ------------------------------------------------------------------ */

test("createLimiter never runs more than `max` tasks at once, and uses all of them", async () => {
  const limit = createLimiter(3);
  const t = tracker();
  const results = await Promise.all(Array.from({ length: 20 }, (_, i) => limit(() => t.track(() => i))));
  assert.deepEqual(results, Array.from({ length: 20 }, (_, i) => i), "results keep their order");
  assert.equal(t.peak, 3);
});

test("createLimiter: a rejected task frees its slot and the queue keeps moving", async () => {
  const limit = createLimiter(1);
  const outcomes = await Promise.allSettled([
    limit(async () => {
      throw new Error("boom");
    }),
    limit(async () => "second"),
    limit(() => {
      throw new Error("sync boom"); // a task that throws before returning a promise
    }),
    limit(async () => "fourth"),
  ]);
  assert.deepEqual(
    outcomes.map((o) => o.status),
    ["rejected", "fulfilled", "rejected", "fulfilled"],
  );
  assert.equal((outcomes[1] as PromiseFulfilledResult<string>).value, "second");
  assert.equal((outcomes[3] as PromiseFulfilledResult<string>).value, "fourth");
});

test("createLimiter clamps a nonsense cap to 1 instead of deadlocking", async () => {
  const limit = createLimiter(0);
  const t = tracker();
  await Promise.all([1, 2, 3].map((n) => limit(() => t.track(() => n))));
  assert.equal(t.peak, 1);
});

/* ------------------------------------------------------------------ *
 * resolvePages
 * ------------------------------------------------------------------ */

test("resolvePages lists each page under its title, in slug order", async () => {
  const pages = await resolvePages(
    ["b", "a", "c"],
    createLimiter(2),
    async (slug) => ({ name: `Title ${slug.toUpperCase()}` }),
    (p) => p.name,
  );
  assert.deepEqual(
    pages.map(({ slug, title }) => ({ slug, title })),
    [
      { slug: "b", title: "Title B" },
      { slug: "a", title: "Title A" },
      { slug: "c", title: "Title C" },
    ],
  );
});

test("resolvePages: a page that is gone is left out; a resolve that throws keeps its entry", async () => {
  const errors: string[] = [];
  const pages = await resolvePages(
    ["kept", "gone", "gone-null", "flaky", "blank-title"],
    createLimiter(2),
    async (slug) => {
      if (slug === "gone") return undefined;
      if (slug === "gone-null") return null;
      if (slug === "flaky") throw new Error("UND_ERR_CONNECT_TIMEOUT");
      return { title: slug === "blank-title" ? "   " : "Real Title" };
    },
    (p) => p.title,
    (slug) => errors.push(slug),
  );
  assert.deepEqual(
    pages.map(({ slug, title }) => ({ slug, title })),
    [
      { slug: "kept", title: "Real Title" },
      { slug: "flaky", title: "Flaky" }, // slug-derived: the entry survives the failure
      { slug: "blank-title", title: "Blank Title" },
    ],
  );
  assert.equal(pages[1].page, undefined, "a failed resolve carries no page");
  assert.deepEqual(errors, ["flaky"], "only the failure is reported");
});

test("resolvePages: a malformed page (titleOf throws) degrades to its slug title, not a rejection", async () => {
  const pages = await resolvePages(
    ["odd"],
    createLimiter(1),
    async () => ({}) as { hero: { h1: string } },
    (p) => p.hero.h1,
  );
  assert.deepEqual(
    pages.map(({ slug, title }) => ({ slug, title })),
    [{ slug: "odd", title: "Odd" }],
  );
});

test("resolvePages: an onError that throws cannot break the list", async () => {
  const pages = await resolvePages(
    ["x"],
    createLimiter(1),
    async () => {
      throw new Error("down");
    },
    (p: { t: string }) => p.t,
    () => {
      throw new Error("logger exploded");
    },
  );
  assert.equal(pages.length, 1);
});

test("newestFirst: newest date first, an unresolved entry last, ties keep their order", () => {
  const entry = (slug: string, publishedAt?: string): ResolvedPage<{ publishedAt: string }> => ({
    slug,
    title: slug,
    ...(publishedAt ? { page: { publishedAt } } : {}),
  });
  const sorted = [
    entry("old", "2026-01-01"),
    entry("failed"),
    entry("new", "2026-09-01"),
    entry("tie-a", "2026-05-05"),
    entry("tie-b", "2026-05-05"),
    entry("bad-date", "not a date"),
  ].sort(newestFirst);
  assert.deepEqual(
    sorted.map((e) => e.slug),
    ["new", "tie-a", "tie-b", "old", "failed", "bad-date"],
  );
});

/* ------------------------------------------------------------------ *
 * loadLlmsData
 * ------------------------------------------------------------------ */

const svc = (name: string, href: string) => ({ name, canonicalHref: href, shortDescription: `${name}.` });

/** Healthy fakes for every source; `over` replaces some. Every CMS-shaped source goes through `t`. */
function fakeSources(t: ReturnType<typeof tracker>, over: Partial<LlmsSources> = {}): LlmsSources {
  const slugs = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}-${i + 1}`);
  return {
    services: () => t.track(() => [svc("Garage Door Repair", "/garage-door-repairs-perth")]),
    servicePageSlugs: () => t.track(() => ["garage-door-repairs-perth", "roller-doors-perth", "garage-door-remote-replacement-perth"]),
    servicePage: (slug) => t.track(() => ({ hero: { h1: `${titleFromSlug(slug)} (H1)` } })),
    costGuideSlugs: () => t.track(() => ["cost-a", "garage-door-installation-cost-perth"]),
    costGuide: (slug) => t.track(() => ({ hero: { h1: `${titleFromSlug(slug)} (H1)` } })),
    staticGuides: () => t.track(() => [{ slug: "garage-door-installation-cost-perth", hero: { h1: "Installation Cost" } }]),
    comparisonSlugs: () => t.track(() => ["roller-door-vs-sectional-door"]),
    suburbSlugs: () => t.track(() => ["garage-door-repairs-joondalup"]),
    brandHubs: () => t.track(() => [{ slug: "hub-doors", name: "Door Hub" }, { slug: "hub-motors", name: "Motor Hub" }]),
    brandPages: () => t.track(() => [{ slug: "merlin-perth", hero: { h1: "Merlin" } }]),
    problemSlugs: () => t.track(() => slugs("problem", 8)),
    problem: (slug) => t.track(() => ({ name: `${slug}?` })),
    articleSlugs: () => t.track(() => slugs("article", 15)),
    article: (slug) => t.track(() => ({ title: slug, publishedAt: `2026-01-${String(Number(slug.split("-")[1]) + 10)}` })),
    caseStudySlugs: () => t.track(() => slugs("case", 38)),
    caseStudy: (slug) => t.track(() => ({ title: `Job ${slug}` })),
    ...over,
  };
}

test("loadLlmsData: ~90 reads never have more than MAX_IN_FLIGHT open at once", async () => {
  const t = tracker();
  const data = await loadLlmsData(fakeSources(t));
  assert.equal(MAX_IN_FLIGHT, 6);
  assert.ok(t.peak <= MAX_IN_FLIGHT, `peak ${t.peak} exceeded ${MAX_IN_FLIGHT}`);
  assert.equal(t.peak, MAX_IN_FLIGHT, "the cap is actually used (reads are not serialised)");
  assert.equal(data.caseStudies.length, 38);
  assert.equal(data.articles.length, 15);
  assert.equal(data.problems.length, 8);
});

test("loadLlmsData: articles come newest first, everything else keeps feed order", async () => {
  const data = await loadLlmsData(fakeSources(tracker()));
  assert.equal(data.articles[0].slug, "article-15");
  assert.equal(data.articles[14].slug, "article-1");
  assert.deepEqual(data.caseStudies.slice(0, 3).map((c) => c.slug), ["case-1", "case-2", "case-3"]);
  assert.deepEqual(data.brandHubs, [
    { slug: "hub-doors", title: "Door Hub" },
    { slug: "hub-motors", title: "Motor Hub" },
  ]);
});

test("loadLlmsData: every source rejecting still resolves, with empty lists and the failures reported", async () => {
  const down = () => Promise.reject(new Error("CMS down"));
  const errors: string[] = [];
  const data = await loadLlmsData(
    {
      services: down,
      servicePageSlugs: down,
      servicePage: down,
      costGuideSlugs: down,
      costGuide: down,
      staticGuides: down,
      comparisonSlugs: down,
      suburbSlugs: down,
      brandHubs: down,
      brandPages: down,
      problemSlugs: down,
      problem: down,
      articleSlugs: down,
      article: down,
      caseStudySlugs: down,
      caseStudy: down,
    },
    { onError: (what) => errors.push(what) },
  );
  assert.deepEqual(data, {
    services: [],
    servicePages: [],
    staticGuides: [],
    cmsGuides: [],
    comparisonSlugs: [],
    suburbSlugs: [],
    brandHubs: [],
    brandPages: [],
    problems: [],
    articles: [],
    caseStudies: [],
  });
  // One report per list read that failed (11 lists); no page resolve runs without a slug list.
  assert.equal(errors.length, 11);
  assert.ok(errors.includes("services") && errors.includes("case studies slugs"));
  // …and the builder still produces a complete, valid file from nothing.
  const text = buildLlmsTxt(data);
  assert.match(text, /^# Capital Garage Doors\n/);
  assert.ok(text.includes("## Company"));
  assert.ok(text.endsWith("\n"));
});

test("loadLlmsData: a failed page keeps its entry (slug title); a failed slug list only empties that list", async () => {
  const errors: string[] = [];
  const t = tracker();
  const data = await loadLlmsData(
    fakeSources(t, {
      // One of the 38 case-study resolves times out, and the article slug list fails outright.
      caseStudy: (slug) =>
        slug === "case-7" ? Promise.reject(new Error("UND_ERR_CONNECT_TIMEOUT")) : t.track(() => ({ title: `Job ${slug}` })),
      articleSlugs: () => Promise.reject(new Error("sitemap 503")),
    }),
    { onError: (what) => errors.push(what) },
  );
  assert.equal(data.caseStudies.length, 38, "no case study is dropped");
  assert.deepEqual(data.caseStudies[6], { slug: "case-7", title: "Case 7" });
  assert.equal(data.caseStudies[7].title, "Job case-8");
  assert.deepEqual(data.articles, []);
  assert.equal(data.problems.length, 8, "the other lists are untouched");
  assert.deepEqual(errors.sort(), ["articles slugs", "case studies case-7"]);
});

test("loadLlmsData: an EMPTY slug list is reported (the lenient feed reads swallow their own errors)", async () => {
  const errors: Array<[string, string]> = [];
  const t = tracker();
  const data = await loadLlmsData(fakeSources(t, { caseStudySlugs: () => t.track(() => []) }), {
    onError: (what, error) => errors.push([what, (error as Error).message]),
  });
  assert.deepEqual(data.caseStudies, []);
  assert.deepEqual(errors, [["case studies slugs", "the feed returned no slugs"]]);
});

test("loadLlmsData: a slug whose page is gone (404) is left out, not listed under a guessed title", async () => {
  const t = tracker();
  const data = await loadLlmsData(
    fakeSources(t, { caseStudy: (slug) => t.track(() => (slug === "case-2" ? undefined : { title: slug })) }),
  );
  assert.equal(data.caseStudies.length, 37);
  assert.ok(!data.caseStudies.some((c) => c.slug === "case-2"));
});

/* ------------------------------------------------------------------ *
 * buildLlmsTxt
 * ------------------------------------------------------------------ */

const data = (over: Partial<LlmsData> = {}): LlmsData => ({
  services: [
    svc("Garage Door Repair", "/garage-door-repairs-perth"),
    svc("Garage Door Installation", "/garage-door-installation-perth"),
  ],
  servicePages: [
    { slug: "garage-door-repairs-perth", title: "Garage Door Repairs Perth" }, // already in Services
    { slug: "garage-door-installation-perth", title: "Garage Door Installation Perth" }, // Services + doors
    { slug: "roller-doors-perth", title: "Roller Doors Perth" },
    { slug: "commercial-garage-doors-perth", title: "Commercial & Industrial Garage Doors Perth" },
    { slug: "garage-door-panel-replacement-perth", title: "Garage Door Panel Replacement Perth" },
  ],
  staticGuides: [{ slug: "garage-door-installation-cost-perth", title: "Garage Door Installation Cost Perth" }],
  cmsGuides: [
    { slug: "garage-door-repair-cost-perth", title: "Garage Door Repair Cost Perth" },
    { slug: "garage-door-installation-cost-perth", title: "Shadowed CMS copy" },
  ],
  comparisonSlugs: ["roller-door-vs-sectional-door"],
  suburbSlugs: ["garage-door-repairs-joondalup"],
  brandHubs: [
    { slug: "garage-door-brands-perth", title: "Garage Door Brands Perth" },
    { slug: "garage-door-motor-brands-perth", title: "Garage Door Motor Brands Perth" },
  ],
  brandPages: [{ slug: "merlin-garage-door-motors-perth", title: "Merlin Motors" }],
  problems: [{ slug: "noisy-garage-door", title: "Noisy Garage Door?" }],
  articles: [{ slug: "garage-door-springs-guide", title: "Garage Door Springs" }],
  caseStudies: [{ slug: "job-1", title: "Job One" }],
  ...over,
});

const headings = (text: string) => text.split("\n").filter((l) => l.startsWith("## "));
const section = (text: string, heading: string) => {
  const lines = text.split("\n");
  const start = lines.indexOf(heading);
  assert.notEqual(start, -1, `missing ${heading}`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith("## "));
  return (end === -1 ? rest : rest.slice(0, end)).filter(Boolean);
};

test("buildLlmsTxt: the sections, in order", () => {
  assert.deepEqual(headings(buildLlmsTxt(data())), [
    "## Services",
    "## Garage Doors & Installation",
    "## Other Services",
    "## Pricing",
    "## Buying Guides & Comparisons",
    "## Garage Door & Motor Brands",
    "## Common Problems",
    "## Articles",
    "## Case Studies",
    "## Service Areas",
    "## Company",
  ]);
});

test("buildLlmsTxt: doors section = every /(doors|installation)-perth$/ page + the motors page; Other Services = the rest, minus Services", () => {
  const text = buildLlmsTxt(data());
  const url = siteConfig.url;
  assert.deepEqual(section(text, "## Garage Doors & Installation"), [
    `- [Garage Door Installation Perth](${url}/garage-door-installation-perth)`,
    `- [Roller Doors Perth](${url}/roller-doors-perth)`,
    `- [Commercial & Industrial Garage Doors Perth](${url}/commercial-garage-doors-perth)`,
    `- [Garage Door Motors Perth](${url}/garage-door-motors-perth): Capital 1100N and 1500N motors, supplied and installed`,
  ]);
  // repairs-perth is in Services, so only the panel page is left over.
  assert.deepEqual(section(text, "## Other Services"), [
    `- [Garage Door Panel Replacement Perth](${url}/garage-door-panel-replacement-perth)`,
  ]);
});

test("buildLlmsTxt: Other Services is left out entirely when nothing is left over", () => {
  const text = buildLlmsTxt(data({ servicePages: [{ slug: "roller-doors-perth", title: "Roller Doors Perth" }] }));
  assert.ok(!text.includes("## Other Services"));
});

test("buildLlmsTxt: Pricing is hub, static guide, CMS guides (static slug wins), calculator", () => {
  const url = siteConfig.url;
  assert.deepEqual(section(buildLlmsTxt(data()), "## Pricing"), [
    `- [Garage Door Prices Perth — price list](${url}/cost-guides): guide prices for every job on our list, from a safety inspection to a new door supplied and installed`,
    `- [Garage Door Installation Cost Perth](${url}/garage-door-installation-cost-perth)`,
    `- [Garage Door Repair Cost Perth](${url}/garage-door-repair-cost-perth)`,
    `- [Price Calculator](${url}/calculator): instant estimate ranges for common repairs`,
  ]);
});

test("buildLlmsTxt: case studies, /quote, brand hubs and the unchanged sections", () => {
  const text = buildLlmsTxt(data());
  const url = siteConfig.url;
  assert.deepEqual(section(text, "## Case Studies"), [
    `- [All case studies](${url}/case-studies)`,
    `- [Job One](${url}/case-studies/job-1)`,
  ]);
  assert.ok(text.includes(`- Get a free quote: ${url}/quote`));
  assert.ok(section(text, "## Company").includes(`- [Get a Quote](${url}/quote)`));
  assert.deepEqual(section(text, "## Garage Door & Motor Brands"), [
    `- [Garage Door Brands Perth](${url}/garage-door-brands-perth)`,
    `- [Garage Door Motor Brands Perth](${url}/garage-door-motor-brands-perth)`,
    `- [Merlin Motors](${url}/merlin-garage-door-motors-perth)`,
  ]);
  assert.deepEqual(section(text, "## Common Problems"), [
    `- [Noisy Garage Door?](${url}/problems/noisy-garage-door)`,
    `- [All problems](${url}/problems)`,
  ]);
  assert.deepEqual(section(text, "## Articles"), [`- [Garage Door Springs](${url}/blog/garage-door-springs-guide)`]);
  assert.deepEqual(section(text, "## Service Areas"), [
    `- [All Perth service areas](${url}/service-areas)`,
    `- [Garage Door Repairs Joondalup](${url}/garage-door-repairs-joondalup)`,
  ]);
  assert.ok(text.endsWith("\n"));
});

test("buildLlmsTxt: no literal prices (prices only ever come from the catalog)", () => {
  assert.ok(!/\$\s?\d/.test(buildLlmsTxt(data())));
});

test("helpers: titleFromSlug and pathOf", () => {
  assert.equal(titleFromSlug("garage-door-repair-cost-perth"), "Garage Door Repair Cost Perth");
  assert.equal(pathOf("/garage-door-repairs-perth/"), "/garage-door-repairs-perth");
  assert.equal(pathOf("https://capitalgaragedoors.com.au/roller-doors-perth"), "/roller-doors-perth");
  assert.equal(pathOf(""), "/");
});
