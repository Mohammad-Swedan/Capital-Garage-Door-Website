import type { CaseStudyPage } from "@/types/case-study";

/**
 * Local fallback registry of case-study pages (used only when the CMS is off /
 * unreachable). The live source of truth is the CMS: the real case studies were
 * created by scripts/import-case-studies-from-jobs.ts (with real Bunny CDN
 * photos) and the original placeholder-image entries were deleted. This array is
 * intentionally empty — regenerate it from the importer MANIFEST if an offline
 * fallback is ever needed. Adding a new CMS case study needs no change here.
 */
export const caseStudies: CaseStudyPage[] = [];
