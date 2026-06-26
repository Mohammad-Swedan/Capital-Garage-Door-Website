import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
