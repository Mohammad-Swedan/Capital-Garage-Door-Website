/**
 * Read-only audit: which CMS case studies mention which brand (and would surface in that brand
 * page's "Recent work"), and which case studies mention no brand at all — scan the latter's
 * partsUsed/titles for product-line names the matcher misses (candidates for matchTerms
 * enrichment or hand-picked caseStudySlugs).
 *
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/audit-brand-case-studies.ts
 */
import { getCaseStudies } from "../lib/data/case-studies";
import { BRAND_ENTITIES } from "../content/brands/entities";
import { textMentionsBrand } from "../lib/brands/match";
import { caseStudySearchText, hasRealPhoto } from "../lib/brands/case-study-pick";

(async () => {
  const all = await getCaseStudies();
  console.log(`${all.length} case studies (${all.filter(hasRealPhoto).length} with a real photo)\n`);

  const matchedSlugs = new Set<string>();
  for (const entity of BRAND_ENTITIES) {
    const hits = all.filter((cs) => textMentionsBrand(caseStudySearchText(cs), entity));
    if (hits.length === 0) continue;
    console.log(`## ${entity.name} (${entity.slug})`);
    for (const cs of hits) {
      matchedSlugs.add(cs.slug);
      console.log(`  - ${cs.slug} ${hasRealPhoto(cs) ? "[photo]" : "[NO PHOTO]"} — ${cs.title}`);
    }
  }

  console.log(`\n## Case studies with NO brand match (scan for missed product lines)`);
  for (const cs of all) {
    if (matchedSlugs.has(cs.slug)) continue;
    const parts = cs.partsUsed.length ? ` | parts: ${cs.partsUsed.join("; ")}` : "";
    console.log(`  - ${cs.slug} ${hasRealPhoto(cs) ? "[photo]" : "[NO PHOTO]"} — ${cs.title}${parts}`);
  }
})();
