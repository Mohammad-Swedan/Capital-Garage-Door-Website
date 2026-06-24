import { problems } from "@/content/problems";
import type { Problem } from "@/types";

/**
 * Data-access layer for problem pages. Reads from local content now; swap the
 * implementation for an API/DB call later without changing call sites.
 */
export async function getProblems(): Promise<Problem[]> {
  return problems;
}

export async function getProblemBySlug(slug: string): Promise<Problem | undefined> {
  return problems.find((problem) => problem.slug === slug);
}

export async function getProblemSlugs(): Promise<string[]> {
  return problems.map((problem) => problem.slug);
}
