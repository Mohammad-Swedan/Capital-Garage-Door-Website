import type { CaseStudyPage } from "@/types/case-study";

/**
 * Pure selection logic for the "Recent work" section on flat service pages
 * (`getCaseStudiesForServicePage` in lib/data/case-studies.ts wraps it with the data fetch).
 * No runtime imports, so it's unit-tested offline (lib/case-studies/__tests__/).
 */

/** True when a case study has at least one real (remote) job photo to show. */
export function hasRealPhoto(cs: CaseStudyPage): boolean {
  return cs.images.some((img) => !!img.src && /^https?:\/\//.test(img.src));
}

/**
 * Service pages that also feature jobs linked to a related page. A case study's
 * `relatedServices` names the money page the job maps to; these parent/child pages have few
 * (or no) direct links, so they borrow their nearest sibling's jobs. One-directional: the
 * installation page does NOT show jobs linked only to /garage-doors-perth.
 */
export const SERVICE_CASE_STUDY_ALIASES: Readonly<Record<string, readonly string[]>> = {
  "garage-doors-perth": ["garage-door-installation-perth"],
  "commercial-garage-doors-perth": ["commercial-roller-doors-perth"],
  "industrial-roller-doors-perth": ["commercial-roller-doors-perth"],
  "roller-door-installation-perth": ["roller-doors-perth", "garage-door-installation-perth"],
};

/**
 * Comparable path for an internal href: "https://capitalgaragedoors.com.au/x/?a=1#b", "/x/" and
 * "x" all become "/x". Lowercased, since every slug on the site is lowercase.
 */
export function normaliseHref(href: string): string {
  const path = href
    .trim()
    .replace(/^https?:\/\/[^/?#]*/i, "")
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "")
    .replace(/^\/*/, "/");
  return path.toLowerCase();
}

/** Newest first; unparseable/empty dates sort last; ties fall back to slug order. */
function byNewest(a: CaseStudyPage, b: CaseStudyPage): number {
  const time = (cs: CaseStudyPage) => {
    const t = Date.parse(cs.updatedAt);
    return Number.isNaN(t) ? -Infinity : t;
  };
  const diff = time(b) - time(a);
  if (diff !== 0 && !Number.isNaN(diff)) return diff;
  return a.slug.localeCompare(b.slug);
}

/**
 * Case studies for a service page's "Recent work": every photo-backed case study whose
 * `relatedServices` links the page itself (or one of its `SERVICE_CASE_STUDY_ALIASES`), newest
 * first by `updatedAt` (the CMS mapper falls back to `publishedAt`), capped at `limit`.
 */
export function pickCaseStudiesForService(
  caseStudies: CaseStudyPage[],
  slug: string,
  limit = 3,
): CaseStudyPage[] {
  const own = normaliseHref(slug).slice(1);
  const targets = new Set([own, ...(SERVICE_CASE_STUDY_ALIASES[own] ?? [])].map(normaliseHref));
  return caseStudies
    .filter(hasRealPhoto)
    .filter((cs) => cs.relatedServices.some((link) => targets.has(normaliseHref(link.href))))
    .sort(byNewest)
    .slice(0, Math.max(0, limit));
}
