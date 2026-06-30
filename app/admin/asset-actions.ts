"use server";

import { revalidatePath } from "next/cache";
import { adminRequest } from "@/lib/cms/admin";

export interface AssetActionResult {
  ok: boolean;
  errors?: { code: string; description: string }[];
}

/** Edit a library asset's alt text + category. */
export async function updateAssetAction(payload: {
  id: number;
  altText: string;
  category: string;
}): Promise<AssetActionResult> {
  const { id, ...body } = payload;
  const res = await adminRequest<unknown>(`/api/admin/assets/${id}`, {
    method: "PUT",
    body: JSON.stringify({ ...body, id }),
  });
  if (!res.ok) {
    return { ok: false, errors: res.errors?.map((e) => ({ code: e.code, description: e.description })) };
  }
  revalidatePath("/admin/media");
  return { ok: true };
}

/**
 * Delete a library asset. The backend rejects assets still referenced by a page/service/gallery
 * item with an `Asset.InUse` validation error — surfaced here so the UI can explain it.
 */
export async function deleteAssetAction(id: number): Promise<AssetActionResult> {
  const res = await adminRequest<unknown>(`/api/admin/assets/${id}`, { method: "DELETE" });
  if (!res.ok) {
    return { ok: false, errors: res.errors?.map((e) => ({ code: e.code, description: e.description })) };
  }
  revalidatePath("/admin/media");
  return { ok: true };
}
