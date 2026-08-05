import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * On-demand revalidation webhook. The ASP.NET CMS POSTs here after any page mutation that changes
 * what the public site serves — create-as-published, update (both hrefs on a slug rename), publish,
 * unpublish, delete — so the change goes live within seconds without a rebuild
 * (docs/cms-architecture.md §8). Protected by a shared secret header.
 *
 * Beyond the page path itself, this expires the shared `cms-sitemap` fetch tag (one Data Cache
 * entry feeding app/sitemap.ts AND every get…Slugs()), the page's own resolve tag, and the
 * discovery surfaces (sitemap / image sitemap / RSS feed) plus the listing page(s) for the route
 * group — so a published page appears everywhere at once and a deleted one vanishes everywhere.
 */

/** Listing pages rendered from each route group's page set (keys = backend `ToRouteKey()`). */
const LISTINGS_BY_ROUTE_GROUP: Record<string, string[]> = {
  blog: ["/blog"],
  // "/" — the home page's "Recent work" section shows the newest case studies
  // (getRecentCaseStudies), so a new job page must refresh the home page too.
  "case-studies": ["/case-studies", "/"],
  problems: ["/problems"],
  // "flat" spans ServicePage/ComparisonPage/CostGuidePage/ServiceSuburbPage templates — the
  // payload doesn't say which, so refresh all three flat listings.
  flat: ["/services", "/cost-guides", "/service-areas"],
  lp: [], // noindex paid pages — no public listing
};

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

  const routeGroup = typeof body.routeGroup === "string" ? body.routeGroup : null;
  const slug = typeof body.slug === "string" ? body.slug : null;

  // The affected page route (the CMS calls once per affected href — twice on a slug rename).
  revalidatePath(body.path);

  // Expire the shared CMS fetch caches so the very next request refetches from the CMS.
  // Next 16 requires the two-arg form; { expire: 0 } = immediate expiry (the docs' webhook pattern).
  revalidateTag("cms-sitemap", { expire: 0 });
  if (routeGroup && slug) {
    revalidateTag(`cms-page:${routeGroup}:${slug}`, { expire: 0 });
  }

  // Discovery surfaces re-render on their next fetch.
  revalidatePath("/sitemap.xml");
  revalidatePath("/image-sitemap.xml");
  revalidatePath("/feed.xml");

  // Listing page(s) whose grids include this route group's pages.
  const listings = routeGroup ? (LISTINGS_BY_ROUTE_GROUP[routeGroup] ?? []) : [];
  for (const listing of listings) revalidatePath(listing);

  return NextResponse.json({
    revalidated: true,
    path: body.path,
    routeGroup,
    slug,
    listings,
    now: Date.now(),
  });
}
