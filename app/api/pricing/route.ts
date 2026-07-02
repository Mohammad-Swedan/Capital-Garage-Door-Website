import { NextResponse } from "next/server";
import { cmsPublicPricing, type CmsPublicPricingItem } from "@/lib/cms/pricing-client";

/**
 * Same-origin proxy for the public CMS pricing catalog. The browser-side Smart Price Calculator
 * fetches this (it can't read the server-only CMS_API_URL or reach the CMS across origins), and we
 * bound/sanitise the payload before handing it to the client. Public data — no secret/auth needed.
 *
 * Graceful by design: cmsPublicPricing() returns [] when the CMS is down, so this always responds
 * 200 with an items array and the calculator simply falls back to its built-in default pricing.
 * Mirrors the shape of app/api/chat/route.ts (minus the auth + forwarding).
 */

const MAX_ITEMS = 300;

/** Coerce a value to a finite, non-negative number or null (prices only). */
function toPrice(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function toText(value: unknown, max = 400): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim().slice(0, max) : null;
}

/** Keep only the fields the calculator uses, normalised; drop rows without a scenario. */
function sanitize(raw: CmsPublicPricingItem): CmsPublicPricingItem | null {
  const scenario = toText(raw?.scenario, 200);
  if (!scenario) return null;
  return {
    id: typeof raw.id === "number" ? raw.id : 0,
    scenario,
    priceMin: toPrice(raw.priceMin),
    priceMax: toPrice(raw.priceMax),
    priceLabel: toText(raw.priceLabel, 120),
    note: toText(raw.note),
    category: toText(raw.category, 120),
    includes: toText(raw.includes),
    costFactors: toText(raw.costFactors),
    nextStep: toText(raw.nextStep),
  };
}

export async function GET() {
  const raw = await cmsPublicPricing();
  const items = raw
    .slice(0, MAX_ITEMS)
    .map(sanitize)
    .filter((x): x is CmsPublicPricingItem => x !== null);

  // Let the browser/CDN cache briefly; the upstream CMS fetch is itself revalidated hourly.
  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
