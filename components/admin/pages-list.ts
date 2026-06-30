/**
 * Shared, pure helpers + constants for the admin Pages list. Used by the server components (category
 * chips, table, the page route) to build URL-driven filter links. No client code here.
 */

export const PAGES_BASE = "/admin/pages";

export interface PagesFilters {
  /** TemplateType enum name, e.g. "ServicePage". */
  type?: string;
  /** "Published" | "Draft". */
  status?: string;
  /** Search term. */
  q?: string;
  page?: number;
}

/**
 * Build a `/admin/pages` href from the current filters + overrides. Empty values are dropped, and any
 * filter change (anything other than an explicit `page` override) resets pagination back to page 1.
 */
export function pagesHref(current: PagesFilters, overrides: Partial<PagesFilters>): string {
  const next: PagesFilters = { ...current, ...overrides };
  if (!("page" in overrides)) next.page = 1;

  const qs = new URLSearchParams();
  if (next.type) qs.set("type", next.type);
  if (next.status) qs.set("status", next.status);
  if (next.q) qs.set("q", next.q);
  if (next.page && next.page > 1) qs.set("page", String(next.page));

  const s = qs.toString();
  return s ? `${PAGES_BASE}?${s}` : PAGES_BASE;
}

/** The 8 page categories (TemplateType enum names), with short labels for the chips. */
export const TEMPLATE_TYPES: { value: string; label: string }[] = [
  { value: "ServicePage", label: "Service" },
  { value: "ComparisonPage", label: "Comparison" },
  { value: "CostGuidePage", label: "Cost guide" },
  { value: "ServiceSuburbPage", label: "Service + suburb" },
  { value: "ProblemPage", label: "Problem" },
  { value: "Article", label: "Blog" },
  { value: "CaseStudyPage", label: "Case study" },
  { value: "LandingPage", label: "Landing" },
];

export const TYPE_LABELS: Record<string, string> = Object.fromEntries(
  TEMPLATE_TYPES.map((t) => [t.value, t.label])
);
