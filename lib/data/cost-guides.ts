import { costGuidePages } from "@/content/cost-guides";
import type { CostGuidePage } from "@/types/cost-guide";
import { cmsResolve, cmsSitemapSafe } from "@/lib/cms/client";
import { mapCostGuidePage } from "@/lib/cms/map-cost-guide-page";
import { getStaticCostGuides } from "@/lib/data/static-cost-guides";
import { COST_GUIDE_LINKS } from "@/lib/pricing/guide-links";

/**
 * Data-access layer for flat cost-guide landing pages.
 *
 * When `CMS_COST_GUIDES === "on"` this reads from the ASP.NET CMS API; otherwise it falls back to
 * the local `content/cost-guides` files (the current source of truth). This flag-guarded seam is
 * how the site cuts over to the CMS one template type at a time without ever breaking the live site
 * (docs/cms-architecture.md §8). Call sites (templates, app/sitemap.ts) do not change.
 *
 * CostGuidePage shares the flat route group ("flat") with other flat types, so `getCostGuidePageBySlug`
 * must check `dto.templateType` and return `undefined` when it doesn't match, letting the shared
 * `app/[slug]/page.tsx` resolver fall through to the next registry.
 */
const CMS_ON = (process.env.CMS_COST_GUIDES ?? "on") === "on";

export async function getCostGuidePages(): Promise<CostGuidePage[]> {
  if (CMS_ON) {
    const slugs = await getCostGuidePageSlugs();
    const pages = await Promise.all(slugs.map((slug) => getCostGuidePageBySlug(slug)));
    return pages.filter((p): p is CostGuidePage => p !== undefined);
  }
  return costGuidePages;
}

export async function getCostGuidePageBySlug(slug: string): Promise<CostGuidePage | undefined> {
  if (CMS_ON) {
    const dto = await cmsResolve("flat", slug);
    if (!dto || dto.templateType !== "CostGuidePage") return undefined;
    return mapCostGuidePage(dto);
  }
  return costGuidePages.find((page) => page.slug === slug);
}

export async function getCostGuidePageSlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemapSafe();
    return feed.filter((p) => p.templateType === "CostGuidePage" && !p.noIndex).map((p) => p.slug);
  }
  return costGuidePages.map((page) => page.slug);
}

/** A cost guide as a card on the /cost-guides price-list hub. */
export interface CostGuideCard {
  href: string;
  title: string;
  description: string;
  updatedAt: string;
}

/** Hub card order: the five main guides (the COST_GUIDE_LINKS order), then any others. */
const CARD_ORDER = Object.values(COST_GUIDE_LINKS).map((link) => link.href);

/**
 * Pure merge behind `getCostGuideCards`: static guides win a slug clash with a CMS guide (the
 * static route shadows it), and cards follow CARD_ORDER, then the source order.
 */
export function mergeCostGuideCards(cmsGuides: CostGuidePage[], staticGuides: CostGuidePage[]): CostGuideCard[] {
  const bySlug = new Map<string, CostGuidePage>();
  for (const guide of cmsGuides) bySlug.set(guide.slug, guide);
  for (const guide of staticGuides) bySlug.set(guide.slug, guide);
  const rank = (href: string) => {
    const i = CARD_ORDER.indexOf(href);
    return i === -1 ? CARD_ORDER.length : i;
  };
  return [...bySlug.values()]
    .map((guide) => ({
      href: `/${guide.slug}`,
      title: guide.hero.h1,
      description: guide.hero.subtitle,
      updatedAt: guide.updatedAt,
    }))
    .map((card, index) => ({ card, index }))
    .sort((a, b) => rank(a.card.href) - rank(b.card.href) || a.index - b.index)
    .map(({ card }) => card);
}

/**
 * Every cost guide for the /cost-guides hub: the CMS guides plus the repo-only static guides
 * (lib/data/static-cost-guides.ts). `getCostGuidePages` throws when a CMS resolve fails; the hub
 * then still lists the static guides rather than failing the page.
 */
export async function getCostGuideCards(): Promise<CostGuideCard[]> {
  const [cmsGuides, staticGuides] = await Promise.all([
    getCostGuidePages().catch((error: unknown): CostGuidePage[] => {
      console.warn("[cost-guides] CMS cost guides unavailable; the hub lists the static guides only.", error);
      return [];
    }),
    getStaticCostGuides(),
  ]);
  return mergeCostGuideCards(cmsGuides, staticGuides);
}
