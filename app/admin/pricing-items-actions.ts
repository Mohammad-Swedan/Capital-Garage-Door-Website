"use server";

import { revalidatePath } from "next/cache";
import { adminRequest } from "@/lib/cms/admin";

export interface SavePricingItemResult {
  ok: boolean;
  id?: number;
  errors?: { code: string; description: string }[];
}

interface PricingItemPayload {
  id?: number;
  scenario: string;
  priceMin: number | null;
  priceMax: number | null;
  priceLabel: string | null;
  note: string | null;
  internalNote: string | null;
  category: string | null;
  includes: string | null;
  costFactors: string | null;
  nextStep: string | null;
}

/** Create or update a pricing item (by presence of `id`). */
export async function savePricingItemAction(payload: PricingItemPayload): Promise<SavePricingItemResult> {
  const { id, ...body } = payload;

  const saved = id
    ? await adminRequest<{ id: number }>(`/api/admin/pricing-items/${id}`, {
        method: "PUT",
        body: JSON.stringify({ ...body, id }),
      })
    : await adminRequest<{ id: number }>(`/api/admin/pricing-items`, {
        method: "POST",
        body: JSON.stringify(body),
      });

  if (!saved.ok) {
    return { ok: false, errors: saved.errors?.map((e) => ({ code: e.code, description: e.description })) };
  }

  revalidatePath("/admin/pricing-items");
  return { ok: true, id: id ?? saved.data?.id };
}

export async function deletePricingItemAction(id: number): Promise<void> {
  await adminRequest<unknown>(`/api/admin/pricing-items/${id}`, { method: "DELETE" });
  revalidatePath("/admin/pricing-items");
}
