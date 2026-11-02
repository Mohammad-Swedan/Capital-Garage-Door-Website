/**
 * /emergency-garage-door-repairs-perth — Nov-2026 click-through fix E7 (description ONLY).
 *
 * Why (docs/seo/serp-pulls-2026-11-01.md): the page sits at 6.5 for "urgent garage door repair"
 * (130 impressions, 0 clicks), 12.9 for "24 hour garage door repair" (350, 0) and 15.3 for
 * "after hours garage door repair" (144, 0). Its title was set by the 2026-09-30 CTR pass
 * ("Emergency Garage Door Repairs Perth | 24 Hour Call-Outs") and is pinned by
 * ctr-titles-2026-10.ts + ctr-titles.test.ts, so the title is NOT touched (4–6-week rule). The
 * description is the one lever left: it did not say "urgent", "24 hour" or "after hours".
 *
 * Dry run by default; CMS_API_URL is REQUIRED:
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/emergency-description.ts [--apply]
 */

import { guardCopy, runEnhancement, setSeo } from "./cms";

export {};

const TARGET_SLUG = "emergency-garage-door-repairs-perth";

export const EMERGENCY_SEO = {
  description:
    "Urgent garage door repair in Perth, 24 hours: door stuck open, jammed shut or off its track? After-hours call-outs, same-day repairs, price agreed first.",
};

guardCopy({}, EMERGENCY_SEO);

runEnhancement({
  name: "emergency page description (E7)",
  slug: TARGET_SLUG,
  templateType: "ServicePage",
  plan: (page) => {
    const notes: string[] = [];
    setSeo(page, EMERGENCY_SEO, notes);
    return notes;
  },
}).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
