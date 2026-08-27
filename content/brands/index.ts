import type { BrandPage } from "@/types/brand";

/**
 * Registry of brand pages. Add a file under content/brands/motors or content/brands/doors and
 * push it here to ship a new brand page — no routing or component changes required.
 * Slugs must be unique across ALL flat page types (app/[slug] resolves brands first).
 */
export const brandPages: BrandPage[] = [];
