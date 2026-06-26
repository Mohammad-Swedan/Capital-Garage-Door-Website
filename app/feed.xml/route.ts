import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/data/articles";
import type { Article } from "@/types/article";

/**
 * RSS 2.0 feed for the blog (`/feed.xml`).
 *
 * Lists published articles newest-first with title, link, pubDate, description
 * (and an `atom:link rel="self"` for validators). Served as a cached route
 * handler so it revalidates on the same cadence as the rest of the site.
 */
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function abs(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

function itemXml(article: Article): string {
  const link = abs(`/blog/${article.slug}`);
  const pubDateSource = article.publishedAt || article.updatedAt;
  const pubDate = pubDateSource ? new Date(pubDateSource).toUTCString() : new Date().toUTCString();
  const description = article.excerpt || article.shortAnswer || article.seo.description || "";
  return [
    "    <item>",
    `      <title>${escapeXml(article.title)}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `      <pubDate>${pubDate}</pubDate>`,
    article.category ? `      <category>${escapeXml(article.category)}</category>` : "",
    article.author ? `      <dc:creator>${escapeXml(article.author)}</dc:creator>` : "",
    `      <description>${escapeXml(description)}</description>`,
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET() {
  const articles = await getArticles();
  const feedUrl = abs("/feed.xml");
  const blogUrl = abs("/blog");
  const lastBuildDate = (
    articles[0]?.updatedAt || articles[0]?.publishedAt
      ? new Date(articles[0].updatedAt || articles[0].publishedAt)
      : new Date()
  ).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${siteConfig.name} Blog`)}</title>
    <link>${escapeXml(blogUrl)}</link>
    <description>${escapeXml(
      "Garage door maintenance, repair, motor, and cost guides for Perth homeowners.",
    )}</description>
    <language>en-AU</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${articles.map(itemXml).join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
