import { articles } from "@/content/articles";
import type { Article, ContentBlock, TocItem } from "@/types/article";
import { cmsResolve, cmsSitemap } from "@/lib/cms/client";
import { mapArticle } from "@/lib/cms/map-article";

const WORDS_PER_MINUTE = 200;

/**
 * Data-access layer for blog/guide articles.
 *
 * When `CMS_ARTICLES === "on"` this reads from the ASP.NET CMS API (route key "blog"); otherwise it
 * falls back to the local `content/articles` files (the current source of truth). This flag-guarded
 * seam is how the site cuts over to the CMS one template type at a time without ever breaking the
 * live site (docs/cms-architecture.md §8). Call sites (templates, app/sitemap.ts) do not change.
 */
const CMS_ON = process.env.CMS_ARTICLES === "on";

function blockWordCount(block: ContentBlock): number {
  switch (block.type) {
    case "heading":
      return block.text.split(/\s+/).filter(Boolean).length;
    case "paragraph":
      return block.text.split(/\s+/).filter(Boolean).length;
    case "list":
    case "checklist":
      return block.items.join(" ").split(/\s+/).filter(Boolean).length;
    case "callout":
      return block.body.split(/\s+/).filter(Boolean).length;
    case "quote":
      return block.text.split(/\s+/).filter(Boolean).length;
    case "image":
      return 0;
  }
}

/** Estimates reading time from the article's content blocks (~200 wpm). */
export function getReadingTime(blocks: ContentBlock[]): string {
  const words = blocks.reduce((total, block) => total + blockWordCount(block), 0);
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

/** Derives a table of contents from the article's level-2 heading blocks. */
export function getTableOfContents(blocks: ContentBlock[]): TocItem[] {
  return blocks
    .filter((block): block is Extract<ContentBlock, { type: "heading" }> => block.type === "heading" && block.level === 2)
    .map((block) => ({ id: block.id, label: block.text }));
}

/** Resolves an article's reading time and table of contents, computing either if not authored explicitly. */
function withDerivedFields(article: Article): Article {
  return {
    ...article,
    readingTime: article.readingTime ?? getReadingTime(article.contentBlocks),
    tableOfContents: article.tableOfContents ?? getTableOfContents(article.contentBlocks),
  };
}

export async function getArticles(): Promise<Article[]> {
  if (CMS_ON) {
    const slugs = await getArticleSlugs();
    const pages = await Promise.all(slugs.map((slug) => getArticleBySlug(slug)));
    return pages
      .filter((p): p is Article => p !== undefined)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map(withDerivedFields);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (CMS_ON) {
    const dto = await cmsResolve("blog", slug);
    return dto ? withDerivedFields(mapArticle(dto)) : undefined;
  }
  const article = articles.find((entry) => entry.slug === slug);
  return article ? withDerivedFields(article) : undefined;
}

export async function getArticleSlugs(): Promise<string[]> {
  if (CMS_ON) {
    const feed = await cmsSitemap();
    return feed.filter((p) => p.templateType === "Article" && !p.noIndex).map((p) => p.slug);
  }
  return articles.map((article) => article.slug);
}
