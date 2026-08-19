/**
 * /garage-door-repairs-clarkson — 2026-08-19 SEO enhancement (idempotent).
 *
 * Why (GSC Domain property 90d + URL Inspection + DataForSEO live Perth SERP):
 *  - "garage door repairs clarkson" = 70 imp @ pos 21 — ALL on the homepage; the
 *    Clarkson page itself has zero impressions for its own term, and Google last
 *    crawled it 2026-07-19 (before the 2026-08-01 enhancement), with the sitemap
 *    as its only known referring URL.
 *  - Related searches: "Residential garage door repairs clarkson", "… prices",
 *    "Mobile garage door repairs clarkson", "Garage door repairs Perth northern
 *    suburbs", "Best …", "… cost". PAA: service cost / common problems / door
 *    lifespan / roller door repair cost. Organic #2 is Eden Roc's "Over 365 Jobs
 *    Completed" proof page → the real Clarkson job (emergency jammed door) is the
 *    page's strongest new signal.
 *
 * What it does (single PUT, safe to re-run):
 *  1. seoTitle/seoDescription → the new desired state (mirrors the "mobile" +
 *     "residential" + "prices upfront" intents). **Keep in lockstep with
 *     scripts/enhance-suburb-pages.ts PLANS["garage-door-repairs-clarkson"]**,
 *     which owns the same fields and would otherwise revert them.
 *  2. Appends ONE proof paragraph to data.localIntro (guarded by PROOF_MARKER —
 *     deliberately not the brands PARA_MARKER used by enhance-suburb-pages.ts).
 *  3. Appends 2 PAA-matched FAQs (de-duped by question; no dollar figures).
 *  4. Appends RelatedPages links to Roller Door Repairs + the Service Cost guide
 *     if missing.
 *  Recent-work (data.caseStudySlugs) is already wired by import-job-pages-2026-08.ts
 *  (Clarkson emergency job first) — left untouched here.
 *
 * PRODUCTION is the default:  npx tsx scripts/enhance-clarkson-page.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const TARGET_SLUG = "garage-door-repairs-clarkson";

/** Desired state — duplicated in scripts/enhance-suburb-pages.ts (keep in lockstep). */
export const CLARKSON_SEO = {
  title: "Garage Door Repairs Clarkson | Same-Day Mobile Service",
  description:
    "Same-day mobile garage door repairs in Clarkson — springs, cables, motors & jammed doors, prices agreed upfront. Also Mindarie, Merriwa & Quinns Rocks.",
};

const PROOF_MARKER = "jammed half-open after dark";
const PROOF_PARAGRAPH =
  "The job that sums Clarkson up for us: a family's sectional door jammed half-open after dark with both cars inside and the garage open to the street. A roller stem had sheared at the end hinge and the lift cable had frayed at the drum — we fitted a new heavy-duty bottom bracket, roller and cable that night and left the door closed and locked. It's one of the real Clarkson jobs in the recent work below, and it's why our mobile vans carry brackets, rollers, cables, springs and openers for the whole northern corridor — Clarkson, Mindarie, Merriwa, Quinns Rocks, Butler and Ridgewood — so the repair is finished in the first visit, day or night.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "How much does a garage door service cost in Clarkson?",
    answer:
      "A standard service is one of the guide-price rows on this page, and it's the same price across the northern suburbs. It covers spring tension and balance, track alignment, hardware tightening, lubrication, opener limits and safety reverse — and on Clarkson's coastal doors it's where we catch a corroding cable or bracket before it snaps and jams the door. Our garage door service cost guide explains exactly what's included.",
  },
  {
    question: "Do you do mobile and after-hours garage door repairs in Clarkson?",
    answer:
      "Yes — every repair is mobile: the van comes to you with the common springs, cables, brackets, rollers and openers on board, so most Clarkson jobs are finished in one visit. After-hours emergency call-outs (a door stuck open with the house exposed, or shut with the car trapped) are prioritised; there's an after-hours component on top of the standard repair and we tell you what it is on the phone before we leave.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
  { label: "Garage Door Service Cost Perth", href: "/garage-door-service-cost-perth" },
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
  if (CLARKSON_SEO.title.length > 60) throw new Error(`seoTitle ${CLARKSON_SEO.title.length} chars (>60)`);
  if (CLARKSON_SEO.description.length > 160) throw new Error(`seoDescription ${CLARKSON_SEO.description.length} chars (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ PROOF_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!PROOF_PARAGRAPH.includes(PROOF_MARKER)) throw new Error("PROOF_PARAGRAPH must contain PROOF_MARKER.");

  console.log(`Clarkson enhancement → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>("/api/admin/pages?pageSize=300");
  const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === TARGET_SLUG);
  if (!ref) throw new Error(`${TARGET_SLUG} (Flat) not found.`);
  const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);

  const notes: string[] = [];

  if (page.seoTitle !== CLARKSON_SEO.title) {
    page.seoTitle = CLARKSON_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== CLARKSON_SEO.description) {
    page.seoDescription = CLARKSON_SEO.description;
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
