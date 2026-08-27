import { BRAND_ENTITIES } from "@/content/brands/entities";
import { BRAND_HUBS } from "@/content/brands/hubs";
import { brandPages } from "@/content/brands";
import { cmsPublicPricing } from "@/lib/cms/pricing-client";
import { getCaseStudies } from "@/lib/data/case-studies";
import { getServiceSuburbPageSlugs } from "@/lib/data/service-suburb-pages";
import {
  assertNoLiteralPrices,
  buildPricingRows,
  renderPriceTokens,
  type ResolvedPriceRow,
} from "@/lib/brands/pricing";
import { textMentionsBrand } from "@/lib/brands/match";
import type { CaseStudyPage } from "@/types/case-study";
import type { LocalLink } from "@/types";
import type {
  BrandEntity,
  BrandHub,
  BrandKind,
  BrandPage,
  ResolvedBrandPage,
} from "@/types/brand";

/**
 * Data-access layer for brand entities, brand pages and the two brand hubs. Local content only
 * (no CMS flag — the spec keeps brand copy in the repo); async like every other lib/data module so
 * call sites never change if that decision is revisited. Prices are the one live piece: rows come
 * from the CMS pricing catalog with the baked pricing-data.ts range as fallback.
 */

export async function getBrandEntities(): Promise<BrandEntity[]> {
  return BRAND_ENTITIES;
}

export async function getBrandEntityBySlug(slug: string): Promise<BrandEntity | undefined> {
  return BRAND_ENTITIES.find((e) => e.slug === slug);
}

export async function getBrandPages(kind?: BrandKind): Promise<BrandPage[]> {
  return kind ? brandPages.filter((p) => p.kind === kind) : brandPages;
}

export async function getBrandPageBySlug(slug: string): Promise<BrandPage | undefined> {
  return brandPages.find((p) => p.slug === slug);
}

export async function getBrandPageSlugs(): Promise<string[]> {
  return brandPages.map((p) => p.slug);
}

export function getBrandHub(kind: BrandKind): BrandHub {
  return BRAND_HUBS[kind];
}

/** Sync: "/merlin-garage-door-motors-perth" for (merlin, motor), or undefined when no page exists. */
export function brandPageHref(entitySlug: string, kind: BrandKind): string | undefined {
  const page = brandPages.find((p) => p.brand === entitySlug && p.kind === kind);
  return page ? `/${page.slug}` : undefined;
}

/** Case studies whose copy names the brand and that carry a real photo. Empty is normal. */
export async function getCaseStudiesForBrand(entity: BrandEntity): Promise<CaseStudyPage[]> {
  const all = await getCaseStudies();
  return all
    .filter((cs) => cs.images.some((img) => /^https?:\/\//.test(img.src)))
    .filter((cs) => {
      const text = [
        cs.title,
        cs.subtitle,
        cs.summary.problem,
        cs.summary.diagnosis,
        cs.summary.solution,
        cs.problem.intro,
        ...cs.problem.points,
        cs.diagnosis.intro,
        ...cs.diagnosis.points,
        cs.solution.intro,
        ...cs.solution.points,
        ...cs.partsUsed,
      ].join(" \n ");
      return textMentionsBrand(text, entity);
    })
    .slice(0, 3);
}

const TOKENISED_FIELDS = (page: BrandPage, rows: ResolvedPriceRow[]): BrandPage => {
  const r = (s: string) => renderPriceTokens(s, rows);
  return {
    ...page,
    directAnswer: r(page.directAnswer),
    intro: { ...page.intro, paragraphs: page.intro.paragraphs.map(r) },
    costIntro: r(page.costIntro),
    costFactors: page.costFactors.map(r),
    faqs: page.faqs.map((f) => ({ ...f, answer: r(f.answer) })),
    decision: page.decision
      ? { repairWhen: page.decision.repairWhen.map(r), replaceWhen: page.decision.replaceWhen.map(r) }
      : undefined,
    parts: page.parts ? { ...page.parts, paragraphs: page.parts.paragraphs.map(r) } : undefined,
  };
};

/** Everything a brand page needs at render time. Throws on content bugs (bad pin/token/entity). */
export async function resolveBrandPage(page: BrandPage): Promise<ResolvedBrandPage> {
  const entity = BRAND_ENTITIES.find((e) => e.slug === page.brand);
  if (!entity) throw new Error(`Brand page "${page.slug}" references unknown entity "${page.brand}"`);

  if (process.env.NODE_ENV !== "production") {
    assertNoLiteralPrices(JSON.stringify(page), `content/brands (${page.slug})`);
  }

  const [catalog, suburbSlugs] = await Promise.all([cmsPublicPricing(), getServiceSuburbPageSlugs()]);
  const pins = page.kind === "motor" && !page.pricingPins.includes("motor-replace")
    ? [...page.pricingPins, "motor-replace"]
    : page.pricingPins;
  const rows = buildPricingRows(pins, catalog);
  const visibleRows = rows.filter((r) => page.pricingPins.includes(r.id));

  const suburbHref = new Map(
    suburbSlugs
      .filter((s) => s.startsWith("garage-door-repairs-"))
      .map((s) => [s.replace("garage-door-repairs-", "").replace(/-/g, " "), `/${s}`] as const),
  );
  const areaLinks: LocalLink[] = page.serviceAreas.map((name) => ({
    label: name,
    href: suburbHref.get(name.toLowerCase()) ?? "/service-areas",
  }));

  const relatedBrands = page.relatedBrands
    .map((slug) => {
      const e = BRAND_ENTITIES.find((x) => x.slug === slug);
      const href = brandPageHref(slug, page.kind);
      return e && href ? { entity: e, href } : null;
    })
    .filter((x): x is { entity: BrandEntity; href: string } => x !== null);

  return {
    page,
    entity,
    hub: BRAND_HUBS[page.kind],
    rendered: TOKENISED_FIELDS(page, rows),
    pricing: { intro: renderPriceTokens(page.costIntro, rows), factors: page.costFactors.map((f) => renderPriceTokens(f, rows)), rows: visibleRows },
    relatedBrands,
    capitalMotorRange: rows.find((r) => r.id === "motor-replace")?.price,
    areaLinks,
  };
}
