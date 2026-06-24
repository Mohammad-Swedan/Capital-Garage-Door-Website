import { caseStudies } from "@/content/case-studies";
import type { CaseStudyPage } from "@/types/case-study";

/**
 * Data-access layer for case-study pages. Reads from local content now;
 * swap the implementation for a CRM/API call later without changing call
 * sites.
 */
export async function getCaseStudies(): Promise<CaseStudyPage[]> {
  return caseStudies;
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyPage | undefined> {
  return caseStudies.find((page) => page.slug === slug);
}

export async function getCaseStudySlugs(): Promise<string[]> {
  return caseStudies.map((page) => page.slug);
}
