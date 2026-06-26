import type { LandingPage } from "@/types/landing-page";
import type { PageResolveDto } from "@/lib/cms/client";

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/**
 * Maps the API's resolve payload onto the existing `LandingPage` shape the template already
 * consumes. The bespoke parts come from `dto.data` (§6); the relational reviews come from
 * `dto.reviews` and FAQs from `dto.faqs`. Keeping this mapping here means the template and all
 * `lib/seo/schema.ts` builders stay unchanged.
 */
export function mapLandingPage(dto: PageResolveDto): LandingPage {
  const data = dto.data as Record<string, any>;
  const hero = (data.hero ?? {}) as Record<string, any>;
  const form = (data.form ?? {}) as Record<string, any>;
  const problems = (data.problems ?? {}) as Record<string, any>;
  const whyChoose = (data.whyChoose ?? {}) as Record<string, any>;
  const serviceAreas = (data.serviceAreas ?? {}) as Record<string, any>;
  const finalCta = (data.finalCta ?? {}) as Record<string, any>;

  return {
    slug: dto.slug,
    pageType: asString(data.pageType),
    serviceLabel: asString(data.serviceLabel, dto.title),
    hero: {
      eyebrow: asString(hero.eyebrow) || undefined,
      h1: asString(hero.h1, dto.title),
      subtitle: asString(hero.subtitle),
      badges: asArray<any>(hero.badges).map((b) => ({
        icon: asString(b.icon),
        label: asString(b.label),
      })),
    },
    directAnswer: asString(data.directAnswer) || undefined,
    form: {
      heading: asString(form.heading),
      subheading: asString(form.subheading) || undefined,
    },
    problems: {
      eyebrow: asString(problems.eyebrow) || undefined,
      heading: asString(problems.heading),
      description: asString(problems.description) || undefined,
      items: asArray<any>(problems.items).map((p) => ({
        title: asString(p.title),
        description: asString(p.description),
        icon: asString(p.icon),
      })),
    },
    whyChoose: {
      eyebrow: asString(whyChoose.eyebrow) || undefined,
      heading: asString(whyChoose.heading),
      description: asString(whyChoose.description) || undefined,
      items: asArray<any>(whyChoose.items).map((w) => ({
        title: asString(w.title),
        description: asString(w.description),
        icon: asString(w.icon),
      })),
    },
    reviews: {
      heading: asString(data.reviewsHeading),
      items: dto.reviews.map((r) => ({
        id: String(r.id),
        customerName: r.customerName,
        rating: r.rating,
        text: r.text,
        suburb: r.suburb ?? "",
        service: r.service ?? "",
        source: r.sourcePlatform ?? "",
        date: r.reviewDate,
        featured: r.isFeatured,
      })),
    },
    serviceAreas: {
      heading: asString(serviceAreas.heading),
      description: asString(serviceAreas.description) || undefined,
      suburbs: asArray<string>(serviceAreas.suburbs),
    },
    faqs: dto.faqs.map((f) => ({ question: f.question, answer: f.answer, faqItemId: f.faqItemId ?? null })),
    finalCta: {
      heading: asString(finalCta.heading),
      body: asString(finalCta.body) || undefined,
    },
    seo: {
      title: dto.seoTitle,
      description: dto.seoDescription,
    },
  };
}
