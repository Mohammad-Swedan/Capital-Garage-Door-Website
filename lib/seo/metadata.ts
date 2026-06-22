import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

/** Builds a Metadata object with site-wide defaults applied. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex,
}: BuildMetadataOptions): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const ogImage = image ?? siteConfig.ogImage;

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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
