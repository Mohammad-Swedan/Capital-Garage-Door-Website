import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { CMS_TOKEN_COOKIE } from "@/lib/cms/admin";

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:5179";

/** Server-side proxy: forwards a multipart upload to the CMS with the httpOnly JWT attached. */
export async function POST(request: NextRequest) {
  const token = (await cookies()).get(CMS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await request.formData();
  const res = await fetch(`${CMS_API_URL}/api/admin/assets/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
