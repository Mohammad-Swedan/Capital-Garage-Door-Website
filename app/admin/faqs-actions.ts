"use server";

import { revalidatePath } from "next/cache";
import { createFaq, updateFaq, deleteFaq } from "@/lib/cms/admin";

export interface SaveFaqResult {
  ok: boolean;
  id?: number;
  errors?: { code: string; description: string }[];
}

interface FaqActionPayload {
  id?: number;
  question: string;
  answer: string;
  category: string | null;
}

/** Create or update a library FAQ (by presence of `id`). */
export async function saveFaqAction(payload: FaqActionPayload): Promise<SaveFaqResult> {
  const { id, question, answer, category } = payload;
  const body = { question, answer, category };

  const saved = id ? await updateFaq(id, body) : await createFaq(body);

  if (!saved.ok) {
    return { ok: false, errors: saved.errors?.map((e) => ({ code: e.code, description: e.description })) };
  }

  revalidatePath("/admin/faqs");
  return { ok: true, id: id ?? saved.data?.id };
}

export async function deleteFaqAction(id: number): Promise<void> {
  await deleteFaq(id);
  revalidatePath("/admin/faqs");
}
