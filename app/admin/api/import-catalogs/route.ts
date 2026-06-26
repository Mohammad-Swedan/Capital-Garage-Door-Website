import { NextResponse } from "next/server";
import { adminRequest, isAuthenticated } from "@/lib/cms/admin";
import { services as contentServices } from "@/content/services";
import { galleryItems as contentGallery } from "@/content/gallery";
import { serviceAreaRegions as contentRegions } from "@/content/service-area-regions";
import type { GalleryCategory } from "@/types/gallery";

export const dynamic = "force-dynamic";

/**
 * One-time catalog importer (admin-only dev tool) — the catalog counterpart to app/admin/api/import.
 * POST to run it: seeds the CMS catalog tables (Services / Gallery / Service-area regions+suburbs)
 * from the local content/*.ts modules so the listing pages can read from the CMS. It is idempotent —
 * it GETs existing rows first and skips ones already present (and treats a 409 as "already exists").
 * After a clean run, flip CMS_CATALOGS=on in .env.local.
 */

interface AdminPageRow {
  id: number;
  slug: string;
  routeGroup: string;
  templateType: string;
}
interface AdminServiceRow {
  id: number;
  slug: string;
  assetId?: number | null;
  canonicalPageId?: number | null;
}
interface AdminGalleryRow {
  id: number;
  caption?: string | null;
}
interface AdminSuburbRow {
  id: number;
  regionId: number;
  slug?: string | null;
  name: string;
}
interface AdminRegionRow {
  id: number;
  name: string;
  suburbs: AdminSuburbRow[];
}

// Map a front GalleryCategory display string to the CMS GalleryCategory enum NAME (PascalCase),
// which the API accepts/returns as a string (StringEnumConverter). Inverse of lib/data/gallery.ts.
const CATEGORY_TO_ENUM: Record<GalleryCategory, string> = {
  Repairs: "Repairs",
  Installations: "Installations",
  Motors: "Motors",
  "Roller Doors": "RollerDoors",
  Commercial: "Commercial",
  "Before & After": "BeforeAfter",
};

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const created: string[] = [];
  const skipped: string[] = [];
  const errors: unknown[] = [];

  // Dedupe asset registrations by URL across the whole import (mirrors app/admin/api/import).
  const assetCache = new Map<string, number>();
  const registerAsset = async (cdnUrl: string, altText: string): Promise<number> => {
    const existing = assetCache.get(cdnUrl);
    if (existing) return existing;
    const res = await adminRequest<{ id: number }>("/api/admin/assets", {
      method: "POST",
      body: JSON.stringify({ cdnUrl, altText: altText || "image", width: null, height: null }),
    });
    const id = res.data?.id ?? 0;
    if (id) assetCache.set(cdnUrl, id);
    return id;
  };

  // ---------------------------------------------------------------- Services
  const serviceCounts = { created: 0, skipped: 0 };
  try {
    const existing = await adminRequest<AdminServiceRow[]>("/api/admin/services");
    const bySlug = new Map<string, AdminServiceRow>((existing.data ?? []).map((s) => [s.slug.toLowerCase(), s]));

    for (let i = 0; i < contentServices.length; i++) {
      const svc = contentServices[i];
      try {
        const existingSvc = bySlug.get(svc.slug.toLowerCase());
        let serviceId = existingSvc?.id;
        // The current asset id on this service — from this run for a fresh create, otherwise the
        // value already stored on the existing row — so the link-PUT below never nulls it out.
        let serviceAssetId: number | null = existingSvc?.assetId ?? null;
        let serviceCanonicalPageId: number | null = existingSvc?.canonicalPageId ?? null;

        if (serviceId) {
          skipped.push(`service/${svc.slug}`);
          serviceCounts.skipped++;
        } else {
          serviceAssetId = svc.image ? (await registerAsset(svc.image, svc.name)) || null : null;
          const res = await adminRequest<AdminServiceRow>("/api/admin/services", {
            method: "POST",
            body: JSON.stringify({
              slug: svc.slug,
              name: svc.name,
              shortDescription: svc.shortDescription,
              iconName: svc.icon,
              assetId: serviceAssetId,
              canonicalPageId: null,
              sortOrder: i,
            }),
          });
          if (res.ok && res.data) {
            serviceId = res.data.id;
            created.push(`service/${svc.slug}`);
            serviceCounts.created++;
          } else if (res.status === 409) {
            skipped.push(`service/${svc.slug}`);
            serviceCounts.skipped++;
          } else {
            errors.push({ stage: "service", slug: svc.slug, status: res.status, errors: res.errors });
          }
        }

        // Resolve canonicalHref ("/garage-door-repairs-perth") -> the matching CMS page id, then link
        // it (skip if already linked). The PUT replaces all fields, so we preserve the current assetId.
        if (serviceId && svc.canonicalHref && !serviceCanonicalPageId) {
          const pageSlug = svc.canonicalHref.split("/").filter(Boolean).pop();
          if (pageSlug) {
            const found = await adminRequest<{ items: AdminPageRow[] }>(
              `/api/admin/pages?search=${encodeURIComponent(pageSlug)}&pageSize=100`,
            );
            const match = (found.data?.items ?? []).find((p) => p.slug.toLowerCase() === pageSlug.toLowerCase());
            if (match) {
              const upd = await adminRequest<AdminServiceRow>(`/api/admin/services/${serviceId}`, {
                method: "PUT",
                body: JSON.stringify({
                  name: svc.name,
                  shortDescription: svc.shortDescription,
                  iconName: svc.icon,
                  assetId: serviceAssetId,
                  canonicalPageId: match.id,
                  sortOrder: i,
                }),
              });
              if (upd.ok) created.push(`service-link/${svc.slug}->${match.slug}`);
              else errors.push({ stage: "service-link", slug: svc.slug, status: upd.status, errors: upd.errors });
            }
          }
        }
      } catch (e) {
        errors.push({ stage: "service", slug: svc.slug, error: String(e) });
      }
    }
  } catch (e) {
    errors.push({ stage: "services", error: String(e) });
  }

  // ---------------------------------------------------------------- Gallery
  const galleryCounts = { created: 0, skipped: 0 };
  try {
    const existing = await adminRequest<AdminGalleryRow[]>("/api/admin/gallery");
    const captions = new Set((existing.data ?? []).map((g) => (g.caption ?? "").trim().toLowerCase()).filter(Boolean));

    for (let i = 0; i < contentGallery.length; i++) {
      const item = contentGallery[i];
      // Caption carries the local title/description; it's the only stable key for idempotency.
      const caption = item.description || item.title;
      try {
        if (caption && captions.has(caption.trim().toLowerCase())) {
          skipped.push(`gallery/${item.id}`);
          galleryCounts.skipped++;
          continue;
        }
        const assetId = await registerAsset(item.image, item.alt || item.title);
        if (!assetId) {
          errors.push({ stage: "gallery", id: item.id, error: "asset registration failed" });
          continue;
        }
        const res = await adminRequest<AdminGalleryRow>("/api/admin/gallery", {
          method: "POST",
          body: JSON.stringify({
            assetId,
            beforeAssetId: null,
            category: CATEGORY_TO_ENUM[item.category] ?? "Repairs",
            caption,
            sortOrder: i,
          }),
        });
        if (res.ok) {
          created.push(`gallery/${item.id}`);
          galleryCounts.created++;
          if (caption) captions.add(caption.trim().toLowerCase());
        } else if (res.status === 409) {
          skipped.push(`gallery/${item.id}`);
          galleryCounts.skipped++;
        } else {
          errors.push({ stage: "gallery", id: item.id, status: res.status, errors: res.errors });
        }
      } catch (e) {
        errors.push({ stage: "gallery", id: item.id, error: String(e) });
      }
    }
  } catch (e) {
    errors.push({ stage: "gallery", error: String(e) });
  }

  // ------------------------------------------------ Service-area regions + suburbs
  const regionCounts = { created: 0, skipped: 0 };
  const suburbCounts = { created: 0, skipped: 0 };
  try {
    const existing = await adminRequest<AdminRegionRow[]>("/api/admin/service-area-regions");
    const regionsByName = new Map<string, AdminRegionRow>(
      (existing.data ?? []).map((r) => [r.name.trim().toLowerCase(), r]),
    );

    for (let ri = 0; ri < contentRegions.length; ri++) {
      const region = contentRegions[ri];
      try {
        let regionRow = regionsByName.get(region.name.trim().toLowerCase());
        let regionId = regionRow?.id;
        if (regionId) {
          skipped.push(`region/${region.name}`);
          regionCounts.skipped++;
        } else {
          const res = await adminRequest<AdminRegionRow>("/api/admin/service-area-regions", {
            method: "POST",
            body: JSON.stringify({ name: region.name, sortOrder: ri }),
          });
          if (res.ok && res.data) {
            regionId = res.data.id;
            regionRow = { ...res.data, suburbs: res.data.suburbs ?? [] };
            created.push(`region/${region.name}`);
            regionCounts.created++;
          } else {
            errors.push({ stage: "region", name: region.name, status: res.status, errors: res.errors });
            continue;
          }
        }

        const existingSlugs = new Set(
          (regionRow?.suburbs ?? []).map((s) => (s.slug ?? s.name).trim().toLowerCase()),
        );

        for (let si = 0; si < region.suburbs.length; si++) {
          const suburb = region.suburbs[si];
          try {
            if (existingSlugs.has(suburb.slug.toLowerCase())) {
              skipped.push(`suburb/${suburb.slug}`);
              suburbCounts.skipped++;
              continue;
            }
            // If a CMS page already exists at exactly this suburb slug, link it (usually none — the
            // service-suburb pages use composite slugs like garage-door-repairs-joondalup).
            let pageId: number | null = null;
            const found = await adminRequest<{ items: AdminPageRow[] }>(
              `/api/admin/pages?search=${encodeURIComponent(suburb.slug)}&pageSize=100`,
            );
            const match = (found.data?.items ?? []).find((p) => p.slug.toLowerCase() === suburb.slug.toLowerCase());
            if (match) pageId = match.id;

            const res = await adminRequest<AdminSuburbRow>("/api/admin/suburbs", {
              method: "POST",
              body: JSON.stringify({
                regionId,
                name: suburb.name,
                slug: suburb.slug,
                pageId,
                sortOrder: si,
              }),
            });
            if (res.ok) {
              created.push(`suburb/${suburb.slug}`);
              suburbCounts.created++;
              existingSlugs.add(suburb.slug.toLowerCase());
            } else if (res.status === 409) {
              skipped.push(`suburb/${suburb.slug}`);
              suburbCounts.skipped++;
            } else {
              errors.push({ stage: "suburb", slug: suburb.slug, status: res.status, errors: res.errors });
            }
          } catch (e) {
            errors.push({ stage: "suburb", slug: suburb.slug, error: String(e) });
          }
        }
      } catch (e) {
        errors.push({ stage: "region", name: region.name, error: String(e) });
      }
    }
  } catch (e) {
    errors.push({ stage: "regions", error: String(e) });
  }

  return NextResponse.json({
    created,
    skipped,
    errors,
    counts: {
      created: created.length,
      skipped: skipped.length,
      errors: errors.length,
      assets: assetCache.size,
      services: serviceCounts,
      gallery: galleryCounts,
      regions: regionCounts,
      suburbs: suburbCounts,
    },
  });
}
