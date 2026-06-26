/**
 * One-time transform: `content/articles/*` → CMS `CreatePagePayload[]`.
 *
 * Inverse of `lib/cms/map-article.ts`: rebuilds the §6 bespoke `data` blob (camelCase, minus
 * relational fields), registers the featured/hero image plus any embedded image content blocks as
 * Assets, and maps FAQs + related services/articles to the create-command shape. Non-image content
 * blocks pass through unchanged.
 */
import { articles } from "@/content/articles";
import type { ContentBlock } from "@/types/article";
import type { CreatePagePayload, RegisterAsset } from "@/lib/cms/import/payload";
import { staticLink } from "@/lib/cms/import/payload";

/** §6 image block once the CDN src has been swapped for a registered Asset id. */
type StoredImageBlock = { type: "image"; assetId: number; caption?: string };

export async function toArticlePayloads(
  registerAsset: RegisterAsset,
): Promise<CreatePagePayload[]> {
  const payloads: CreatePagePayload[] = [];

  for (const article of articles) {
    // Featured image → hero asset.
    let heroImageAssetId: number | null = null;
    if (article.featuredImage) {
      heroImageAssetId = await registerAsset(
        article.featuredImage,
        article.featuredImageAlt ?? article.title ?? "",
      );
    }

    // Rebuild content blocks, swapping image blocks for registered-asset references.
    const contentBlocks: (ContentBlock | StoredImageBlock)[] = [];
    for (const block of article.contentBlocks ?? []) {
      if (block.type === "image") {
        const caption = block.caption;
        const assetId = await registerAsset(block.src, caption ?? block.alt ?? "");
        contentBlocks.push({ type: "image", assetId, caption });
      } else {
        contentBlocks.push(block);
      }
    }

    const data = {
      category: article.category,
      excerpt: article.excerpt,
      author: article.author,
      shortAnswer: article.shortAnswer,
      readingTimeOverride: article.readingTime,
      tableOfContentsOverride: (article.tableOfContents ?? []).map((t) => ({
        id: t.id,
        label: t.label,
      })),
      contentBlocks,
      expertTips: (article.expertTips ?? []).map((t) => ({
        kind: t.kind,
        title: t.title,
        body: t.body,
      })),
    };

    const relatedServiceLinks = (article.relatedServices ?? []).map((l, i) =>
      staticLink(l.href, l.label, "RelatedServices", i),
    );
    const relatedArticleLinks = (article.relatedArticles ?? []).map((a, i) =>
      staticLink(
        (a as { href?: string }).href ?? `/blog/${a.slug}`,
        a.title,
        "RelatedArticles",
        i,
      ),
    );

    payloads.push({
      templateType: "Article",
      routeGroup: "Blog",
      slug: article.slug,
      title: article.title,
      seoTitle: article.seo?.title ?? "",
      seoDescription: article.seo?.description ?? "",
      noIndex: false,
      status: "Published",
      heroImageAssetId,
      data,
      faqs: (article.faqs ?? []).map((f, i) => ({
        question: f.question,
        answer: f.answer,
        sortOrder: i,
      })),
      relatedLinks: [...relatedServiceLinks, ...relatedArticleLinks],
      pricingRows: [],
      reviews: [],
      services: [],
    });
  }

  return payloads;
}
