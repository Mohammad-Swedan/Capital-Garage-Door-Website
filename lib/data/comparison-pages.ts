import { comparisonPages } from "@/content/comparison-pages";
import type { ComparisonPage } from "@/types/comparison-page";

/**
 * Data-access layer for flat comparison landing pages. Reads from local
 * content now; swap the implementation for an API/CMS call later without
 * changing call sites.
 */
export async function getComparisonPages(): Promise<ComparisonPage[]> {
  return comparisonPages;
}

export async function getComparisonPageBySlug(slug: string): Promise<ComparisonPage | undefined> {
  return comparisonPages.find((page) => page.slug === slug);
}

export async function getComparisonPageSlugs(): Promise<string[]> {
  return comparisonPages.map((page) => page.slug);
}
