/**
 * /sectional-garage-doors-perth — Nov-2026 enhancement E6 (idempotent).
 *
 * Why (docs/seo/serp-pulls-2026-11-01.md): the /garage-doors-perth hub outranks the type page
 * for its own term — "sectional garage doors perth" 862 impressions @ 34.6 (hub) and 350 @ 18.0
 * (hub, striking distance) against the sectional page's own 901 impressions across the cluster;
 * "sectional door service" 707 @ 60, "insulated garage doors perth" 22 @ 24.9 also land
 * elsewhere. The page's title still ends in the brand ("| Capital Garage Doors"), so it echoes
 * none of the modifiers the SERP rewards ("prices", "insulated"). The hub already links the page
 * with the exact anchor "Sectional Garage Doors Perth" (verified 2026-11-01), so no hub change.
 *
 * What it does (one PUT, safe to re-run):
 *  1. seoTitle → SECTIONAL_SEO.title (the description is kept: it already names insulated
 *     panels and the measure-and-quote). Not in any lockstep table (checked sync-seo-fixes.ts).
 *  2. Appends ONE "prices and insulation" paragraph (PARA_MARKER guard; price-free — service
 *     pages render no price tokens, the pinned table carries the figures).
 *  3. Appends 2 FAQs (insulated sectional price; sectional vs roller for a Perth garage).
 *  4. Appends a RelatedServices link to the installation cost guide.
 *  The four pinned rows (standard door, sectional refit, custom door, motor) are untouched.
 *
 * Dry run by default; CMS_API_URL is REQUIRED:
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/sectional-page.ts [--apply]
 */

import { appendFaqs, appendIntroParagraph, appendRelatedLinks, guardCopy, runEnhancement, setSeo } from "./cms";

export {};

const TARGET_SLUG = "sectional-garage-doors-perth";

export const SECTIONAL_SEO = {
  title: "Sectional Garage Doors Perth | Insulated Panels & Prices",
};

const PARA_MARKER = "garage door prices in Perth follow three things";
const PRICES_PARAGRAPH =
  "Sectional garage door prices in Perth follow three things: the width of the opening, whether the panels are plain Colorbond or foam-core insulated, and the finish. A standard single or double door in a stock colour sits inside the new-door row of the guide-price table below, supplied and installed with the old door removed and new tracks and springs sized to the panel weight; insulated panels add to the door's cost and, because they are heavier, usually call for the stronger of our two openers. Timber-look, matt and oversized doors move into custom pricing. Our installation cost guide walks through what moves the figure, and a measure-and-quote visit fixes it in writing.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "How much does an insulated sectional garage door cost in Perth?",
    answer:
      "An insulated sectional door costs more than a plain Colorbond one because each panel is a foam-core sandwich rather than a single steel skin, and the heavier door needs springs and a motor sized to it. For a standard single or double opening the finished price still usually sits within the new-door range in the guide-price table, toward its upper end; a wide, tall or timber-look insulated door is quoted as a custom door. The payback is a garage that stays cooler in a Perth summer and a door that runs noticeably quieter.",
  },
  {
    question: "Is a sectional door better than a roller door for a Perth garage?",
    answer:
      "It depends on the garage. A sectional door seals the full opening, can be insulated, and gives the street-facing look most new Perth homes want, but it needs ceiling tracks and about 300 mm of headroom. A roller door coils into a drum above the opening, so it suits a garage with a low lintel, shelving along the ceiling or a tight side room, and it is the more economical of the two. Our roller door versus sectional door guide compares them in detail, and we are happy to recommend one after measuring.",
  },
];

const NEW_RELATED = [{ label: "Garage Door Installation Cost Perth", href: "/garage-door-installation-cost-perth" }];

guardCopy({ PRICES_PARAGRAPH, NEW_FAQS }, SECTIONAL_SEO);

runEnhancement({
  name: "sectional page (E6)",
  slug: TARGET_SLUG,
  templateType: "ServicePage",
  plan: (page) => {
    const notes: string[] = [];
    if (page.pricingRows.length === 0) console.warn("  ! the page has NO pinned price rows — expected 4");
    setSeo(page, SECTIONAL_SEO, notes);
    appendIntroParagraph(page, PARA_MARKER, PRICES_PARAGRAPH, notes);
    appendFaqs(page, NEW_FAQS, notes);
    appendRelatedLinks(page, NEW_RELATED, notes);
    return notes;
  },
}).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
