import { PRICING_BY_ID } from "@/components/sections/smart-calculator/pricing-data";
import type { CmsPublicPricingItem } from "@/lib/cms/pricing-client";
import type { CostGuidanceRow } from "@/types";

export interface ResolvedPriceRow extends CostGuidanceRow {
  /** pricing-data.ts scenario id. */
  id: string;
  /**
   * Only set when the row resolved to a real min–max range. Open-ended ("From $140 + parts") and
   * per-unit ("$95 each + $120 to attend & program") scenarios render their authored label instead,
   * and carry no numbers rather than a fabricated bound.
   */
  min?: number;
  max?: number;
  source: "catalog" | "baked";
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function formatRange(min: number, max: number): string {
  const f = (n: number) => `$${n.toLocaleString("en-AU")}`;
  return min === max ? f(min) : `${f(min)}–${f(max)}`;
}

/**
 * Pins → guide-price rows. The baked pricing-data.ts entry is the fallback; a live catalog row
 * whose `scenario` equals the baked scenario name (case/punctuation-insensitive) overrides it —
 * the same exact-name rule the calculator uses, without its keyword fallback (a brand page must
 * never show a neighbouring scenario's price).
 *
 * A scenario resolves to a range when it has BOTH bounds; otherwise it renders its authored
 * `priceLabel` — that covers open-ended scenarios ("Service / tune-up", From $140 + parts) and
 * per-unit ones ("Remote (extra / replacement)", $95 each + $120 to attend & program). A live row
 * therefore counts as a match when it carries either a full range or a label. A pin that resolves
 * to neither is a content bug and throws, like an unknown pin: a pinned scenario must always be
 * visible in the table, never silently dropped so the copy and the table disagree.
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
      (r) =>
        normalize(r.scenario ?? "") === target &&
        ((r.priceMin != null && r.priceMax != null) || Boolean(r.priceLabel)),
    );
    const min = live ? live.priceMin : scenario.priceMin;
    const max = live ? live.priceMax : scenario.priceMax;
    const label = (live ? live.priceLabel : scenario.priceLabel) || undefined;
    const hasRange = min != null && max != null;
    if (!hasRange && !label) {
      throw new Error(
        `Pricing pin "${id}" resolved to neither a min–max range nor a priceLabel — it cannot be shown as a guide price`,
      );
    }
    rows.push({
      id,
      label: scenario.scenario,
      price: hasRange ? formatRange(min, max) : (label as string),
      note: live?.note ?? scenario.publicNote,
      ...(hasRange ? { min, max } : {}),
      source: live ? "catalog" : "baked",
    });
  }
  return rows;
}

const TOKEN = /\{\{price:([a-z0-9-]+)\}\}/g;

/**
 * Replace `{{price:<id>}}` with the resolved range. Unknown id = content bug → throw.
 *
 * Open-ended prices are authored sentence-style for the table ("From $140 + parts"); every token
 * in the brand copy sits mid-sentence ("…a full service is {{price:service}}, and…"), so the
 * leading "From" is lowercased unless the token genuinely starts a sentence.
 */
export function renderPriceTokens(copy: string, rows: ResolvedPriceRow[]): string {
  return copy.replace(TOKEN, (_m: string, id: string, offset: number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) throw new Error(`Price token "${id}" is not in this page's pricingPins`);
    const startsSentence = offset === 0 || /(^|[.!?])\s+$/.test(copy.slice(0, offset));
    return startsSentence ? row.price : row.price.replace(/^From /, "from ");
  });
}

/** Content files may never carry a hand-written figure (CLAUDE.md pricing rule). */
export function assertNoLiteralPrices(copy: string, where: string): void {
  if (/\$\s?\d/.test(copy)) {
    throw new Error(`Literal price in ${where} — prices must come from {{price:id}} tokens`);
  }
}
