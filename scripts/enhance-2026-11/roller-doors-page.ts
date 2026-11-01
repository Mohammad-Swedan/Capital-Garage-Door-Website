/**
 * /roller-doors-perth — Nov-2026 enhancement E4 (idempotent).
 *
 * Why (docs/seo/serp-pulls-2026-11-01.md): the page draws 3,690 AU impressions in 90 days for
 * price variants at positions 7–13 with 5 clicks ("roller door prices" 282 @ 13.5, "roller door
 * prices perth" 241 @ 11.2, "garage roller doors perth prices" 155 @ 7.6, "roller door sizes and
 * prices" 90 @ 8.4). PAA: "Can you get a 6m wide roller door?", "How much is a sectional garage
 * door?", repair vs replace; related search "double roller door prices perth".
 *
 * Verified 2026-11-01: the page already pins four catalog rows (new standard door, roller
 * removal & reinstall, commercial/custom door, motor replacement), so the price table is NOT
 * touched. What it does (one PUT, safe to re-run):
 *  1. Appends ONE "sizes and prices" paragraph to data.intro.paragraphs (PARA_MARKER guard).
 *     Service pages render no price tokens, so the paragraph is price-free and points at the
 *     guide-price table and the roller price guide.
 *  2. Appends 2 PAA FAQs (6 m wide door; double roller door price) — price-free.
 *  3. Appends a RelatedServices link to /roller-door-prices-perth ONLY once that URL returns a
 *     plain 200 (it ships with the Day-2 code deploy); until then the link is skipped with a
 *     message and the script is re-run after the deploy.
 *  The title is deliberately unchanged (the page is the incumbent at 7–13 for the price variants;
 *  the 4–6-week check decides whether the product page or the new guide owns "prices").
 *
 * Dry run by default; CMS_API_URL is REQUIRED:
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/roller-doors-page.ts
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/roller-doors-page.ts --apply
 */

import { appendFaqs, appendIntroParagraph, appendRelatedLinks, guardCopy, isLive200, runEnhancement } from "./cms";

export {};

const TARGET_SLUG = "roller-doors-perth";
const GUIDE_HREF = "/roller-door-prices-perth";

const PARA_MARKER = "sizes and prices go together";
const SIZES_PARAGRAPH =
  "Roller door sizes and prices go together. A standard single door for one car is about 2.4 to 3 metres wide and 2.1 to 2.4 metres high and sits toward the lower end of the new-door range in the guide-price table below; a double door for a two-car garage, usually 4.8 to 5.4 metres wide, needs a longer and heavier curtain, a larger drum and stronger springs, so it sits toward the top. Openings beyond a standard double, very tall sheds and commercial premises are made to measure and quoted as custom doors. Our roller door price guide sets out every figure, from a new door and motor to a removal and refit, a spring or a lock.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "Can you get a 6 m wide roller door?",
    answer:
      "Yes. Roller doors are made to the opening, so wide doors for double and triple garages, sheds and commercial premises are common across Perth. Beyond a standard double width the curtain needs a heavier gauge, a larger drum and a wind rating, which is why a six-metre door is quoted as a custom door rather than at the standard rate shown in the table. We measure the opening first and confirm the price in writing before the door is ordered.",
  },
  {
    question: "How much is a double roller door in Perth?",
    answer:
      "Most double roller doors fall within the standard supply-and-install range shown in the guide-price table on this page, higher in that range than a single because the curtain is longer and heavier and needs a bigger drum and stronger springs. Motorising it adds the roller door motor row. A very wide or tall opening moves into custom pricing, and our roller door price guide walks through single, double and custom doors step by step.",
  },
];

const NEW_RELATED = [{ label: "Roller Door Prices Perth", href: GUIDE_HREF }];

guardCopy({ SIZES_PARAGRAPH, NEW_FAQS });

runEnhancement({
  name: "roller doors page (E4)",
  slug: TARGET_SLUG,
  templateType: "ServicePage",
  plan: async (page) => {
    const notes: string[] = [];
    if (page.pricingRows.length === 0) console.warn("  ! the page has NO pinned price rows — expected 4 (new door, reinstall, custom, motor)");
    appendIntroParagraph(page, PARA_MARKER, SIZES_PARAGRAPH, notes);
    appendFaqs(page, NEW_FAQS, notes);
    if (await isLive200(GUIDE_HREF)) {
      appendRelatedLinks(page, NEW_RELATED, notes);
    } else if (!page.relatedLinks.some((l) => l.staticHref === GUIDE_HREF)) {
      console.log(`  - ${GUIDE_HREF} is not live yet (no plain 200) — guide link skipped; re-run after the deploy`);
    }
    return notes;
  },
}).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
