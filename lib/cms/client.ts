/**
 * Thin typed client for the ASP.NET CMS API. The public site only ever reads the anonymous
 * `resolve` and `sitemap` endpoints; the `/admin` editor talks to the authenticated endpoints
 * through its own server-side route handlers (see app/admin). Swapping `lib/data/*.ts` to call
 * these functions is the documented cutover seam (docs/cms-architecture.md §8).
 */

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:5179";

/** A related link flattened by the API to a label + real href. */
export interface CmsRelatedLink {
  label: string;
  href: string;
}

export interface CmsHeroImage {
  cdnUrl: string;
  altText: string;
  width: number | null;
  height: number | null;
}

export interface CmsResolvedFaq {
  question: string;
  answer: string;
  /** Provenance FK to the FAQ library (FaqItem), when this row came from the library. */
  faqItemId?: number | null;
}

export interface CmsPricingRow {
  scenario: string;
  priceMin: number | null;
  priceMax: number | null;
  priceLabel: string | null;
  note: string | null;
  includes: string | null;
  costFactors: string | null;
  nextStep: string | null;
}

export interface CmsReview {
  id: number;
  customerName: string;
  rating: number;
  text: string;
  reviewDate: string;
  service: string | null;
  suburb: string | null;
  sourcePlatform: string | null;
  isFeatured: boolean;
}

/** The shape returned by GET /api/pages/resolve (camelCase). `data` is the bespoke §6 JSON. */
export interface PageResolveDto {
  id: number;
  templateType: string;
  routeGroup: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
  heroImage: CmsHeroImage | null;
  data: Record<string, unknown>;
  faqs: CmsResolvedFaq[];
  relatedLinks: Record<string, CmsRelatedLink[]>;
  pricingRows: CmsPricingRow[];
  reviews: CmsReview[];
}

export interface PageSitemapItem {
  routeGroup: string;
  slug: string;
  templateType: string;
  href: string;
  noIndex: boolean;
  updatedAt: string | null;
}

const REVALIDATE_SECONDS = 3600;

/** Resolve one published page. Returns null on 404 (so callers can `notFound()`). */
export async function cmsResolve(routeGroup: string, slug: string): Promise<PageResolveDto | null> {
  const url = `${CMS_API_URL}/api/pages/resolve?routeGroup=${encodeURIComponent(routeGroup)}&slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [`cms-page:${routeGroup}:${slug}`] },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`CMS resolve failed (${res.status}) for ${routeGroup}/${slug}`);
  return (await res.json()) as PageResolveDto;
}

/** The slim published-only feed for sitemap + slug generation. Returns [] on failure. */
export async function cmsSitemap(): Promise<PageSitemapItem[]> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/pages/sitemap`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["cms-sitemap"] },
    });
    if (!res.ok) return [];
    return (await res.json()) as PageSitemapItem[];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ *
 * Catalog reads (Services / Gallery / Service-area regions).
 * These back the CMS-driven listing pages (lib/data/{services,gallery,
 * service-area-regions}.ts) when CMS_CATALOGS === "on". camelCase DTOs;
 * optional fields are omitted by the API (NullValueHandling.Ignore).
 * ------------------------------------------------------------------ */

/** A row from GET /api/services. `imageUrl`/`canonicalHref` are present only when linked. */
export interface CmsServiceDto {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  iconName: string;
  assetId?: number | null;
  imageUrl?: string | null;
  canonicalPageId?: number | null;
  canonicalHref?: string | null;
  sortOrder: number;
}

/** A row from GET /api/gallery. `category` is the PascalCase enum name (e.g. "BeforeAfter"). */
export interface CmsGalleryItemDto {
  id: number;
  assetId: number;
  assetCdnUrl?: string | null;
  assetAltText?: string | null;
  beforeAssetId?: number | null;
  beforeAssetCdnUrl?: string | null;
  beforeAssetAltText?: string | null;
  category: string;
  caption?: string | null;
  sortOrder: number;
}

/** A suburb within a region from GET /api/service-area-regions. */
export interface CmsSuburbDto {
  id: number;
  regionId: number;
  regionName?: string | null;
  name: string;
  slug?: string | null;
  pageId?: number | null;
  pageHref?: string | null;
  sortOrder: number;
}

/** A region (with its suburbs) from GET /api/service-area-regions. */
export interface CmsServiceAreaRegionDto {
  id: number;
  name: string;
  sortOrder: number;
  suburbs: CmsSuburbDto[];
}

/** GET /api/services — the homepage/services-grid catalog. Returns [] on failure. */
export async function cmsServices(): Promise<CmsServiceDto[]> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/services`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["cms-services"] },
    });
    if (!res.ok) return [];
    return (await res.json()) as CmsServiceDto[];
  } catch {
    return [];
  }
}

/** GET /api/gallery — the job-photo gallery. Returns [] on failure. */
export async function cmsGallery(): Promise<CmsGalleryItemDto[]> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/gallery`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["cms-gallery"] },
    });
    if (!res.ok) return [];
    return (await res.json()) as CmsGalleryItemDto[];
  } catch {
    return [];
  }
}

/** GET /api/service-area-regions — regions with their suburbs. Returns [] on failure. */
export async function cmsServiceAreaRegions(): Promise<CmsServiceAreaRegionDto[]> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/service-area-regions`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["cms-service-area-regions"] },
    });
    if (!res.ok) return [];
    return (await res.json()) as CmsServiceAreaRegionDto[];
  } catch {
    return [];
  }
}
