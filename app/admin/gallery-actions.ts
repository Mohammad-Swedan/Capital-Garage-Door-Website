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
  caption: string | null;
  sortOrder: number;
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

  revalidatePath("/admin/gallery");
  return { ok: true, id: id ?? saved.data?.id };
}

export async function deleteGalleryItemAction(id: number): Promise<void> {
  await adminRequest<unknown>(`/api/admin/gallery/${id}`, { method: "DELETE" });
  revalidatePath("/admin/gallery");
}
