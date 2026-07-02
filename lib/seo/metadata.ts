import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  /**
   * Optional ISO date the page content was last modified. When supplied it
   * surfaces a freshness signal to crawlers via `og:updated_time` /
   * `article:modified_time` and an `<meta name="last-modified">` tag. Optional
   * and backward compatible — existing call sites are unaffected.
   */
  lastModified?: string;
  /** Optional ISO date the page was first published (sets `article:published_time`). */
  publishedTime?: string;
}

/** Builds a Metadata object with site-wide defaults applied. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex,
  lastModified,
  publishedTime,
}: BuildMetadataOptions): Metadata {
  const url = new URL(path, siteConfig.url).toString();

  // When no page-specific image is supplied we fall back to the known-good
  // default card (public/images/og/default.jpg, 1200×630) and can safely assert
  // its dimensions. Per-page hero/featured images are arbitrary sizes, so we
  // emit alt only and let the platform measure them.
  const usingDefaultImage = !image;
  const ogImageUrl = image ?? siteConfig.ogImage;
  const ogImageObject = {
    url: ogImageUrl,
    alt: title,
    ...(usingDefaultImage ? { width: 1200, height: 630 } : {}),
  };

  // Use the "article" OG type only when we actually have freshness dates to
  // attach (article:modified_time / published_time are only valid on og:type=article).
  const hasDates = Boolean(lastModified || publishedTime);

  // Dev-only authoring guardrail: flag titles/descriptions that overflow the
  // SERP-safe lengths. No runtime behavior change — just a console nudge so new
  // pages self-correct against on-page-seo.md (Category 1).
  if (process.env.NODE_ENV !== "production") {
    if (title.length > 60) {
      console.warn(`[seo] <title> is ${title.length} chars (>60): "${title}" — ${path}`);
    }
    if (description.length > 160) {
      console.warn(
        `[seo] meta description is ${description.length} chars (>160) — ${path}`,
      );
    }
  }

  return {
    // `absolute` opts out of the root `title.template` ("%s | Capital Garage
    // Door"): the page-authored title is already keyword-complete, and appending
    // the brand suffix pushed every content <title> past 60 chars and made
    // og:title differ from <title>. Authors own the full title here.
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [ogImageObject],
      locale: siteConfig.locale,
      ...(hasDates
        ? {
            type: "article",
            ...(publishedTime ? { publishedTime } : {}),
            ...(lastModified ? { modifiedTime: lastModified } : {}),
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImageUrl, alt: title }],
    },
    ...(lastModified ? { other: { "last-modified": lastModified } } : {}),
  };
}
