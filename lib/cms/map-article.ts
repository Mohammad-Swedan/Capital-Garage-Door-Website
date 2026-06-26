import { siteConfig } from "@/config/site";
import type {
  Article,
  ContentBlock,
  ExpertTip,
  ExpertTipKind,
  TocItem,
} from "@/types/article";
import type { PageResolveDto } from "@/lib/cms/client";

/** Fallback featured image when a CMS article has no hero asset yet (keeps next/image happy). */
const FALLBACK_IMAGE = siteConfig.ogImage;

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

const CALLOUT_VARIANTS = ["tip", "info", "safety", "warning"] as const;
type CalloutVariant = (typeof CALLOUT_VARIANTS)[number];

function calloutVariant(v: unknown): CalloutVariant {
  return CALLOUT_VARIANTS.includes(v as CalloutVariant) ? (v as CalloutVariant) : "info";
}

const EXPERT_TIP_KINDS = ["maintenance", "safety", "technician", "cost"] as const;

function expertTipKind(v: unknown): ExpertTipKind {
  return EXPERT_TIP_KINDS.includes(v as ExpertTipKind) ? (v as ExpertTipKind) : "maintenance";
}

/** Maps one loose Data block onto the typed `ContentBlock` union. Unknown types are dropped. */
function mapBlock(raw: unknown): ContentBlock | null {
  const b = (raw ?? {}) as Record<string, any>;
  switch (b.type) {
    case "heading":
      return {
        type: "heading",
        level: b.level === 3 ? 3 : 2,
        text: asString(b.text),
        id: asString(b.id),
      };
    case "paragraph":
      return { type: "paragraph", text: asString(b.text) };
    case "list":
      return { type: "list", ordered: Boolean(b.ordered), items: asArray<string>(b.items) };
    case "checklist":
      return { type: "checklist", title: asString(b.title) || undefined, items: asArray<string>(b.items) };
    case "callout":
      return {
        type: "callout",
        variant: calloutVariant(b.variant),
        title: asString(b.title) || undefined,
        body: asString(b.body),
      };
    case "image":
      return { type: "image", src: asString(b.src), alt: asString(b.alt), caption: asString(b.caption) || undefined };
    case "quote":
      return { type: "quote", text: asString(b.text), cite: asString(b.cite) || undefined };
    default:
      return null;
  }
}

/**
 * Maps the API's resolve payload onto the existing `Article` shape the template already consumes.
 * The bespoke parts come from `dto.data` (§6); the relational parts (FAQs, related links) come from
 * the expanded top-level fields, and `featuredImage`/`publishedAt`/`updatedAt` from real Page
 * columns. Reading time + table of contents are still derived downstream by lib/data/articles.ts
 * when not provided here. Keeping this mapping here means the template stays unchanged.
 */
export function mapArticle(dto: PageResolveDto): Article {
  const data = dto.data as Record<string, any>;

  const tocOverride = asArray<any>(data.tableOfContentsOverride).map(
    (t): TocItem => ({ id: asString(t.id), label: asString(t.label) }),
  );

  return {
    title: dto.title,
    slug: dto.slug,
    category: asString(data.category),
    excerpt: asString(data.excerpt),
    author: asString(data.author, "Capital Garage Door Team"),
    publishedAt: asString(dto.publishedAt),
    updatedAt: asString(dto.updatedAt),
    readingTime: asString(data.readingTimeOverride) || undefined,
    featuredImage: dto.heroImage?.cdnUrl ?? FALLBACK_IMAGE,
    featuredImageAlt: asString(dto.heroImage?.altText, dto.title),
    shortAnswer: asString(data.shortAnswer),
    tableOfContents: tocOverride.length > 0 ? tocOverride : undefined,
    contentBlocks: asArray<unknown>(data.contentBlocks)
      .map(mapBlock)
      .filter((b): b is ContentBlock => b !== null),
    expertTips: asArray<any>(data.expertTips).map(
      (t): ExpertTip => ({
        kind: expertTipKind(t.kind),
        title: asString(t.title),
        body: asString(t.body),
      }),
    ),
    relatedServices: (dto.relatedLinks?.relatedServices ?? []).map((l) => ({
      label: l.label,
      href: l.href,
    })),
    relatedArticles: (dto.relatedLinks?.relatedArticles ?? []).map((l) => ({
      slug: l.href.replace(/^\/?blog\//, "").replace(/^\//, ""),
      title: l.label,
    })),
    faqs: dto.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    seo: {
      title: dto.seoTitle,
      description: dto.seoDescription,
    },
  };
}
