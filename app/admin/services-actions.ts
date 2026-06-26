"use server";

import { revalidatePath } from "next/cache";
import { adminRequest } from "@/lib/cms/admin";

export interface SaveServiceResult {
  ok: boolean;
  id?: number;
  errors?: { code: string; description: string }[];
}

interface CreateServicePayload {
  slug: string;
  name: string;
  shortDescription: string;
  iconName: string;
  assetId: number | null;
  canonicalPageId: number | null;
  sortOrder: number;
}

interface UpdateServicePayload {
  id: number;
  name: string;
  shortDescription: string;
  iconName: string;
  assetId: number | null;
  canonicalPageId: number | null;
  sortOrder: number;
}

/** Create or update a service (by presence of `id`). */
export async function saveServiceAction(
  payload: (CreateServicePayload | UpdateServicePayload) & { id?: number },
): Promise<SaveServiceResult> {
  const { id } = payload;

  const saved = id
    ? await adminRequest<{ id: number }>(`/api/admin/services/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...payload, id }),
      })
    : await adminRequest<{ id: number }>(`/api/admin/services`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

  if (!saved.ok) {
    return { ok: false, errors: saved.errors?.map((e) => ({ code: e.code, description: e.description })) };
  }

  revalidatePath("/admin/services");
  return { ok: true, id: id ?? saved.data?.id };
}

export async function deleteServiceAction(id: number): Promise<void> {
  await adminRequest<unknown>(`/api/admin/services/${id}`, { method: "DELETE" });
  revalidatePath("/admin/services");
}
