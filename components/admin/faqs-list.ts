/**
 * Shared, pure helpers for the admin FAQ library list (URL-driven). Mirrors `pages-list.ts`. No client
 * code here.
 */

export const FAQS_BASE = "/admin/faqs";

/** Sentinel category param for the "Uncategorized" chip — must match the backend FaqQueryConstants. */
export const UNCATEGORIZED = "__uncategorized__";

export interface FaqsFilters {
  /** Category value, or UNCATEGORIZED, or undefined for All. */
  category?: string;
  /** Search term. */
  q?: string;
  page?: number;
}

/** Build a `/admin/faqs` href from current filters + overrides; any filter change resets to page 1. */
export function faqsHref(current: FaqsFilters, overrides: Partial<FaqsFilters>): string {
  const next: FaqsFilters = { ...current, ...overrides };
  if (!("page" in overrides)) next.page = 1;

  const qs = new URLSearchParams();
  if (next.category) qs.set("category", next.category);
  if (next.q) qs.set("q", next.q);
  if (next.page && next.page > 1) qs.set("page", String(next.page));

  const s = qs.toString();
  return s ? `${FAQS_BASE}?${s}` : FAQS_BASE;
}
