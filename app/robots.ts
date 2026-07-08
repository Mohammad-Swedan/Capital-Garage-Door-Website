import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /lp/* is deliberately NOT disallowed: those paid landing pages are noindex, and a
      // crawler can only see a noindex directive on URLs it is allowed to fetch — disallowing
      // them here could leave externally-linked LPs "indexed, though blocked". They are also
      // excluded from the sitemap, so they are never advertised.
      disallow: ["/admin", "/api"],
    },
    sitemap: [`${siteConfig.url}/sitemap.xml`, `${siteConfig.url}/image-sitemap.xml`],
    // No `host` directive: it was a Yandex-only extension deprecated in 2018
    // and gets flagged as an invalid robots.txt line by auditing tools.
  };
}
