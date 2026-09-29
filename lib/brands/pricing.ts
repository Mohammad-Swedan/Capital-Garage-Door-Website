import {
  PRICING_BY_ID,
  SPECIAL_SEED_ROWS,
  type CmsSeedRow,
} from "@/components/sections/smart-calculator/pricing-data";
import type { CmsPublicPricingItem } from "@/lib/cms/pricing-client";
import type { CostGuidanceRow } from "@/types";

export interface ResolvedPriceRow extends CostGuidanceRow {
  /**
   * pricing-data.ts scenario id — or, for `resolvePriceRows`, the exact key it was asked for
   * ("spring-x2", "after-hours"), which is what `{{price:<key>}}` tokens look up.
   */
  id: string;
  /**
   * Only set when the row resolved to a real min–max range. Open-ended ("From $140 + parts") and
   * per-unit ("$95 each + $120 to attend & program") scenarios render their authored label instead,
   * and carry no numbers rather than a fabricated bound.
   */
  min?: number;
  max?: number;
  source: "catalog" | "baked";
  /** Live catalog columns, copied by `resolvePriceRows` when the matched live row carries them. */
  includes?: string;
  costFactors?: string;
  nextStep?: string;
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Whole-dollar AUD with en-AU thousands grouping: 3000 → "$3,000". */
export function formatAud(n: number): string {
  return `$${n.toLocaleString("en-AU")}`;
}

export function formatRange(min: number, max: number): string {
  return min === max ? formatAud(min) : `${formatAud(min)}–${formatAud(max)}`;
}

/**
 * The display price of a CMS pricing row (a pinned page row or a catalog item): its authored label
 * when it has one ("From $140 + parts", "+$500"), else the range ("$3,000–$5,000"; a single price
 * when min === max), else "From $<min>" for an open-ended row, else "".
 */
export function formatCatalogPrice(row: {
  priceMin?: number | null;
  priceMax?: number | null;
  priceLabel?: string | null;
}): string {
  if (row.priceLabel && row.priceLabel.trim()) return row.priceLabel;
  if (row.priceMin != null && row.priceMax != null) return formatRange(row.priceMin, row.priceMax);
  if (row.priceMin != null) return `From ${formatAud(row.priceMin)}`;
  return "";
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

/* ------------------------------------------------------------------ *
 * Price-list keys: every row of the live catalog, not just scenario ids
 * ------------------------------------------------------------------ */

/** SPECIAL_SEED_ROWS scenario names (pricing-data.ts) behind `after-hours` and the policy note. */
const AFTER_HOURS_SCENARIO = "After-hours / emergency call-out";
const POLICY_SCENARIO = "Estimates & quotes (how we price)";

/** `${scenarioId}-x${count}`: one count of a per-count scenario, e.g. "spring-x2". */
const PER_COUNT_KEY = /^([a-z0-9-]+)-x([1-9]\d*)$/;

/** The baked side of a key. `name` is the row label and the exact name a live row must carry. */
interface BakedPrice {
  name: string;
  min: number | null;
  max: number | null;
  label?: string | null;
  note?: string;
}

function specialSeedRow(scenario: string): CmsSeedRow {
  const row = SPECIAL_SEED_ROWS.find((r) => r.scenario === scenario);
  if (!row) throw new Error(`pricing-data.ts SPECIAL_SEED_ROWS has no "${scenario}" row`);
  return row;
}

/** Read at call time, never snapshotted: a test mutates the shared pricing-data entries in place. */
function bakedPrice(key: string): BakedPrice {
  const scenario = PRICING_BY_ID.get(key);
  if (scenario) {
    return {
      name: scenario.scenario,
      min: scenario.priceMin,
      max: scenario.priceMax,
      label: scenario.priceLabel,
      note: scenario.publicNote,
    };
  }
  if (key === "after-hours") {
    const row = specialSeedRow(AFTER_HOURS_SCENARIO);
    return { name: row.scenario, min: row.priceMin, max: row.priceMax, label: row.priceLabel, note: row.note ?? undefined };
  }
  const perCount = PER_COUNT_KEY.exec(key);
  if (perCount) {
    const [, id, count] = perCount;
    const parent = PRICING_BY_ID.get(id);
    if (!parent) throw new Error(`Unknown pricing key "${key}" — "${id}" is not a pricing-data.ts scenario id`);
    const variants = parent.countVariants;
    if (!variants) throw new Error(`Unknown pricing key "${key}" — scenario "${id}" has no per-count variants`);
    const variant = variants[Number(count)];
    if (!variant) {
      throw new Error(
        `Unknown pricing key "${key}" — scenario "${id}" has no ×${count} variant (it has ${Object.keys(variants).join(", ")})`,
      );
    }
    return { name: variant.scenario, min: variant.min, max: variant.max, note: variant.note };
  }
  throw new Error(
    `Unknown pricing key "${key}" — expected a pricing-data.ts scenario id, a per-count key "<id>-x<count>" or "after-hours"`,
  );
}

/** The live row for a baked name, by `buildPricingRows`' rule: exact name, and a range or a label. */
function findLiveRow(name: string, catalog: CmsPublicPricingItem[]): CmsPublicPricingItem | undefined {
  const target = normalize(name);
  return catalog.find(
    (r) =>
      normalize(r.scenario ?? "") === target &&
      ((r.priceMin != null && r.priceMax != null) || Boolean(r.priceLabel)),
  );
}

type LiveExtras = Pick<ResolvedPriceRow, "includes" | "costFactors" | "nextStep">;

/** The live row's non-blank includes / cost factors / next step (keys left out when blank). */
function liveExtras(live: CmsPublicPricingItem | undefined): LiveExtras {
  const extras: LiveExtras = {};
  if (live?.includes?.trim()) extras.includes = live.includes;
  if (live?.costFactors?.trim()) extras.costFactors = live.costFactors;
  if (live?.nextStep?.trim()) extras.nextStep = live.nextStep;
  return extras;
}

/**
 * Price-list keys → guide-price rows, covering the whole catalog. A key is one of:
 *   - a pricing-data.ts scenario id ("cable"): the same row `buildPricingRows([id], catalog)` gives;
 *   - a per-count key `${id}-x${n}` ("spring-x2"): the scenario's `countVariants[n]`. The CMS stores
 *     each count as its own row ("Broken springs (×2)"), which the parent "Broken spring(s)" never
 *     matches, so this is the only way a spring row picks up its live price;
 *   - "after-hours": the after-hours surcharge from SPECIAL_SEED_ROWS ("+$500").
 * `buildPricingRows`' rules apply to all three: a live row with the exact (normalised) name
 * overrides the baked price, a key that resolves to neither a range nor a label throws, and so does
 * an unknown key. Each row's `id` is its key, so `renderPriceTokens` resolves `{{price:spring-x2}}`.
 * The live row's `includes` / `costFactors` / `nextStep` are copied onto the row when present.
 */
export function resolvePriceRows(keys: string[], catalog: CmsPublicPricingItem[] = []): ResolvedPriceRow[] {
  return keys.map((key): ResolvedPriceRow => {
    const baked = bakedPrice(key);
    const live = findLiveRow(baked.name, catalog);
    const min = live ? live.priceMin : baked.min;
    const max = live ? live.priceMax : baked.max;
    const label = (live ? live.priceLabel : baked.label) || undefined;
    const hasRange = min != null && max != null;
    if (!hasRange && !label) {
      throw new Error(
        `Pricing key "${key}" resolved to neither a min–max range nor a priceLabel — it cannot be shown as a guide price`,
      );
    }
    return {
      id: key,
      label: baked.name,
      price: hasRange ? formatRange(min, max) : (label as string),
      note: live?.note ?? baked.note,
      ...(hasRange ? { min, max } : {}),
      source: live ? "catalog" : "baked",
      ...liveExtras(live),
    };
  });
}

/**
 * The price list's disclaimer: the live "Estimates & quotes (how we price)" note, else the baked
 * one. That catalog row is pricing policy for the assistant, never a price row.
 */
export function priceListPolicyNote(catalog: CmsPublicPricingItem[] = []): string {
  const baked = specialSeedRow(POLICY_SCENARIO);
  const target = normalize(baked.scenario);
  const live = catalog.find((r) => normalize(r.scenario ?? "") === target && Boolean(r.note?.trim()));
  return live?.note ?? baked.note ?? "";
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
