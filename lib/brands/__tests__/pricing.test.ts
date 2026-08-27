import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPricingRows,
  renderPriceTokens,
  assertNoLiteralPrices,
  formatRange,
} from "../pricing";
import { PRICING_BY_ID } from "../../../components/sections/smart-calculator/pricing-data";
import type { CmsPublicPricingItem } from "../../cms/pricing-client";

test("formatRange renders AU ranges and single values", () => {
  assert.equal(formatRange(770, 990), "$770–$990");
  assert.equal(formatRange(1200, 1200), "$1,200");
});

test("buildPricingRows uses the baked range when the catalog is empty", () => {
  const rows = buildPricingRows(["motor-replace"], []);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, "motor-replace");
  assert.equal(rows[0].price, "$770–$990");
  assert.equal(rows[0].source, "baked");
});

test("buildPricingRows lets an exact-name catalog row override the baked range", () => {
  const catalog: CmsPublicPricingItem[] = [
    { id: 1, scenario: "Motor / opener replacement", priceMin: 800, priceMax: 1000, note: "Live note" },
  ];
  const rows = buildPricingRows(["motor-replace"], catalog);
  assert.equal(rows[0].price, "$800–$1,000");
  assert.equal(rows[0].source, "catalog");
  assert.equal(rows[0].note, "Live note");
});

test("buildPricingRows renders the baked label for an open-ended scenario (no upper bound)", () => {
  const rows = buildPricingRows(["service"], []);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].price, PRICING_BY_ID.get("service")!.priceLabel);
  assert.equal(rows[0].source, "baked");
  // Label-only rows carry no numbers rather than a fabricated bound.
  assert.equal(rows[0].min, undefined);
  assert.equal(rows[0].max, undefined);
});

test("buildPricingRows renders the baked label for a per-unit scenario", () => {
  const rows = buildPricingRows(["remote"], []);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].price, PRICING_BY_ID.get("remote")!.priceLabel);
  assert.equal(rows[0].min, undefined);
  assert.equal(rows[0].max, undefined);
});

test("buildPricingRows lets a live label-only catalog row override the baked label", () => {
  const catalog: CmsPublicPricingItem[] = [
    {
      id: 28,
      scenario: "Service / tune-up",
      priceMin: null,
      priceMax: null,
      priceLabel: "From $160 + parts",
      note: "Live service note",
    },
  ];
  const rows = buildPricingRows(["service"], catalog);
  assert.equal(rows[0].price, "From $160 + parts");
  assert.equal(rows[0].source, "catalog");
  assert.equal(rows[0].note, "Live service note");
});

test("buildPricingRows throws when a pinned scenario has neither a range nor a label", () => {
  const scenario = PRICING_BY_ID.get("service")!;
  const originalLabel = scenario.priceLabel;
  // Mutating the shared catalog entry is the only way to reach this branch: every shipped scenario
  // has a range or a label, which is exactly the invariant this guard protects.
  delete (scenario as { priceLabel?: string }).priceLabel;
  try {
    assert.throws(() => buildPricingRows(["service"], []), /neither a min–max range nor a priceLabel/);
  } finally {
    (scenario as { priceLabel?: string }).priceLabel = originalLabel;
  }
});

test("buildPricingRows throws on an unknown pin", () => {
  assert.throws(() => buildPricingRows(["not-a-scenario"], []), /Unknown pricing pin/);
});

test("renderPriceTokens replaces tokens and rejects unknown ones", () => {
  const rows = buildPricingRows(["motor-replace"], []);
  assert.equal(renderPriceTokens("From {{price:motor-replace}} installed", rows), "From $770–$990 installed");
  assert.throws(() => renderPriceTokens("{{price:remote}}", rows), /not in this page's pricingPins/);
});

test("renderPriceTokens lowercases a leading From only mid-sentence", () => {
  const rows = buildPricingRows(["service"], []);
  assert.equal(
    renderPriceTokens("Servicing is {{price:service}}.", rows),
    "Servicing is from $140 + parts.",
  );
  // At the start of a sentence the authored capitalisation is kept.
  assert.equal(renderPriceTokens("{{price:service}}.", rows), "From $140 + parts.");
  assert.equal(renderPriceTokens("A service. {{price:service}}.", rows), "A service. From $140 + parts.");
});

test("assertNoLiteralPrices catches hand-written figures", () => {
  assert.throws(() => assertNoLiteralPrices("costs $450 to fix", "test"), /Literal price/);
  assert.doesNotThrow(() => assertNoLiteralPrices("costs {{price:remote}} to fix", "test"));
});
