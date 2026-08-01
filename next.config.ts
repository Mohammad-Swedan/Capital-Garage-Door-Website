import type { NextConfig } from "next";

// Docker/self-hosted builds run the emitted standalone server (server.js).
// Gated so the Netlify standby build keeps its default output untouched.
const isDockerBuild = process.env.DOCKER_BUILD === "1";

const nextConfig: NextConfig = {
  ...(isDockerBuild
    ? {
        output: "standalone" as const,
        // sharp powers production image optimization; force its platform
        // binaries into the .next/standalone trace (Next docs' own pattern).
        outputFileTracingIncludes: { "/*": ["node_modules/sharp/**/*"] },
      }
    : {}),
  // Don't advertise the stack (X-Powered-By: Next.js) — flagged in a security-header audit.
  poweredByHeader: false,
  // Baseline security headers, set at the origin so they survive any CDN/proxy
  // in front (Cloudflare passes origin headers through). A technical-SEO audit
  // found the site served ZERO security headers. CSP is deliberately not set
  // yet — it needs a full inline-script/style inventory first (add it in
  // Report-Only mode when ready).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), camera=(), microphone=()" },
        ],
      },
      {
        // /public marketing assets (van hero, map, logos, social icons) aren't
        // covered by _next/static's immutable caching — give them a sensible
        // edge/browser TTL instead of revalidating every request.
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
  // Lets the dev server's HMR websocket succeed when loading it from a phone
  // over LAN (e.g. http://10.102.77.150:3000) instead of localhost. Without
  // this, every reconnect attempt fails and retries indefinitely, burning
  // CPU/network on the device for the life of the page.
  allowedDevOrigins: ["10.53.254.150"],
  // Inline the (small, atomic Tailwind) CSS into the HTML <head> so the browser
  // can render without first round-tripping for render-blocking stylesheets.
  // Production-only; has no effect in `next dev`.
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Service tiles sit under dark gradients, so they tolerate heavier
    // compression; 75 stays available for everything else. Next 16 requires
    // every `quality` prop value to be allow-listed here.
    qualities: [60, 75],
    // CMS-hosted images: the API serves uploads locally now; the Bunny.net CDN
    // pull-zone host is added here in Milestone 4.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "5179" },
      { protocol: "https", hostname: "jadara-hub.b-cdn.net" }, // Bunny.net CDN pull-zone
    ],
  },
  async redirects() {
    return [
      {
        source: "/request-quote",
        destination: "/contact",
        permanent: true,
      },
      // Old /services/{slug} detail links never had a route — redirect each
      // to its flat canonical SEO page so old links/bookmarks don't 404.
      {
        source: "/services/garage-door-repair",
        destination: "/garage-door-repairs-perth",
        permanent: true,
      },
      {
        source: "/services/garage-door-installation",
        destination: "/garage-door-repairs-perth",
        permanent: true,
      },
      {
        source: "/services/spring-repair",
        destination: "/garage-door-repairs-perth",
        permanent: true,
      },
      {
        source: "/services/garage-door-opener-repair",
        destination: "/garage-door-repairs-perth",
        permanent: true,
      },
      {
        source: "/services/emergency-garage-door-service",
        destination: "/garage-door-repairs-perth",
        permanent: true,
      },
      {
        source: "/services/garage-door-maintenance",
        destination: "/garage-door-repairs-perth",
        permanent: true,
      },
      // ---------------------------------------------------------------------
      // Legacy pre-rebuild top-level URLs (old site, pre 2026-07-06).
      // The 2026-07-24 GSC export shows these still pulling ~3,800 impressions
      // a quarter while returning 404 — /services/garage-doors alone is the
      // site's #2 URL by impressions (2,322), and /book-an-appointment holds
      // the best average position on the whole domain (7.35). 301 each to its
      // closest live equivalent so the equity lands somewhere instead of dying.
      // ---------------------------------------------------------------------
      {
        // Retargeted 2026-08-02. This URL is still the #4 URL site-wide by
        // impressions (1,525 in the 28 days to 08-01, avg position 52.5) and it
        // still ranks for roller doors perth (29.4), residential garage doors
        // perth (31.1) and sectional garage doors perth (35.3) — in several
        // cases ABOVE the real pages. It was pointing at /services, a listing
        // hub that only manages 252 impressions itself, so a product-intent URL
        // was handing its equity to a nav page. /garage-doors-perth is the
        // matching product hub built for exactly that cluster.
        source: "/services/garage-doors",
        destination: "/garage-doors-perth",
        permanent: true,
      },
      {
        source: "/emergency-service",
        destination: "/emergency-garage-door-repairs-perth",
        permanent: true,
      },
      {
        source: "/new-installations",
        destination: "/garage-door-installation-perth",
        permanent: true,
      },
      {
        source: "/commercial-services",
        destination: "/commercial-garage-doors-perth",
        permanent: true,
      },
      {
        source: "/maintenance-service",
        destination: "/garage-door-maintenance-perth",
        permanent: true,
      },
      {
        source: "/book-an-appointment",
        destination: "/contact",
        permanent: true,
      },
      {
        // Distinct from the /request-quote rule above — this is the old site's
        // URL. The trailing-slash variant needs no rule of its own: with the
        // default `trailingSlash: false`, Next 308s /request-a-quote/ to
        // /request-a-quote first, and this rule then fires.
        source: "/request-a-quote",
        destination: "/contact",
        permanent: true,
      },
      {
        // Duplicate content: `garage-door-motor-replacement-cost-perth` exists
        // in BOTH the `flat` and `blog` CMS route groups. Google indexed the
        // blog copy (90 impressions, pos 19) and ignored the flat one (zero),
        // but the blog copy quotes $450–$1,200 for a motor replacement and
        // $150–$450 for a repair — the real price list (pricing-data.ts /
        // CMS PricingItems) says $770–$990 and $380–$490, and the flat
        // cost-guide page is pinned to it. Keep the accurate page, which also
        // matches the rest of the cost-guide family at the top level, and
        // point the blog URL at it. The blog copy is unpublished in the CMS so
        // it leaves the sitemap.
        source: "/blog/garage-door-motor-replacement-cost-perth",
        destination: "/garage-door-motor-replacement-cost-perth",
        permanent: true,
      },
      // Three placeholder case studies removed in 1842de8 — they still hold
      // indexed impressions, so point each at the real job in the same suburb
      // rather than letting them 404.
      {
        source: "/case-studies/sectional-door-installation-fremantle",
        destination: "/case-studies/garage-door-cable-drum-repair-fremantle-perth",
        permanent: true,
      },
      {
        source: "/case-studies/garage-door-motor-replacement-joondalup",
        destination: "/case-studies/garage-door-motor-installation-ellenbrook-perth",
        permanent: true,
      },
      {
        source: "/case-studies/roller-door-repair-canning-vale",
        destination: "/case-studies/emergency-sectional-door-repair-canning-vale-perth",
        permanent: true,
      },
      // Legacy pre-rebuild blog URLs. The old site used a /blogs/<slug> (plural)
      // path; this build only has /blog/<slug>. GSC still has some of these
      // indexed and ranking (e.g. /blogs/garage-door-repair-costs-perth was
      // pulling the whole cost-query cluster before it started 404ing), so 301
      // them to the matching live page to transfer the equity instead of losing
      // it. Specific rules MUST precede the catch-all — Next matches in order.
      {
        source: "/blogs/garage-door-repair-costs-perth",
        destination: "/garage-door-repair-cost-perth",
        permanent: true,
      },
      {
        // Singular-prefix variant of the same dead URL — also 404s today.
        source: "/blog/garage-door-repair-costs-perth",
        destination: "/garage-door-repair-cost-perth",
        permanent: true,
      },
      {
        // Any other legacy /blogs/* URL → the same slug under the live /blog hub.
        source: "/blogs/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
