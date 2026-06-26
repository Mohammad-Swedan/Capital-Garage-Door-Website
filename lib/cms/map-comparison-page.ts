import type {
  ComparisonPage,
  ComparisonOption,
  ComparisonDecisionCard,
} from "@/types/comparison-page";
import type { PageResolveDto } from "@/lib/cms/client";

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/** Map a Data `option` block onto the public `ComparisonOption` shape, with safe fallbacks. */
function mapOption(v: unknown): ComparisonOption {
  const o = (v ?? {}) as Record<string, any>;
  return {
    name: asString(o.name),
    icon: asString(o.icon),
    summary: asString(o.summary),
    benefits: asArray<string>(o.benefits),
    limitations: asArray<string>(o.limitations),
    bestFor: asArray<string>(o.bestFor),
  };
}

const VALID_TONES: ComparisonDecisionCard["tone"][] = ["optionA", "optionB", "uncertain"];

function asTone(v: unknown): ComparisonDecisionCard["tone"] {
  return VALID_TONES.includes(v as ComparisonDecisionCard["tone"])
    ? (v as ComparisonDecisionCard["tone"])
    : "uncertain";
}

/**
 * Maps the API's resolve payload onto the existing `ComparisonPage` shape the template already
 * consumes. The bespoke parts come from `dto.data` (§6); the relational parts (FAQs, related links)
 * come from the expanded top-level fields. Keeping this mapping here means the template and all
 * `lib/seo/schema.ts` builders stay unchanged.
 */
export function mapComparisonPage(dto: PageResolveDto): ComparisonPage {
  const data = dto.data as Record<string, any>;
  const hero = (data.hero ?? {}) as Record<string, any>;
  const table = (data.comparisonTable ?? {}) as Record<string, any>;

  return {
    slug: dto.slug,
    pageType: "comparison",
    topicLabel: asString(data.topicLabel, dto.title),
    hero: {
      h1: asString(hero.h1, dto.title),
      subtitle: asString(hero.subtitle),
    },
    directAnswer: asString(data.directAnswer),
    comparisonTable: {
      optionALabel: asString(table.optionALabel),
      optionBLabel: asString(table.optionBLabel),
      rows: asArray<any>(table.rows).map((r) => ({
        feature: asString(r.feature),
        optionA: asString(r.optionA),
        optionB: asString(r.optionB),
      })),
    },
    optionA: mapOption(data.optionA),
    optionB: mapOption(data.optionB),
    decisionCards: asArray<any>(data.decisionCards).map((c) => ({
      heading: asString(c.heading),
      icon: asString(c.icon),
      tone: asTone(c.tone),
      points: asArray<string>(c.points),
    })),
    relatedServices: (dto.relatedLinks?.relatedServices ?? []).map((l) => ({
      name: l.label,
      href: l.href,
      description: "",
      icon: "DoorOpen",
    })),
    faqs: dto.faqs.map((f) => ({ question: f.question, answer: f.answer, faqItemId: f.faqItemId ?? null })),
    cta: {
      heading: asString(data.cta?.heading, "Get in touch"),
      subtitle: asString(data.cta?.subtitle),
    },
    seo: {
      title: dto.seoTitle,
      description: dto.seoDescription,
    },
    updatedAt: dto.updatedAt ?? dto.publishedAt ?? "",
  };
}
