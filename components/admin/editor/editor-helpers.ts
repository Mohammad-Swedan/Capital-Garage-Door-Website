/**
 * Small, dependency-free authoring helpers for the in-place editor (Agent 5).
 * Kept separate from `page-editor.tsx` so they're easy to unit-reason about and
 * reuse (slug derivation, friendly issue labels, time formatting).
 */

/**
 * Kebab-case a title into a URL slug: lowercase, strip accents, drop anything
 * that isn't a-z/0-9, collapse runs of separators to a single dash, and trim
 * leading/trailing dashes. Mirrors the editor's own slug validation
 * (`/^[a-z0-9-]+$/`) so an auto-derived slug never trips the validator.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** "9:05 AM" style local time for the "Saved …" status chip. */
export function formatSavedTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
