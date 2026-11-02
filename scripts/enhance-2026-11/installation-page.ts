/**
 * /garage-door-installation-perth — Nov-2026 enhancement E5 (idempotent).
 *
 * Why (docs/seo/serp-pulls-2026-11-01.md): the page drew 2,191 impressions @ 48.6 in 28 days
 * with 0 clicks, while "garage door installation perth" (1,727 impr @ 37.6, Planner 90/mo)
 * lands on the home page and the roller-door installation page. The SERP's related searches are
 * "residential garage door installation perth", "roller garage door installation perth",
 * "garage door installation perth prices" and "garage door replacement perth"; PAA is all cost
 * ("How much does a new garage door cost in Perth?", "…to have a new garage door fitted?") plus
 * "What is the best garage door brand in Australia?".
 *
 * What it does (one PUT, safe to re-run): appends ONE residential/roller-install paragraph
 * (PARA_MARKER guard), 2 PAA FAQs (the page already answers cost, replacement and timing), and
 * RelatedServices links to the installation-cost guide and — once it returns a plain 200 — the
 * roller door price guide. Title, pins and the existing eleven links are untouched.
 *
 * Dry run by default; CMS_API_URL is REQUIRED:
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/installation-page.ts [--apply]
 */

import { appendFaqs, appendIntroParagraph, appendRelatedLinks, guardCopy, isLive200, runEnhancement } from "./cms";

export {};

const TARGET_SLUG = "garage-door-installation-perth";
const ROLLER_GUIDE = "/roller-door-prices-perth";

const PARA_MARKER = "residential garage door installation in Perth";
const RESIDENTIAL_PARAGRAPH =
  "Most of our work is residential garage door installation in Perth: a single or double roller door on a 1980s brick-and-tile home, a sectional door replacing a tired tilt door on a renovated front elevation, or a first door on a new build once the opening is finished. Roller garage door installation is the quickest and most economical of the three, because the curtain coils into a drum above the opening and needs no ceiling tracks, while a sectional door suits a garage that wants insulation or a timber-look finish. Whichever you choose, the price is the new-door row in the guide-price table below, with the old door removed and new tracks or guides fitted, and our installation cost guide and roller door price guide set out what moves the figure within that range.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "Do you install roller garage doors in Perth?",
    answer:
      "Yes, roller doors are the most common door we install. A roller garage door installation in Perth is usually completed in a morning: the old door comes out, the new drum, curtain and guides go in, the springs are tensioned to the curtain's weight and the door is balanced and tested, with a roller door motor fitted and programmed if you want one. The new-door row in the guide-price table covers a standard single or double roller door supplied and installed; our roller door price guide lists the motor, removal-and-refit and repair figures alongside it.",
  },
  {
    question: "Which garage door brand is best in Australia?",
    answer:
      "For a Perth home the honest answer is that the fit, the balance and the motor sizing matter more than the badge. The large Australian makers — B&D, Steel-Line, Gliderol and Centurion among them — all build sound roller and sectional doors in Colorbond colours, and the differences are in profiles, finishes and warranty terms rather than reliability. We install and service all of them and we will recommend the door that suits your opening and budget rather than a brand; our brand directory explains what each maker is known for.",
  },
];

const RELATED_NOW: { label: string; href: string }[] = [
  { label: "Garage Door Installation Cost Perth", href: "/garage-door-installation-cost-perth" },
  { label: "Garage Door Brands Perth", href: "/garage-door-brands-perth" },
];
const RELATED_AFTER_DEPLOY = [{ label: "Roller Door Prices Perth", href: ROLLER_GUIDE }];

guardCopy({ RESIDENTIAL_PARAGRAPH, NEW_FAQS });

runEnhancement({
  name: "installation page (E5)",
  slug: TARGET_SLUG,
  templateType: "ServicePage",
  plan: async (page) => {
    const notes: string[] = [];
    if (page.pricingRows.length === 0) console.warn("  ! the page has NO pinned price rows — expected 3");
    appendIntroParagraph(page, PARA_MARKER, RESIDENTIAL_PARAGRAPH, notes);
    appendFaqs(page, NEW_FAQS, notes);
    appendRelatedLinks(page, RELATED_NOW, notes);
    if (await isLive200(ROLLER_GUIDE)) {
      appendRelatedLinks(page, RELATED_AFTER_DEPLOY, notes);
    } else if (!page.relatedLinks.some((l) => l.staticHref === ROLLER_GUIDE)) {
      console.log(`  - ${ROLLER_GUIDE} is not live yet (no plain 200) — that link is skipped; re-run after the deploy`);
    }
    return notes;
  },
}).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
