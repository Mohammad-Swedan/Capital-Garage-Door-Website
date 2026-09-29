import type {
  CostGuidePage,
  CostFactor,
  CostScenario,
  CostGuideStep,
} from "@/types/cost-guide";
import type { PageResolveDto } from "@/lib/cms/client";
import { formatCatalogPrice } from "@/lib/brands/pricing";

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/**
 * Maps the API's resolve payload onto the existing `CostGuidePage` shape the template already
 * consumes. The bespoke parts come from `dto.data` (§6); the cost-table rows come from the
 * relational `dto.pricingRows`, and FAQs / related links come from the expanded top-level fields.
 * Keeping this mapping here means the template and all `lib/seo/schema.ts` builders stay unchanged.
 */
export function mapCostGuidePage(dto: PageResolveDto): CostGuidePage {
  const data = dto.data as Record<string, any>;
  const hero = (data.hero ?? {}) as Record<string, any>;
  const costTable = (data.costTable ?? {}) as Record<string, any>;
  const factors = (data.factors ?? {}) as Record<string, any>;
  const scenarios = (data.scenarios ?? {}) as Record<string, any>;
  const repairVsReplace = (data.repairVsReplace ?? {}) as Record<string, any>;
  const howToQuote = (data.howToQuote ?? {}) as Record<string, any>;

  return {
    slug: dto.slug,
    pageType: "cost-guide",
    topicLabel: asString(data.topicLabel, dto.title),
    hero: {
      h1: asString(hero.h1, dto.title),
      subtitle: asString(hero.subtitle),
    },
    directAnswer: asString(data.directAnswer),
    costTable: {
      heading: asString(costTable.heading),
      intro: asString(costTable.intro),
      disclaimer: asString(costTable.disclaimer) || undefined,
      rows: dto.pricingRows.map((r) => ({
        repairType: r.scenario,
        includes: r.includes ?? "",
        costFactors: r.costFactors ?? "",
        nextStep: r.nextStep ?? "",
        // Indicative price column (undefined = no price, so the column can hide).
        priceRange: formatCatalogPrice(r) || undefined,
        // The catalog numbers behind it, for the JSON-LD Offer — never re-parsed from the label.
        // The live payload omits null fields, so absent bounds are normalised to null.
        priceMin: r.priceMin ?? null,
        priceMax: r.priceMax ?? null,
      })),
    },
    factors: {
      heading: asString(factors.heading),
      items: asArray<any>(factors.items).map(
        (i): CostFactor => ({
          icon: asString(i.icon),
          title: asString(i.title),
          description: asString(i.description),
        }),
      ),
    },
    scenarios: {
      heading: asString(scenarios.heading),
      items: asArray<any>(scenarios.items).map(
        (i): CostScenario => ({
          icon: asString(i.icon),
          title: asString(i.title),
          mayAffectQuote: asString(i.mayAffectQuote),
        }),
      ),
    },
    repairVsReplace: {
      heading: asString(repairVsReplace.heading),
      intro: asString(repairVsReplace.intro),
      repairWhen: asArray<string>(repairVsReplace.repairWhen),
      replaceWhen: asArray<string>(repairVsReplace.replaceWhen),
    },
    howToQuote: {
      heading: asString(howToQuote.heading),
      steps: asArray<any>(howToQuote.steps).map(
        (s): CostGuideStep => ({
          icon: asString(s.icon),
          title: asString(s.title),
          description: asString(s.description),
        }),
      ),
    },
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
