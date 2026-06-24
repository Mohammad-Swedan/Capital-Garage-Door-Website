import { articles } from "@/content/articles";
import type { Article, ContentBlock, TocItem } from "@/types/article";

const WORDS_PER_MINUTE = 200;

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

/**
 * Data-access layer for blog/guide articles. Reads from local content now;
 * swap the implementation for an API/CMS call later without changing call sites.
 */
export async function getArticles(): Promise<Article[]> {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map(withDerivedFields);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const article = articles.find((entry) => entry.slug === slug);
  return article ? withDerivedFields(article) : undefined;
}

export async function getArticleSlugs(): Promise<string[]> {
  return articles.map((article) => article.slug);
}
