import { cache } from "react";
import { PRICE_LIST } from "@/content/price-list";
import { cmsPublicPricing, type CmsPublicPricingItem } from "@/lib/cms/pricing-client";
import {
  assertNoLiteralPrices,
  priceListPolicyNote,
  renderPriceTokens,
  resolvePriceRows,
  type ResolvedPriceRow,
} from "@/lib/brands/pricing";
import type { PriceListContent, PriceListRow, ResolvedPriceList } from "@/types/price-list";

/**
 * Data-access layer for the /cost-guides price list. The copy is repo content
 * (content/price-list.ts); the prices are the live CMS catalog's, resolved at render time with the
 * baked pricing-data.ts figures as the fallback. The route and the sitemap read it through here.
 */

/** SERP-safe meta description length, counted in code points (an en dash is one character). */
export const META_DESCRIPTION_MAX = 160;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** The same token syntax `renderPriceTokens` replaces. */
const TOKEN = /\{\{price:([a-z0-9-]+)\}\}/g;

const codePoints = (s: string) => Array.from(s).length;

/** Same normalisation `resolvePriceRows` matches live catalog rows by (case and punctuation ignored). */
const normalizeScenario = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** The page's meta title (≤60 characters). */
export function priceListTitle(year: number): string {
  return `Garage Door Prices Perth | ${year} Price List & Cost Guides`;
}

/** The page's single H1. */
export function priceListH1(year: number): string {
  return `Garage Door Prices Perth — ${year} Price List`;
}

/** "2026-09-30" → "Sep 2026", without going through a Date (no time-zone drift). */
function monthYear(isoDate: string): string {
  return `${MONTHS[Number(isoDate.slice(5, 7)) - 1]} ${isoDate.slice(0, 4)}`;
}

/** Applies `render` to every string in a JSON-shaped value, so no field can keep a raw token. */
function mapStrings<T>(value: T, render: (s: string) => string): T {
  if (typeof value === "string") return render(value) as T;
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, render)) as T;
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, render)])) as T;
  }
  return value;
}

/** Every key the list needs resolved: its table rows first, then any key used only in the copy. */
export function priceListKeys(content: PriceListContent): string[] {
  const keys = content.groups.flatMap((group) => group.rows.map((row) => row.key));
  for (const match of JSON.stringify(content).matchAll(TOKEN)) keys.push(match[1]);
  return [...new Set(keys)];
}

/**
 * The newest date among `reviewedAt` and the `updatedAt` of the live catalog rows the page shows
 * (the resolved price rows and the pricing-policy note). A price change is a content change; an
 * edit to a catalog row this page doesn't show is not.
 */
function lastUpdated(reviewedAt: string, rows: ResolvedPriceRow[], catalog: CmsPublicPricingItem[]): string {
  const shown = new Set(rows.filter((r) => r.source === "catalog").map((r) => normalizeScenario(r.label)));
  shown.add(normalizeScenario("Estimates & quotes (how we price)"));
  let newest = reviewedAt;
  for (const item of catalog) {
    const day = item.updatedAt?.slice(0, 10);
    if (day && ISO_DATE.test(day) && day > newest && shown.has(normalizeScenario(item.scenario ?? ""))) {
      newest = day;
    }
  }
  return newest;
}

/**
 * Renders the price list against a catalog snapshot (pure: pass `[]` to render offline from the
 * baked prices). Throws on any content bug, so a bad edit fails the build instead of shipping: a
 * literal price in the copy, a malformed `reviewedAt`, a duplicate group id or row key, an unknown
 * price key, an unparseable token, or a fallback description that is over-long or tokenised.
 */
export function renderPriceList(
  content: PriceListContent,
  catalog: CmsPublicPricingItem[] = [],
): ResolvedPriceList {
  const where = "content/price-list.ts";
  assertNoLiteralPrices(JSON.stringify(content), where);
  if (!ISO_DATE.test(content.reviewedAt)) {
    throw new Error(`${where}: reviewedAt "${content.reviewedAt}" must be an ISO date (YYYY-MM-DD)`);
  }
  const { descriptionFallback } = content.seo;
  if (descriptionFallback.includes("{{") || codePoints(descriptionFallback) > META_DESCRIPTION_MAX) {
    throw new Error(`${where}: seo.descriptionFallback must be token-free and ≤${META_DESCRIPTION_MAX} characters`);
  }
  const groupIds = content.groups.map((group) => group.id);
  if (new Set(groupIds).size !== groupIds.length) throw new Error(`${where}: duplicate group id`);
  const rowKeys = content.groups.flatMap((group) => group.rows.map((row) => row.key));
  if (new Set(rowKeys).size !== rowKeys.length) throw new Error(`${where}: a price key appears in two rows`);

  const priceRows = resolvePriceRows(priceListKeys(content), catalog);
  const copy = mapStrings(content, (s) => renderPriceTokens(s, priceRows));
  if (JSON.stringify(copy).includes("{{")) {
    throw new Error(`${where}: unrendered "{{…}}" left in the copy — tokens are {{price:<lowercase-key>}}`);
  }

  const rowByKey = new Map(priceRows.map((row) => [row.id, row]));
  const groups = copy.groups.map((group) => ({
    ...group,
    rows: group.rows.map((def): PriceListRow => {
      // Always present: every row key went through resolvePriceRows, which throws on an unknown key.
      const row = rowByKey.get(def.key) as ResolvedPriceRow;
      return { ...row, label: def.label ?? row.label, href: def.href };
    }),
  }));

  const updated = lastUpdated(content.reviewedAt, priceRows, catalog);
  const year = Number(updated.slice(0, 4));
  const description = copy.seo.descriptionTemplate;

  return {
    year,
    lastUpdated: updated,
    title: priceListTitle(year),
    hero: {
      eyebrow: `Updated ${monthYear(updated)} · ${copy.hero.eyebrow}`,
      h1: priceListH1(year),
      subtitle: copy.hero.subtitle,
    },
    directAnswer: copy.directAnswer,
    groups,
    factors: copy.factors,
    repairVsReplace: copy.repairVsReplace,
    faqs: copy.faqs,
    policyNote: priceListPolicyNote(catalog),
    metaDescription: codePoints(description) <= META_DESCRIPTION_MAX ? description : descriptionFallback,
    source: priceRows.some((row) => row.source === "catalog") ? "catalog" : "baked",
  };
}

/** One catalog fetch and render per request, shared by generateMetadata, the page and the sitemap. */
export const getPriceList = cache(async (): Promise<ResolvedPriceList> => {
  const catalog = await cmsPublicPricing();
  return renderPriceList(PRICE_LIST, catalog);
});
