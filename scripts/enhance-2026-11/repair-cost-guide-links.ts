/**
 * /garage-door-repair-cost-perth — Nov-2026 enhancement E8 (links ONLY; idempotent).
 *
 * Why (docs/seo/serp-pulls-2026-11-01.md): replacement-cost intent is split — "garage door
 * replacement cost" 830 impressions @ 16.3 on the HOME page and "garage door replacement cost
 * perth" 413 @ 36.5 on THIS guide, while the installation-cost guide (whose H2s cover
 * replacement) owns the topic. An exact-anchor link from here to that guide, plus the new
 * cable-repair page once it is published, hands the intent to the right page. The title was set
 * by the 2026-09-30 CTR pass and is pinned by ctr-titles.test.ts, so nothing else changes.
 *
 * Dry run by default; CMS_API_URL is REQUIRED:
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/repair-cost-guide-links.ts [--apply]
 */

import { appendRelatedLinks, isLive200, runEnhancement } from "./cms";

export {};

const TARGET_SLUG = "garage-door-repair-cost-perth";

const LINKS_NOW = [{ label: "Garage door replacement cost", href: "/garage-door-installation-cost-perth" }];
const LINKS_WHEN_LIVE = [{ label: "Garage Door Cable Repair Perth", href: "/garage-door-cable-repair-perth" }];

runEnhancement({
  name: "repair-cost guide links (E8)",
  slug: TARGET_SLUG,
  templateType: "CostGuidePage",
  plan: async (page) => {
    const notes: string[] = [];
    appendRelatedLinks(page, LINKS_NOW, notes);
    for (const l of LINKS_WHEN_LIVE) {
      if (await isLive200(l.href)) appendRelatedLinks(page, [l], notes);
      else if (!page.relatedLinks.some((x) => x.staticHref === l.href)) console.log(`  - ${l.href} is not live yet — skipped; re-run after it is published`);
    }
    return notes;
  },
}).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
