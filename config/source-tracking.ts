/**
 * INSTANCE FILE — Capital Garage Doors values for the source-tracking module
 * (website/modules/source-tracking). Created by scripts/module-sync.mjs from
 * modules/source-tracking/templates on 2026-10-11 (module v1.2.0) and
 * never overwritten by it; the module reads its configuration from here only.
 *
 * Env vars read by the module's server route (not configured here):
 *   CRM_API_URL           — CRM API base, e.g. https://…/api (falls back to crmApiFallbackUrl)
 *   TRACKING_PROXY_SECRET — shared secret sent as x-tracking-secret
 */
import { defineSourceTrackingConfig, type PageGroupRules } from "@/modules/source-tracking/config";
import { VISITOR_COOKIE } from "@/lib/visitor";
import pageGroupsJson from "./source-tracking.page-groups.json";

export const sourceTrackingConfig = defineSourceTrackingConfig({
  enabled: true,
  // The 400-day first-party visitor cookie proxy.ts issues ("cgd_vid", httpOnly;
  // read server-side by the events route only).
  visitorCookie: VISITOR_COOKIE,
  sessionCookie: "cgd_sid",
  sessionTimeoutMinutes: 30,
  // Every Google Ads final URL lands under /lp.
  landingPagePrefixes: ["/lp"],
  // JSON imports widen string literals; the rules are validated at runtime by defineSourceTrackingConfig.
  pageGroups: pageGroupsJson as PageGroupRules,
  // Dev only (production sets CRM_API_URL in deploy.yml). The booking API's
  // Program.cs listens on 5001 (HTTP) and 6001 (HTTPS) whatever the launch
  // profile says, and redirects HTTP to HTTPS, so the fallback is HTTPS — the
  // same base the booking app's dev config names. Node's fetch rejects the
  // self-signed ASP.NET dev cert: export it (dotnet dev-certs https -ep dev.crt
  // --format PEM) and start `next dev` with NODE_EXTRA_CA_CERTS=dev.crt, or
  // events are dropped in dev.
  crmApiFallbackUrl: "https://localhost:6001/api",
  // A CMS dashboard mounted in the same app is staff traffic, not a lead source.
  excludePathPrefixes: ["/admin"],
  // Set to true ONLY when the site is served through Cloudflare (orange-cloud):
  // cf-connecting-ip is then the visitor's real address. Anywhere else the
  // header is client-settable and the right-most x-forwarded-for hop is used.
  // capitalgaragedoors.com.au is proxied by Cloudflare (Oct 2026: responses carry
  // `server: cloudflare` + `cf-ray`) in front of the VPS's nginx, so the
  // right-most x-forwarded-for hop would be a Cloudflare edge address shared by
  // many visitors. Set back to false if the site ever stops going through
  // Cloudflare. (Hardening: nginx should accept origin traffic from
  // Cloudflare's ranges only, so the header cannot be forged by a direct hit.)
  trustCloudflareIpHeader: true,
  debug: false,
});
