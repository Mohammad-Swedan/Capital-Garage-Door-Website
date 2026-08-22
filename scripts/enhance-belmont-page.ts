/**
 * /garage-door-repairs-belmont — 2026-08-22 refactor of the batch-2 DRAFT before
 * it publishes alongside its own Belmont case study (idempotent).
 *
 * Why (GSC Domain property 90d + DataForSEO live Perth SERP, 2026-08-22):
 *  - "garage door repairs belmont" already ranks **pos 1.0** — on the HOMEPAGE,
 *    with no page of ours behind it. The suburb page converts that ranking into a
 *    real landing surface, and its own same-suburb case study (Avanti → Superlift
 *    motor + springs) is the local proof.
 *  - **Belmont is ambiguous**: "garage door repairs belmont nsw" is in the related
 *    searches (Belmont also exists in NSW and VIC), and the two competitors that
 *    rank here put the WA postcode in their titles ("Belmont 6104", "Belmont 6104
 *    Perth"). The draft title carried NO Perth/WA signal at all → add it.
 *  - Related searches: "residential", "mobile", "best", "cost", "cheap". PAA:
 *    service cost ×2, **"Is it cheaper to repair or replace a garage door?"**,
 *    "how much to fix a new garage door".
 *  - SERP is directory/lead-gen heavy (Gecko #1, easygaragerepair, Express) with
 *    NOBODY covering the Kewdale freight precinct — the page's commercial angle
 *    (backed by the live Kewdale case study, "garage door repairs kewdale" 7 imp
 *    @ 25.6 on the homepage) is a genuine differentiator, so it keeps the
 *    commercial guide-price row too.
 *
 * What it does (single PUT, safe to re-run, KEEPS the page's current status):
 *  1. Pins the 8 standard guide-price scenarios + the commercial roller-door row
 *     if pricingRows is empty (batch-2 drafts ship unpinned).
 *  2. seoTitle/seoDescription → desired state (WA disambiguation + mobile/cost).
 *     Lockstep: the seo block in content/service-suburb-pages-batch2.ts.
 *  3. Appends ONE proof paragraph to data.localIntro (PROOF_MARKER-guarded).
 *  4. Appends 3 PAA/related-search FAQs (de-duped; no dollar figures).
 *  5. Appends RelatedPages links (spring repair, motors, repair cost guide).
 *
 * PRODUCTION is the default:  npx tsx scripts/enhance-belmont-page.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const TARGET_SLUG = "garage-door-repairs-belmont";

/** Desired state — duplicated in content/service-suburb-pages-batch2.ts (keep in lockstep). */
export const BELMONT_SEO = {
  title: "Garage Door Repairs Belmont WA | Same-Day Mobile Service",
  description:
    "Same-day mobile garage door repairs in Belmont WA 6104 — springs, motors, cables plus commercial roller doors in Kewdale. Upfront guide prices, real local jobs.",
};

/** Standard pin set (exact catalog scenario strings — note the × in "×2") plus the
 *  commercial row: Belmont's copy covers the Kewdale freight precinct. */
const PRICING_PINS = [
  "Broken spring (single)",
  "Broken springs (×2)",
  "Cable snapped or off the drum",
  "Motor / opener not working (repair)",
  "Motor / opener replacement",
  "Door off track / stuck",
  "Service / tune-up",
  "Remote (extra / replacement)",
  "Commercial roller door (service, from)",
];

const PROOF_MARKER = "Belmont WA 6104";
const PROOF_PARAGRAPH =
  "To be clear about which Belmont: this is Belmont WA 6104, the airport-corridor suburb between Great Eastern Highway and Tonkin Highway — not the Belmont in NSW or Victoria. Every repair here is mobile, so the van comes to you in Belmont, Cloverdale, Rivervale, Redcliffe, Ascot or Kewdale with the common springs, cables, brackets and openers on board, and the price is agreed from a published price list before anything is touched. The motor-and-springs job in the recent work below is a real Belmont example: an Avanti opener that had spent years straining against tired springs, replaced with a new Superlift motor and a fresh pair of torsion springs in one visit — because fitting a new opener onto a door that is out of balance just kills the new one too.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "Is it cheaper to repair or replace a garage door?",
    answer:
      "Repairing is almost always cheaper, and on most Belmont doors it is also the right call — springs, cables, rollers, brackets and openers are all replaceable parts on a door panel that is still sound. Replacement makes sense when several panels are creased or rusted through, the door has been hit hard enough to bend the frame, or the repair bill starts approaching the cost of a new door with a warranty. We inspect the whole door and tell you honestly which side of that line yours sits on; the guide-price table on this page shows where the common repairs land.",
  },
  {
    question: "How much does a garage door service cost in Belmont?",
    answer:
      "A standard service is one of the guide-price rows on this page, and it is the same price across the eastern suburbs. It covers spring tension and balance, track alignment, hardware tightening, lubrication, opener limits and safety reverse — the check that catches a fraying cable or a tired spring before it strands you. Commercial roller doors in Kewdale and Welshpool are quoted on their own row because they cycle far more often. Our garage door service cost guide explains exactly what is included.",
  },
  {
    question: "Do you offer mobile garage door repairs in Belmont?",
    answer:
      "Yes — every job is mobile. There is no workshop to drop your door at: we come to the property in Belmont, Cloverdale, Rivervale, Redcliffe, Ascot or Kewdale with the common parts on the van, so most repairs are diagnosed and finished in the first visit. Commercial call-outs through the Kewdale and Welshpool freight precinct are prioritised, because a roller door that will not open costs a business money by the hour.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
  { label: "Garage Door Motors — Capital 1100N & 1500N", href: "/garage-door-motors-perth" },
  { label: "Garage Door Repair Cost Guide", href: "/garage-door-repair-cost-perth" },
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
  if (BELMONT_SEO.title.length > 60) throw new Error(`seoTitle ${BELMONT_SEO.title.length} chars (>60)`);
  if (BELMONT_SEO.description.length > 160) throw new Error(`seoDescription ${BELMONT_SEO.description.length} chars (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ PROOF_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!PROOF_PARAGRAPH.includes(PROOF_MARKER)) throw new Error("PROOF_PARAGRAPH must contain PROOF_MARKER.");

  console.log(`Belmont enhancement → ${CMS_API_URL}`);
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

  if (page.seoTitle !== BELMONT_SEO.title) {
    page.seoTitle = BELMONT_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== BELMONT_SEO.description) {
    page.seoDescription = BELMONT_SEO.description;
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
