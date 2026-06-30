import { NextResponse, type NextRequest } from "next/server";
import { adminRequest, isAuthenticated } from "@/lib/cms/admin";

export const dynamic = "force-dynamic";

/**
 * Client-callable proxy for the media library, used by the editor's Asset Picker.
 * `adminRequest` is server-only (it attaches the httpOnly JWT), so the client cannot hit
 * `GET /api/admin/assets` directly — this thin route forwards the paging/filter query and returns
 * the full `PaginatedList` envelope (`{ items, pageNumber, pageSize, totalCount, totalPages }`).
 */
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const qs = new URLSearchParams();
  const search = sp.get("search");
  if (search) qs.set("search", search);
  const category = sp.get("category");
  if (category) qs.set("category", category);
  const pageNumber = sp.get("pageNumber");
  if (pageNumber) qs.set("pageNumber", pageNumber);
  qs.set("pageSize", sp.get("pageSize") ?? "40");

  const res = await adminRequest<unknown>(`/api/admin/assets?${qs.toString()}`);
  if (!res.ok) {
    return NextResponse.json({ error: "failed", items: [] }, { status: res.status });
  }
  return NextResponse.json(res.data ?? { items: [] });
}
