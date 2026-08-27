import { buildPricingRows, renderPriceTokens } from "@/lib/brands/pricing";
import { cmsPublicPricing } from "@/lib/cms/pricing-client";
import { brandPageHref, getBrandEntities, getBrandHub } from "@/lib/data/brands";
import type { FAQ } from "@/types";
import type { BrandEntity, BrandHub, BrandKind, HubTile } from "@/types/brand";

/**
 * Every scenario a hub FAQ can reference with a `{{price:id}}` token. Both hubs resolve all
 * three: the copy decides which it uses, and an unpinned token throws at render (see
 * lib/brands/pricing.ts) — which is the point, prices are never hand-written in content.
 */
const HUB_PRICE_PINS = ["new-standard", "motor-replace", "service"];

export interface BrandHubProps {
  hub: BrandHub;
  tiles: HubTile[];
  /** Hub FAQs with price tokens resolved against the live CMS catalog. */
  faqs: FAQ[];
  /** ItemList entries for the hub's JSON-LD — brands that have a real guide page. */
  items: { name: string; url: string; image?: string }[];
  /** Every entity, both kinds — DealerStrip filters this down to the hub's kind itself. */
  entities: BrandEntity[];
}

/**
 * Everything either brand hub route needs. The two routes are identical apart from the kind they
 * pass in, so the resolution lives here rather than being duplicated (and drifting) in both.
 */
export async function buildHubProps(kind: BrandKind): Promise<BrandHubProps> {
  const hub = getBrandHub(kind);
  const [entities, catalog] = await Promise.all([getBrandEntities(), cmsPublicPricing()]);

  const tiles: HubTile[] = entities
    .filter((e) => e.kinds.includes(kind))
    .map((entity) => {
      const href = brandPageHref(entity.slug, kind);
      return href ? { entity, href } : { entity };
    });

  const rows = buildPricingRows(HUB_PRICE_PINS, catalog);
  const faqs = hub.faqs.map((faq) => ({ ...faq, answer: renderPriceTokens(faq.answer, rows) }));

  const noun = kind === "motor" ? "garage door motors" : "garage doors";
  const items = tiles
    .filter((tile): tile is Required<HubTile> => Boolean(tile.href))
    .map((tile) => ({
      name: `${tile.entity.name} ${noun} Perth`,
      url: tile.href,
      ...(tile.entity.logo ? { image: tile.entity.logo } : {}),
    }));

  return { hub, tiles, faqs, items, entities };
}
