"use server";

import { revalidatePath } from "next/cache";
import { adminRequest } from "@/lib/cms/admin";

export interface SaveGalleryItemResult {
  ok: boolean;
  id?: number;
  errors?: { code: string; description: string }[];
}

interface GalleryItemPayload {
  id?: number;
  assetId: number;
  beforeAssetId: number | null;
  category: string;
  title: string | null;
  serviceType: string | null;
  suburb: string | null;
  caption: string | null;
  sortOrder: number;
}

/**
 * Revalidate the admin list and the public gallery after a write. `revalidatePath` purges both the
 * route and the data cache for the path (the pattern used by app/api/revalidate), so the next
 * `/gallery` render re-reads the CMS catalog.
 */
function revalidateGallery() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

/** Create or update a gallery item (by presence of `id`). */
export async function saveGalleryItemAction(payload: GalleryItemPayload): Promise<SaveGalleryItemResult> {
  const { id, ...body } = payload;

  const saved = id
    ? await adminRequest<{ id: number }>(`/api/admin/gallery/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...body, id }),
      })
    : await adminRequest<{ id: number }>(`/api/admin/gallery`, {
        method: "POST",
        body: JSON.stringify(body),
      });

  if (!saved.ok) {
    return { ok: false, errors: saved.errors?.map((e) => ({ code: e.code, description: e.description })) };
  }

  revalidateGallery();
  return { ok: true, id: id ?? saved.data?.id };
}

export async function deleteGalleryItemAction(id: number): Promise<void> {
  await adminRequest<unknown>(`/api/admin/gallery/${id}`, { method: "DELETE" });
  revalidateGallery();
}
