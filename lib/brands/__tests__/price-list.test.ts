import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildPricingRows,
  formatAud,
  formatCatalogPrice,
  formatRange,
  priceListPolicyNote,
  renderPriceTokens,
  resolvePriceRows,
} from "../pricing";
import {
  PRICING_BY_ID,
  PRICING_SCENARIOS,
  SPECIAL_SEED_ROWS,
  buildSeedRows,
} from "../../../components/sections/smart-calculator/pricing-data";
import type { CmsPublicPricingItem } from "../../cms/pricing-client";
import type { CmsPricingRow, PageResolveDto } from "../../cms/client";
import { mapServicePage } from "../../cms/map-service-page";
import { mapServiceSuburbPage } from "../../cms/map-service-suburb-page";
import { mapProblemPage } from "../../cms/map-problem-page";
import { mapCostGuidePage } from "../../cms/map-cost-guide-page";
import { costGuideOffers } from "../../seo/schema";
import {
  COST_GUIDE_LINKS,
  PRICE_LIST_LINK,
  priceLinksFor,
  siblingGuideLinks,
} from "../../pricing/guide-links";

/* ------------------------------------------------------------------ *
 * Fixtures
 * ------------------------------------------------------------------ */

const AFTER_HOURS = "After-hours / emergency call-out";
const POLICY = "Estimates & quotes (how we price)";

const springVariant = (n: number) => PRICING_BY_ID.get("spring")!.countVariants![n];
const seedRow = (scenario: string) => SPECIAL_SEED_ROWS.find((r) => r.scenario === scenario)!;

/**
 * Every seeded catalog row (what scripts/seed-pricing.ts writes to the CMS), re-priced so a live
 * override is distinguishable from the baked value, with the live-only columns filled in.
 */
function liveCatalog(): CmsPublicPricingItem[] {
  return buildSeedRows().map((r, i) => ({
    id: i + 1,
    scenario: r.scenario,
    priceMin: r.priceMin == null ? null : r.priceMin + 10,
    priceMax: r.priceMax == null ? null : r.priceMax + 10,
    priceLabel: r.priceLabel ? `${r.priceLabel} (live)` : null,
    note: `Live: ${r.note}`,
    includes: `Includes for ${r.scenario}`,
    costFactors: `Factors for ${r.scenario}`,
    nextStep: `Next step for ${r.scenario}`,
  }));
}

/**
 * A resolve payload carrying `pricingRows`. The live API omits null fields entirely, so rows are
 * written in that sparse shape (hence the cast).
 */
function resolveDto(pricingRows: Partial<CmsPricingRow>[]): PageResolveDto {
  return {
    id: 1,
    templateType: "ServicePage",
    routeGroup: "Flat",
    slug: "test-page",
    title: "Test page",
    seoTitle: "Test page",
    seoDescription: "Test page",
    noIndex: false,
    publishedAt: null,
    updatedAt: null,
    heroImage: null,
    data: {},
    faqs: [],
    relatedLinks: {},
    pricingRows: pricingRows as CmsPricingRow[],
    reviews: [],
  };
}

const MAPPER_ROWS: Partial<CmsPricingRow>[] = [
  { scenario: "New garage door — standard (supply & install)", priceMin: 3000, priceMax: 5000 },
  { scenario: "Safety check-up / inspection", priceMin: 120, priceMax: 120 },
  { scenario: "Service / tune-up", priceMin: 140, priceLabel: "From $140 + parts" },
  { scenario: "Remote (extra / replacement)", priceLabel: "$95 each + $120 to attend & program" },
  { scenario: AFTER_HOURS, priceLabel: "+$500" },
  { scenario: "New door — commercial / custom", priceMin: 5000 },
  { scenario: "Unpriced row" },
];
const MAPPER_PRICES = [
  "$3,000–$5,000",
  "$120",
  "From $140 + parts",
  "$95 each + $120 to attend & program",
  "+$500",
  "From $5,000",
  "",
];

/* ------------------------------------------------------------------ *
 * resolvePriceRows
 * ------------------------------------------------------------------ */

test("resolvePriceRows: per-count keys resolve each baked spring variant", () => {
  const keys = ["spring-x1", "spring-x2", "spring-x3", "spring-x4"];
  const rows = resolvePriceRows(keys, []);
  assert.deepEqual(
    rows.map((r) => r.id),
    keys,
  );
  // One live catalog row exists per count, under exactly these names (× is U+00D7).
  assert.deepEqual(
    rows.map((r) => r.label),
    ["Broken spring (single)", "Broken springs (×2)", "Springs (×3)", "Springs (×4)"],
  );
  rows.forEach((row, i) => {
    const v = springVariant(i + 1);
    assert.equal(row.price, formatRange(v.min, v.max));
    assert.equal(row.min, v.min);
    assert.equal(row.max, v.max);
    assert.equal(row.note, v.note);
    assert.equal(row.source, "baked");
  });
});

test("resolvePriceRows: a live 'Broken springs (×2)' row overrides spring-x2 and only spring-x2", () => {
  const liveName = "Broken springs (×2)"; // the real × (U+00D7), exactly as the live CMS row is named
  const catalog: CmsPublicPricingItem[] = [
    {
      id: 6,
      scenario: liveName,
      priceMin: 460,
      priceMax: 580,
      note: "Live pair note",
      includes: "Live includes",
      costFactors: "Live factors",
      nextStep: "Live next step",
    },
  ];
  const [single, pair] = resolvePriceRows(["spring-x1", "spring-x2"], catalog);
  assert.equal(pair.id, "spring-x2");
  assert.equal(pair.label, liveName);
  assert.equal(pair.price, "$460–$580");
  assert.equal(pair.min, 460);
  assert.equal(pair.max, 580);
  assert.equal(pair.source, "catalog");
  assert.equal(pair.note, "Live pair note");
  assert.equal(pair.includes, "Live includes");
  assert.equal(pair.costFactors, "Live factors");
  assert.equal(pair.nextStep, "Live next step");
  // The single-spring key has no live row in this catalog, so it stays baked.
  assert.equal(single.source, "baked");
  assert.equal(single.price, formatRange(springVariant(1).min, springVariant(1).max));
});

test("resolvePriceRows: every per-count key and after-hours find their seeded catalog row", () => {
  const catalog = liveCatalog();
  for (const n of [1, 2, 3, 4]) {
    const v = springVariant(n);
    const [row] = resolvePriceRows([`spring-x${n}`], catalog);
    assert.equal(row.source, "catalog", `spring-x${n}`);
    assert.equal(row.price, formatRange(v.min + 10, v.max + 10));
    assert.equal(row.includes, `Includes for ${v.scenario}`);
  }
  const [afterHours] = resolvePriceRows(["after-hours"], catalog);
  assert.equal(afterHours.source, "catalog");
  assert.equal(afterHours.price, `${seedRow(AFTER_HOURS).priceLabel} (live)`);
});

test("resolvePriceRows: a live row with omitted fields keeps the baked note and copies no blank extras", () => {
  // GET /api/pricing-items drops null fields entirely; model that sparse shape.
  const catalog = [
    { id: 9, scenario: "Spring re-fit / re-tension", priceMin: 300, priceMax: 350, includes: "  " },
  ] as CmsPublicPricingItem[];
  const [row] = resolvePriceRows(["spring-refit"], catalog);
  assert.equal(row.price, "$300–$350");
  assert.equal(row.source, "catalog");
  assert.equal(row.note, PRICING_BY_ID.get("spring-refit")!.publicNote);
  assert.equal("includes" in row, false);
  assert.equal("costFactors" in row, false);
  assert.equal("nextStep" in row, false);
});

test("resolvePriceRows: a scenario id gives buildPricingRows' row, plus the live extras", () => {
  for (const catalog of [[], liveCatalog()]) {
    for (const { id } of PRICING_SCENARIOS) {
      const [row] = resolvePriceRows([id], catalog);
      const { includes, costFactors, nextStep, ...base } = row;
      assert.deepEqual(base, buildPricingRows([id], catalog)[0], id);
      if (row.source === "catalog") {
        assert.equal(includes, `Includes for ${row.label}`, id);
        assert.equal(costFactors, `Factors for ${row.label}`, id);
        assert.equal(nextStep, `Next step for ${row.label}`, id);
      } else {
        assert.equal(includes, undefined, id);
        assert.equal(costFactors, undefined, id);
        assert.equal(nextStep, undefined, id);
      }
    }
  }
});

test("resolvePriceRows: after-hours resolves the baked '+$500' surcharge", () => {
  const [row] = resolvePriceRows(["after-hours"], []);
  assert.equal(row.id, "after-hours");
  assert.equal(row.label, AFTER_HOURS);
  assert.equal(row.price, "+$500");
  assert.equal(row.note, seedRow(AFTER_HOURS).note);
  assert.equal(row.source, "baked");
  // A surcharge is a label, never a fabricated range.
  assert.equal(row.min, undefined);
  assert.equal(row.max, undefined);
});

test("resolvePriceRows: a live after-hours row overrides the baked surcharge", () => {
  const catalog: CmsPublicPricingItem[] = [
    {
      id: 30,
      scenario: AFTER_HOURS,
      priceMin: null,
      priceMax: null,
      priceLabel: "+$550",
      note: "Live after-hours note",
      includes: "Priority after-hours response on top of the repair price",
      costFactors: "Time of day, urgency",
      nextStep: "Call now — 24/7",
    },
  ];
  const [row] = resolvePriceRows(["after-hours"], catalog);
  assert.equal(row.id, "after-hours");
  assert.equal(row.price, "+$550");
  assert.equal(row.source, "catalog");
  assert.equal(row.note, "Live after-hours note");
  assert.equal(row.includes, "Priority after-hours response on top of the repair price");
  assert.equal(row.costFactors, "Time of day, urgency");
  assert.equal(row.nextStep, "Call now — 24/7");
});

test("resolvePriceRows: unknown keys throw", () => {
  assert.throws(() => resolvePriceRows(["spring-x9"]), /Unknown pricing key "spring-x9"/);
  assert.throws(() => resolvePriceRows(["spring-x0"]), /Unknown pricing key "spring-x0"/);
  assert.throws(() => resolvePriceRows(["nope"]), /Unknown pricing key "nope"/);
  // A per-count key on a scenario without count variants, and on an unknown scenario.
  assert.throws(() => resolvePriceRows(["cable-x2"]), /Unknown pricing key "cable-x2"/);
  assert.throws(() => resolvePriceRows(["nope-x2"]), /Unknown pricing key "nope-x2"/);
});

test("resolvePriceRows reads the data at call time and throws when a row has neither a range nor a label", () => {
  // Mutating the shared entries is the only way to reach this branch (every shipped row is priced),
  // and it proves nothing was snapshotted at import time.
  const surcharge = seedRow(AFTER_HOURS);
  const originalLabel = surcharge.priceLabel;
  surcharge.priceLabel = null;
  try {
    assert.throws(() => resolvePriceRows(["after-hours"], []), /neither a min–max range nor a priceLabel/);
  } finally {
    surcharge.priceLabel = originalLabel;
  }

  const variant = springVariant(2) as { min: number | null };
  const originalMin = variant.min;
  variant.min = null;
  try {
    assert.throws(() => resolvePriceRows(["spring-x2"], []), /neither a min–max range nor a priceLabel/);
  } finally {
    variant.min = originalMin;
  }

  const service = PRICING_BY_ID.get("service")!;
  const originalServiceLabel = service.priceLabel;
  delete (service as { priceLabel?: string }).priceLabel;
  try {
    assert.throws(() => resolvePriceRows(["service"], []), /neither a min–max range nor a priceLabel/);
  } finally {
    (service as { priceLabel?: string }).priceLabel = originalServiceLabel;
  }
});

test("renderPriceTokens resolves per-count and after-hours tokens from resolvePriceRows", () => {
  const rows = resolvePriceRows(["spring-x2", "after-hours"], []);
  assert.equal(
    renderPriceTokens("A matched pair is {{price:spring-x2}}; after hours add {{price:after-hours}}.", rows),
    `A matched pair is ${rows[0].price}; after hours add ${rows[1].price}.`,
  );
  assert.throws(() => renderPriceTokens("{{price:spring-x1}}", rows), /not in this page's pricingPins/);
});

/* ------------------------------------------------------------------ *
 * Formatting + policy note
 * ------------------------------------------------------------------ */

test("formatAud groups thousands the en-AU way", () => {
  assert.equal(formatAud(1000), "$1,000");
  assert.equal(formatAud(120), "$120");
  assert.equal(formatAud(15000), "$15,000");
});

test("formatCatalogPrice: label, else range, else 'From' min, else empty", () => {
  assert.equal(formatCatalogPrice({ priceMin: 3000, priceMax: 5000 }), "$3,000–$5,000");
  assert.equal(formatCatalogPrice({ priceMin: 120, priceMax: 120 }), "$120");
  assert.equal(formatCatalogPrice({ priceMin: 140, priceMax: null }), "From $140");
  assert.equal(formatCatalogPrice({ priceMin: 140 }), "From $140");
  // A label always wins, even over numbers.
  assert.equal(
    formatCatalogPrice({ priceMin: 140, priceMax: null, priceLabel: "From $140 + parts" }),
    "From $140 + parts",
  );
  assert.equal(formatCatalogPrice({ priceLabel: "+$500" }), "+$500");
  // A blank label is no label.
  assert.equal(formatCatalogPrice({ priceMin: 280, priceMax: 380, priceLabel: "  " }), "$280–$380");
  assert.equal(formatCatalogPrice({ priceMin: null, priceMax: null, priceLabel: null }), "");
  assert.equal(formatCatalogPrice({}), "");
});

test("priceListPolicyNote falls back to the baked policy and prefers the live note", () => {
  const baked = seedRow(POLICY).note;
  assert.ok(baked);
  assert.equal(priceListPolicyNote([]), baked);
  assert.equal(
    priceListPolicyNote([
      { id: 31, scenario: POLICY, priceMin: null, priceMax: null, priceLabel: "Indicative", note: "Live policy note" },
    ]),
    "Live policy note",
  );
  // A live policy row with no note, or a catalog without the policy row, keeps the baked note.
  assert.equal(
    priceListPolicyNote([{ id: 31, scenario: POLICY, priceMin: null, priceMax: null, note: "" }]),
    baked,
  );
  assert.equal(
    priceListPolicyNote([
      { id: 30, scenario: AFTER_HOURS, priceMin: null, priceMax: null, priceLabel: "+$500", note: "Surcharge note" },
    ]),
    baked,
  );
});

/* ------------------------------------------------------------------ *
 * lib/pricing/guide-links.ts
 * ------------------------------------------------------------------ */

test("guide links: the hub and five guides carry the agreed labels and URLs", () => {
  assert.deepEqual(PRICE_LIST_LINK, { label: "Full Perth garage door price list", href: "/cost-guides" });
  assert.deepEqual(COST_GUIDE_LINKS, {
    installation: { label: "Garage door installation cost", href: "/garage-door-installation-cost-perth" },
    repair: { label: "Garage door repair cost guide", href: "/garage-door-repair-cost-perth" },
    springs: { label: "Spring & cable replacement cost", href: "/garage-door-spring-replacement-cost-perth" },
    motor: { label: "Motor replacement cost", href: "/garage-door-motor-replacement-cost-perth" },
    service: { label: "Service & maintenance cost", href: "/garage-door-service-cost-perth" },
  });
  // Key order is the display order siblingGuideLinks uses.
  assert.deepEqual(Object.keys(COST_GUIDE_LINKS), ["installation", "repair", "springs", "motor", "service"]);
});

test("priceLinksFor: a mapped page returns [its guide, the hub]", () => {
  assert.deepEqual(priceLinksFor("garage-door-spring-repair-perth"), [COST_GUIDE_LINKS.springs, PRICE_LIST_LINK]);
  assert.deepEqual(priceLinksFor("garage-door-installation-perth"), [
    COST_GUIDE_LINKS.installation,
    PRICE_LIST_LINK,
  ]);
  // A leading slash (an href rather than a slug) resolves the same way.
  assert.deepEqual(priceLinksFor("/garage-door-repairs-perth"), [COST_GUIDE_LINKS.repair, PRICE_LIST_LINK]);
});

test("priceLinksFor: a problem key maps", () => {
  assert.deepEqual(priceLinksFor("problems/garage-door-spring-or-cable-broken"), [
    COST_GUIDE_LINKS.springs,
    PRICE_LIST_LINK,
  ]);
  assert.deepEqual(priceLinksFor("problems/noisy-garage-door"), [COST_GUIDE_LINKS.service, PRICE_LIST_LINK]);
});

test("priceLinksFor: an unknown key returns just the hub", () => {
  assert.deepEqual(priceLinksFor("garage-door-repairs-baldivis"), [PRICE_LIST_LINK]);
  assert.deepEqual(priceLinksFor(""), [PRICE_LIST_LINK]);
  // The problem prefix matters: a bare problem slug is not a service page.
  assert.deepEqual(priceLinksFor("noisy-garage-door"), [PRICE_LIST_LINK]);
  // Object.prototype members are not page keys.
  assert.deepEqual(priceLinksFor("constructor"), [PRICE_LIST_LINK]);
});

test("priceLinksFor follows the full page → guide table", () => {
  const table: Record<string, keyof typeof COST_GUIDE_LINKS> = {
    "garage-door-repairs-perth": "repair",
    "emergency-garage-door-repairs-perth": "repair",
    "roller-door-repairs-perth": "repair",
    "garage-door-panel-replacement-perth": "repair",
    "garage-door-spring-repair-perth": "springs",
    "garage-door-opener-repair-perth": "motor",
    "garage-door-remote-replacement-perth": "motor",
    "garage-door-maintenance-perth": "service",
    "garage-door-installation-perth": "installation",
    "roller-door-installation-perth": "installation",
    "garage-doors-perth": "installation",
    "roller-doors-perth": "installation",
    "sectional-garage-doors-perth": "installation",
    "tilt-garage-doors-perth": "installation",
    "custom-garage-doors-perth": "installation",
    "commercial-garage-doors-perth": "installation",
    "commercial-roller-doors-perth": "installation",
    "industrial-roller-doors-perth": "installation",
    "problems/garage-door-wont-open": "repair",
    "problems/garage-door-wont-close": "repair",
    "problems/garage-door-stuck-halfway": "repair",
    "problems/garage-door-off-track": "repair",
    "problems/garage-door-remote-not-working": "motor",
    "problems/garage-door-motor-not-responding": "motor",
    "problems/garage-door-spring-or-cable-broken": "springs",
    "problems/noisy-garage-door": "service",
  };
  for (const [page, guide] of Object.entries(table)) {
    assert.deepEqual(priceLinksFor(page), [COST_GUIDE_LINKS[guide], PRICE_LIST_LINK], page);
  }
});

test("siblingGuideLinks: the hub first, then every other guide, never itself", () => {
  assert.deepEqual(siblingGuideLinks("garage-door-repair-cost-perth"), [
    PRICE_LIST_LINK,
    COST_GUIDE_LINKS.installation,
    COST_GUIDE_LINKS.springs,
    COST_GUIDE_LINKS.motor,
    COST_GUIDE_LINKS.service,
  ]);
  for (const guide of Object.values(COST_GUIDE_LINKS)) {
    const links = siblingGuideLinks(guide.href.slice(1));
    assert.equal(links.length, 5, guide.href);
    assert.equal(links[0], PRICE_LIST_LINK);
    assert.ok(!links.some((l) => l.href === guide.href), `${guide.href} lists itself`);
  }
  // A guide outside the five (a future CMS guide) gets the hub plus all five.
  assert.deepEqual(siblingGuideLinks("garage-door-roller-cost-perth"), [
    PRICE_LIST_LINK,
    ...Object.values(COST_GUIDE_LINKS),
  ]);
});

test("guide-links.ts has no imports (the admin editor loads it in the browser)", () => {
  const src = readFileSync(new URL("../../pricing/guide-links.ts", import.meta.url), "utf8");
  assert.doesNotMatch(src, /^\s*import\b/m);
  assert.doesNotMatch(src, /\bfrom\s+["']/);
  assert.doesNotMatch(src, /\brequire\s*\(/);
});

/* ------------------------------------------------------------------ *
 * CMS mappers + cost-guide JSON-LD
 * ------------------------------------------------------------------ */

test("the four CMS mappers format catalog prices with thousands separators", () => {
  const dto = resolveDto(MAPPER_ROWS);
  assert.deepEqual(
    mapServicePage(dto).costGuidance.rows?.map((r) => r.price),
    MAPPER_PRICES,
  );
  assert.deepEqual(
    mapServiceSuburbPage(dto).costGuidance.rows?.map((r) => r.price),
    MAPPER_PRICES,
  );
  assert.deepEqual(
    mapProblemPage(dto).costRows.map((r) => r.priceRange),
    MAPPER_PRICES,
  );
  // Cost guides keep "no price" as undefined (the price column only renders when a row has one).
  assert.deepEqual(
    mapCostGuidePage(dto).costTable.rows.map((r) => r.priceRange),
    MAPPER_PRICES.map((p) => p || undefined),
  );
});

test("mapCostGuidePage carries the catalog's numeric bounds on each row", () => {
  const rows = mapCostGuidePage(resolveDto(MAPPER_ROWS)).costTable.rows;
  assert.deepEqual(
    rows.map((r) => [r.priceMin, r.priceMax]),
    [
      [3000, 5000],
      [120, 120],
      [140, null],
      [null, null],
      [null, null],
      [5000, null],
      [null, null],
    ],
  );
});

type Offer = { name?: string; description?: string; priceSpecification?: Record<string, unknown> };

test("costGuideOffers prices Offers from the numeric bounds, never from per-unit or surcharge labels", () => {
  const offers = (costGuideOffers(mapCostGuidePage(resolveDto(MAPPER_ROWS))) ?? []) as Offer[];
  // The unpriced row has no Offer; every other row keeps its label as the description.
  assert.deepEqual(
    offers.map((o) => o.description),
    MAPPER_PRICES.filter(Boolean),
  );
  const spec = offers.map((o) => o.priceSpecification);
  assert.deepEqual(spec[0], { "@type": "PriceSpecification", priceCurrency: "AUD", minPrice: 3000, maxPrice: 5000 });
  // min === max is a single price.
  assert.deepEqual(spec[1], { "@type": "PriceSpecification", priceCurrency: "AUD", price: 120 });
  // Open-ended rows carry only a lower bound.
  assert.deepEqual(spec[2], { "@type": "PriceSpecification", priceCurrency: "AUD", minPrice: 140 });
  // "$95 each + $120 …" and "+$500" are not price ranges.
  assert.equal(spec[3], undefined);
  assert.equal(spec[4], undefined);
  assert.deepEqual(spec[5], { "@type": "PriceSpecification", priceCurrency: "AUD", minPrice: 5000 });
});

test("costGuideOffers falls back to parsing the label only when a row has no numbers", () => {
  const page = mapCostGuidePage(resolveDto([]));
  const labels = ["$880–$1,000", "$120", "From $180", "+$500", "$95 each + $120 to attend", "From $140 + parts"];
  const withRows = {
    ...page,
    costTable: {
      ...page.costTable,
      rows: labels.map((priceRange) => ({
        repairType: priceRange,
        includes: "",
        costFactors: "",
        nextStep: "",
        priceRange,
      })),
    },
  };
  const spec = ((costGuideOffers(withRows) ?? []) as Offer[]).map((o) => o.priceSpecification);
  assert.deepEqual(spec[0], { "@type": "PriceSpecification", priceCurrency: "AUD", minPrice: 880, maxPrice: 1000 });
  assert.deepEqual(spec[1], { "@type": "PriceSpecification", priceCurrency: "AUD", price: 120 });
  assert.deepEqual(spec[2], { "@type": "PriceSpecification", priceCurrency: "AUD", minPrice: 180 });
  assert.equal(spec[3], undefined);
  assert.equal(spec[4], undefined);
  assert.equal(spec[5], undefined);
});
