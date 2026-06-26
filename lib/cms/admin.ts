import "server-only";
import { cookies } from "next/headers";

/**
 * Server-only client for the authenticated CMS admin endpoints. The JWT lives in an httpOnly
 * cookie and is attached here server-side, so it is never exposed to the browser and CORS never
 * applies. Used by the /admin route group's server components and server actions.
 */

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:5179";
export const CMS_TOKEN_COOKIE = "cms_token";

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(CMS_TOKEN_COOKIE)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getToken());
}

export interface AdminResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  /** Value of the response `Location` header (set by 201 CreatedAtRoute), if any. */
  location?: string;
  errors?: { code: string; description: string; type: string }[];
}

async function request<T>(path: string, init: RequestInit = {}): Promise<AdminResult<T>> {
  const token = await getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(`${CMS_API_URL}${path}`, { ...init, headers, cache: "no-store" });

  let body: unknown = undefined;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const errors = (body as { errors?: AdminResult<T>["errors"] })?.errors;
    return { ok: false, status: res.status, errors };
  }
  return { ok: true, status: res.status, data: body as T, location: res.headers.get("location") ?? undefined };
}

/** Generic authenticated admin request, for catalog slices to reuse (attaches the JWT cookie). */
export function adminRequest<T>(path: string, init: RequestInit = {}): Promise<AdminResult<T>> {
  return request<T>(path, init);
}

// ---- Auth ----
export async function login(email: string, password: string): Promise<{ token: string } | null> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { token?: string };
  return data.token ? { token: data.token } : null;
}

// ---- Pages ----
export interface AdminPageListItem {
  id: number;
  templateType: string;
  routeGroup: string;
  slug: string;
  title: string;
  status: string;
  noIndex: boolean;
  href: string;
  publishedAt: string | null;
  updatedAt: string | null;
  createdAt: string;
}

export interface PaginatedAdmin<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function listPages(params: { templateType?: string; status?: string; search?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.templateType) qs.set("templateType", params.templateType);
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  qs.set("pageSize", "100");
  return request<PaginatedAdmin<AdminPageListItem>>(`/api/admin/pages?${qs.toString()}`);
}

export function getPage(id: number) {
  return request<Record<string, unknown>>(`/api/admin/pages/${id}`);
}

export function createPage(body: unknown) {
  return request<{ id: number }>(`/api/admin/pages`, { method: "POST", body: JSON.stringify(body) });
}

export function updatePage(id: number, body: unknown) {
  return request<{ id: number }>(`/api/admin/pages/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export function publishPage(id: number) {
  return request<{ id: number }>(`/api/admin/pages/${id}/publish`, { method: "POST" });
}

export function unpublishPage(id: number) {
  return request<{ id: number }>(`/api/admin/pages/${id}/unpublish`, { method: "POST" });
}

export function deletePage(id: number) {
  return request<unknown>(`/api/admin/pages/${id}`, { method: "DELETE" });
}
