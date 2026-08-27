import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPricingRows,
  renderPriceTokens,
  assertNoLiteralPrices,
  formatRange,
} from "../pricing";
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

test("buildPricingRows throws on an unknown pin", () => {
  assert.throws(() => buildPricingRows(["not-a-scenario"], []), /Unknown pricing pin/);
});

test("renderPriceTokens replaces tokens and rejects unknown ones", () => {
  const rows = buildPricingRows(["motor-replace"], []);
  assert.equal(renderPriceTokens("From {{price:motor-replace}} installed", rows), "From $770–$990 installed");
  assert.throws(() => renderPriceTokens("{{price:remote}}", rows), /not in this page's pricingPins/);
});

test("assertNoLiteralPrices catches hand-written figures", () => {
  assert.throws(() => assertNoLiteralPrices("costs $450 to fix", "test"), /Literal price/);
  assert.doesNotThrow(() => assertNoLiteralPrices("costs {{price:remote}} to fix", "test"));
});
