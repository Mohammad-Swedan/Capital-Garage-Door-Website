import { landingPages } from "@/content/landing-pages";
import type { LandingPage } from "@/types/landing-page";

/**
 * Data-access layer for Google Ads / paid landing pages (/lp/[slug]). Reads
 * from local content now; swap the implementation for an API/CMS call later
 * without changing call sites.
 */
export async function getLandingPages(): Promise<LandingPage[]> {
  return landingPages;
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | undefined> {
  return landingPages.find((page) => page.slug === slug);
}

export async function getLandingPageSlugs(): Promise<string[]> {
  return landingPages.map((page) => page.slug);
}
