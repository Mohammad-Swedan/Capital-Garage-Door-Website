/**
 * /commercial-garage-doors-perth — Nov-2026 enhancement E3 (idempotent).
 *
 * Why (docs/seo/serp-pulls-2026-11-01.md): the hub is live #6 for "commercial garage door
 * maintenance perth", and the commercial cluster is the site's biggest pool of unclaimed
 * impressions — "commercial garage door maintenance" 2,282 @ 55, "commercial garage door
 * service" 978 @ 51, "commercial garage door repairs" 1,763 @ 46, "industrial door maintenance"
 * 117 @ 10.4, "commercial roller servicing" 295 @ 15.6, "commercial roller shutter servicing"
 * 71 @ 11.1 (AU, 90 days, 0 clicks). The SERP's PAA: "How often should commercial roller doors
 * be serviced?", "How much does it cost to maintain a garage door?", "What is the most common
 * problem with garage doors?"; related searches name Wangara and the industrial belt.
 * "Commercial roller shutters perth" itself is a window-shutter SERP, so it gets wording here,
 * not a page.
 *
 * What it does (one PUT, safe to re-run): appends ONE maintenance-contract paragraph naming the
 * industrial suburbs and roller-shutter servicing (PARA_MARKER guard) and 3 PAA FAQs. The title,
 * the five pinned price rows and the nine related links are left as they are.
 *
 * Dry run by default; CMS_API_URL is REQUIRED:
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/commercial-hub.ts [--apply]
 */

import { appendFaqs, appendIntroParagraph, guardCopy, replaceInIntro, runEnhancement } from "./cms";

export {};

const TARGET_SLUG = "commercial-garage-doors-perth";

const PARA_MARKER = "scheduled maintenance contract";
const MAINTENANCE_PARAGRAPH =
  "Most of our commercial work is a scheduled maintenance contract rather than a breakdown call: a quarterly or six-monthly visit to every roller door, roller shutter and sectional door on the site, with the springs, barrels, curtains, guides, motors, limits, safety edges and photo-eyes checked and adjusted, worn parts replaced before they stop the door, and a written condition report for the facilities manager. Commercial roller shutter servicing is the same visit on a shopfront or loading-dock shutter. We offer these contracts to warehouses, workshops and depots across Perth's industrial belt — Wangara, Malaga, Osborne Park, Kewdale, Welshpool, Canning Vale, Bibra Lake and Jandakot — and price them per door from the commercial service row in the guide-price table below, with breakdown call-outs between visits at the listed rate.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "How often should commercial roller doors be serviced?",
    answer:
      "Every six months for a door that cycles more than a dozen times a day, such as a loading dock, a workshop or a car-park entry, and once a year for a door that is opened a few times a day. High-cycle doors wear their springs, barrels and motors far faster than a home door, and a missed service usually shows up as a snapped spring or a burnt-out motor during business hours. A maintenance contract fixes the interval and the price in advance.",
  },
  {
    question: "How much does it cost to maintain a commercial garage door?",
    answer:
      "The commercial roller door service row in the guide-price table on this page is our starting figure per door per visit, and it covers the inspection, lubrication, adjustment and condition report. Parts found worn are quoted on the day and fitted on the same visit if you approve them. For a site with several doors we quote a contract price per door, which is lower than booking each door separately, and breakdown call-outs between visits are charged at the listed rate.",
  },
  {
    question: "What is the most common problem with commercial garage doors?",
    answer:
      "Springs and motors, in that order. A commercial roller door's springs are sized for the curtain weight and a set number of cycles, and on a busy door they reach that number in a few years; when one goes the door is stuck down and the motor cannot lift it. Motors fail next, usually from running a door whose springs have already lost tension. Damaged slats from forklift strikes and failed safety photo-eyes make up most of the rest, and all four are what a scheduled service is designed to catch.",
  },
];

guardCopy({ MAINTENANCE_PARAGRAPH, NEW_FAQS });

runEnhancement({
  name: "commercial hub (E3)",
  slug: TARGET_SLUG,
  templateType: "ServicePage",
  plan: (page) => {
    const notes: string[] = [];
    if (page.pricingRows.length === 0) console.warn("  ! the page has NO pinned price rows — expected 5");
    appendIntroParagraph(page, PARA_MARKER, MAINTENANCE_PARAGRAPH, notes);
    // 2026-11-01 correction: the first run said "We run these contracts for…", which asserts existing
    // customers nobody has verified. Rewrite that sentence wherever it is still live.
    replaceInIntro(page, "We run these contracts for warehouses, workshops and depots", "We offer these contracts to warehouses, workshops and depots", notes);
    appendFaqs(page, NEW_FAQS, notes);
    return notes;
  },
}).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
