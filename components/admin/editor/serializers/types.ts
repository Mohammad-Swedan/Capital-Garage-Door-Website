import type { InitialPage } from "@/components/admin/page-form-types";
import type { RelatedLinkItem } from "@/components/admin/fields";
import type { PageResolveDto } from "@/lib/cms/client";
import type { PageMeta } from "../settings-drawer";

/**
 * Shared input/output contract for every per-type serializer (the inverse of the `map-*.ts`
 * loaders). `<PageEditor>` builds this from the live draft + Settings-drawer state and passes it to
 * `editorRegistry[type].serialize`. Each serializer casts `draft` to its own props type.
 */
export interface SerializerInput<TDraft> {
  draft: TDraft;
  initial?: InitialPage;
  /** Page meta owned by the Settings drawer (slug/title/SEO/noIndex/status). */
  meta: PageMeta;
  /** Related links managed canonically in the Settings drawer. */
  relatedLinks: RelatedLinkItem[];
  /** Hero/featured image asset id chosen this session (else fall back to initial). */
  heroImageAssetId: number | null;
}

/** The payload `savePageAction` expects (matches each field form's buildPayload). */
export interface CreatePageCommand {
  id?: number;
  templateType: string;
  routeGroup: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
  status: string;
  heroImageAssetId: number | null;
  data: Record<string, unknown>;
  faqs: { question: string; answer: string; sortOrder: number; faqItemId?: number | null }[];
  relatedLinks: {
    targetPageId: number | null;
    staticHref: string | null;
    labelOverride: string | null;
    linkGroup: string;
    sortOrder: number;
  }[];
  pricingRows: unknown[];
  reviews: unknown[];
  services: unknown[];
}

/**
 * Map the admin record's pinned pricing rows (resolved by GET /api/admin/pages/{id}) into the
 * resolve-DTO pricing-row shape the `map-*.ts` loaders consume — so cost-table templates render
 * their existing rows in the in-place editor instead of an empty table. Carries the editor-only
 * `pricingItemId`/`internalNote` for the inline cost-row editor + serializer round-trip. Shared by
 * every cost-table `buildDraft` (defined here, not in registry.ts, to avoid an import cycle).
 */
export function pricingRowsToDto(rows: InitialPage["pricingRows"]): PageResolveDto["pricingRows"] {
  return (rows ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r) => ({
      scenario: r.scenario ?? "",
      priceMin: r.priceMin ?? null,
      priceMax: r.priceMax ?? null,
      priceLabel: r.priceLabel ?? null,
      note: r.effectiveNote ?? r.noteOverride ?? null,
      includes: r.includes ?? null,
      costFactors: r.costFactors ?? null,
      nextStep: r.nextStep ?? null,
      pricingItemId: r.pricingItemId,
      internalNote: r.internalNote ?? null,
    }));
}

/** A draft cost row managed by the inline editor (catalog-backed: must carry `pricingItemId`). */
export interface DraftCostRow {
  pricingItemId?: number | null;
  note?: string;
}

/**
 * Inverse of {@link pricingRowsToDto}: turn the inline editor's draft cost rows back into the
 * pricing-row PIN payload the backend expects (`{ pricingItemId, sortOrder, noteOverride }`). Rows
 * without a `pricingItemId` (not catalog-backed) are dropped — every cost row pins a PricingItem.
 */
export function pricingPinsFromDraftRows(rows: DraftCostRow[] | undefined) {
  return (rows ?? [])
    .filter((r): r is DraftCostRow & { pricingItemId: number } =>
      typeof r.pricingItemId === "number" && r.pricingItemId > 0)
    .map((r, i) => ({
      pricingItemId: r.pricingItemId,
      sortOrder: i,
      noteOverride: r.note && r.note.trim() ? r.note : null,
    }));
}

/** Map RelatedLinkItem[] (drawer state) → the payload's relatedLinks (shared by all serializers). */
export function serializeRelatedLinks(relatedLinks: RelatedLinkItem[]) {
  return relatedLinks.map((l, i) => {
    const hasTarget = l.targetPageId != null && l.targetPageId > 0;
    return {
      targetPageId: hasTarget ? l.targetPageId : null,
      staticHref: hasTarget ? null : l.staticHref || null,
      labelOverride: l.labelOverride || null,
      linkGroup: l.linkGroup,
      sortOrder: i,
    };
  });
}
