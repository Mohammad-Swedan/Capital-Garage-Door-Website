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
  const ogImage = image ?? siteConfig.ogImage;

  // Use the "article" OG type only when we actually have freshness dates to
  // attach (article:modified_time / published_time are only valid on og:type=article).
  const hasDates = Boolean(lastModified || publishedTime);

  return {
    title,
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
      images: [{ url: ogImage }],
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
      images: [ogImage],
    },
    ...(lastModified ? { other: { "last-modified": lastModified } } : {}),
  };
}
