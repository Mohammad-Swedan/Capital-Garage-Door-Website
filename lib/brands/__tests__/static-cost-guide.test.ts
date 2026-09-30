import { test } from "node:test";
import assert from "node:assert/strict";
import { staticCostGuides } from "../../../content/static-cost-guides";
import { renderStaticCostGuide, META_DESCRIPTION_MAX } from "../../data/static-cost-guides";
import { assertNoLiteralPrices, priceListPolicyNote } from "../pricing";
import { iconMap } from "../../icons";
import { costGuideOffers } from "../../seo/schema";
import type { CmsPublicPricingItem } from "../../cms/pricing-client";
import type { StaticCostGuideSource } from "../../../types/cost-guide";

/** Meta lengths are counted in code points (an en dash is one character, not three bytes). */
const chars = (s: string) => Array.from(s).length;
const words = (s: string) => s.trim().split(/\s+/).length;

const SLUG = "garage-door-installation-cost-perth";
const found = staticCostGuides.find((g) => g.slug === SLUG);
assert.ok(found, `content/static-cost-guides has no "${SLUG}" entry`);
const guide: StaticCostGuideSource = found;

test("the installation guide renders offline (empty catalog) with every token resolved", () => {
  const page = renderStaticCostGuide(guide, []);
  assert.equal(page.slug, SLUG);
  assert.equal(page.pageType, "cost-guide");
  assert.doesNotMatch(JSON.stringify(page), /\{\{/, "an unrendered token reached the page");
  // Baked pricing-data.ts ranges stand in for the live catalog.
  assert.match(page.directAnswer, /\$3,000–\$5,000/);
  assert.match(page.directAnswer, /\$5,000–\$15,000/);
  assert.match(page.directAnswer, /\$770–\$990/);
});

test("the source copy carries no literal price", () => {
  assert.doesNotThrow(() => assertNoLiteralPrices(JSON.stringify(guide), `content/static-cost-guides (${SLUG})`));
});

test("seo title is ≤60 characters with the reviewedAt year; the rendered description is ≤160", () => {
  const page = renderStaticCostGuide(guide, []);
  assert.ok(chars(page.seo.title) <= 60, `title is ${chars(page.seo.title)} chars: ${page.seo.title}`);
  assert.ok(page.seo.title.includes(guide.reviewedAt.slice(0, 4)), "title must carry the reviewedAt year");
  assert.ok(chars(page.seo.description) <= META_DESCRIPTION_MAX, `description is ${chars(page.seo.description)} chars`);
  // Offline, the priced template fits, so it is used rather than the static fallback.
  assert.notEqual(page.seo.description, guide.seo.descriptionFallback);
  assert.match(page.seo.description, /\$3,000–\$5,000/);
  assert.ok(chars(guide.seo.descriptionFallback) <= META_DESCRIPTION_MAX);
  assert.doesNotMatch(guide.seo.descriptionFallback, /\{\{/);
});

test("the table has 7–8 priced rows with every cell filled, under a Door / Job header", () => {
  const page = renderStaticCostGuide(guide, []);
  const { rows, rowHeader, disclaimer } = page.costTable;
  assert.equal(rowHeader, "Door / Job");
  assert.ok(rows.length >= 7 && rows.length <= 8, `table has ${rows.length} rows`);
  for (const row of rows) {
    for (const cell of [row.repairType, row.includes, row.costFactors, row.nextStep, row.priceRange]) {
      assert.ok(cell && cell.trim().length > 0, `empty cell in row ${JSON.stringify(row)}`);
    }
    // Every row here is a real range, so the JSON-LD Offer reads numbers, never the label.
    assert.equal(typeof row.priceMin, "number");
    assert.equal(typeof row.priceMax, "number");
  }
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

test("a live catalog row overrides the price, its non-blank columns win, and fallbacks fill the rest", () => {
  const catalog: CmsPublicPricingItem[] = [
    {
      id: 19,
      scenario: "New garage door — standard (supply & install)",
      priceMin: 3200,
      priceMax: 5200,
      includes: "Live includes text",
      costFactors: null,
      nextStep: "  ",
      updatedAt: "2026-10-02T01:00:00+00:00",
    },
    {
      id: 25,
      scenario: "Motor / opener replacement",
      priceMin: 800,
      priceMax: 1000,
      includes: "Live motor includes",
      costFactors: "Live motor factors",
      nextStep: "Live motor next step",
      updatedAt: "2026-08-01T00:00:00+00:00",
    },
    // Not pinned by this guide: its date must not move the guide's updatedAt.
    { id: 5, scenario: "Broken spring (single)", priceMin: 240, priceMax: 280, updatedAt: "2026-12-25T00:00:00+00:00" },
  ];
  const page = renderStaticCostGuide(guide, catalog);
  const fallback = guide.costTable.rows.find((r) => r.key === "new-standard")!;
  const standard = page.costTable.rows[0];
  assert.equal(standard.priceRange, "$3,200–$5,200");
  assert.equal(standard.priceMin, 3200);
  assert.equal(standard.priceMax, 5200);
  assert.equal(standard.includes, "Live includes text");
  assert.equal(standard.costFactors, fallback.costFactors);
  assert.equal(standard.nextStep, fallback.nextStep);
  const motorIndex = guide.costTable.rows.findIndex((r) => r.key === "motor-replace");
  const motor = page.costTable.rows[motorIndex];
  assert.equal(motor.priceRange, "$800–$1,000");
  assert.equal(motor.includes, "Live motor includes");
  assert.equal(motor.costFactors, "Live motor factors");
  assert.equal(motor.nextStep, "Live motor next step");
  assert.match(page.directAnswer, /\$3,200–\$5,200/);
  assert.match(page.seo.description, /\$3,200–\$5,200/);
  // Newest of reviewedAt and the PINNED live rows' dates.
  assert.equal(page.updatedAt, "2026-10-02");
});

test("updatedAt is reviewedAt offline and when every pinned live row is older", () => {
  assert.equal(renderStaticCostGuide(guide, []).updatedAt, guide.reviewedAt);
  const older: CmsPublicPricingItem[] = [
    { id: 26, scenario: "WiFi / smart control (supply & install)", priceMin: 280, priceMax: 380, updatedAt: "2026-07-11T16:58:03+00:00" },
  ];
  assert.equal(renderStaticCostGuide(guide, older).updatedAt, guide.reviewedAt);
});

test("a rendered description over 160 characters falls back to the static one", () => {
  const catalog: CmsPublicPricingItem[] = [
    {
      id: 19,
      scenario: "New garage door — standard (supply & install)",
      priceMin: null,
      priceMax: null,
      priceLabel: "From $3,000 depending on the door type, opening size, material, insulation and motor",
    },
  ];
  const page = renderStaticCostGuide(guide, catalog);
  assert.equal(page.seo.description, guide.seo.descriptionFallback);
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
  assert.equal(page.hero.h1, "Garage Door Installation Cost Perth");
  assert.equal(page.topicLabel, "New Garage Door Installation");

  // resolveIcon silently falls back to Wrench, so an unknown icon name would never show up as an error.
  const icons = [
    ...page.factors.items.map((i) => i.icon),
    ...page.scenarios.items.map((i) => i.icon),
    ...page.howToQuote.steps.map((s) => s.icon),
    ...page.relatedServices.map((l) => l.icon),
  ];
  for (const icon of icons) assert.ok(icon in iconMap, `icon "${icon}" is not in lib/icons.ts iconMap`);

  const hrefs = page.relatedServices.map((l) => l.href);
  for (const href of [
    "/garage-door-installation-perth",
    "/garage-doors-perth",
    "/roller-doors-perth",
    "/sectional-garage-doors-perth",
    "/tilt-garage-doors-perth",
    "/custom-garage-doors-perth",
    "/garage-door-motors-perth",
    "/commercial-garage-doors-perth",
    "/cost-guides",
    "/warranty",
  ]) {
    assert.ok(hrefs.includes(href), `related links miss ${href}`);
  }
  for (const link of page.relatedServices) assert.ok(link.name && link.description, `incomplete link ${link.href}`);
});

test("every table row becomes a JSON-LD Offer with a numeric price specification", () => {
  const page = renderStaticCostGuide(guide, []);
  const offers = costGuideOffers(page) ?? [];
  assert.equal(offers.length, page.costTable.rows.length);
  const custom = offers.find((o) => o.description === "$5,000–$15,000") as
    | { priceSpecification?: { minPrice?: number; maxPrice?: number } }
    | undefined;
  assert.deepEqual(
    { min: custom?.priceSpecification?.minPrice, max: custom?.priceSpecification?.maxPrice },
    { min: 5000, max: 15000 },
  );
});

test("content bugs throw instead of rendering", () => {
  const withRows = (rows: StaticCostGuideSource["costTable"]["rows"]): StaticCostGuideSource => ({
    ...guide,
    costTable: { ...guide.costTable, rows },
  });
  assert.throws(
    () => renderStaticCostGuide(withRows([...guide.costTable.rows, { key: "cable", includes: "a", costFactors: "b", nextStep: "c" }]), []),
    /not in pricingPins/,
  );
  // A token for a key that isn't pinned.
  assert.throws(() => renderStaticCostGuide({ ...guide, directAnswer: "Cables are {{price:cable}}." }, []), /cable/);
  // A malformed token the renderer can't see must not reach the page as raw braces.
  assert.throws(
    () => renderStaticCostGuide({ ...guide, directAnswer: "Doors are {{price:New-Standard}}." }, []),
    /unrendered/i,
  );
  assert.throws(() => renderStaticCostGuide({ ...guide, directAnswer: "Doors are $3,000." }, []), /Literal price/);
  assert.throws(() => renderStaticCostGuide({ ...guide, reviewedAt: "30/09/2026" }, []), /reviewedAt/);
  assert.throws(
    () => renderStaticCostGuide({ ...guide, seo: { ...guide.seo, descriptionFallback: "x".repeat(161) } }, []),
    /descriptionFallback/,
  );
});
