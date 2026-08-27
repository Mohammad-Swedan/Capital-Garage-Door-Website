import type { BrandEntity } from "@/types/brand";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whole-word, case-insensitive pattern over `matchTerms` (else name + aliases). */
export function brandPattern(entity: BrandEntity): RegExp {
  const terms = entity.matchTerms ?? [entity.name, ...(entity.aliases ?? [])];
  const alternatives = terms.map((t) => escape(t).replace(/\s+/g, "\\s+"));
  return new RegExp(`(?:^|[^a-z0-9])(?:${alternatives.join("|")})(?![a-z0-9])`, "i");
}

export function textMentionsBrand(text: string, entity: BrandEntity): boolean {
  return brandPattern(entity).test(text);
}
