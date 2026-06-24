import { costGuidePages } from "@/content/cost-guides";
import type { CostGuidePage } from "@/types/cost-guide";

/**
 * Data-access layer for flat cost-guide landing pages. Reads from local
 * content now; swap the implementation for an API/CMS call later without
 * changing call sites.
 */
export async function getCostGuidePages(): Promise<CostGuidePage[]> {
  return costGuidePages;
}

export async function getCostGuidePageBySlug(slug: string): Promise<CostGuidePage | undefined> {
  return costGuidePages.find((page) => page.slug === slug);
}

export async function getCostGuidePageSlugs(): Promise<string[]> {
  return costGuidePages.map((page) => page.slug);
}
