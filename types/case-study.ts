import type { FAQ, LocalLink } from "@/types";

export interface CaseStudyImage {
  src: string;
  alt: string;
  caption: string;
}

export interface CaseStudyDetailBlock {
  intro: string;
  points: string[];
}

export interface CaseStudyPageSeo {
  title: string;
  description: string;
}

export interface CaseStudySummary {
  problem: string;
  diagnosis: string;
  solution: string;
}

/**
 * Drives /case-studies/{slug} local-proof pages. All copy lives in the
 * content layer (content/case-studies/) so new completed jobs are data
 * entries, not new components — designed to later be populated from a CRM
 * job export rather than hand-authored.
 */
export interface CaseStudyPage {
  slug: string;
  pageType: "case-study";
  title: string;
  subtitle: string;
  service: string;
  suburb: string;
  doorType: string;
  jobType: string;
  result: string;
  summary: CaseStudySummary;
  problem: CaseStudyDetailBlock;
  diagnosis: CaseStudyDetailBlock;
  solution: CaseStudyDetailBlock;
  images: CaseStudyImage[];
  partsUsed: string[];
  relatedServices: LocalLink[];
  faqs: FAQ[];
  seo: CaseStudyPageSeo;
  updatedAt: string;
}
