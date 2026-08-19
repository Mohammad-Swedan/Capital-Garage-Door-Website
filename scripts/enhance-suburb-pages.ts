/**
 * Money-keyword enhancement for all 19 garage-door-repairs-{suburb} pages
 * (August 2026) — built from live GSC + DataForSEO + SERP research.
 *
 * What the data showed (90d GSC to 2026-07-29 + DataForSEO volumes):
 *  - The HOMEPAGE outranks suburb pages for their own money terms
 *    ("garage door repairs gosnells": home pos 1.4 / 31 impr vs the Gosnells
 *    page pos 6 / 7 impr) — suburb pages lack internal-link authority.
 *  - Real monthly volumes (Australia): baldivis 110, rockingham 90 (+110
 *    "garage doors rockingham"), joondalup 90, canning vale 50, ellenbrook 20,
 *    midland 20, most others 10 — with CPCs $27–$103 (genuine lead terms).
 *  - GSC shows nearby-locality demand landing on these pages (huntingdale,
 *    maddington, wangara, aveley, safety bay, heathridge, currambine,
 *    east perth…) that the copy never mentions.
 *  - SERP winners (Eden Roc #1 Canning Vale) run ~1,200 words with hyper-local
 *    specificity, brand lists and job proof; our pages are generic.
 *
 * What this script applies to every suburb page (desired-state, idempotent):
 *  1. seoTitle — adds the "Same-Day" CTR hook (skips the three titles pinned
 *     by sync-seo-fixes.ts: baldivis, success, midland — kept verbatim there).
 *  2. seoDescription — keyword + nearby-locality + CTA formula (≤160 chars).
 *  3. One UNIQUE local paragraph appended to data.localIntro — nearby
 *     mini-suburbs (GSC-informed) + the major-brands list (B&D, Steel-Line,
 *     Centurion, Gliderol, Dominator, Merlin/ATA/Chamberlain openers).
 *  4. Three appended FAQs — brands / new-door supply & install (captures the
 *     "garage doors {suburb}" cluster) / most-common-problem (PAA-aligned,
 *     coastal variant for salt-air suburbs). NO dollar figures anywhere —
 *     pricing statements are only allowed from PricingItems (repo rule).
 *  5. NearbySuburbs chips — any placeholder chip (href /service-areas) whose
 *     label is one of the 19 live suburbs is repointed at the real page;
 *     Cannington + Lathlain (zero real chips) get strategic appends.
 *  6. data.caseStudySlugs — hand-picked nearby job photos for the 6 suburbs
 *     with no same-suburb case study (auto-match covers the other 13).
 *  7. The /garage-door-repairs-perth hub grid gets every missing suburb name
 *     appended to data.serviceAreas — combined with the frontend change that
 *     links matching grid chips to suburb pages, this is the hub→spoke
 *     internal-link fix for the homepage-cannibalization problem.
 *
 * Run against the LOCAL CMS (default):
 *   npx tsx scripts/enhance-suburb-pages.ts
 * Run against PRODUCTION (deliberate, explicit):
 *   CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=<real> npx tsx scripts/enhance-suburb-pages.ts
 */

export {}; // force module scope

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/* ------------------------------------------------------------------ *
 * Desired state
 * ------------------------------------------------------------------ */

const BRANDS_DOORS = "B&D, Steel-Line, Centurion, Gliderol and Dominator";
const BRANDS_OPENERS = "Merlin, ATA and Chamberlain";
/** Stable idempotency marker: the new paragraph is the only intro paragraph
 * that ever contains this exact brand-list phrase. */
const PARA_MARKER = "B&D, Steel-Line, Centurion";

interface SuburbPlan {
  /** Display name as used in chip labels / copy. */
  name: string;
  /** New seoTitle, or null to keep the current one (pinned in sync-seo-fixes.ts). */
  title: string | null;
  description: string;
  paragraph: string;
  /** Salt-air suburb → corrosion variant of the common-problem FAQ. */
  coastal?: boolean;
  /** Chips to append when the label is missing entirely. */
  appendChips?: { label: string; href: string }[];
  /** Hand-picked nearby case studies (only for suburbs with no same-suburb
   * job photos; applied only while data.caseStudySlugs is empty). */
  caseStudySlugs?: string[];
}

const PLANS: Record<string, SuburbPlan> = {
  "garage-door-repairs-armadale": {
    name: "Armadale",
    title: "Garage Door Repairs Armadale | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Armadale — springs, motors, cables & roller doors. Also covering Kelmscott, Seville Grove & Byford. Call for a free quote.",
    paragraph:
      "We're in and around Armadale most weeks — from older homes near Jull Street to the newer estates toward Harrisdale and Piara Waters — and we take same-day calls from Kelmscott, Seville Grove, Mount Nasura and Byford too. Whatever the door, we carry parts for all the major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers, so most repairs are finished in a single visit.",
  },
  "garage-door-repairs-baldivis": {
    name: "Baldivis",
    title: null, // pinned by sync-seo-fixes.ts
    description:
      "Same-day garage door repairs in Baldivis — springs, motors, cables & roller doors. Also covering Wellard, Warnbro & Secret Harbour. Call for a free quote.",
    paragraph:
      "From new builds off Safety Bay Road to acreage properties on the rural fringe, Baldivis doors get a workout — and coastal air from Warnbro Sound speeds up spring and cable wear. We take same-day calls across Baldivis, Wellard, Warnbro, Secret Harbour and Port Kennedy, and we stock parts for all major Australian brands — B&D, Steel-Line, Centurion, Gliderol and Dominator — plus Merlin, ATA and Chamberlain openers, so most repairs are done in one visit.",
    coastal: true,
  },
  "garage-door-repairs-butler": {
    name: "Butler",
    title: "Garage Door Repairs Butler | Same-Day Coastal Service",
    description:
      "Same-day garage door repairs in Butler — springs, motors, cables & sectional doors. Also covering Alkimos, Jindalee & Quinns Rocks. Call for a free quote.",
    paragraph:
      "Butler and the surrounding coastal corridor are full of newer homes with sectional doors that cop salt air year-round, so corroded springs and sticky tracks are common calls for us. We provide same-day service across Butler, Alkimos, Jindalee, Merriwa, Quinns Rocks and Ridgewood, carrying parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers.",
    coastal: true,
    caseStudySlugs: [
      "roller-door-repair-wanneroo-perth",
      "broken-garage-door-spring-replacement-duncraig-perth",
    ],
  },
  "garage-door-repairs-cannington": {
    name: "Cannington",
    title: "Garage Door Repairs Cannington | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Cannington — springs, motors, tracks & commercial roller doors. Covering Beckenham, Bentley & Welshpool. Free quotes.",
    paragraph:
      "From homes around Westfield Carousel to workshops and warehouses in the Welshpool industrial area, we repair residential and commercial doors across Cannington every week — with same-day calls covering Beckenham, Wilson, Queens Park, Bentley and East Cannington too. We carry parts for all major Australian brands, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers.",
    appendChips: [
      { label: "Canning Vale", href: "/garage-door-repairs-canning-vale" },
      { label: "Thornlie", href: "/garage-door-repairs-thornlie" },
      { label: "Gosnells", href: "/garage-door-repairs-gosnells" },
    ],
  },
  "garage-door-repairs-canning-vale": {
    name: "Canning Vale",
    title: "Garage Door Repairs Canning Vale | Same-Day Local Team",
    description:
      "Same-day garage door repairs in Canning Vale — springs, motors & commercial roller doors. Covering Willetton, Harrisdale & Piara Waters. Free quotes.",
    paragraph:
      "Alongside Canning Vale's family streets we service one of Perth's biggest industrial precincts, so high-cycle commercial roller doors off Bannister and Ranford Roads are regular jobs — as are same-day house calls in Willetton, Parkwood, Harrisdale, Piara Waters and Huntingdale. We stock parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors, plus Merlin, ATA and Chamberlain openers, so most repairs are completed on the spot.",
  },
  "garage-door-repairs-clarkson": {
    name: "Clarkson",
    // 2026-08-19: desired state now owned jointly with scripts/enhance-clarkson-page.ts
    // (CLARKSON_SEO) — keep the two in lockstep.
    title: "Garage Door Repairs Clarkson | Same-Day Mobile Service",
    description:
      "Same-day mobile garage door repairs in Clarkson — springs, cables, motors & jammed doors, prices agreed upfront. Also Mindarie, Merriwa & Quinns Rocks.",
    paragraph:
      "Clarkson's mix of established streets and newer pockets near Ocean Keys keeps us busy with everything from worn-out springs to full motor replacements — and the salt air off Mindarie Marina doesn't do door hardware any favours. We take same-day calls across Clarkson, Mindarie, Kinross, Merriwa, Banksia Grove and Tamala Park, with parts on board for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers.",
    coastal: true,
    caseStudySlugs: [
      "roller-door-repair-wanneroo-perth",
      "broken-garage-door-spring-replacement-duncraig-perth",
    ],
  },
  "garage-door-repairs-ellenbrook": {
    name: "Ellenbrook",
    title: "Garage Door Repairs Ellenbrook | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Ellenbrook — springs, motors, cables & roller doors. Also covering Aveley, The Vines & Brabham. Call for a free quote.",
    paragraph:
      "Ellenbrook and its surrounding estates are some of Perth's fastest-growing suburbs, and we're out here most weeks fixing doors in Aveley, The Vines, Brabham and Henley Brook as well. Whether it's a sectional door that's jumped its tracks or a motor that's given up in the summer heat, we arrive with parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers — so most jobs are finished same-day.",
  },
  "garage-door-repairs-fremantle": {
    name: "Fremantle",
    title: "Garage Door Repairs Fremantle | Same-Day & Coastal Homes",
    description:
      "Same-day garage door repairs in Fremantle — springs, motors & older doors on character homes. Covering East Freo, Beaconsfield & Hamilton Hill. Free quotes.",
    paragraph:
      "Fremantle's character homes often run older tilt and roller doors that need someone who knows how to keep them going — and the sea air is tough on springs, cables and tracks everywhere from South Fremantle to North Fremantle. We provide same-day repairs across Fremantle, East Fremantle, White Gum Valley, Beaconsfield and Hamilton Hill, and carry parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers.",
    coastal: true,
  },
  "garage-door-repairs-gosnells": {
    name: "Gosnells",
    title: "Garage Door Repairs Gosnells | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Gosnells — springs, motors, cables & roller doors. Also covering Huntingdale, Maddington & Kenwick. Call for a free quote.",
    paragraph:
      "Gosnells is home turf for us — we're fixing doors here and in Huntingdale, Maddington, Kenwick and Langford every week, from older homes near the town centre to newer builds toward Southern River. Broken spring at 7am? Door stuck halfway? We prioritise same-day calls and carry parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors, plus Merlin, ATA and Chamberlain openers, so most repairs take one visit.",
  },
  "garage-door-repairs-joondalup": {
    name: "Joondalup",
    title: "Garage Door Repairs Joondalup | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Joondalup — springs, motors, cables & roller doors. Covering Edgewater, Currambine & Heathridge. Call for a free quote.",
    paragraph:
      "From Lakeside Joondalup out to the coast, we take same-day repair calls across Joondalup, Edgewater, Currambine, Heathridge, Ocean Reef and Mullaloo. Whether it's a broken torsion spring, a motor that hums but won't lift, or a roller door off its tracks, our techs carry parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers — so most jobs are fixed on the first visit.",
    caseStudySlugs: [
      "broken-garage-door-spring-replacement-duncraig-perth",
      "roller-door-repair-wanneroo-perth",
    ],
  },
  "garage-door-repairs-lathlain": {
    name: "Lathlain",
    title: "Garage Door Repairs Lathlain | Same-Day Inner Perth",
    description:
      "Same-day garage door repairs in Lathlain & inner-east Perth — springs, motors, tilt & roller doors. Covering Victoria Park, Carlisle & Burswood. Free quotes.",
    paragraph:
      "Being minutes from the CBD, Lathlain jobs are often urgent — a car stuck behind a dead door before work, or a rental that needs securing fast. We cover the whole inner east same-day: Lathlain, Victoria Park, East Victoria Park, Carlisle, Burswood, Rivervale and across to East Perth. We repair every major Australian brand, including B&D, Steel-Line, Centurion, Gliderol and Dominator, plus Merlin, ATA and Chamberlain openers.",
    appendChips: [
      { label: "Cannington", href: "/garage-door-repairs-cannington" },
      { label: "Morley", href: "/garage-door-repairs-morley" },
    ],
    caseStudySlugs: [
      "garage-door-lift-cable-replacement-bayswater-perth",
      "buckled-roller-door-repair-cannington-perth",
    ],
  },
  "garage-door-repairs-midland": {
    name: "Midland",
    title: null, // pinned by sync-seo-fixes.ts
    description:
      "Same-day garage door repairs in Midland — springs, motors & commercial roller doors. Covering Middle Swan, Bellevue & Swan View. Call for a free quote.",
    paragraph:
      "Midland's mix of older workers' cottages, new subdivisions and industrial yards means we see everything here — from seized tilt doors to high-cycle commercial rollers near Great Eastern Highway. Same-day calls cover Midland, Middle Swan, Woodbridge, Bellevue, Stratton and Swan View, with parts on board for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers.",
  },
  "garage-door-repairs-morley": {
    name: "Morley",
    title: "Garage Door Repairs Morley | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Morley — springs, motors, cables & roller doors. Also covering Bedford, Dianella, Noranda & Bayswater. Free quotes.",
    paragraph:
      "Morley's post-war homes often run original tilt or early sectional doors that have done decades of work — we keep them going, or replace worn springs, cables and motors when it's time. Same-day service covers Morley, Bedford, Dianella, Noranda, Embleton and Bayswater, and we carry parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers.",
  },
  "garage-door-repairs-rockingham": {
    name: "Rockingham",
    title: "Garage Door Repairs Rockingham | Same-Day Coastal Service",
    description:
      "Same-day garage door repairs in Rockingham — rusted springs, motors & coastal wear fixed fast. Covering Safety Bay, Warnbro & Waikiki. Free quotes.",
    paragraph:
      "Rockingham doors live a hard life — salt air off the foreshore corrodes springs, cables and tracks faster than anywhere inland, and we replace more rusted hardware here than in most other parts of Perth. Same-day calls cover Rockingham, Safety Bay, Shoalwater, Warnbro, Waikiki, Cooloongup and Port Kennedy, with corrosion-resistant parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers.",
    coastal: true,
  },
  "garage-door-repairs-scarborough": {
    name: "Scarborough",
    title: "Garage Door Repairs Scarborough | Same-Day Coastal Service",
    description:
      "Same-day garage door repairs in Scarborough — salt-air spring & motor wear fixed fast. Covering Doubleview, Innaloo, Karrinyup & Trigg. Free quotes.",
    paragraph:
      "Between the beach and the older streets up the hill, Scarborough doors deal with constant salt exposure — rusted springs, pitted tracks and seized rollers are our most common call-outs here. We service Scarborough, Doubleview, Innaloo, Karrinyup, Trigg and Wembley Downs same-day, carrying parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers.",
    coastal: true,
    caseStudySlugs: [
      "broken-garage-door-spring-replacement-duncraig-perth",
      "garage-door-hinge-roller-replacement-morley-perth",
    ],
  },
  "garage-door-repairs-southern-river": {
    name: "Southern River",
    title: "Garage Door Repairs Southern River | Same-Day Service",
    description:
      "Same-day garage door repairs in Southern River — springs, motors, cables & sectional doors. Covering Harrisdale, Piara Waters & Riverton. Free quotes.",
    paragraph:
      "Southern River's newer estates run big double sectional doors that get heavy daily use, and when a spring lets go the car's not going anywhere. We take same-day calls across Southern River, Harrisdale, Piara Waters, Riverton and out to Canning Vale, arriving with parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers so most repairs are finished in one visit.",
  },
  // Narrowed 2026-08: the Cockburn wording moved to
  // /garage-door-repairs-cockburn-central so the two pages stop competing.
  // scripts/import-cockburn-central-page.ts rewrites the LIVE page to match
  // this desired state; keep all three in lockstep.
  "garage-door-repairs-success": {
    name: "Success",
    title: null, // pinned by sync-seo-fixes.ts
    description:
      "Same-day garage door repairs in Success — springs, motors, cables & roller doors. Covering Atwell, Aubin Grove, Hammond Park & Beeliar. Free quotes.",
    paragraph:
      "Through the newer streets of Success, Atwell, Aubin Grove, Hammond Park and Beeliar, we're in the area most days — usually for broken springs, faulty motors or doors that have come off their tracks. We carry parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers, so most repairs are completed same-day.",
    caseStudySlugs: [
      "garage-door-cable-replacement-willetton-perth",
      "emergency-sectional-door-repair-canning-vale-perth",
    ],
  },
  "garage-door-repairs-thornlie": {
    name: "Thornlie",
    title: "Garage Door Repairs Thornlie | Same-Day Local Service",
    description:
      "Same-day garage door repairs in Thornlie — springs, motors, cables & roller doors. Also covering Maddington, Langford & Huntingdale. Free quotes.",
    paragraph:
      "Thornlie's established homes mean plenty of doors that have been lifting for twenty-plus years — worn springs, stretched cables and tired motors are our regular work here. Same-day calls cover Thornlie, Maddington, Langford, Huntingdale and the Canning Vale border, with parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers on the truck.",
  },
  "garage-door-repairs-wanneroo": {
    name: "Wanneroo",
    title: "Garage Door Repairs Wanneroo | Same-Day, Homes & Sheds",
    description:
      "Same-day garage door repairs in Wanneroo — springs, motors, roller doors & shed doors. Covering Wangara, Landsdale, Madeley & Pearsall. Free quotes.",
    paragraph:
      "Wanneroo jobs range from family homes and semi-rural blocks with big shed rollers to commercial units in the Wangara industrial area — we handle them all, usually same-day. Our techs cover Wanneroo, Wangara, Landsdale, Madeley, Pearsall and Sinagra with parts for B&D, Steel-Line, Centurion, Gliderol and Dominator doors plus Merlin, ATA and Chamberlain openers, including heavy-duty springs for oversized shed doors.",
  },
};

/** label → live suburb-page href, for the generic placeholder-chip repoint. */
const NAME_TO_HREF: Record<string, string> = Object.fromEntries(
  Object.entries(PLANS).map(([slug, p]) => [p.name, `/${slug}`]),
);

function buildFaqs(name: string, coastal: boolean): { question: string; answer: string }[] {
  const problemAnswer = coastal
    ? `Broken torsion springs are the number one call-out everywhere in Perth — but in ${name} the coastal salt air adds rusted springs, corroded cables and pitted tracks to the usual list. We replace more corrosion-damaged hardware near the coast than anywhere else, and we fit corrosion-resistant parts to slow it happening again. Failed motors and doors off their tracks make up most of the remaining jobs, and all of these are usually same-day repairs.`
    : `Broken torsion springs are the number one call-out — they do the heavy lifting every time the door opens and eventually snap, usually without warning. Worn cables, failed motors and doors that have come off their tracks make up most of the rest. All of these are same-day repairs for our ${name} techs in most cases.`;
  return [
    {
      question: `Which garage door brands do you repair in ${name}?`,
      answer: `All major Australian brands — ${BRANDS_DOORS} doors and more, plus openers and motors from ${BRANDS_OPENERS} and Grifco. If you're not sure what brand your door is, send a photo with your quote request and we'll identify it before we arrive.`,
    },
    {
      question: `Do you supply and install new garage doors in ${name}?`,
      answer: `Yes — as well as repairs, we supply and install new sectional, roller, tilt and custom garage doors across ${name}, including automatic openers. If your existing door is beyond economical repair we'll tell you straight, and give you a fixed written quote for a replacement after a free on-site measure.`,
    },
    {
      question: `What's the most common garage door problem in ${name}?`,
      answer: problemAnswer,
    },
  ];
}

/** Hub page whose service-area grid should name every live suburb page. */
const HUB_SLUG = "garage-door-repairs-perth";

/* ------------------------------------------------------------------ *
 * API plumbing (same shapes as scripts/enhance-installation-page.ts)
 * ------------------------------------------------------------------ */

interface AdminPage {
  id: number;
  templateType: string;
  routeGroup: string;
  slug: string;
  title: string;
  status: string;
  noIndex: boolean;
  seoTitle: string;
  seoDescription: string;
  heroImageAssetId: number | null;
  socialImageAssetId: number | null;
  data: Record<string, unknown>;
  faqs: { id: number; question: string; answer: string; sortOrder: number; faqItemId: number | null }[];
  relatedLinks: {
    id: number;
    targetPageId: number | null;
    staticHref: string | null;
    labelOverride: string | null;
    linkGroup: string;
    sortOrder: number;
  }[];
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[];
  reviews: { reviewId: number; sortOrder: number }[];
  services: { serviceId: number; sortOrder: number }[];
}

let token = "";

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function login(): Promise<void> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(
      `Login failed (${res.status}). Check CMS_ADMIN_EMAIL/PASSWORD and that the CMS is running at ${CMS_API_URL}.`,
    );
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Login succeeded but no token was returned.");
  token = data.token;
}

function toUpdateBody(page: AdminPage) {
  return {
    id: page.id,
    templateType: page.templateType,
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    noIndex: page.noIndex,
    status: page.status,
    heroImageAssetId: page.heroImageAssetId,
    socialImageAssetId: page.socialImageAssetId,
    data: page.data,
    faqs: page.faqs.map((f) => ({
      question: f.question,
      answer: f.answer,
      sortOrder: f.sortOrder,
      faqItemId: f.faqItemId,
    })),
    relatedLinks: page.relatedLinks.map((l) => ({
      targetPageId: l.targetPageId,
      staticHref: l.staticHref,
      labelOverride: l.labelOverride,
      linkGroup: l.linkGroup,
      sortOrder: l.sortOrder,
    })),
    pricingRows: page.pricingRows.map((r) => ({
      pricingItemId: r.pricingItemId,
      sortOrder: r.sortOrder,
      noteOverride: r.noteOverride,
    })),
    reviews: page.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder })),
    services: page.services.map((s) => ({ serviceId: s.serviceId, sortOrder: s.sortOrder })),
  };
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

async function main() {
  // Sanity-check copy limits before touching anything.
  for (const [slug, plan] of Object.entries(PLANS)) {
    if (plan.title && plan.title.length > 60)
      console.warn(`! title >60 chars (${plan.title.length}) on ${slug}`);
    if (plan.description.length > 160)
      console.warn(`! description >160 chars (${plan.description.length}) on ${slug}`);
    if (!plan.paragraph.includes(PARA_MARKER))
      throw new Error(`paragraph for ${slug} is missing the idempotency marker "${PARA_MARKER}"`);
  }

  console.log(`Enhancing ${Object.keys(PLANS).length} suburb pages + hub grid at ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const pageList = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  // Slugs are only unique per route group — garage-door-repairs-perth also
  // exists as an /lp/ landing page, so restrict the lookup to Flat pages.
  const idBySlug = new Map(
    pageList.items.filter((p) => p.routeGroup === "Flat").map((p) => [p.slug, p.id]),
  );

  /* ---- Phase A: the 19 suburb pages ---- */
  for (const [slug, plan] of Object.entries(PLANS)) {
    const id = idBySlug.get(slug);
    if (!id) {
      console.warn(`  ! page not found in CMS, skipped: ${slug}`);
      continue;
    }
    const page = await api<AdminPage>(`/api/admin/pages/${id}`);
    let changed = false;
    const notes: string[] = [];

    if (plan.title && page.seoTitle !== plan.title) {
      page.seoTitle = plan.title;
      changed = true;
      notes.push("title");
    }
    if (page.seoDescription !== plan.description) {
      page.seoDescription = plan.description;
      changed = true;
      notes.push("description");
    }

    const localIntro = page.data.localIntro as string[] | undefined;
    if (Array.isArray(localIntro) && !localIntro.some((p) => p.includes(PARA_MARKER))) {
      localIntro.push(plan.paragraph);
      changed = true;
      notes.push("intro-paragraph");
    }

    const existingQuestions = new Set(page.faqs.map((f) => f.question));
    let faqSort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
    for (const faq of buildFaqs(plan.name, plan.coastal ?? false)) {
      if (existingQuestions.has(faq.question)) continue;
      page.faqs.push({ id: 0, question: faq.question, answer: faq.answer, sortOrder: faqSort++, faqItemId: null });
      changed = true;
      notes.push(`faq:"${faq.question.slice(0, 30)}…"`);
    }

    // Repoint placeholder nearby-suburb chips at the real pages.
    for (const link of page.relatedLinks) {
      if (link.linkGroup !== "NearbySuburbs" || !link.labelOverride) continue;
      const target = NAME_TO_HREF[link.labelOverride];
      if (!target || target === `/${slug}`) continue;
      if (link.staticHref === target) continue;
      if (link.staticHref && link.staticHref !== "/service-areas") continue; // hand-set elsewhere — leave it
      if (link.targetPageId) continue;
      link.staticHref = target;
      changed = true;
      notes.push(`chip→${link.labelOverride}`);
    }

    // Append strategic chips missing entirely (Cannington / Lathlain islands).
    if (plan.appendChips) {
      const labels = new Set(
        page.relatedLinks.filter((l) => l.linkGroup === "NearbySuburbs").map((l) => l.labelOverride),
      );
      let chipSort =
        page.relatedLinks
          .filter((l) => l.linkGroup === "NearbySuburbs")
          .reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1;
      for (const chip of plan.appendChips) {
        if (labels.has(chip.label)) continue;
        page.relatedLinks.push({
          id: 0,
          targetPageId: null,
          staticHref: chip.href,
          labelOverride: chip.label,
          linkGroup: "NearbySuburbs",
          sortOrder: chipSort++,
        });
        changed = true;
        notes.push(`+chip:${chip.label}`);
      }
    }

    // Hand-picked nearby case studies (only while the list is empty — a later
    // hand-edit in the admin wins over this script).
    const caseSlugs = page.data.caseStudySlugs as string[] | undefined;
    if (plan.caseStudySlugs && (!Array.isArray(caseSlugs) || caseSlugs.length === 0)) {
      page.data.caseStudySlugs = plan.caseStudySlugs;
      changed = true;
      notes.push("case-studies");
    }

    if (changed) {
      await api(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        body: JSON.stringify(toUpdateBody(page)),
      });
      console.log(`  ✓ ${slug}: ${notes.join(", ")}`);
    } else {
      console.log(`  = ${slug} (no change)`);
    }
  }

  /* ---- Phase B: hub grid — every live suburb named on the repairs hub ---- */
  const hubId = idBySlug.get(HUB_SLUG);
  if (!hubId) {
    console.warn(`  ! hub page not found: ${HUB_SLUG}`);
  } else {
    const hub = await api<AdminPage>(`/api/admin/pages/${hubId}`);
    const areas = hub.data.serviceAreas as string[] | undefined;
    if (!Array.isArray(areas)) {
      console.warn(`  ! ${HUB_SLUG} has no data.serviceAreas array, skipped`);
    } else {
      const added: string[] = [];
      for (const plan of Object.values(PLANS)) {
        if (!areas.includes(plan.name)) {
          areas.push(plan.name);
          added.push(plan.name);
        }
      }
      if (added.length) {
        await api(`/api/admin/pages/${hub.id}`, {
          method: "PUT",
          body: JSON.stringify(toUpdateBody(hub)),
        });
        console.log(`  ✓ ${HUB_SLUG}: grid += ${added.join(", ")}`);
      } else {
        console.log(`  = ${HUB_SLUG} grid already complete`);
      }
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
