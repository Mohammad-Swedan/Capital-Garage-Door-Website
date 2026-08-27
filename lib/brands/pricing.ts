import { PRICING_BY_ID } from "@/components/sections/smart-calculator/pricing-data";
import type { CmsPublicPricingItem } from "@/lib/cms/pricing-client";
import type { CostGuidanceRow } from "@/types";

export interface ResolvedPriceRow extends CostGuidanceRow {
  /** pricing-data.ts scenario id. */
  id: string;
  min: number;
  max: number;
  source: "catalog" | "baked";
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function formatRange(min: number, max: number): string {
  const f = (n: number) => `$${n.toLocaleString("en-AU")}`;
  return min === max ? f(min) : `${f(min)}–${f(max)}`;
}

/**
 * Pins → guide-price rows. The baked pricing-data.ts range is the fallback; a live catalog row
 * whose `scenario` equals the baked scenario name (case/punctuation-insensitive) overrides it —
 * the same exact-name rule the calculator uses, without its keyword fallback (a brand page must
 * never show a neighbouring scenario's price).
 */
export function buildPricingRows(
  pins: string[],
  catalog: CmsPublicPricingItem[] = [],
): ResolvedPriceRow[] {
  const rows: ResolvedPriceRow[] = [];
  for (const id of pins) {
    const scenario = PRICING_BY_ID.get(id);
    if (!scenario) throw new Error(`Unknown pricing pin "${id}" — must be a pricing-data.ts scenario id`);
    const target = normalize(scenario.scenario);
    const live = catalog.find(
      (r) => normalize(r.scenario ?? "") === target && r.priceMin != null && r.priceMax != null,
    );
    const min = live ? (live.priceMin as number) : scenario.priceMin;
    const max = live ? (live.priceMax as number) : scenario.priceMax;
    if (min == null || max == null) continue; // per-unit / open-ended scenarios have no range
    rows.push({
      id,
      label: scenario.scenario,
      price: formatRange(min, max),
      note: live?.note ?? scenario.publicNote,
      min,
      max,
      source: live ? "catalog" : "baked",
    });
  }
  return rows;
}

const TOKEN = /\{\{price:([a-z0-9-]+)\}\}/g;

/** Replace `{{price:<id>}}` with the resolved range. Unknown id = content bug → throw. */
export function renderPriceTokens(copy: string, rows: ResolvedPriceRow[]): string {
  return copy.replace(TOKEN, (_m, id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) throw new Error(`Price token "${id}" is not in this page's pricingPins`);
    return row.price;
  });
}

/** Content files may never carry a hand-written figure (CLAUDE.md pricing rule). */
export function assertNoLiteralPrices(copy: string, where: string): void {
  if (/\$\s?\d/.test(copy)) {
    throw new Error(`Literal price in ${where} — prices must come from {{price:id}} tokens`);
  }
}
