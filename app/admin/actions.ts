"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  CMS_TOKEN_COOKIE,
  createPage,
  deletePage,
  login,
  publishPage,
  unpublishPage,
  updatePage,
} from "@/lib/cms/admin";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  // Trim both fields — a stray leading/trailing space (common from autocomplete, paste,
  // or mobile keyboards) would otherwise miss the email lookup / fail the password check
  // and look like a wrong password. The CMS admin password never has surrounding spaces.
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  if (!email || !password) return { error: "Email and password are required." };

  let result: { token: string } | null;
  try {
    result = await login(email, password);
  } catch {
    // `fetch` throws (rather than returning a response) when the API is
    // unreachable — backend down, wrong URL, network blip. Surface a clear,
    // distinct message instead of letting the server action crash with an
    // unhandled "fetch failed" (which renders the dev error overlay).
    return { error: "Can't reach the server right now. Please try again in a moment." };
  }
  if (!result) return { error: "Invalid email or password." };

  (await cookies()).set(CMS_TOKEN_COOKIE, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2, // 2h, matches the JWT lifetime
  });

  redirect("/admin/pages");
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(CMS_TOKEN_COOKIE);
  redirect("/admin/login");
}

export interface SavePageResult {
  ok: boolean;
  id?: number;
  errors?: { code: string; description: string }[];
}

/** Create or update a page (by presence of `id`), then optionally publish it. */
export async function savePageAction(
  payload: Record<string, unknown> & { id?: number },
  publish: boolean,
): Promise<SavePageResult> {
  // New pages arrive with a synthetic id of 0 (and `??` would NOT fall through on 0),
  // so normalise: a real, existing page id is > 0; anything else means "create".
  const { id, ...body } = payload;
  const existingId = typeof id === "number" && id > 0 ? id : undefined;

  const saved = existingId
    ? await updatePage(existingId, { ...body, id: existingId })
    : await createPage(body);

  if (!saved.ok) {
    return { ok: false, errors: saved.errors?.map((e) => ({ code: e.code, description: e.description })) };
  }

  // Resolve the id to publish: the existing id, else the created id from the response
  // body, else the 201 Location header (.../api/admin/pages/{id}). Without a correct id
  // here, "Save & publish" on a NEW page would silently leave it a draft.
  const locationId = Number(saved.location?.match(/\/(\d+)(?:[/?#]|$)/)?.[1]);
  const savedId = existingId ?? saved.data?.id ?? (Number.isFinite(locationId) ? locationId : undefined);

  if (publish && savedId) {
    const published = await publishPage(savedId);
    if (!published.ok) {
      return { ok: false, id: savedId, errors: published.errors?.map((e) => ({ code: e.code, description: e.description })) };
    }
  }

  revalidatePath("/admin/pages");
  return { ok: true, id: savedId };
}

export async function publishPageAction(id: number): Promise<void> {
  await publishPage(id);
  revalidatePath("/admin/pages");
}

export async function unpublishPageAction(id: number): Promise<void> {
  await unpublishPage(id);
  revalidatePath("/admin/pages");
}

export async function deletePageAction(id: number): Promise<void> {
  await deletePage(id);
  revalidatePath("/admin/pages");
}
