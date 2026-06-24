import type { FAQ } from "@/types";

/** One entry in the article's table of contents — `id` matches a heading block's anchor. */
export interface TocItem {
  id: string;
  label: string;
}

export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "checklist"; title?: string; items: string[] }
  | { type: "callout"; variant: "tip" | "info" | "safety" | "warning"; title?: string; body: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "quote"; text: string; cite?: string };

export type ExpertTipKind = "maintenance" | "safety" | "technician" | "cost";

export interface ExpertTip {
  kind: ExpertTipKind;
  title: string;
  body: string;
}

/** Internal link to another article (related-articles cards). */
export interface ArticleLink {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
}

/** Internal link to a service landing page (related-services CTA cards). */
export interface ArticleServiceLink {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface ArticleSeo {
  title: string;
  description: string;
}

export interface Article {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author: string;
  /** ISO date, e.g. "2026-01-12". */
  publishedAt: string;
  /** ISO date, e.g. "2026-03-02". */
  updatedAt: string;
  /** Optional — derived from `contentBlocks` if omitted (see lib/data/articles.ts). */
  readingTime?: string;
  featuredImage: string;
  featuredImageAlt: string;
  /** Short, direct answer shown near the top — primary AEO/GEO target. */
  shortAnswer: string;
  /** Optional — derived from level-2 heading blocks if omitted. */
  tableOfContents?: TocItem[];
  contentBlocks: ContentBlock[];
  expertTips: ExpertTip[];
  relatedServices: ArticleServiceLink[];
  relatedArticles: ArticleLink[];
  faqs: FAQ[];
  seo: ArticleSeo;
}
