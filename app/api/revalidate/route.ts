import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * On-demand revalidation webhook. The ASP.NET CMS POSTs here after a publish/unpublish so the
 * affected page goes live within seconds without a rebuild (docs/cms-architecture.md §8).
 * Protected by a shared secret header. `revalidatePath` purges both the route and data cache for
 * the path, so the next request re-runs the page and re-fetches the CMS resolve payload.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { routeGroup?: string; slug?: string; path?: string }
    | null;

  if (!body?.path || typeof body.path !== "string") {
    return NextResponse.json({ error: "A 'path' is required." }, { status: 400 });
  }

  revalidatePath(body.path);
  // Keep the sitemap in sync (slug list changes when pages are published/unpublished).
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ revalidated: true, path: body.path, now: Date.now() });
}
