import type { ServicePage } from "@/types/service-page";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { RelatedLinkItem } from "@/components/admin/fields";

/**
 * Inverse of `lib/cms/map-service-page.ts`: turns the in-place editor's draft
 * (ServicePage *props* shape) back into the `CreatePageCommand` payload that
 * `savePageAction` expects. This MUST produce the same payload shape as
 * `components/admin/service-page-form.tsx#buildPayload`.
 *
 * Relational pins (FAQs, related links, pricing rows, reviews, services) are
 * children the backend REPLACES WHOLESALE on update — so any pin this editor
 * doesn't manage in-place is echoed back from `initial` untouched to avoid
 * silently deleting it (plan §B.6, the single most important correctness rule).
 */

export interface ServiceSerializerInput {
  draft: ServicePage;
  initial?: InitialPage;
  /** Page meta + relational state owned by the Settings drawer. */
  meta: {
    slug: string;
    title: string;
    seoTitle: string;
    seoDescription: string;
    noIndex: boolean;
    status: string;
  };
  /** Related links managed canonically in the Settings drawer. */
  relatedLinks: RelatedLinkItem[];
  /** Hero image asset id chosen this session (else fall back to initial). */
  heroImageAssetId: number | null;
}

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

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function serializeServicePage(
  input: ServiceSerializerInput,
): CreatePageCommand {
  const { draft, initial, meta, relatedLinks, heroImageAssetId } = input;
  const hero = draft.hero ?? ({} as ServicePage["hero"]);

  return {
    ...(initial ? { id: initial.id } : {}),
    templateType: "ServicePage",
    routeGroup: "Flat",
    slug: meta.slug,
    title: meta.title,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    noIndex: meta.noIndex,
    status: meta.status,
    heroImageAssetId,
    data: {
      hero: {
        h1: str(hero.h1),
        subtitle: str(hero.subtitle),
        // Badges: keep only {icon, label} (matches §6 + buildPayload).
        badges: (hero.badges ?? []).map((b) => ({
          icon: str(b.icon),
          label: str(b.label),
        })),
        imageAlt: str(hero.imageAlt),
        floatingCardLabel: str(hero.floatingCardLabel),
      },
      directAnswer: str(draft.directAnswer),
      intro: {
        heading: str(draft.intro?.heading),
        paragraphs: (draft.intro?.paragraphs ?? []).map(str),
      },
      // problems: {label, icon} only (drop the derived `slug`/`problemPageId`).
      problems: (draft.problems ?? []).map((p) => ({
        label: str(p.label),
        icon: str(p.icon),
      })),
      includedItems: (draft.includedItems ?? []).map(str),
      processSteps: (draft.processSteps ?? []).map((s) => ({
        title: str(s.title),
        description: str(s.description),
        icon: str(s.icon),
      })),
      // map-service-page reads `data.costGuidanceIntro` → draft.costGuidance.intro.
      costGuidanceIntro: str(draft.costGuidance?.intro),
      whyChoose: (draft.whyChoose ?? []).map((w) => ({
        title: str(w.title),
        description: str(w.description),
        icon: str(w.icon),
      })),
      serviceAreas: (draft.serviceAreas ?? []).map(str),
      cta: {
        heading: str(draft.cta?.heading),
        subtitle: str(draft.cta?.subtitle),
      },
    },
    // FAQs — relational pin edited in place but serialized to the `faqs` array.
    faqs: (draft.faqs ?? []).filter((f) => str(f.question).trim() !== "").map((f, i) => ({
      question: str(f.question),
      answer: str(f.answer),
      sortOrder: i,
      // Carry library provenance through (undefined for free-text FAQs).
      faqItemId: f.faqItemId ?? null,
    })),
    // Related links — canonical management in the Settings drawer (mirrors buildPayload).
    relatedLinks: relatedLinks.map((l, i) => {
      const hasTarget = l.targetPageId != null && l.targetPageId > 0;
      return {
        targetPageId: hasTarget ? l.targetPageId : null,
        staticHref: hasTarget ? null : l.staticHref || null,
        labelOverride: l.labelOverride || null,
        linkGroup: l.linkGroup,
        sortOrder: i,
      };
    }),
    // Pins this editor does NOT manage → echo untouched so they aren't deleted.
    pricingRows: initial?.pricingRows ?? [],
    reviews: initial?.reviews ?? [],
    services: initial?.services ?? [],
  };
}
