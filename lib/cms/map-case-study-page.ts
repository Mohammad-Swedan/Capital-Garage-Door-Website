import type {
  CaseStudyDetailBlock,
  CaseStudyImage,
  CaseStudyPage,
  CaseStudySummary,
} from "@/types/case-study";
import type { PageResolveDto } from "@/lib/cms/client";

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function mapDetailBlock(raw: unknown): CaseStudyDetailBlock {
  const b = (raw ?? {}) as Record<string, any>;
  return { intro: asString(b.intro), points: asArray<string>(b.points) };
}

/**
 * Maps the API's resolve payload onto the existing `CaseStudyPage` shape the template already
 * consumes. The bespoke parts come from `dto.data` (§6); FAQs and related services come from the
 * expanded top-level fields, and `updatedAt` from the real Page column. Image `assetId`s in the
 * blob have no resolved CDN url here, so `src` falls back to empty — captions are preserved.
 * Keeping this mapping here means the template stays unchanged.
 */
export function mapCaseStudyPage(dto: PageResolveDto): CaseStudyPage {
  const data = dto.data as Record<string, any>;
  const summary = (data.summary ?? {}) as Record<string, any>;

  return {
    slug: dto.slug,
    pageType: "case-study",
    title: asString(data.title, dto.title),
    subtitle: asString(data.subtitle),
    service: asString(data.service),
    suburb: asString(data.suburb),
    doorType: asString(data.doorType),
    jobType: asString(data.jobType),
    result: asString(data.result),
    summary: {
      problem: asString(summary.problem),
      diagnosis: asString(summary.diagnosis),
      solution: asString(summary.solution),
    } satisfies CaseStudySummary,
    problem: mapDetailBlock(data.problem),
    diagnosis: mapDetailBlock(data.diagnosis),
    solution: mapDetailBlock(data.solution),
    images: asArray<any>(data.images).map(
      (img): CaseStudyImage => ({
        src: asString(img.src),
        alt: asString(img.alt, asString(img.caption)),
        caption: asString(img.caption),
      }),
    ),
    partsUsed: asArray<string>(data.partsUsed),
    relatedServices: (dto.relatedLinks?.relatedServices ?? []).map((l) => ({
      label: l.label,
      href: l.href,
    })),
    faqs: dto.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    seo: {
      title: dto.seoTitle,
      description: dto.seoDescription,
    },
    updatedAt: asString(dto.updatedAt),
  };
}
