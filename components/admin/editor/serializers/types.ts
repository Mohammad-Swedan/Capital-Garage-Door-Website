import type { InitialPage } from "@/components/admin/page-form-types";
import type { RelatedLinkItem } from "@/components/admin/fields";
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
