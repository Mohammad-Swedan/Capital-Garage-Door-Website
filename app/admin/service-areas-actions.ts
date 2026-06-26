"use server";

import { revalidatePath } from "next/cache";
import { adminRequest } from "@/lib/cms/admin";

export interface SaveResult {
  ok: boolean;
  id?: number;
  errors?: { code: string; description: string }[];
}

function toErrors(
  errors?: { code: string; description: string; type: string }[],
): { code: string; description: string }[] {
  return (errors ?? []).map((e) => ({ code: e.code, description: e.description }));
}

// ---- Regions ----

export interface RegionPayload {
  id?: number;
  name: string;
  sortOrder: number;
}

export async function saveRegionAction(payload: RegionPayload): Promise<SaveResult> {
  const { id, ...body } = payload;

  const saved = id
    ? await adminRequest<{ id: number }>(`/api/admin/service-area-regions/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...body, id }),
      })
    : await adminRequest<{ id: number }>(`/api/admin/service-area-regions`, {
        method: "POST",
        body: JSON.stringify(body),
      });

  if (!saved.ok) return { ok: false, errors: toErrors(saved.errors) };

  revalidatePath("/admin/service-areas");
  return { ok: true, id: id ?? saved.data?.id };
}

export async function deleteRegionAction(id: number): Promise<SaveResult> {
  const res = await adminRequest<unknown>(`/api/admin/service-area-regions/${id}`, { method: "DELETE" });
  if (!res.ok) return { ok: false, errors: toErrors(res.errors) };
  revalidatePath("/admin/service-areas");
  return { ok: true };
}

// ---- Suburbs ----

export interface SuburbPayload {
  id?: number;
  regionId: number;
  name: string;
  slug: string | null;
  pageId: number | null;
  sortOrder: number;
}

export async function saveSuburbAction(payload: SuburbPayload): Promise<SaveResult> {
  const { id, ...body } = payload;

  const saved = id
    ? await adminRequest<{ id: number }>(`/api/admin/suburbs/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...body, id }),
      })
    : await adminRequest<{ id: number }>(`/api/admin/suburbs`, {
        method: "POST",
        body: JSON.stringify(body),
      });

  if (!saved.ok) return { ok: false, errors: toErrors(saved.errors) };

  revalidatePath("/admin/service-areas");
  return { ok: true, id: id ?? saved.data?.id };
}

export async function deleteSuburbAction(id: number): Promise<SaveResult> {
  const res = await adminRequest<unknown>(`/api/admin/suburbs/${id}`, { method: "DELETE" });
  if (!res.ok) return { ok: false, errors: toErrors(res.errors) };
  revalidatePath("/admin/service-areas");
  return { ok: true };
}
