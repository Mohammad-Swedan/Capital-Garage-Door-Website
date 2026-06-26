/**
 * Shared shape passed to every admin page-edit form. It carries the full record returned by
 * GET /api/admin/pages/{id} — including the relational pins (pricingRows / reviews / services) so
 * a form can pass through the children it doesn't itself manage. This is important because the
 * backend UpdatePage replaces ALL children on save: a form that omitted these would silently delete
 * them. Forms that don't edit a given pin must echo `initial?.<field> ?? []` back in their payload.
 */
export interface InitialPage {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
  status: string;
  heroImageAssetId: number | null;
  data: Record<string, any>;
  faqs: { question: string; answer: string }[];
  relatedLinks: {
    targetPageId: number | null;
    staticHref: string | null;
    labelOverride: string | null;
    linkGroup: string;
  }[];
  pricingRows?: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[];
  reviews?: { reviewId: number; sortOrder: number }[];
  services?: { serviceId: number; sortOrder: number }[];
}
