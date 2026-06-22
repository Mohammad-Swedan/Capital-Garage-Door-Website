import { serviceAreas } from "@/content/service-areas";
import type { ServiceArea } from "@/types";

/**
 * Data-access layer for service areas. Reads from local content now; swap
 * the implementation for an API/DB call later without changing call sites.
 */
export async function getServiceAreas(): Promise<ServiceArea[]> {
  return serviceAreas;
}

export async function getServiceAreaBySlug(slug: string): Promise<ServiceArea | undefined> {
  return serviceAreas.find((area) => area.slug === slug);
}

export async function getServiceAreaSlugs(): Promise<string[]> {
  return serviceAreas.map((area) => area.slug);
}
