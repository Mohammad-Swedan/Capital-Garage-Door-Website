import { test } from "node:test";
import assert from "node:assert/strict";
import { staticCostGuides } from "../../../content/static-cost-guides";
import { renderStaticCostGuide, META_DESCRIPTION_MAX } from "../../data/static-cost-guides";
import { assertNoLiteralPrices, priceListPolicyNote } from "../pricing";
import { iconMap } from "../../icons";
import { costGuideOffers } from "../../seo/schema";
import type { CmsPublicPricingItem } from "../../cms/pricing-client";
import type { StaticCostGuideSource } from "../../../types/cost-guide";

/**
 * The roller-door price guide (2026-11). Same contract as static-cost-guide.test.ts, except that
 * this guide carries an OPEN-ENDED row ("Service / tune-up", "From $140 + parts"): on a static
 * guide resolvePriceRows() sets min/max only for a two-bound range, so that row must render its
 * label and get a description-only JSON-LD Offer (no PriceSpecification).
 */

const chars = (s: string) => Array.from(s).length;
const words = (s: string) => s.trim().split(/\s+/).length;

const SLUG = "roller-door-prices-perth";
const found = staticCostGuides.find((g) => g.slug === SLUG);
assert.ok(found, `content/static-cost-guides has no "${SLUG}" entry`);
const guide: StaticCostGuideSource = found;

const OPEN_ENDED_KEYS = new Set(["service"]);

test("the roller guide renders offline (empty catalog) with every token resolved", () => {
  const page = renderStaticCostGuide(guide, []);
  assert.equal(page.slug, SLUG);
  assert.equal(page.pageType, "cost-guide");
  assert.doesNotMatch(JSON.stringify(page), /\{\{/, "an unrendered token reached the page");
  assert.match(page.directAnswer, /\$3,000–\$5,000/);
  assert.match(page.directAnswer, /\$770–\$990/);
  assert.match(page.directAnswer, /\$5,000–\$15,000/);
});

test("the source copy carries no literal price and no roller-irrelevant cable row", () => {
  assert.doesNotThrow(() => assertNoLiteralPrices(JSON.stringify(guide), `content/static-cost-guides (${SLUG})`));
  // Roller doors have no lift cables: a cable row on this page would be a factual mismatch.
  assert.ok(!guide.pricingPins.includes("cable"), "the roller guide must not pin the cable row");
});

test("seo title is ≤60 characters with the reviewedAt year; the rendered description is ≤160", () => {
  const page = renderStaticCostGuide(guide, []);
  assert.ok(chars(page.seo.title) <= 60, `title is ${chars(page.seo.title)} chars: ${page.seo.title}`);
  assert.ok(page.seo.title.includes(guide.reviewedAt.slice(0, 4)), "title must carry the reviewedAt year");
  assert.match(page.seo.title, /^Roller Door Prices Perth/);
  assert.ok(chars(page.seo.description) <= META_DESCRIPTION_MAX, `description is ${chars(page.seo.description)} chars`);
  assert.notEqual(page.seo.description, guide.seo.descriptionFallback);
  assert.match(page.seo.description, /\$3,000–\$5,000/);
  assert.ok(chars(guide.seo.descriptionFallback) <= META_DESCRIPTION_MAX);
  assert.doesNotMatch(guide.seo.descriptionFallback, /\{\{/);
});

test("the table has 7 priced rows with every cell filled; only two-bound rows carry numbers", () => {
  const page = renderStaticCostGuide(guide, []);
  const { rows, rowHeader, disclaimer } = page.costTable;
  assert.equal(rowHeader, "Door / Job");
  assert.equal(rows.length, 7, `table has ${rows.length} rows`);
  rows.forEach((row, i) => {
    for (const cell of [row.repairType, row.includes, row.costFactors, row.nextStep, row.priceRange]) {
      assert.ok(cell && cell.trim().length > 0, `empty cell in row ${JSON.stringify(row)}`);
    }
    const key = guide.costTable.rows[i].key;
    if (OPEN_ENDED_KEYS.has(key)) {
      assert.equal(row.priceMin, null, `${key} must not carry a min`);
      assert.equal(row.priceMax, null, `${key} must not carry a max`);
      assert.match(row.priceRange ?? "", /^From \$/);
    } else {
      assert.equal(typeof row.priceMin, "number", `${key} min`);
      assert.equal(typeof row.priceMax, "number", `${key} max`);
    }
  });
  assert.equal(rows[0].repairType, "New roller door (supply & install)");
  assert.equal(rows[0].priceRange, "$3,000–$5,000");
  assert.equal(disclaimer, priceListPolicyNote([]));
});

test("every pin is used by the table or a token in the copy", () => {
  const tableKeys = new Set(guide.costTable.rows.map((r) => r.key));
  const tokens = new Set([...JSON.stringify(guide).matchAll(/\{\{price:([a-z0-9-]+)\}\}/g)].map((m) => m[1]));
  for (const pin of guide.pricingPins) {
    assert.ok(tableKeys.has(pin) || tokens.has(pin), `pin "${pin}" is never used`);
  }
  for (const key of tableKeys) assert.ok(guide.pricingPins.includes(key), `table row "${key}" is not pinned`);
});

test("a live catalog row overrides the price and its non-blank columns win", () => {
  const catalog: CmsPublicPricingItem[] = [
    {
      id: 19,
      scenario: "New garage door — standard (supply & install)",
      priceMin: 3200,
      priceMax: 5200,
      includes: "Live includes text",
      costFactors: null,
      nextStep: "  ",
      updatedAt: "2026-11-05T01:00:00+00:00",
    },
    // A live open-ended service row keeps the label path (no range).
    { id: 27, scenario: "Service / tune-up", priceMin: 150, priceMax: null, priceLabel: "From $150 + parts", updatedAt: "2026-10-01T00:00:00+00:00" },
  ];
  const page = renderStaticCostGuide(guide, catalog);
  const fallback = guide.costTable.rows.find((r) => r.key === "new-standard")!;
  const standard = page.costTable.rows[0];
  assert.equal(standard.priceRange, "$3,200–$5,200");
  assert.equal(standard.includes, "Live includes text");
  assert.equal(standard.costFactors, fallback.costFactors);
  assert.equal(standard.nextStep, fallback.nextStep);
  const serviceIndex = guide.costTable.rows.findIndex((r) => r.key === "service");
  assert.equal(page.costTable.rows[serviceIndex].priceRange, "From $150 + parts");
  assert.equal(page.costTable.rows[serviceIndex].priceMin, null);
  assert.match(page.directAnswer, /\$3,200–\$5,200/);
  // Newest of reviewedAt and the PINNED live rows' dates.
  assert.equal(page.updatedAt, "2026-11-05");
  assert.equal(renderStaticCostGuide(guide, []).updatedAt, guide.reviewedAt);
});

test("content shape: direct answer, FAQs, factors, scenarios, steps and related links", () => {
  const page = renderStaticCostGuide(guide, []);
  const answerWords = words(page.directAnswer);
  assert.ok(answerWords >= 50 && answerWords <= 90, `direct answer is ${answerWords} words`);
  assert.equal(page.faqs.length, 6);
  for (const faq of page.faqs) {
    const n = words(faq.answer);
    assert.ok(n >= 40 && n <= 90, `"${faq.question}" answer is ${n} words`);
  }
  assert.equal(page.factors.items.length, 6);
  assert.equal(page.scenarios.items.length, 4);
  assert.equal(page.howToQuote.steps.length, 5);
  assert.equal(page.hero.h1, "Roller Door Prices Perth");
  assert.equal(page.topicLabel, "Roller Doors");

  const icons = [
    ...page.factors.items.map((i) => i.icon),
    ...page.scenarios.items.map((i) => i.icon),
    ...page.howToQuote.steps.map((s) => s.icon),
    ...page.relatedServices.map((l) => l.icon),
  ];
  for (const icon of icons) assert.ok(icon in iconMap, `icon "${icon}" is not in lib/icons.ts iconMap`);

  const hrefs = page.relatedServices.map((l) => l.href);
  for (const href of [
    "/roller-doors-perth",
    "/roller-door-installation-perth",
    "/roller-door-repairs-perth",
    "/garage-door-motors-perth",
    "/commercial-roller-doors-perth",
    "/industrial-roller-doors-perth",
    "/garage-door-installation-cost-perth",
    "/cost-guides",
    "/roller-door-vs-sectional-door",
    "/warranty",
  ]) {
    assert.ok(hrefs.includes(href), `related links miss ${href}`);
  }
  for (const link of page.relatedServices) assert.ok(link.name && link.description, `incomplete link ${link.href}`);
  // No unverified claim may slip into the copy.
  assert.doesNotMatch(JSON.stringify(page), /licensed|insured|lifetime|#1|authori[sz]ed dealer/i);
});

test("JSON-LD: one Offer per row; two-bound rows get a numeric spec, the open-ended row is description-only", () => {
  const page = renderStaticCostGuide(guide, []);
  const offers = (costGuideOffers(page) ?? []) as {
    name: string;
    description: string;
    priceSpecification?: { minPrice?: number; maxPrice?: number; price?: number };
  }[];
  assert.equal(offers.length, page.costTable.rows.length);
  const newDoor = offers.find((o) => o.name === "New roller door (supply & install)");
  assert.deepEqual(
    { min: newDoor?.priceSpecification?.minPrice, max: newDoor?.priceSpecification?.maxPrice },
    { min: 3000, max: 5000 },
  );
  const service = offers.find((o) => o.name === "Roller door service / tune-up");
  assert.ok(service, "service offer missing");
  assert.equal(service.priceSpecification, undefined, "an open-ended row must not carry a PriceSpecification");
  assert.match(service.description, /^From \$/);
});
