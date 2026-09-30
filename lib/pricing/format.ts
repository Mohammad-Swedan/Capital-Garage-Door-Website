/**
 * AUD price formatting shared by the CMS mappers, the price tables, the brand pages and the admin
 * editor. `lib/brands/pricing.ts` re-exports all three, so server code may import them from either.
 *
 * This module deliberately has NO imports. The admin editor's `"use client"` primitives
 * (components/admin/editor/editable.tsx) are imported by most public templates, so everything they
 * import ships in every public page's JavaScript. Importing the formatters from lib/brands/pricing.ts
 * there pulled in components/sections/smart-calculator/pricing-data.ts, including its private
 * `internalNote` market figures, which must never reach the browser. Client code imports this file.
 */

/** Whole-dollar AUD with en-AU thousands grouping: 3000 → "$3,000". */
export function formatAud(n: number): string {
  return `$${n.toLocaleString("en-AU")}`;
}

/** "$3,000–$5,000", or a single price when min === max ("$120"). */
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
