import type { Article } from "@/types/article";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { PageResolveDto } from "@/lib/cms/client";
import { mapArticle } from "@/lib/cms/map-article";
import { siteConfig } from "@/config/site";
import {
  type SerializerInput,
  type CreatePageCommand,
  serializeRelatedLinks,
} from "./types";

/**
 * Inverse of `lib/cms/map-article.ts`: turns the in-place editor's draft
 * (Article *props* shape) back into the `CreatePageCommand` payload that
 * `savePageAction` expects (mirrors `serialize-service.ts`).
 *
 * Relational pins the backend REPLACES WHOLESALE on update (FAQs, related
 * links, pricing rows, reviews, services) are echoed back from `initial`
 * untouched whenever this editor doesn't manage them in place, so they aren't
 * silently deleted (plan §B.6).
 *
 * v1 scope: `contentBlocks` and `expertTips` are NOT edited in place — they are
 * passed straight through from the draft so they round-trip unchanged. The
 * featured image rides along via `input.heroImageAssetId`.
 */

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function serializeArticle(
  input: SerializerInput<Article>,
): CreatePageCommand {
  const { draft, initial, meta, relatedLinks, heroImageAssetId } = input;

  return {
    ...(initial ? { id: initial.id } : {}),
    templateType: "Article",
    routeGroup: "Blog",
    slug: meta.slug,
    title: meta.title,
    seoTitle: meta.seoTitle,
    seoDescription: meta.seoDescription,
    noIndex: meta.noIndex,
    status: meta.status,
    heroImageAssetId,
    data: {
      category: str(draft.category),
      excerpt: str(draft.excerpt),
      author: str(draft.author),
      shortAnswer: str(draft.shortAnswer),
      // map-article reads these as optional overrides (null when absent).
      readingTimeOverride: draft.readingTime ? str(draft.readingTime) : null,
      tableOfContentsOverride:
        draft.tableOfContents && draft.tableOfContents.length > 0
          ? draft.tableOfContents.map((t) => ({
              id: str(t.id),
              label: str(t.label),
            }))
          : null,
      // Not edited in place (v1) — round-tripped through unchanged.
      contentBlocks: draft.contentBlocks ?? [],
      expertTips: draft.expertTips ?? [],
    },
    // FAQs — relational pin (edited in place via EditableFaqList → draft.faqs).
    // Drop blank rows (the blank seed / half-filled rows): an empty question is
    // not a FAQ, and the backend rejects FAQs with no question.
    faqs: (draft.faqs ?? [])
      .filter((f) => str(f.question).trim() !== "")
      .map((f, i) => ({
        question: str(f.question),
        answer: str(f.answer),
        sortOrder: i,
      })),
    // Related links — canonical management in the Settings drawer.
    relatedLinks: serializeRelatedLinks(relatedLinks),
    // Pins this editor does NOT manage → echo untouched so they aren't deleted.
    pricingRows: initial?.pricingRows ?? [],
    reviews: initial?.reviews ?? [],
    services: initial?.services ?? [],
  };
}

/** A sensible non-empty skeleton for a brand-new Article. */
export function seedBlankArticle(): Article {
  return {
    title: "New article",
    slug: "",
    category: "Guides",
    excerpt: "A short summary of what this article covers.",
    author: "Capital Garage Door Team",
    publishedAt: "",
    updatedAt: "",
    readingTime: undefined,
    featuredImage: siteConfig.ogImage,
    featuredImageAlt: "",
    shortAnswer: "",
    tableOfContents: undefined,
    contentBlocks: [
      { type: "heading", level: 2, text: "Overview", id: "overview" },
      { type: "paragraph", text: "" },
    ],
    expertTips: [],
    relatedServices: [],
    relatedArticles: [],
    faqs: [{ question: "", answer: "" }],
    seo: { title: "", description: "" },
  };
}

/** Build an Article props draft from the admin record via the authoritative `mapArticle`. */
export function buildArticleDraft(
  initial: InitialPage,
  heroImageUrl?: string | null,
): Article {
  const dto: PageResolveDto = {
    id: initial.id,
    templateType: "Article",
    routeGroup: "Blog",
    slug: initial.slug,
    title: initial.title,
    seoTitle: initial.seoTitle,
    seoDescription: initial.seoDescription,
    noIndex: initial.noIndex,
    publishedAt: null,
    updatedAt: null,
    heroImage: heroImageUrl
      ? { cdnUrl: heroImageUrl, altText: "", width: null, height: null }
      : null,
    data: initial.data ?? {},
    faqs: initial.faqs ?? [],
    relatedLinks: {},
    pricingRows: [],
    reviews: [],
  };
  return mapArticle(dto);
}
