import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { CMS_TOKEN_COOKIE } from "@/lib/cms/admin";

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:5179";

// Client-callable proxy so the editor's Settings-drawer pin pickers can list the catalogs
// (the admin endpoints need the httpOnly JWT, which is attached here server-side).
const ENDPOINTS: Record<string, string> = {
  reviews: "/api/admin/reviews?pageSize=200",
  pricing: "/api/admin/pricing-items",
  services: "/api/admin/services",
};

export async function GET(request: NextRequest) {
  const token = (await cookies()).get(CMS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type") ?? "";
  const path = ENDPOINTS[type];
  if (!path) return NextResponse.json({ error: "unknown type" }, { status: 400 });

  const res = await fetch(`${CMS_API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  // Normalize paginated ({items}) vs plain-array responses to a flat array.
  const items = Array.isArray(data) ? data : (data?.items ?? []);
  return NextResponse.json(items, { status: res.ok ? 200 : res.status });
}
