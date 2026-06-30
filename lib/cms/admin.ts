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

export function listPages(
  params: {
    templateType?: string;
    status?: string;
    search?: string;
    pageNumber?: number;
    pageSize?: number;
  } = {}
) {
  const qs = new URLSearchParams();
  if (params.templateType) qs.set("templateType", params.templateType);
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  if (params.pageNumber) qs.set("pageNumber", String(params.pageNumber));
  qs.set("pageSize", String(params.pageSize ?? 20));
  return request<PaginatedAdmin<AdminPageListItem>>(`/api/admin/pages?${qs.toString()}`);
}

export interface PageTypeCount {
  templateType: string;
  count: number;
}

export interface PageCounts {
  total: number;
  byType: PageTypeCount[];
}

/** Per-category page counts for the list's category chips. Honors status/search (not template type). */
export function listPageCounts(params: { status?: string; search?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  const q = qs.toString();
  return request<PageCounts>(`/api/admin/pages/counts${q ? `?${q}` : ""}`);
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

// ---- FAQ library ----
export interface AdminFaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
  updatedAt?: string | null;
}

export interface CreateFaqPayload {
  question: string;
  answer: string;
  category?: string | null;
}

export interface UpdateFaqPayload extends CreateFaqPayload {
  id: number;
}

/** List/search the FAQ library. `search` is a substring match on the question. */
export function listFaqs(params: { search?: string; pageNumber?: number; pageSize?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.pageNumber) qs.set("pageNumber", String(params.pageNumber));
  qs.set("pageSize", String(params.pageSize ?? 100));
  return request<PaginatedAdmin<AdminFaqItem>>(`/api/admin/faqs?${qs.toString()}`);
}

export function getFaq(id: number) {
  return request<AdminFaqItem>(`/api/admin/faqs/${id}`);
}

export function createFaq(body: CreateFaqPayload) {
  return request<AdminFaqItem>(`/api/admin/faqs`, { method: "POST", body: JSON.stringify(body) });
}

export function updateFaq(id: number, body: CreateFaqPayload) {
  return request<AdminFaqItem>(`/api/admin/faqs/${id}`, {
    method: "PUT",
    body: JSON.stringify({ ...body, id }),
  });
}

export function deleteFaq(id: number) {
  return request<unknown>(`/api/admin/faqs/${id}`, { method: "DELETE" });
}

// ---- Catalog create (Reviews / Services / PricingItems) ----
// Minimal create helpers used by the in-place editor's pin pickers ("Create new …").
// They attach the JWT cookie via `request` and return the created row (camelCase DTO).

export interface AdminReview {
  id: number;
  customerName: string;
  rating: number;
  text: string;
  reviewDate: string;
  service?: string | null;
  suburb?: string | null;
  sourcePlatform?: string | null;
  isFeatured: boolean;
}

export interface CreateReviewPayload {
  customerName: string;
  rating: number;
  text: string;
  /** ISO date "YYYY-MM-DD" (maps to the backend DateOnly). Required by the backend. */
  reviewDate: string;
  service?: string | null;
  suburb?: string | null;
  /** "Google" | "Facebook" | "Website" (enum name) — omitted when unknown. */
  sourcePlatform?: string | null;
  isFeatured?: boolean;
}

export function createReview(body: CreateReviewPayload) {
  return request<AdminReview>(`/api/admin/reviews`, { method: "POST", body: JSON.stringify(body) });
}

export interface AdminService {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  iconName: string;
  assetId?: number | null;
  canonicalPageId?: number | null;
  sortOrder: number;
}

export interface CreateServicePayload {
  slug: string;
  name: string;
  shortDescription: string;
  iconName: string;
  assetId?: number | null;
  canonicalPageId?: number | null;
  sortOrder?: number;
}

export function createService(body: CreateServicePayload) {
  return request<AdminService>(`/api/admin/services`, { method: "POST", body: JSON.stringify(body) });
}

export interface AdminPricingItem {
  id: number;
  scenario: string;
  priceMin?: number | null;
  priceMax?: number | null;
  priceLabel?: string | null;
  note?: string | null;
  /** Admin-only note for the AI assistant. Present on admin endpoints only. */
  internalNote?: string | null;
  category?: string | null;
  includes?: string | null;
  costFactors?: string | null;
  nextStep?: string | null;
}

export interface CreatePricingItemPayload {
  scenario: string;
  priceMin?: number | null;
  priceMax?: number | null;
  priceLabel?: string | null;
  note?: string | null;
  /** Admin-only note for the AI assistant — never sent to the public site. */
  internalNote?: string | null;
  category?: string | null;
  includes?: string | null;
  costFactors?: string | null;
  nextStep?: string | null;
}

export function createPricingItem(body: CreatePricingItemPayload) {
  return request<AdminPricingItem>(`/api/admin/pricing-items`, { method: "POST", body: JSON.stringify(body) });
}
