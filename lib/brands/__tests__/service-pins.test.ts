import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PRICE_PINS_BY_SLUG,
  REVIEW_KEYWORDS_BY_SLUG,
  SERVICE_PIN_SLUGS,
  buildUpdateBody,
  countKeywordHits,
  diffPageState,
  pickReviewsForPage,
  planPagePins,
  selectReviewsForPage,
  type AdminPage,
  type PinReview,
} from "../../cms/service-pins";
import { buildSeedRows } from "../../../components/sections/smart-calculator/pricing-data";
import { reviews as contentReviews } from "../../../content/reviews";

/* ------------------------------------------------------------------ *
 * Fixtures
 * ------------------------------------------------------------------ */

const SPRING = "garage-door-spring-repair-perth";
const EMERGENCY = "emergency-garage-door-repairs-perth";
const MAINTENANCE = "garage-door-maintenance-perth";
const OPENER = "garage-door-opener-repair-perth";
const ROLLER = "roller-door-repairs-perth";
const COMMERCIAL = "commercial-garage-doors-perth";
const INSTALLATION = "garage-door-installation-perth";
const REPAIRS = "garage-door-repairs-perth";

let seq = 1000;
/** A review with NO keyword for any page ("Lovely people, thank you.") unless `over` adds one. */
function rv(over: Partial<PinReview> = {}): PinReview {
  const id = over.id ?? ++seq;
  return {
    id,
    customerName: `Customer ${id}`,
    rating: 5,
    text: "Lovely people, thank you.",
    reviewDate: "2026-01-01",
    service: null,
    ...over,
  };
}
const ids = (rs: PinReview[]) => rs.map((r) => r.id);

/** Deterministic Fisher-Yates so the shuffles in the determinism test are reproducible. */
function shuffle<T>(list: readonly T[], seed: number): T[] {
  const out = [...list];
  let s = seed;
  const next = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Every catalog scenario the CMS is seeded with, with made-up ids. */
const CATALOG = buildSeedRows().map((r, i) => ({ id: 500 + i, scenario: r.scenario }));
const catalogId = (scenario: string) => CATALOG.find((c) => c.scenario === scenario)!.id;

function page(over: Partial<AdminPage> = {}): AdminPage {
  return {
    id: 7,
    templateType: "ServicePage",
    routeGroup: "Flat",
    slug: SPRING,
    title: "Garage Door Spring Repair Perth",
    status: "Published",
    noIndex: false,
    seoTitle: "Spring Repair Perth | Same-Day",
    seoDescription: "Broken spring? We replace them today.",
    heroImageAssetId: 55,
    socialImageAssetId: null,
    data: { hero: { headline: "Fix it", bullets: ["a", "b"] }, nested: { z: 1, a: [1, 2, { k: "v" }] } },
    faqs: [
      { id: 1, question: "Q1?", answer: "A1", sortOrder: 0, faqItemId: null },
      { id: 2, question: "Q2?", answer: "A2", sortOrder: 1, faqItemId: 9 },
    ],
    relatedLinks: [
      { id: 1, targetPageId: null, staticHref: "/garage-door-repairs-perth", labelOverride: "Repairs", linkGroup: "RelatedServices", sortOrder: 0 },
      { id: 2, targetPageId: 12, staticHref: null, labelOverride: null, linkGroup: "NearbySuburbs", sortOrder: 1 },
    ],
    pricingRows: [],
    reviews: [],
    services: [{ serviceId: 3, sortOrder: 0 }],
    ...over,
  };
}

/* ------------------------------------------------------------------ *
 * pickReviewsForPage — relevance
 * ------------------------------------------------------------------ */

test("keyword relevance: more hits rank first, and zero-hit reviews are left out when enough match", () => {
  const none = rv({ id: 1, reviewDate: "2026-09-01" }); // newest, but no keyword
  const one = rv({ id: 2, text: "Replaced a broken spring.", reviewDate: "2026-08-01" });
  const two = rv({ id: 4, text: "New cable fitted and a spring replaced.", reviewDate: "2025-06-01" });
  const three = rv({ id: 3, text: "Both springs snapped and a cable came off; springs replaced.", reviewDate: "2025-01-01" });
  assert.deepEqual(ids(pickReviewsForPage([none, one, two, three], SPRING, 3)), [3, 4, 2]);
});

test("countKeywordHits counts each occurrence once (spring vs springs is not double counted)", () => {
  assert.equal(countKeywordHits("Springs", ["spring", "springs", "cable"]), 1);
  assert.equal(countKeywordHits("One spring. Two springs! SPRING", ["spring", "springs"]), 3);
  assert.equal(countKeywordHits("", ["spring"]), 0);
  assert.equal(countKeywordHits("anything at all", []), 0);
});

test("keywords match at the start of a word: inflections hit, mid-word fragments do not", () => {
  assert.equal(countKeywordHits("Installation of roller doors", ["install"]), 1);
  assert.equal(countKeywordHits("Rollers, remotes and motors", ["roller", "remote", "motor"]), 3);
  assert.equal(countKeywordHits("A template, a plate and a chocolate", ["late"]), 0);
  assert.equal(countKeywordHits("The workshop and the breakfast", ["shop", "fast"]), 0);
  // Hyphens and punctuation are word breaks, so phrases match "after-hours" / "same-day" too.
  assert.equal(
    countKeywordHits("Came after-hours, same-day, late at night", ["after hours", "same day", "late", "night"]),
    4,
  );
});

test("the review's service tag counts as review content", () => {
  const tagged = rv({ id: 1, text: "Adam was there in an hour.", service: "Emergency Repairs", reviewDate: "2025-01-01" });
  const untagged = rv({ id: 2, text: "Adam was there in an hour.", service: "Repairs", reviewDate: "2026-01-01" });
  const other = rv({ id: 3, reviewDate: "2026-06-01" });
  const [first] = selectReviewsForPage([untagged, other, tagged], EMERGENCY, 3);
  assert.equal(first.review.id, 1);
  assert.equal(first.hits, 1);
  assert.equal(first.source, "keyword");
});

test("ties break on rating (5-star first), then newest, then highest id", () => {
  const fourNew = rv({ id: 1, rating: 4, text: "Fast!", reviewDate: "2026-09-01" });
  const fiveOld = rv({ id: 2, rating: 5, text: "Fast!", reviewDate: "2024-01-01" });
  const fiveNew = rv({ id: 3, rating: 5, text: "Fast!", reviewDate: "2026-01-01" });
  const fiveNewTwin = rv({ id: 4, rating: 5, text: "Fast, really!", reviewDate: "2026-01-01" });
  assert.deepEqual(ids(pickReviewsForPage([fourNew, fiveOld, fiveNew, fiveNewTwin], EMERGENCY, 4)), [4, 3, 2, 1]);
});

test("keyword hits outrank rating: a 4-star with more hits beats a 5-star with fewer", () => {
  const fourStar = rv({ id: 1, rating: 4, text: "Fast and quick." });
  const fiveStar = rv({ id: 2, rating: 5, text: "Fast." });
  assert.deepEqual(ids(pickReviewsForPage([fiveStar, fourStar], EMERGENCY, 2)), [1, 2]);
});

/* ------------------------------------------------------------------ *
 * pickReviewsForPage — filters
 * ------------------------------------------------------------------ */

test("rating filter: below 4 stars is never picked, even with the most keyword hits", () => {
  const three = rv({ id: 1, rating: 3, text: "Fast, quick, urgent emergency, same day." });
  const two = rv({ id: 2, rating: 2, text: "Urgent and fast." });
  const four = rv({ id: 3, rating: 4, text: "Fast service." });
  const five = rv({ id: 4, rating: 5, text: "Quick." });
  assert.deepEqual(ids(pickReviewsForPage([three, two, four, five], EMERGENCY, 4)), [4, 3]);
});

test("fallback fills with the newest 5-star reviews only (a newer 4-star or 3-star is skipped)", () => {
  const pool = [
    rv({ id: 1, rating: 3, reviewDate: "2026-09-30" }),
    rv({ id: 2, rating: 4, reviewDate: "2026-09-01" }),
    rv({ id: 3, rating: 5, reviewDate: "2026-03-01" }),
    rv({ id: 4, rating: 5, reviewDate: "2026-02-01" }),
    rv({ id: 5, rating: 5, reviewDate: "2025-01-01" }),
    rv({ id: 6, rating: 5, reviewDate: "2024-01-01" }),
  ];
  assert.deepEqual(ids(pickReviewsForPage(pool, COMMERCIAL, 3)), [3, 4, 5]);
});

test("visibility filter: reviews flagged unpublished / hidden are never picked", () => {
  const visible = rv({ id: 1, text: "Fast!", reviewDate: "2020-01-01" });
  const hidden = [
    rv({ id: 2, text: "Fast fast fast!", isPublished: false }),
    rv({ id: 3, text: "Fast fast fast!", isVisible: false }),
    rv({ id: 4, text: "Fast fast fast!", isHidden: true }),
    rv({ id: 5, text: "Fast fast fast!", status: "Draft" }),
    rv({ id: 6, text: "Fast fast fast!", status: " unpublished " }),
  ];
  const published = rv({ id: 7, text: "Fast!", status: "Published", reviewDate: "2019-01-01" });
  assert.deepEqual(ids(pickReviewsForPage([...hidden, visible, published], EMERGENCY, 5)), [1, 7]);
});

test("a review with no text is never picked", () => {
  const blank = rv({ id: 1, text: "   ", service: "Emergency Repairs" });
  const real = rv({ id: 2, text: "Fast!" });
  const other = rv({ id: 3, text: "Quick!" });
  assert.deepEqual(ids(pickReviewsForPage([blank, real, other], EMERGENCY, 3)), [3, 2]);
});

/* ------------------------------------------------------------------ *
 * pickReviewsForPage — fallback, size, duplicates, determinism
 * ------------------------------------------------------------------ */

test("fewer than 2 keyword matches: fill with the newest 5-star reviews up to n", () => {
  const match = rv({ id: 1, text: "Fixed my roller door.", reviewDate: "2024-01-01" });
  const newest = rv({ id: 2, reviewDate: "2026-05-01" });
  const next = rv({ id: 3, reviewDate: "2026-04-01" });
  const oldest = rv({ id: 4, reviewDate: "2020-01-01" });
  const picked = selectReviewsForPage([oldest, newest, match, next], ROLLER, 3);
  assert.deepEqual(ids(picked.map((p) => p.review)), [1, 2, 3]);
  assert.deepEqual(picked.map((p) => p.source), ["keyword", "fallback", "fallback"]);
  assert.deepEqual(picked.map((p) => p.hits), [1, 0, 0]);
});

test("no keyword matches at all: the newest 5-star reviews fill the page", () => {
  const pool = [
    rv({ id: 1, reviewDate: "2024-01-01" }),
    rv({ id: 2, reviewDate: "2026-02-01" }),
    rv({ id: 3, reviewDate: "2025-01-01" }),
    rv({ id: 4, reviewDate: "2026-03-01" }),
  ];
  assert.deepEqual(ids(pickReviewsForPage(pool, COMMERCIAL, 3)), [4, 2, 3]);
});

test("two keyword matches are enough: no fallback fill, even when n is larger", () => {
  const a = rv({ id: 1, text: "Roller door fixed.", reviewDate: "2026-01-01" });
  const b = rv({ id: 2, text: "Rollers replaced.", reviewDate: "2025-01-01" });
  const newestButUnrelated = rv({ id: 3, reviewDate: "2030-01-01" });
  assert.deepEqual(ids(pickReviewsForPage([newestButUnrelated, a, b], ROLLER, 3)), [1, 2]);
});

test("n caps the result, n of 0 returns nothing, and a small pool returns what exists", () => {
  const pool = [1, 2, 3, 4].map((i) => rv({ id: i, text: "Fast!", reviewDate: `2026-01-0${i}` }));
  assert.deepEqual(ids(pickReviewsForPage(pool, EMERGENCY, 2)), [4, 3]);
  assert.deepEqual(ids(pickReviewsForPage(pool, EMERGENCY, 1)), [4]);
  assert.deepEqual(pickReviewsForPage(pool, EMERGENCY, 0), []);
  // A nonsense n must never turn the fallback into an unbounded fill.
  assert.deepEqual(pickReviewsForPage([rv(), rv(), rv()], COMMERCIAL, Number.NaN), []);
  assert.deepEqual(ids(pickReviewsForPage(pool.slice(0, 1), EMERGENCY, 3)), [1]);
  assert.deepEqual(pickReviewsForPage([], EMERGENCY, 3), []);
  // Default n is 3.
  assert.equal(pickReviewsForPage(pool, EMERGENCY).length, 3);
});

test("never returns the same review twice (same id, or same customer + text)", () => {
  const original = rv({ id: 1, customerName: "Sam", text: "Fast fix.", reviewDate: "2026-01-01" });
  const sameId = { ...original };
  const sameContent = rv({ id: 2, customerName: " sam ", text: "FAST  fix", reviewDate: "2025-12-01" });
  const other = rv({ id: 3, text: "Quick job.", reviewDate: "2025-01-01" });
  assert.deepEqual(ids(pickReviewsForPage([original, sameId, sameContent, other], EMERGENCY, 4)), [1, 3]);
});

test("the fallback never repeats a review that already matched", () => {
  const match = rv({ id: 1, text: "Fixed my roller door.", reviewDate: "2026-09-01" });
  const others = [2, 3].map((i) => rv({ id: i, reviewDate: `2026-0${i}-01` }));
  const picked = ids(pickReviewsForPage([match, ...others], ROLLER, 3));
  assert.deepEqual(picked, [1, 3, 2]);
  assert.equal(new Set(picked).size, picked.length);
});

/** 40 reviews with lots of deliberate ties (dates, ratings, hit counts) so ordering rules are exercised. */
function tiePool(): PinReview[] {
  const texts = [
    "Lovely people, thank you.",
    "Fast and quick, fixed the spring.",
    "Motor and remote replaced same day.",
    "Roller door serviced after hours.",
    "Commercial roller shutter repaired for our business.",
    "New door installed, springs and cable checked.",
  ];
  const services = [null, "Repairs", "Emergency Repairs", "Installations", "Motor Replacement"];
  return Array.from({ length: 40 }, (_, i) =>
    rv({
      id: 2000 + i,
      customerName: `Tie ${i}`,
      rating: i % 7 === 0 ? 4 : i % 11 === 0 ? 3 : 5,
      text: texts[i % texts.length],
      service: services[i % services.length],
      reviewDate: `2025-0${(i % 3) + 1}-15`,
    }),
  );
}

test("deterministic: any input order gives the same picks, and the input is never mutated", () => {
  const pool = tiePool();
  const before = pool.map((r) => r.id);
  for (const slug of SERVICE_PIN_SLUGS) {
    const expected = ids(pickReviewsForPage(pool, slug, 3));
    assert.deepEqual(ids(pickReviewsForPage(pool, slug, 3)), expected, `${slug} repeat call`);
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      assert.deepEqual(ids(pickReviewsForPage(shuffle(pool, seed), slug, 3)), expected, `${slug} shuffle ${seed}`);
    }
  }
  assert.deepEqual(pool.map((r) => r.id), before);
});

test("every page gets distinct eligible reviews (no duplicates, nothing below 4 stars, at most n)", () => {
  const pool = tiePool();
  for (const slug of SERVICE_PIN_SLUGS) {
    for (const n of [1, 2, 3, 5]) {
      const picked = pickReviewsForPage(pool, slug, n);
      assert.ok(picked.length <= n, `${slug} n=${n}`);
      assert.equal(new Set(ids(picked)).size, picked.length, `${slug} n=${n} duplicates`);
      assert.ok(picked.every((r) => r.rating >= 4), `${slug} n=${n} rating`);
    }
  }
});

test("an unknown page slug is a programming error, not a silent fallback", () => {
  assert.throws(() => pickReviewsForPage([rv()], "not-a-money-page", 3), /No review keywords/);
});

/* ------------------------------------------------------------------ *
 * The real review pool (content/reviews.ts is the source the CMS was seeded from)
 * ------------------------------------------------------------------ */

test("real review pool: every money page gets 3 distinct 5-star reviews, best keyword matches first", () => {
  const pool: PinReview[] = contentReviews.map((r, i) => ({
    id: i + 1,
    customerName: r.customerName,
    rating: r.rating,
    text: r.text,
    reviewDate: r.date,
    service: r.service,
  }));
  assert.ok(pool.length >= 20, "expected the seeded review pool");
  for (const slug of SERVICE_PIN_SLUGS) {
    const keywords = REVIEW_KEYWORDS_BY_SLUG[slug];
    const picked = selectReviewsForPage(pool, slug, 3);
    assert.equal(picked.length, 3, slug);
    assert.equal(new Set(picked.map((p) => p.review.id)).size, 3, slug);
    assert.ok(picked.every((p) => p.review.rating === 5), slug);
    // A keyword-sourced pick really carries its hits; a fallback pick carries none.
    for (const p of picked) assert.equal(p.source === "keyword", p.hits > 0, `${slug} #${p.review.id}`);
    // Keyword picks come first, and none is beaten by a review that was left out.
    const hitsOf = (r: PinReview) => countKeywordHits(r.text, keywords) + countKeywordHits(r.service, keywords);
    const leftOut = pool.filter((r) => !picked.some((p) => p.review.id === r.id));
    for (const p of picked.filter((x) => x.source === "keyword")) {
      assert.ok(leftOut.every((r) => hitsOf(r) <= p.hits), `${slug}: a left-out review out-scores #${p.review.id}`);
    }
    const sources = picked.map((p) => p.source);
    assert.deepEqual(sources, [...sources.filter((s) => s === "keyword"), ...sources.filter((s) => s === "fallback")]);
  }
});

/* ------------------------------------------------------------------ *
 * Pin tables
 * ------------------------------------------------------------------ */

test("pin tables: price pins exist for exactly the six empty pages, keywords for all eight", () => {
  assert.deepEqual(Object.keys(PRICE_PINS_BY_SLUG).sort(), [COMMERCIAL, EMERGENCY, MAINTENANCE, OPENER, ROLLER, SPRING].sort());
  assert.deepEqual([...SERVICE_PIN_SLUGS].sort(), [COMMERCIAL, EMERGENCY, INSTALLATION, MAINTENANCE, OPENER, REPAIRS, ROLLER, SPRING].sort());
  assert.deepEqual(Object.keys(REVIEW_KEYWORDS_BY_SLUG).sort(), [...SERVICE_PIN_SLUGS].sort());
  const counts = Object.fromEntries(Object.entries(PRICE_PINS_BY_SLUG).map(([slug, list]) => [slug, list.length]));
  assert.deepEqual(counts, { [SPRING]: 7, [EMERGENCY]: 7, [MAINTENANCE]: 5, [OPENER]: 5, [ROLLER]: 7, [COMMERCIAL]: 5 });
});

test("pin tables: every price scenario is a real catalog row (exact string, incl. × and —), none repeated on a page", () => {
  const seeded = new Set(buildSeedRows().map((r) => r.scenario));
  for (const [slug, scenarios] of Object.entries(PRICE_PINS_BY_SLUG)) {
    assert.equal(new Set(scenarios).size, scenarios.length, `${slug} repeats a scenario`);
    for (const s of scenarios) assert.ok(seeded.has(s), `${slug}: "${s}" is not a seeded catalog scenario`);
  }
  assert.ok(PRICE_PINS_BY_SLUG[SPRING].includes("Broken springs (×2)"));
  assert.ok(PRICE_PINS_BY_SLUG[COMMERCIAL].includes("New door — commercial / custom"));
});

test("pin tables: review keywords are lower-case and non-empty", () => {
  for (const [slug, keywords] of Object.entries(REVIEW_KEYWORDS_BY_SLUG)) {
    assert.ok(keywords.length > 0, slug);
    for (const k of keywords) assert.equal(k, k.trim().toLowerCase(), `${slug}: "${k}"`);
  }
});

/* ------------------------------------------------------------------ *
 * planPagePins
 * ------------------------------------------------------------------ */

test("plan: an empty page gets its whole price table in table order, plus reviews", () => {
  const pool = tiePool();
  for (const [slug, scenarios] of Object.entries(PRICE_PINS_BY_SLUG)) {
    const plan = planPagePins(page({ slug }), CATALOG, pool, 3);
    assert.deepEqual(plan.priceRows.map((r) => r.scenario), [...scenarios], slug);
    assert.deepEqual(plan.priceRows.map((r) => r.sortOrder), scenarios.map((_, i) => i), slug);
    assert.deepEqual(plan.priceRows.map((r) => r.pricingItemId), scenarios.map(catalogId), slug);
    assert.ok(plan.priceRows.every((r) => r.noteOverride === null));
    assert.deepEqual(plan.missingScenarios, []);
    assert.equal(plan.priceSkipReason, null);
    assert.deepEqual(plan.reviews.map((r) => r.reviewId), ids(pickReviewsForPage(pool, slug, 3)));
    assert.deepEqual(plan.reviews.map((r) => r.sortOrder), [0, 1, 2]);
  }
});

test("plan: idempotent — a page that already has price rows or reviews is left alone", () => {
  const pool = tiePool();
  const withRows = planPagePins(
    page({ pricingRows: [{ pricingItemId: 1, sortOrder: 0, noteOverride: null }] }),
    CATALOG,
    pool,
  );
  assert.deepEqual(withRows.priceRows, []);
  assert.match(withRows.priceSkipReason ?? "", /already has 1/);
  assert.equal(withRows.reviews.length, 3); // no pinned reviews yet, so those are still added

  const withReviews = planPagePins(page({ reviews: [{ reviewId: 1, sortOrder: 0 }, { reviewId: 2, sortOrder: 1 }] }), CATALOG, pool);
  assert.deepEqual(withReviews.reviews, []);
  assert.match(withReviews.reviewSkipReason ?? "", /already has 2/);
  assert.equal(withReviews.priceRows.length, PRICE_PINS_BY_SLUG[SPRING].length);
});

test("plan: the installation and repairs pages have no price table, only reviews", () => {
  for (const slug of [INSTALLATION, REPAIRS]) {
    const plan = planPagePins(page({ slug }), CATALOG, tiePool());
    assert.deepEqual(plan.priceRows, []);
    assert.match(plan.priceSkipReason ?? "", /no price table/);
    assert.equal(plan.reviews.length, 3);

    // In production both already carry price rows: that is what gets reported.
    const rows = [1, 2, 3].map((i) => ({ pricingItemId: i, sortOrder: i, noteOverride: null }));
    const withRows = planPagePins(page({ slug, pricingRows: rows }), CATALOG, tiePool());
    assert.deepEqual(withRows.priceRows, []);
    assert.match(withRows.priceSkipReason ?? "", /already has 3/);
    assert.equal(withRows.reviews.length, 3);
  }
});

test("plan: a scenario missing from the catalog is reported and skipped, the rest keep contiguous sort orders", () => {
  const catalog = CATALOG.filter((c) => c.scenario !== "Springs (×3)");
  const plan = planPagePins(page(), catalog, tiePool());
  assert.deepEqual(plan.missingScenarios, ["Springs (×3)"]);
  assert.equal(plan.priceRows.length, PRICE_PINS_BY_SLUG[SPRING].length - 1);
  assert.deepEqual(plan.priceRows.map((r) => r.sortOrder), [0, 1, 2, 3, 4, 5]);
  assert.ok(!plan.priceRows.some((r) => r.scenario === "Springs (×3)"));
});

test("plan: nothing matches the catalog -> no price rows and every scenario reported missing", () => {
  const plan = planPagePins(page(), [], tiePool());
  assert.deepEqual(plan.priceRows, []);
  assert.deepEqual(plan.missingScenarios, [...PRICE_PINS_BY_SLUG[SPRING]]);
});

test("plan: an empty review pool plans no reviews and says why", () => {
  const plan = planPagePins(page(), CATALOG, []);
  assert.deepEqual(plan.reviews, []);
  assert.match(plan.reviewSkipReason ?? "", /no eligible reviews/);
});

/* ------------------------------------------------------------------ *
 * buildUpdateBody — the full-children PUT must preserve the page
 * ------------------------------------------------------------------ */

test("update body: preserves the page and every existing child, and adds only the planned pins", () => {
  const before = page();
  const snapshot = JSON.parse(JSON.stringify(before));
  const plan = planPagePins(before, CATALOG, tiePool());
  const body = buildUpdateBody(before, plan);

  assert.equal(body.id, 7);
  assert.equal(body.templateType, "ServicePage");
  assert.equal(body.slug, SPRING);
  assert.equal(body.title, before.title);
  assert.equal(body.seoTitle, before.seoTitle);
  assert.equal(body.seoDescription, before.seoDescription);
  assert.equal(body.noIndex, false);
  assert.equal(body.status, "Published");
  assert.equal(body.heroImageAssetId, 55);
  assert.equal(body.socialImageAssetId, null);
  assert.deepEqual(body.data, before.data);
  assert.deepEqual(body.faqs, [
    { question: "Q1?", answer: "A1", sortOrder: 0, faqItemId: null },
    { question: "Q2?", answer: "A2", sortOrder: 1, faqItemId: 9 },
  ]);
  assert.deepEqual(body.relatedLinks, [
    { targetPageId: null, staticHref: "/garage-door-repairs-perth", labelOverride: "Repairs", linkGroup: "RelatedServices", sortOrder: 0 },
    { targetPageId: 12, staticHref: null, labelOverride: null, linkGroup: "NearbySuburbs", sortOrder: 1 },
  ]);
  assert.deepEqual(body.services, [{ serviceId: 3, sortOrder: 0 }]);
  assert.deepEqual(
    body.pricingRows,
    plan.priceRows.map((r) => ({ pricingItemId: r.pricingItemId, sortOrder: r.sortOrder, noteOverride: null })),
  );
  assert.deepEqual(
    body.reviews,
    plan.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder })),
  );
  // Only the fields the update endpoint takes — no server-only fields leak into the PUT.
  assert.deepEqual(Object.keys(body).sort(), [
    "data", "faqs", "heroImageAssetId", "id", "noIndex", "pricingRows", "relatedLinks", "reviews",
    "seoDescription", "seoTitle", "services", "slug", "socialImageAssetId", "status", "templateType", "title",
  ]);
  // The page object handed in is untouched.
  assert.deepEqual(before, snapshot);
});

test("update body: existing pins are kept and new pins are added after them", () => {
  const before = page({
    pricingRows: [{ pricingItemId: 42, sortOrder: 0, noteOverride: "keep me" }],
    reviews: [{ reviewId: 9, sortOrder: 0 }],
  });
  const body = buildUpdateBody(before, {
    priceRows: [{ pricingItemId: 43, sortOrder: 1, noteOverride: null, scenario: "x" }],
    reviews: [{ reviewId: 10, sortOrder: 1, hits: 1, source: "keyword", review: rv({ id: 10 }) }],
  });
  assert.deepEqual(body.pricingRows, [
    { pricingItemId: 42, sortOrder: 0, noteOverride: "keep me" },
    { pricingItemId: 43, sortOrder: 1, noteOverride: null },
  ]);
  assert.deepEqual(body.reviews, [
    { reviewId: 9, sortOrder: 0 },
    { reviewId: 10, sortOrder: 1 },
  ]);
});

/* ------------------------------------------------------------------ *
 * diffPageState — the post-write check
 * ------------------------------------------------------------------ */

/** What the server would hold after the PUT: the page with the plan's pins added and fresh child ids. */
function afterWrite(before: AdminPage, plan: ReturnType<typeof planPagePins>): AdminPage {
  return {
    ...before,
    faqs: before.faqs.map((f) => ({ ...f, id: f.id + 100 })),
    relatedLinks: before.relatedLinks.map((l) => ({ ...l, id: l.id + 100 })),
    pricingRows: [
      ...before.pricingRows,
      ...plan.priceRows.map((r) => ({ pricingItemId: r.pricingItemId, sortOrder: r.sortOrder, noteOverride: r.noteOverride })),
    ],
    reviews: [...before.reviews, ...plan.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder }))],
  };
}

test("post-write check: a faithful write (new child ids, re-ordered keys) reports no problems", () => {
  const before = page();
  const plan = planPagePins(before, CATALOG, tiePool());
  const after = afterWrite(before, plan);
  after.data = { nested: { a: [1, 2, { k: "v" }], z: 1 }, hero: { bullets: ["a", "b"], headline: "Fix it" } }; // same JSON, other key order
  after.faqs = [...after.faqs].reverse();
  assert.deepEqual(diffPageState(before, after, plan), []);
});

test("post-write check: flags a lost FAQ, link, service, changed data or status, and missing / unexpected pins", () => {
  const before = page();
  const plan = planPagePins(before, CATALOG, tiePool());
  const good = afterWrite(before, plan);

  const problems = (mutate: (p: AdminPage) => void) => {
    const after = structuredClone(good);
    mutate(after);
    return diffPageState(before, after, plan);
  };

  assert.match(problems((p) => p.faqs.pop()).join("|"), /faqs/);
  assert.match(problems((p) => p.relatedLinks.pop()).join("|"), /relatedLinks/);
  assert.match(problems((p) => (p.services = [])).join("|"), /services/);
  assert.match(problems((p) => (p.data = { hero: {} })).join("|"), /data/);
  assert.match(problems((p) => (p.status = "Draft")).join("|"), /status/);
  assert.match(problems((p) => (p.seoTitle = "changed")).join("|"), /seoTitle/);
  assert.match(problems((p) => p.pricingRows.pop()).join("|"), /pricingRows/);
  assert.match(problems((p) => p.reviews.pop()).join("|"), /reviews/);
  assert.match(problems((p) => p.reviews.push({ reviewId: 99999, sortOrder: 9 })).join("|"), /reviews/);
});
