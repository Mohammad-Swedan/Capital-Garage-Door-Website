import { services } from "@/content/services";
import type { Service } from "@/types";

/**
 * Data-access layer for services. Reads from local content now; swap the
 * implementation for an API/DB call later without changing call sites.
 */
export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  return services.find((service) => service.slug === slug);
}

export async function getServiceSlugs(): Promise<string[]> {
  return services.map((service) => service.slug);
}
