/**
 * /garage-door-cable-repair-perth — "cable replacement" + Centurion enhancement (2026-11-16, idempotent).
 *
 * Why: the owner asked for "Centurion garage door cable replacement" and "cable replacement" pages.
 * Keyword Planner (2026-11-16): "garage door cable replacement" 110/mo AU (20/mo Perth, top bid
 * $19–$24); "centurion garage door cable replacement" has no figure, so it is covered here and on
 * the Centurion brand page rather than as its own URL. GSC 90 days: "garage door cable replacement
 * cost" 36 impressions @ 3.3 lands on the repair-cost guide; the cable page (published 2026-11-02)
 * holds "garage door cable repair" @ 17.5.
 *
 * The title is NOT changed (the page is two weeks old). What it does (one PUT, safe to re-run):
 *  1. seoDescription → leads with "cable repair & replacement" (≤160 code points).
 *  2. Appends ONE paragraph on cable replacement by door brand, naming Centurion (PARA_MARKER guard).
 *  3. Appends 2 FAQs (Centurion cables; how long a cable replacement takes) — price-free.
 *  4. Appends a RelatedServices link to /centurion-garage-doors-perth (live, plain 200 checked).
 * The same copy is mirrored in content/service-pages/garage-door-cable-repair-perth.ts (fallback).
 *
 * Dry run by default; CMS_API_URL is REQUIRED:
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/cable-page-replacement.ts
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/cable-page-replacement.ts --apply
 */

import { appendFaqs, appendIntroParagraph, appendRelatedLinks, guardCopy, isLive200, runEnhancement, setSeo } from "./cms";

export {};

const TARGET_SLUG = "garage-door-cable-repair-perth";
const CENTURION_HREF = "/centurion-garage-doors-perth";

export const CABLE_SEO = {
  description:
    "Garage door cable repair & replacement across Perth: snapped, frayed or off-drum cables replaced in pairs on Centurion, B&D, Steel-Line & more. Open 24/7.",
};

export const CABLE_PARA_MARKER = "Cable replacement is the same job on every brand";
export const CABLE_PARAGRAPH =
  "Cable replacement is the same job on every brand of sectional door, but the parts are not interchangeable. Centurion, B&D, Steel-Line, Gliderol and Taurean doors each use cables cut to the door's height and drums matched to its spring system, so we fit cables of the right length and rating for your door rather than a universal kit, replace them as a pair, re-seat both on the drums and re-tension the springs so the door lifts level. Centurion doors in particular are common across Perth, built in Wangara since 1976, and their cables are a routine replacement for us.";

export const CABLE_FAQS: { question: string; answer: string }[] = [
  {
    question: "Do you replace cables on Centurion garage doors?",
    answer:
      "Yes. Centurion sectional doors are among the most common in Perth and their lift cables wear the same way as any other brand's: fraying at the bottom bracket, rust near the coast, or slipping off the drum when the door closes on something. We replace both cables with ones cut to the door's height, re-seat them on the drums and re-tension the springs, whoever installed the door.",
  },
  {
    question: "How long does a garage door cable replacement take?",
    answer:
      "Most cable replacements are finished in a single visit, including re-tensioning the springs and testing the door through its full travel. It takes longer when the door has dropped crooked and jammed in the tracks, or when a bottom bracket or drum is damaged as well, because those are straightened or replaced before the new cables go on.",
  },
];

const NEW_RELATED = [{ label: "Centurion Garage Door Repairs Perth", href: CENTURION_HREF }];

guardCopy({ CABLE_PARAGRAPH, CABLE_FAQS }, CABLE_SEO);

runEnhancement({
  name: "cable page (replacement + Centurion)",
  slug: TARGET_SLUG,
  templateType: "ServicePage",
  plan: async (page) => {
    const notes: string[] = [];
    setSeo(page, CABLE_SEO, notes);
    appendIntroParagraph(page, CABLE_PARA_MARKER, CABLE_PARAGRAPH, notes);
    appendFaqs(page, CABLE_FAQS, notes);
    if (await isLive200(CENTURION_HREF)) appendRelatedLinks(page, NEW_RELATED, notes);
    else console.log(`  - ${CENTURION_HREF} did not return a plain 200 — link skipped`);
    return notes;
  },
}).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
