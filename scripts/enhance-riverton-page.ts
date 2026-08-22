/**
 * /garage-door-repairs-riverton — 2026-08-22 refactor of the batch-2 DRAFT before
 * it publishes alongside the (adjacent) Lynwood case study (idempotent).
 *
 * Why (GSC Domain property 90d + DataForSEO live Perth SERP, 2026-08-22):
 *  - Riverton is the biggest remaining draft-suburb opportunity: 39 imp —
 *    "garage door repair riverton" 22 @ pos 21.4 and "garage door repairs
 *    riverton" 17 @ 44.6 — every one of them landing on the HOMEPAGE.
 *  - SERP: the local pack is hyper-local and review-heavy (Silverline in Shelley
 *    619 reviews, Dynasty in Bateman 655, New Luk in Willetton 188) — we will not
 *    out-review them, so the play is content. Organic #1 is Express with the
 *    postcode IN THE TITLE ("Garage Door Repairs Riverton 6148 Perth"); #2 is
 *    Eden Roc with only "Over 40 Jobs Completed" (their weakest job count in the
 *    whole account — real photos beat it); #3 is B&D's Willetton corporate page.
 *    Positions 5–8 then drift to SOUTHERN RIVER pages, i.e. Google is short of
 *    genuinely Riverton-specific content. That is the gap this page fills.
 *  - Related searches: "residential", "garage roller doors repairs near me",
 *    "cost to service garage door". PAA: "How expensive is it to repair a garage
 *    door?", "How much is it to get your garage door serviced?", **"Is it worth
 *    repairing a garage door?"**
 *
 * What it does (single PUT, safe to re-run, KEEPS the page's current status):
 *  1. Pins the 8 standard guide-price scenarios if pricingRows is empty
 *     (batch-2 drafts ship unpinned) — the answer to the cost-heavy PAA.
 *  2. seoTitle/seoDescription → desired state (postcode 6148 + upfront prices).
 *     Lockstep: the seo block in content/service-suburb-pages-batch2.ts.
 *  3. Appends ONE proof paragraph to data.localIntro (PROOF_MARKER-guarded).
 *  4. Appends 3 PAA/related-search FAQs (de-duped; no dollar figures).
 *  5. Appends RelatedPages links (repair + service cost guides, roller doors).
 *
 * PRODUCTION is the default:  npx tsx scripts/enhance-riverton-page.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const TARGET_SLUG = "garage-door-repairs-riverton";

/** Desired state — duplicated in content/service-suburb-pages-batch2.ts (keep in lockstep). */
export const RIVERTON_SEO = {
  title: "Garage Door Repairs Riverton 6148 | Same-Day Local Team",
  description:
    "Same-day residential garage door repairs in Riverton WA 6148 — springs, cables, motors & off-track doors, prices upfront. Also Shelley, Rossmoyne & Lynwood.",
};

/** Standard pin set (exact catalog scenario strings — note the × in "×2").
 *  No commercial row: Riverton is residential river-suburb territory. */
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

const PROOF_MARKER = "Riverton WA 6148";
const PROOF_PARAGRAPH =
  "This is Riverton WA 6148 — the pocket between the Canning River, Riverton Forum and High Road, next door to Shelley, Rossmoyne, Ferndale and Lynwood. Most of it was built through the 1970s and 80s, which means a lot of doors here are still running their original springs, cables and openers: hardware that was never designed for four decades of school runs and commutes. The half-opening door in the recent work below is a Lynwood job minutes from Riverton — an old Steel-Line opener that had started stopping part-way and losing its travel limits, replaced with a new Superlift motor and set up properly in one visit. Every repair here is mobile and priced from a published list before we start, so you know the number before anyone touches the door.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "Is it worth repairing a garage door?",
    answer:
      "On most Riverton doors, yes. Springs, cables, rollers, hinges, brackets and openers are all replaceable parts, and a 1970s or 80s door panel that has been looked after is usually worth keeping — a repair is a fraction of a replacement. It stops being worth it when several panels are creased or rusted through, the frame has been bent by an impact, or the repair list keeps growing every visit. We inspect the whole door, not just the part that broke, and tell you honestly which case yours is.",
  },
  {
    question: "How much does a garage door service cost in Riverton?",
    answer:
      "A standard service is one of the guide-price rows on this page, and it is the same price across the river suburbs. It covers spring tension and balance, track alignment, hardware tightening, lubrication, opener travel limits and the safety reverse test — the check that catches a fraying cable or a tired spring on an older Riverton door before it strands the car inside. Our garage door service cost guide sets out exactly what is included.",
  },
  {
    question: "My garage door only opens half-way — what is wrong?",
    answer:
      "Usually one of three things: the opener's travel limits have drifted or its board is failing, the door is out of balance so the opener's force cut-out trips, or something is binding in the tracks. A balance test on the manual release separates the door from the opener in a couple of minutes. The Lynwood job in the recent work below was the first case — an older Steel-Line unit that could no longer hold its limits, replaced and set up the same visit.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Garage Door Repair Cost Guide", href: "/garage-door-repair-cost-perth" },
  { label: "Garage Door Service Cost Perth", href: "/garage-door-service-cost-perth" },
  { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
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
  if (RIVERTON_SEO.title.length > 60) throw new Error(`seoTitle ${RIVERTON_SEO.title.length} chars (>60)`);
  if (RIVERTON_SEO.description.length > 160) throw new Error(`seoDescription ${RIVERTON_SEO.description.length} chars (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ PROOF_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!PROOF_PARAGRAPH.includes(PROOF_MARKER)) throw new Error("PROOF_PARAGRAPH must contain PROOF_MARKER.");

  console.log(`Riverton enhancement → ${CMS_API_URL}`);
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

  if (page.seoTitle !== RIVERTON_SEO.title) {
    page.seoTitle = RIVERTON_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== RIVERTON_SEO.description) {
    page.seoDescription = RIVERTON_SEO.description;
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
