import { cache } from "react";
import { staticCostGuides } from "@/content/static-cost-guides";
import { cmsPublicPricing, type CmsPublicPricingItem } from "@/lib/cms/pricing-client";
import {
  assertNoLiteralPrices,
  priceListPolicyNote,
  renderPriceTokens,
  resolvePriceRows,
  type ResolvedPriceRow,
} from "@/lib/brands/pricing";
import type { CostGuidePage, CostGuideRow, StaticCostGuideSource } from "@/types/cost-guide";

/**
 * Data-access layer for the repo-only ("static") cost guides in content/static-cost-guides, each
 * served by its own static route (e.g. app/garage-door-installation-cost-perth). The copy lives in
 * the repo and deploys with the code; the prices are the live CMS catalog's, resolved at render
 * time with the baked pricing-data.ts figures as the fallback. These guides are never CMS pages
 * and never enter content/cost-guides: with CMS_COST_GUIDES=off that registry feeds
 * app/[slug]'s generateStaticParams, where a slug would collide with the static route.
 */

/** SERP-safe meta description length, counted in code points (an en dash is one character). */
export const META_DESCRIPTION_MAX = 160;

const codePoints = (s: string) => Array.from(s).length;

/** Same normalisation `resolvePriceRows` matches live catalog rows by (case and punctuation ignored). */
const normalizeScenario = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Applies `render` to every string in a JSON-shaped value, so no field can keep a raw token. */
function mapStrings<T>(value: T, render: (s: string) => string): T {
  if (typeof value === "string") return render(value) as T;
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, render)) as T;
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, render)])) as T;
  }
  return value;
}

/**
 * The guide's last-modified date (YYYY-MM-DD): `reviewedAt`, or the newest `updatedAt` among the
 * live catalog rows the guide actually shows, when that is later. A price change is a content
 * change; an edit to a row this guide doesn't pin is not.
 */
function lastUpdated(reviewedAt: string, rows: ResolvedPriceRow[], catalog: CmsPublicPricingItem[]): string {
  const shown = new Set(rows.filter((r) => r.source === "catalog").map((r) => normalizeScenario(r.label)));
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
 * Renders one static guide against a catalog snapshot (pure: pass `[]` to render offline from the
 * baked prices). Throws on any content bug, so a bad guide fails the build instead of shipping:
 * a literal price in the source, a malformed `reviewedAt`, a table row or token that isn't pinned,
 * a token the renderer can't parse, or a fallback description that is over-long or tokenised.
 */
export function renderStaticCostGuide(
  source: StaticCostGuideSource,
  catalog: CmsPublicPricingItem[] = [],
): CostGuidePage {
  const where = `content/static-cost-guides (${source.slug})`;
  assertNoLiteralPrices(JSON.stringify(source), where);
  if (!ISO_DATE.test(source.reviewedAt)) {
    throw new Error(`${where}: reviewedAt "${source.reviewedAt}" must be an ISO date (YYYY-MM-DD)`);
  }
  const { descriptionFallback } = source.seo;
  if (descriptionFallback.includes("{{") || codePoints(descriptionFallback) > META_DESCRIPTION_MAX) {
    throw new Error(`${where}: seo.descriptionFallback must be token-free and ≤${META_DESCRIPTION_MAX} characters`);
  }

  const priceRows = resolvePriceRows(source.pricingPins, catalog);
  const copy = mapStrings(source, (s) => renderPriceTokens(s, priceRows));
  if (JSON.stringify(copy).includes("{{")) {
    throw new Error(`${where}: unrendered "{{…}}" left in the copy — tokens are {{price:<lowercase-key>}}`);
  }

  const rowByKey = new Map(priceRows.map((r) => [r.id, r]));
  const rows = copy.costTable.rows.map((fallback): CostGuideRow => {
    const row = rowByKey.get(fallback.key);
    if (!row) throw new Error(`${where}: table row "${fallback.key}" is not in pricingPins`);
    return {
      repairType: fallback.label ?? row.label,
      includes: row.includes ?? fallback.includes,
      costFactors: row.costFactors ?? fallback.costFactors,
      nextStep: row.nextStep ?? fallback.nextStep,
      priceRange: row.price,
      // Numbers only for a real range, so the JSON-LD Offer never parses a label like "+$500".
      priceMin: row.min ?? null,
      priceMax: row.max ?? null,
    };
  });

  const description =
    codePoints(copy.seo.description) <= META_DESCRIPTION_MAX ? copy.seo.description : descriptionFallback;

  return {
    slug: copy.slug,
    pageType: "cost-guide",
    topicLabel: copy.topicLabel,
    hero: copy.hero,
    directAnswer: copy.directAnswer,
    costTable: {
      heading: copy.costTable.heading,
      intro: copy.costTable.intro,
      rowHeader: copy.costTable.rowHeader,
      rows,
      disclaimer: priceListPolicyNote(catalog),
    },
    factors: copy.factors,
    scenarios: copy.scenarios,
    repairVsReplace: copy.repairVsReplace,
    howToQuote: copy.howToQuote,
    relatedServices: copy.relatedServices,
    faqs: copy.faqs,
    cta: copy.cta,
    seo: { title: copy.seo.title, description },
    updatedAt: lastUpdated(source.reviewedAt, priceRows, catalog),
  };
}

/** One catalog fetch and render per request, shared by generateMetadata and the page. */
const loadStaticCostGuides = cache(async (): Promise<CostGuidePage[]> => {
  const catalog = await cmsPublicPricing();
  return staticCostGuides.map((source) => renderStaticCostGuide(source, catalog));
});

export async function getStaticCostGuides(): Promise<CostGuidePage[]> {
  return loadStaticCostGuides();
}

export async function getStaticCostGuide(slug: string): Promise<CostGuidePage | undefined> {
  const guides = await loadStaticCostGuides();
  return guides.find((guide) => guide.slug === slug);
}
