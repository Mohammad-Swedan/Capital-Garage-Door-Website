import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { CMS_TOKEN_COOKIE } from "@/lib/cms/admin";

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:5179";

/**
 * Client-callable proxy for the FAQ library, used by the in-place editor's FAQ
 * picker (CatalogPicker). The admin endpoints require the httpOnly JWT, which is
 * attached here server-side (mirrors app/admin/api/pins/route.ts).
 *
 * GET  /admin/api/faqs?search=&pageSize=  → flat array of {id, question, answer, category?, updatedAt}
 * POST /admin/api/faqs  {question, answer, category?}  → the created FaqItem
 */

export async function GET(request: NextRequest) {
  const token = (await cookies()).get(CMS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const pageSize = request.nextUrl.searchParams.get("pageSize") ?? "50";

  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  qs.set("pageSize", pageSize);

  const res = await fetch(`${CMS_API_URL}/api/admin/faqs?${qs.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  // Normalize paginated ({items}) vs plain-array responses to a flat array.
  const items = Array.isArray(data) ? data : (data?.items ?? []);
  return NextResponse.json(items, { status: res.ok ? 200 : res.status });
}

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(CMS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body.question !== "string" || typeof body.answer !== "string") {
    return NextResponse.json({ error: "question and answer are required" }, { status: 400 });
  }

  const res = await fetch(`${CMS_API_URL}/api/admin/faqs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: body.question,
      answer: body.answer,
      category: body.category ?? null,
    }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
