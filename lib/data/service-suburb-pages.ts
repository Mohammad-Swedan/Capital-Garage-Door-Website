import { serviceSuburbPages } from "@/content/service-suburb-pages";
import type { ServiceSuburbPage } from "@/types";

/**
 * Data-access layer for Service + Suburb landing pages (Page Type 2). Reads
 * from local content now; swap the implementation for a CMS/API call later
 * without changing call sites.
 */
export async function getServiceSuburbPages(): Promise<ServiceSuburbPage[]> {
  return serviceSuburbPages;
}

export async function getServiceSuburbPageBySlug(
  slug: string
): Promise<ServiceSuburbPage | undefined> {
  return serviceSuburbPages.find((page) => page.slug === slug);
}

export async function getServiceSuburbPageSlugs(): Promise<string[]> {
  return serviceSuburbPages.map((page) => page.slug);
}
