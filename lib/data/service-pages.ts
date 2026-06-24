import { servicePages } from "@/content/service-pages";
import type { ServicePage } from "@/types/service-page";

/**
 * Data-access layer for flat service landing pages. Reads from local content
 * now; swap the implementation for an API/CMS call later without changing
 * call sites.
 */
export async function getServicePages(): Promise<ServicePage[]> {
  return servicePages;
}

export async function getServicePageBySlug(slug: string): Promise<ServicePage | undefined> {
  return servicePages.find((page) => page.slug === slug);
}

export async function getServicePageSlugs(): Promise<string[]> {
  return servicePages.map((page) => page.slug);
}
