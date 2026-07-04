/**
 * Self-contained client for the public CMS pricing catalog, kept separate from lib/cms/client.ts
 * (which other work touches). The Smart Price Calculator reads this (through the same-origin
 * app/api/pricing proxy) so live admin-maintained prices can override the app's built-in defaults.
 * camelCase DTOs; mirrors the fetch/revalidate style of lib/cms/reviews-client.ts.
 *
 * Note: there is intentionally NO feature flag here — pricing is purely an *override* layer over the
 * calculator's baked defaults, so we always attempt the catalog and fall back to [] (defaults stand)
 * when the CMS is unreachable. The admin-only InternalNote is never exposed by GET /api/pricing-items.
 */

const CMS_API_URL = process.env.CMS_API_URL ?? "https://cgd.runasp.net";
const REVALIDATE_SECONDS = 3600;

/** A single row from GET /api/pricing-items (mirrors the backend PublicPricingItemDto, camelCase). */
export interface CmsPublicPricingItem {
  id: number;
  scenario: string;
  priceMin: number | null;
  priceMax: number | null;
  priceLabel?: string | null;
  note?: string | null;
  category?: string | null;
  includes?: string | null;
  costFactors?: string | null;
  nextStep?: string | null;
  /** ISO timestamp (DateTimeOffset). */
  updatedAt?: string | null;
}

/**
 * GET /api/pricing-items — the anonymous public pricing catalog. Returns [] on any failure so the
 * calculator falls back to its built-in defaults and never crashes.
 */
export async function cmsPublicPricing(): Promise<CmsPublicPricingItem[]> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/pricing-items`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["cms-pricing"] },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as CmsPublicPricingItem[]) : [];
  } catch {
    return [];
  }
}
