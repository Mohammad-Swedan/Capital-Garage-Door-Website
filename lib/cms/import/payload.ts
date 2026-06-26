/**
 * Shared contract for the one-time `content/*.ts` → CMS importer (app/admin/api/import).
 * Each per-type transform maps the local content objects into this payload (the shape the CMS
 * `POST /api/admin/pages` create command accepts) and registers any images as Assets via the
 * supplied `RegisterAsset` callback.
 *
 * v1 importer scope: migrates the bespoke `data`, FAQs, internal links (as StaticHref — no FK
 * resolution needed), and the hero image. Relational PINS (pricingRows / reviews / services) are
 * left empty and can be re-added in the admin or by a later catalog importer.
 */
export interface CreatePagePayload {
  templateType: string;
  routeGroup: "Flat" | "CaseStudies" | "Blog" | "Problems" | "Lp";
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
  status: "Published" | "Draft";
  heroImageAssetId: number | null;
  data: Record<string, unknown>;
  faqs: { question: string; answer: string; sortOrder: number }[];
  relatedLinks: {
    targetPageId: number | null;
    staticHref: string | null;
    labelOverride: string | null;
    linkGroup: string;
    sortOrder: number;
  }[];
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[];
  reviews: { reviewId: number; sortOrder: number }[];
  services: { serviceId: number; sortOrder: number }[];
}

/** Registers an image URL as an Asset and returns its id (deduped by URL by the orchestrator). */
export type RegisterAsset = (cdnUrl: string, altText: string) => Promise<number>;

/** Convenience for a related link pointing at an existing route by its href (escape-hatch form). */
export function staticLink(href: string, label: string, linkGroup: string, sortOrder: number) {
  return { targetPageId: null, staticHref: href, labelOverride: label, linkGroup, sortOrder };
}
