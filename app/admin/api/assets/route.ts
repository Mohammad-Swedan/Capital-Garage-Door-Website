import { NextResponse, type NextRequest } from "next/server";
import { adminRequest, isAuthenticated } from "@/lib/cms/admin";

export const dynamic = "force-dynamic";

/**
 * Client-callable proxy for the asset library, used by the editor's Asset Picker
 * "Library" tab. `adminRequest` is server-only (it attaches the httpOnly JWT), so
 * the client cannot hit `GET /api/admin/assets` directly — this thin route forwards
 * the (optional) search query and returns the asset list. Mirrors the existing
 * `app/admin/api/upload` proxy pattern.
 */
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  qs.set("pageSize", "60");

  const res = await adminRequest<unknown>(`/api/admin/assets?${qs.toString()}`);
  if (!res.ok) {
    return NextResponse.json({ error: "failed", items: [] }, { status: res.status });
  }
  return NextResponse.json(res.data ?? { items: [] });
}
