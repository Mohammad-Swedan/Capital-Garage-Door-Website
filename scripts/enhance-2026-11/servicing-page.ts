/**
 * /garage-door-maintenance-perth — Nov-2026 enhancement E2 (idempotent).
 *
 * Why (docs/seo/serp-pulls-2026-11-01.md): Keyword Planner "garage door service perth" 210/mo
 * and "garage door maintenance perth" 210/mo; Search Console (AU, 90d) "garage door service
 * perth" 969 impressions @ 21.9 and "garage door servicing perth" 463 @ 26.6 land on the HOME
 * page, while this page sits at 722 impressions @ 48 with 0 clicks and a title that says
 * "Servicing | Capital Garage Doors". The live SERP's PAA is cost and frequency: "How much does
 * it cost to service a garage door in Perth?", "How much is it to get your garage door
 * serviced?", "How often should a garage door be serviced?", "How much does it cost to have a
 * garage door lubricated?", "How often should garage doors be oiled?", "Can I service my garage
 * door myself?". The sister site's servicing page is its best-converting inner page (15 lead
 * actions from 74 sessions in a month).
 *
 * What it does (one PUT, safe to re-run):
 *  1. seoTitle/seoDescription → SERVICING_SEO (price-free description; the old one typed
 *     "from $140"). **Kept in lockstep with scripts/sync-seo-fixes.ts SEO_FIXES
 *     ["garage-door-maintenance-perth"]**, which owns the same two fields.
 *  2. Appends ONE "what a service in Perth covers" paragraph (PARA_MARKER guard).
 *  3. Appends 4 PAA FAQs (de-duped; "how often" already exists on the page).
 *  4. Appends RelatedServices links to the service-cost guide and the opener page if missing.
 *  The 2026-09-30 pins (service, check-up, seals, hinges/rollers, spring re-tension) and the
 *  three pinned reviews were verified present on 2026-11-01 and are not touched.
 *  The home page's "Most searched" row gains an exact "garage door service Perth" anchor in the
 *  same change (components/sections/services-grid.tsx, deployed with the code).
 *
 * Dry run by default; CMS_API_URL is REQUIRED:
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/servicing-page.ts [--apply]
 */

import { appendFaqs, appendIntroParagraph, appendRelatedLinks, guardCopy, runEnhancement, setSeo } from "./cms";

export {};

const TARGET_SLUG = "garage-door-maintenance-perth";

/** Desired state — duplicated in scripts/sync-seo-fixes.ts SEO_FIXES (keep in lockstep). */
export const SERVICING_SEO = {
  title: "Garage Door Service Perth | Servicing & Maintenance",
  description:
    "Garage door service in Perth: springs, cables, rollers, seals and opener checked, lubricated and adjusted in one visit. Same-day servicing across all suburbs.",
};

const PARA_MARKER = "a garage door service in Perth covers";
const SERVICE_PARAGRAPH =
  "What a garage door service in Perth covers, in plain terms: the technician checks the spring tension and the door's balance, inspects the cables, drums, rollers, hinges and tracks for wear, lubricates every moving part with the right product (not a general-purpose spray), adjusts the opener's force and travel limits, tests the safety reverse and the manual release, and replaces worn weather seals or rollers on the spot if you want them done. It takes about an hour for a standard door, and the price is the service row in the guide-price table below, with any parts quoted before they are fitted. Most Perth doors need it once a year; coastal and heavily used doors benefit from every six months.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "How much does it cost to service a garage door in Perth?",
    answer:
      "The service row in the guide-price table on this page is our listed price for a standard residential door, and it covers the full check, lubrication and adjustment described above. Parts that turn out to be worn, such as rollers, hinges or a weather seal, are quoted on the spot and only fitted if you say yes. Our garage door service cost guide breaks the figure down and compares it with the repairs a missed service tends to lead to.",
  },
  {
    question: "How much does it cost to have a garage door lubricated?",
    answer:
      "Lubrication on its own is not something we sell separately, because spraying the wrong product on the wrong parts is the most common DIY mistake we see. It is part of every service: the springs, rollers, hinges, bearings and the opener's rail or chain each get the lubricant they need, and the tracks are cleaned rather than greased. If you only want a lubrication and quick check, book the safety check-up row in the table, which is the lighter visit.",
  },
  {
    question: "How often should a garage door be oiled?",
    answer:
      "Twice a year is a sensible rhythm for the moving parts of a Perth door: a silicone or garage-door-specific lubricant on the springs, rollers, hinges and bearings, and the opener's chain or screw drive if it has one. Never grease the tracks, which collects grit and makes the rollers skid, and never use a water-displacing spray as a lubricant, because it strips what was there. An annual service does all of this properly and checks the door while it is at it.",
  },
  {
    question: "Can I service my garage door myself?",
    answer:
      "You can safely do the light work: keep the tracks clean, lubricate the rollers and hinges, check that the photo-eye sensors are aligned and test the safety reverse with a block of wood. Leave the springs, the cables and the drum alone: they are under high tension and are the parts that injure people. Those, plus the opener's force and limit settings and the door's balance, are what a professional service exists for.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Garage Door Service Cost Perth", href: "/garage-door-service-cost-perth" },
  { label: "Garage Door Opener Repair Perth", href: "/garage-door-opener-repair-perth" },
];

guardCopy({ SERVICE_PARAGRAPH, NEW_FAQS }, SERVICING_SEO);

runEnhancement({
  name: "servicing page (E2)",
  slug: TARGET_SLUG,
  templateType: "ServicePage",
  plan: (page) => {
    const notes: string[] = [];
    if (page.pricingRows.length === 0) console.warn("  ! the page has NO pinned price rows — run add-service-page-pins.ts first");
    setSeo(page, SERVICING_SEO, notes);
    appendIntroParagraph(page, PARA_MARKER, SERVICE_PARAGRAPH, notes);
    appendFaqs(page, NEW_FAQS, notes);
    appendRelatedLinks(page, NEW_RELATED, notes);
    return notes;
  },
}).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
