import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/data/articles";
import { getCaseStudies } from "@/lib/data/case-studies";
import { getServicePages } from "@/lib/data/service-pages";
import { getProblems } from "@/lib/data/problems";
import { getGalleryItems } from "@/lib/data/gallery";

/**
 * Google image sitemap (`/image-sitemap.xml`).
 *
 * Lists the hero / featured / gallery images for the site's content pages using
 * the `image` sitemap extension (one `<url>` per page, with nested
 * `<image:image>` entries). Image discovery is a real ranking input for Google
 * Images and helps AI answer engines attach visuals to answers. Listed in
 * robots.txt as a sitemap so crawlers find it.
 */
export const revalidate = 3600;

interface PageImages {
  /** Page URL (absolute). */
  loc: string;
  images: Array<{ url: string; title?: string; caption?: string }>;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Resolve a possibly-relative image/page path to an absolute URL; pass through external CDN URLs. */
function abs(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, siteConfig.url).toString();
}

export async function GET() {
  const [articles, caseStudies, servicePages, problems, gallery] = await Promise.all([
    getArticles(),
    getCaseStudies(),
    getServicePages(),
    getProblems(),
    getGalleryItems(),
  ]);

  const pages: PageImages[] = [];

  for (const a of articles) {
    if (a.featuredImage) {
      pages.push({
        loc: abs(`/blog/${a.slug}`),
        images: [{ url: abs(a.featuredImage), title: a.title, caption: a.featuredImageAlt }],
      });
    }
  }

  for (const cs of caseStudies) {
    const images = (cs.images ?? [])
      .filter((img) => img.src)
      .map((img) => ({ url: abs(img.src), title: cs.title, caption: img.caption || img.alt }));
    if (images.length > 0) pages.push({ loc: abs(`/case-studies/${cs.slug}`), images });
  }

  for (const sp of servicePages) {
    if (sp.hero?.image) {
      pages.push({
        loc: abs(`/${sp.slug}`),
        images: [{ url: abs(sp.hero.image), title: sp.serviceName, caption: sp.hero.imageAlt }],
      });
    }
  }

  for (const p of problems) {
    if (p.heroImage) {
      pages.push({
        loc: abs(`/problems/${p.slug}`),
        images: [{ url: abs(p.heroImage), title: p.name }],
      });
    }
  }

  // All gallery images are surfaced on the /gallery page.
  const galleryImages = gallery
    .filter((g) => g.image)
    .map((g) => ({ url: abs(g.image), title: g.title || undefined, caption: g.alt || undefined }));
  if (galleryImages.length > 0) pages.push({ loc: abs("/gallery"), images: galleryImages });

  const urlsXml = pages
    .map((page) => {
      const imgs = page.images
        .filter((img) => img.url)
        .map((img) =>
          [
            "    <image:image>",
            `      <image:loc>${escapeXml(img.url)}</image:loc>`,
            img.title ? `      <image:title>${escapeXml(img.title)}</image:title>` : "",
            img.caption ? `      <image:caption>${escapeXml(img.caption)}</image:caption>` : "",
            "    </image:image>",
          ]
            .filter(Boolean)
            .join("\n"),
        )
        .join("\n");
      return `  <url>\n    <loc>${escapeXml(page.loc)}</loc>\n${imgs}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXml}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
