import { siteConfig } from "@/config/site";
import type { ServicePage } from "@/types/service-page";
import type { PageResolveDto } from "@/lib/cms/client";

/** Fallback hero image when a CMS page has no hero asset yet (keeps next/image happy). */
const FALLBACK_HERO = siteConfig.ogImage;

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function priceLabel(row: PageResolveDto["pricingRows"][number]): string {
  if (row.priceLabel) return row.priceLabel;
  if (row.priceMin != null && row.priceMax != null) return `$${row.priceMin}–$${row.priceMax}`;
  if (row.priceMin != null) return `From $${row.priceMin}`;
  return "";
}

/**
 * Maps the API's resolve payload onto the existing `ServicePage` shape the template already
 * consumes. The bespoke parts come from `dto.data` (§6); the relational parts (hero image, FAQs,
 * reviews, pricing rows, related links) come from the expanded top-level fields. Keeping this
 * mapping here means the template and all `lib/seo/schema.ts` builders stay unchanged.
 */
export function mapServicePage(dto: PageResolveDto): ServicePage {
  const data = dto.data as Record<string, any>;
  const hero = (data.hero ?? {}) as Record<string, any>;

  return {
    serviceName: dto.title,
    slug: dto.slug,
    pageType: "service",
    hero: {
      h1: asString(hero.h1, dto.title),
      subtitle: asString(hero.subtitle),
      badges: asArray<{ icon: string; label: string }>(hero.badges),
      image: dto.heroImage?.cdnUrl ?? FALLBACK_HERO,
      imageAlt: asString(hero.imageAlt, dto.heroImage?.altText ?? dto.title),
      floatingCardLabel: asString(hero.floatingCardLabel),
    },
    directAnswer: asString(data.directAnswer),
    intro: {
      heading: asString(data.intro?.heading),
      paragraphs: asArray<string>(data.intro?.paragraphs),
    },
    problems: asArray<any>(data.problems).map((p) => ({
      label: asString(p.label),
      icon: asString(p.icon),
    })),
    includedItems: asArray<string>(data.includedItems),
    processSteps: asArray<any>(data.processSteps).map((s) => ({
      title: asString(s.title),
      description: asString(s.description),
      icon: asString(s.icon),
    })),
    costGuidance: {
      intro: asString(data.costGuidanceIntro),
      rows: dto.pricingRows.map((r) => ({
        label: r.scenario,
        price: priceLabel(r),
        note: r.note ?? undefined,
      })),
    },
    whyChoose: asArray<any>(data.whyChoose).map((w) => ({
      title: asString(w.title),
      description: asString(w.description),
      icon: asString(w.icon),
    })),
    relatedServices: (dto.relatedLinks?.relatedServices ?? []).map((l) => ({
      name: l.label,
      href: l.href,
      description: "",
      icon: "DoorOpen",
    })),
    serviceAreas: asArray<string>(data.serviceAreas),
    reviews: dto.reviews.map((r) => ({
      name: r.customerName,
      rating: r.rating,
      text: r.text,
      suburb: r.suburb ?? undefined,
      service: r.service ?? undefined,
    })),
    faqs: dto.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    cta: {
      heading: asString(data.cta?.heading, "Get in touch"),
      subtitle: asString(data.cta?.subtitle),
    },
    seo: {
      title: dto.seoTitle,
      description: dto.seoDescription,
    },
  };
}
