import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidVisitorId, VISITOR_COOKIE } from "@/lib/visitor";

/**
 * Issues the first-party visitor id (`cgd_vid`) that source tracking uses to
 * connect a visitor's later visits to their first one (Google Ads click on
 * Monday, direct call on Thursday).
 *
 * ## Why the server sets it
 *
 * A cookie written from `document.cookie` is capped at 7 days by Safari's
 * Intelligent Tracking Prevention, which would cut exactly the multi-visit
 * journeys worth measuring — people research, then call when the door fails.
 * A cookie set in a `Set-Cookie` response header is not subject to that cap,
 * and this file is the only place that sees every page request.
 *
 * ## Why it is httpOnly
 *
 * Only the server reads it: the module's events route
 * (app/api/source-tracking/events) takes the visitor id from the request's
 * Cookie header, never from the browser payload. No script on the page needs
 * it, so script cannot read it.
 *
 * ## Why it only writes when missing
 *
 * A `Set-Cookie` on every response would make every HTML response uncacheable.
 * Writing only on the first visit leaves the overwhelming majority of requests
 * untouched.
 */

/** 400 days — the longest lifetime browsers honour for a server-set cookie. */
export const VISITOR_MAX_AGE_SECONDS = 400 * 24 * 60 * 60;

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (isValidVisitorId(request.cookies.get(VISITOR_COOKIE)?.value)) return response;

  response.cookies.set({
    name: VISITOR_COOKIE,
    value: crypto.randomUUID(),
    path: "/",
    maxAge: VISITOR_MAX_AGE_SECONDS,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Every page request, excluding:
     * - api            — route handlers read the cookie off the request itself
     * - admin          — the CMS dashboard is staff, not a lead source
     * - _next/static, _next/image — assets
     * - the generated metadata files crawlers fetch
     * - anything with a file extension (images, fonts, .xml, .txt, …)
     */
    "/((?!api|admin|_next/static|_next/image|favicon.ico|sitemap.xml|image-sitemap.xml|robots.txt|manifest.webmanifest|llms.txt|feed.xml|.*\\..*).*)",
  ],
};
