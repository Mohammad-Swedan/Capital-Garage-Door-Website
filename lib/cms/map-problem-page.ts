import type { Problem } from "@/types";
import type { PageResolveDto } from "@/lib/cms/client";

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/** Indicative price column for a problem cost row, derived from the relational pricing row. */
function priceRange(row: PageResolveDto["pricingRows"][number]): string {
  if (row.priceLabel) return row.priceLabel;
  if (row.priceMin != null && row.priceMax != null) return `$${row.priceMin}–$${row.priceMax}`;
  if (row.priceMin != null) return `From $${row.priceMin}`;
  return "";
}

/** A related-service link only carries a label + href in the resolve payload; derive the slug from the href. */
function hrefToSlug(href: string): string {
  const parts = href.split("/").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : href;
}

/**
 * Maps the API's resolve payload onto the existing `Problem` shape the template already consumes.
 * The bespoke parts come from `dto.data` (§6); h1/metaTitle/metaDescription map from the Pages row
 * (title/seoTitle/seoDescription), and the relational parts (related services, cost rows, FAQs,
 * hero image) come from the expanded top-level fields. Keeping this mapping here means the template
 * and all `lib/seo/schema.ts` builders stay unchanged.
 */
export function mapProblemPage(dto: PageResolveDto): Problem {
  const data = dto.data as Record<string, any>;
  const emergency = (data.emergency ?? {}) as Record<string, any>;

  return {
    slug: dto.slug,
    name: dto.title,
    h1: dto.title,
    heroSubtitle: asString(data.heroSubtitle),
    metaTitle: dto.seoTitle,
    metaDescription: dto.seoDescription,
    directAnswer: asString(data.directAnswer),
    causes: asArray<any>(data.causes).map((c) => ({
      icon: asString(c.icon),
      title: asString(c.title),
      description: asString(c.description),
    })),
    safeChecks: asArray<string>(data.safeChecks),
    doNotDo: asArray<string>(data.doNotDo),
    callTechnicianSigns: asArray<string>(data.callTechnicianSigns),
    relatedServices: (dto.relatedLinks?.relatedServices ?? []).map((l) => ({
      slug: hrefToSlug(l.href),
      label: l.label,
    })),
    costRows: dto.pricingRows.map((r) => ({
      scenario: r.scenario,
      priceRange: priceRange(r),
      note: r.note ?? undefined,
    })),
    emergency: {
      heading: asString(emergency.heading),
      body: asString(emergency.body),
    },
    faqs: dto.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    updatedAt: dto.updatedAt ?? dto.publishedAt ?? "",
    heroImage: dto.heroImage?.cdnUrl ?? undefined,
  };
}
