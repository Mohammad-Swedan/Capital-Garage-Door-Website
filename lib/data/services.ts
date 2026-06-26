import { services } from "@/content/services";
import type { Service } from "@/types";
import { cmsServices, type CmsServiceDto } from "@/lib/cms/client";

/**
 * Data-access layer for services.
 *
 * When `CMS_CATALOGS === "on"` this reads the public `GET /api/services` catalog from the ASP.NET
 * CMS and maps each DTO to the exact `Service` shape the listing pages consume; otherwise it falls
 * back to the local `content/services` module (the current source of truth). This flag-guarded seam
 * mirrors the per-page-type cutover (see lib/data/service-pages.ts). Call sites do not change.
 */
const CMS_ON = process.env.CMS_CATALOGS === "on";

// The documented fallback canonical URL when a service has no dedicated CMS page yet — the one
// comprehensive flat page covering repairs, springs, motors, and call-outs (see content/services.ts).
const DEFAULT_CANONICAL_HREF = "/garage-door-repairs-perth";

/**
 * Map a CMS ServiceDto to the front `Service` shape. The CMS catalog has no separate long
 * `description` or `faqs` columns (those live on the dedicated ServicePage), so `description`
 * falls back to the short description and `faqs` is omitted. `image`/`canonicalHref` are guarded
 * to non-empty strings so the grid (which uses them directly in <Image>/<Link>) never crashes.
 */
function mapService(dto: CmsServiceDto): Service {
  return {
    slug: dto.slug,
    name: dto.name,
    shortDescription: dto.shortDescription,
    description: dto.shortDescription,
    image: dto.imageUrl ?? "",
    icon: dto.iconName,
    canonicalHref: dto.canonicalHref ?? DEFAULT_CANONICAL_HREF,
  };
}

async function loadServices(): Promise<Service[]> {
  if (CMS_ON) {
    const dtos = await cmsServices();
    // Empty CMS catalog (or a transient fetch failure) falls back to content so the page never goes blank.
    if (dtos.length > 0) return dtos.map(mapService);
  }
  return services;
}

export async function getServices(): Promise<Service[]> {
  return loadServices();
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const all = await loadServices();
  return all.find((service) => service.slug === slug);
}

export async function getServiceSlugs(): Promise<string[]> {
  const all = await loadServices();
  return all.map((service) => service.slug);
}
