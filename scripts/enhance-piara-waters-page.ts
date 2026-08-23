/**
 * /garage-door-repairs-piara-waters — 2026-08-23 refactor of the batch-3 DRAFT
 * before publishing (idempotent).
 *
 * Why (GSC Domain property 90d + DataForSEO live Perth SERP, 2026-08-23):
 *  - "garage door repairs piara waters" 26 imp @ **pos 4.9** on the HOMEPAGE —
 *    the closest remaining draft to page 1 now that Huntingdale has shipped, so a
 *    dedicated page is the highest-probability top-3 conversion left.
 *  - SERP: Gecko's thin location page is organic #1 (its URL even misspells the
 *    suburb, "piarra-waters"), Eden Roc runs "Over 118 Jobs Completed" at #2, and
 *    the two pages after it declare the exact angles we are missing —
 *    24 Seven leads with "**Residential** Garage Door Repairs Piara Waters" and
 *    Jim's with "**No hidden fees, upfront pricing**". The draft title said only
 *    "Same-Day Service" and never mentioned price transparency, which is the
 *    thing this SERP is actually competing on.
 *  - PAA is entirely cost + longevity: "How much does it cost to replace a garage
 *    door in Australia?", "How much does it cost to fix a garage door near me?",
 *    "What is the average lifespan of a garage door motor?", "Is it worth
 *    repairing a garage door?" — all answerable from the pinned guide-price table
 *    and the estate-home angle the copy already owns.
 *  - No state/postcode disambiguation needed here: unlike Belmont, Riverton and
 *    Huntingdale, Piara Waters exists only in WA.
 *
 * What it does (single PUT, safe to re-run, KEEPS the page's current status):
 *  1. Pins the standard guide-price scenarios if pricingRows is empty (this
 *     batch-3 draft already ships 8 rows, so the step is a no-op here).
 *  2. seoTitle/seoDescription -> desired state (same-day + upfront prices).
 *     Lockstep: the seo block in content/service-suburb-pages-batch3.ts.
 *  3. Appends ONE proof paragraph to data.localIntro (PROOF_MARKER-guarded —
 *     the marker MUST be a phrase that appears nowhere in the draft copy).
 *  4. Appends 3 PAA FAQs (de-duped; no dollar figures).
 *  5. Appends RelatedPages links (service cost guide, motors, servicing).
 *
 * PRODUCTION is the default:  npx tsx scripts/enhance-piara-waters-page.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const TARGET_SLUG = "garage-door-repairs-piara-waters";

/** Desired state — duplicated in content/service-suburb-pages-batch3.ts (keep in lockstep). */
export const PIARA_WATERS_SEO = {
  title: "Garage Door Repairs Piara Waters | Same-Day, Upfront Prices",
  description:
    "Same-day garage door repairs in Piara Waters — estate-home springs, cables, motors and dusty sensors, guide prices listed. Also Harrisdale & Forrestdale.",
};

/** Standard pin set (exact catalog scenario strings — note the × in "×2").
 *  No-op on this page: the batch-3 importer already pinned 8 rows. */
const PRICING_PINS = [
  "Broken spring (single)",
  "Broken springs (×2)",
  "Cable snapped or off the drum",
  "Motor / opener not working (repair)",
  "Motor / opener replacement",
  "Door off track / stuck",
  "Service / tune-up",
  "Remote (extra / replacement)",
];

// Marker checked against the live draft copy: this phrase appears nowhere in it.
const PROOF_MARKER = "before a spanner comes out";
const PROOF_PARAGRAPH =
  "The other thing worth knowing before you call anyone: you should be told the price before a spanner comes out. Every job here is quoted from a published price list — the common repairs are in the guide-price table on this page — and the number is agreed before the work starts, with no call-out surprise added at the end. That matters more than usual in a suburb like this, because most Piara Waters doors are young enough that the honest answer is a repair rather than a replacement, and you should be able to see that for yourself rather than take our word for it. The recent jobs below are all from the surrounding corridor, photographed as we found them and as we left them.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "Is it worth repairing a garage door?",
    answer:
      "In Piara Waters, almost always yes. These are young doors — the oldest estates here are only a decade or so old — so the panels and curtain have plenty of life left and it is the hardware around them that wears: springs, cables, rollers and the opener. Replacing those is a fraction of a new door. Replacement only makes sense when a panel has been creased by an impact or the frame has been bent, and we will tell you plainly if that is what we find.",
  },
  {
    question: "What is the average lifespan of a garage door motor?",
    answer:
      "Ten to fifteen years, which is exactly the age the first Piara Waters estates are reaching now — so builder-fitted openers giving up is one of the most common calls we take here. The thing that shortens a motor's life is a door that has drifted out of balance: weak springs leave the opener hauling weight it was never rated for. We test the balance before quoting any new opener, so the replacement starts on a healthy door instead of repeating the same cycle.",
  },
  {
    question: "How much does it cost to fix a garage door near me?",
    answer:
      "The guide-price table on this page lists the common repairs — springs, cables, a door off its track, an opener repair or replacement, a service — and those prices apply across Piara Waters, Harrisdale, Forrestdale and Treeby. You get a fixed quote before any work starts, so the figure you agree is the figure you pay. If you describe the fault or send a photo with your quote request, we can usually confirm the exact price before we arrive.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Garage Door Service Cost Perth", href: "/garage-door-service-cost-perth" },
  { label: "Garage Door Motors — Capital 1100N & 1500N", href: "/garage-door-motors-perth" },
  { label: "Garage Door Servicing & Maintenance", href: "/garage-door-maintenance-perth" },
];

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

function resolveAdminPassword(): string {
  if (process.env.CMS_ADMIN_PASSWORD) return process.env.CMS_ADMIN_PASSWORD;
  if (!IS_PROD) return "Admin#12345";
  const raw = readFileSync(CMS_APPSETTINGS_PROD, "utf8").replace(/^\uFEFF/, "");
  const pw = (JSON.parse(raw) as { SeedAdmin?: { Password?: string } }).SeedAdmin?.Password;
  if (!pw) throw new Error("SeedAdmin.Password missing from appsettings.Production.json.");
  return pw;
}

let token = "";

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : undefined) as T;
}

async function login(): Promise<void> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: resolveAdminPassword() }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status}) at ${CMS_API_URL}.`);
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
    faqs: page.faqs.map((f) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder, faqItemId: f.faqItemId })),
    relatedLinks: page.relatedLinks.map((l) => ({
      targetPageId: l.targetPageId,
      staticHref: l.staticHref,
      labelOverride: l.labelOverride,
      linkGroup: l.linkGroup,
      sortOrder: l.sortOrder,
    })),
    pricingRows: page.pricingRows.map((r) => ({ pricingItemId: r.pricingItemId, sortOrder: r.sortOrder, noteOverride: r.noteOverride })),
    reviews: page.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder })),
    services: page.services.map((s) => ({ serviceId: s.serviceId, sortOrder: s.sortOrder })),
  };
}

async function main() {
  if (PIARA_WATERS_SEO.title.length > 60) throw new Error(`seoTitle ${PIARA_WATERS_SEO.title.length} chars (>60)`);
  if (PIARA_WATERS_SEO.description.length > 160) throw new Error(`seoDescription ${PIARA_WATERS_SEO.description.length} chars (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ PROOF_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!PROOF_PARAGRAPH.includes(PROOF_MARKER)) throw new Error("PROOF_PARAGRAPH must contain PROOF_MARKER.");

  console.log(`Piara Waters enhancement → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>("/api/admin/pages?pageSize=300");
  const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === TARGET_SLUG);
  if (!ref) throw new Error(`${TARGET_SLUG} (Flat) not found.`);
  const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);

  const notes: string[] = [];

  if (page.pricingRows.length === 0) {
    const pricingBody = await api<{ items?: { id: number; scenario: string }[] } | { id: number; scenario: string }[]>(
      "/api/admin/pricing-items?pageSize=200",
    );
    const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
    const byScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));
    for (const scenario of PRICING_PINS) {
      const pricingItemId = byScenario.get(scenario);
      if (!pricingItemId) {
        console.warn(`  ! pricing scenario not in catalog, pin skipped: "${scenario}"`);
        continue;
      }
      page.pricingRows.push({ pricingItemId, sortOrder: page.pricingRows.length, noteOverride: null });
    }
    notes.push(`pinned ${page.pricingRows.length} guide-price rows`);
  }

  if (page.seoTitle !== PIARA_WATERS_SEO.title) {
    page.seoTitle = PIARA_WATERS_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== PIARA_WATERS_SEO.description) {
    page.seoDescription = PIARA_WATERS_SEO.description;
    notes.push("seoDescription");
  }

  const intro = Array.isArray(page.data.localIntro) ? (page.data.localIntro as string[]) : [];
  if (!intro.some((p) => p.includes(PROOF_MARKER))) {
    page.data.localIntro = [...intro, PROOF_PARAGRAPH];
    notes.push("localIntro += proof paragraph");
  }

  const questions = new Set(page.faqs.map((f) => f.question.trim().toLowerCase()));
  let faqSort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
  for (const f of NEW_FAQS) {
    if (questions.has(f.question.trim().toLowerCase())) continue;
    page.faqs.push({ id: 0, question: f.question, answer: f.answer, sortOrder: faqSort++, faqItemId: null });
    notes.push(`faq: ${f.question}`);
  }

  let linkSort = page.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1;
  for (const l of NEW_RELATED) {
    if (page.relatedLinks.some((x) => x.linkGroup === "RelatedPages" && x.staticHref === l.href)) continue;
    page.relatedLinks.push({ id: 0, targetPageId: null, staticHref: l.href, labelOverride: l.label, linkGroup: "RelatedPages", sortOrder: linkSort++ });
    notes.push(`related: ${l.href}`);
  }

  if (!notes.length) {
    console.log("  = already at desired state — nothing to do");
    return;
  }
  await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
  console.log(`  ✓ ${TARGET_SLUG} updated [${page.status}]:\n    - ${notes.join("\n    - ")}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
