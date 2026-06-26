import { galleryItems } from "@/content/gallery";
import type { GalleryCategory, GalleryItem } from "@/types/gallery";
import { cmsGallery, type CmsGalleryItemDto } from "@/lib/cms/client";

/**
 * Data-access layer for the gallery.
 *
 * When `CMS_CATALOGS === "on"` this reads the public `GET /api/gallery` catalog from the ASP.NET CMS
 * and maps each DTO to the `GalleryItem` shape the gallery page consumes; otherwise it falls back to
 * the local `content/gallery` module. Mirrors the per-page-type cutover seam (lib/data/service-pages.ts).
 */
const CMS_ON = process.env.CMS_CATALOGS === "on";

// Map the CMS GalleryCategory enum name (PascalCase on the wire) to the front display string used
// by the filter pills (types/gallery.ts). Inverse of the importer's display → enum-name mapping.
const CATEGORY_FROM_ENUM: Record<string, GalleryCategory> = {
  Repairs: "Repairs",
  Installations: "Installations",
  Motors: "Motors",
  RollerDoors: "Roller Doors",
  Commercial: "Commercial",
  BeforeAfter: "Before & After",
};

/**
 * Map a CMS GalleryItemDto to the front `GalleryItem` shape. The CMS catalog stores only the image
 * (+ optional before image) and a free-text caption — it has no separate title/service/suburb
 * columns — so `title`/`description` derive from the caption and `service`/`suburb` are left blank
 * (the gallery card guards empty strings). `image`/`alt` are guarded to non-empty strings.
 */
function mapGalleryItem(dto: CmsGalleryItemDto): GalleryItem {
  const caption = dto.caption ?? "";
  return {
    id: String(dto.id),
    image: dto.assetCdnUrl ?? "",
    alt: dto.assetAltText ?? caption,
    title: caption,
    service: "",
    suburb: "",
    category: CATEGORY_FROM_ENUM[dto.category] ?? "Repairs",
    description: caption,
  };
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (CMS_ON) {
    const dtos = await cmsGallery();
    // Empty CMS gallery (or a transient fetch failure) falls back to content so the page never goes blank.
    if (dtos.length > 0) return dtos.map(mapGalleryItem);
  }
  return galleryItems;
}
