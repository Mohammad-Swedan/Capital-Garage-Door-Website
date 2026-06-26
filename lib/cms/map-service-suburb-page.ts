import type { ServiceSuburbPage } from "@/types";
import type { PageResolveDto } from "@/lib/cms/client";

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/**
 * Maps the API's resolve payload onto the existing `ServiceSuburbPage` shape the template already
 * consumes. The bespoke parts come from `dto.data` (§6); the relational parts (FAQs, nearby suburbs,
 * related pages) come from the expanded top-level fields (`dto.faqs`, `dto.relatedLinks`). Keeping
 * this mapping here means the template and all `lib/seo/schema.ts` builders stay unchanged.
 */
export function mapServiceSuburbPage(dto: PageResolveDto): ServiceSuburbPage {
  const data = dto.data as Record<string, any>;
  const hero = (data.hero ?? {}) as Record<string, any>;
  const costGuidance = (data.costGuidance ?? {}) as Record<string, any>;

  return {
    slug: dto.slug,
    service: asString(data.service, dto.title),
    suburb: asString(data.suburb),
    region: asString(data.region),
    nearbySuburbs: (dto.relatedLinks?.nearbySuburbs ?? []).map((l) => ({
      label: l.label,
      href: l.href,
    })),
    hero: {
      subtitle: asString(hero.subtitle),
      trustBadges: asArray<string>(hero.trustBadges),
    },
    directAnswer: asString(data.directAnswer),
    localIntro: asArray<string>(data.localIntro),
    availableServices: asArray<any>(data.availableServices).map((s) => ({
      title: asString(s.title),
      description: asString(s.description),
      icon: asString(s.icon),
    })),
    problems: asArray<any>(data.problems).map((p) => ({
      title: asString(p.title),
      description: asString(p.description),
      icon: asString(p.icon),
    })),
    costGuidance: {
      intro: asString(costGuidance.intro),
      factors: asArray<string>(costGuidance.factors),
      note: asString(costGuidance.note) || undefined,
    },
    whyChooseUs: asArray<any>(data.whyChooseUs).map((w) => ({
      title: asString(w.title),
      description: asString(w.description),
      icon: asString(w.icon),
    })),
    relatedPages: (dto.relatedLinks?.relatedPages ?? []).map((l) => ({
      label: l.label,
      href: l.href,
    })),
    faqs: dto.faqs.map((f) => ({ question: f.question, answer: f.answer, faqItemId: f.faqItemId ?? null })),
    localProof: asArray<any>(data.localProof).map((p) => ({
      serviceType: asString(p.serviceType),
      suburb: asString(p.suburb),
      problem: asString(p.problem),
      solution: asString(p.solution),
    })),
    seo: {
      title: dto.seoTitle,
      description: dto.seoDescription,
    },
  };
}
