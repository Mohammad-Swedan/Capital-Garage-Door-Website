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
    ];
  },
};

export default nextConfig;
