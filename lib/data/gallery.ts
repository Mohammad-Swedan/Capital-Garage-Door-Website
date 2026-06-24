import { galleryItems } from "@/content/gallery";
import type { GalleryItem } from "@/types/gallery";

/**
 * Data-access layer for the gallery. Reads from local content now; swap the
 * implementation for a CRM job-photo feed later without changing call sites.
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  return galleryItems;
}
