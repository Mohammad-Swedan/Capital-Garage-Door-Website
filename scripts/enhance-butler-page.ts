/**
 * /garage-door-repairs-butler — 2026-08-20 SEO refactor before its case study
 * goes live (idempotent).
 *
 * Why (GSC Domain property 90d + DataForSEO live Perth SERP, 2026-08-20):
 *  - "garage door repairs butler" = 76 imp — 62 @ pos 28.2 on the homepage,
 *    "garage door repair butler" already pos 7; the Butler page's Recent-work
 *    was empty until the Avanti→Chamberlain case study publishes.
 *  - SERP is the toughest of the batch: Dave Hughes Garage Doors is a
 *    Butler-BASED competitor holding #1 organic + the knowledge graph (AGDA,
 *    57 reviews @ 4.9); Eden Roc "Over 405 Jobs Completed" #2; Otto's dedicated
 *    Butler page #3. Related searches: "butler prices", "butler cost", "butler
 *    reviews", "alkimos", "Perth northern suburbs", "Joondalup". PAA: service
 *    cost / how to fix a faulty door / "What is the average lifespan of a
 *    garage door motor?" / replacement cost.
 *  → Angle: price transparency (guide-price table + upfront-prices title),
 *    real-photo job proof, and the motor story matching the lifespan PAA.
 *
 * What it does (single PUT, safe to re-run):
 *  1. seoTitle/seoDescription → desired state. **Keep in lockstep with
 *     scripts/enhance-suburb-pages.ts PLANS["garage-door-repairs-butler"]**.
 *  2. Appends ONE proof paragraph to data.localIntro (PROOF_MARKER-guarded).
 *  3. Appends 2 PAA-matched FAQs (de-duped by question; no dollar figures).
 *  4. Appends RelatedPages links to the Capital motors page + motor cost guide.
 *
 * PRODUCTION is the default:  npx tsx scripts/enhance-butler-page.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const TARGET_SLUG = "garage-door-repairs-butler";

/** Desired state — duplicated in scripts/enhance-suburb-pages.ts (keep in lockstep). */
export const BUTLER_SEO = {
  title: "Garage Door Repairs Butler | Same-Day & Upfront Prices",
  description:
    "Same-day garage door repairs in Butler with prices agreed upfront — springs, cables, motors & openers. Real local jobs. Also Alkimos, Jindalee & Quinns Rocks.",
};

const PROOF_MARKER = "failed Avanti opener";
const PROOF_PARAGRAPH =
  "A recent Butler job tells the suburb's story: a failed Avanti opener — the builder-fitted unit from when the house was built — replaced with a new Chamberlain motor on the existing rail line, remotes programmed and the safety reversal tested, all in a single visit. It's one of the real Butler jobs in the recent work below. Butler, Alkimos, Jindalee and Ridgewood were built out through the 2000s, so a whole generation of builder-grade openers is reaching the end of its life at once — and because we quote from a published price list before any work starts, you'll know the full cost of a repair or an upgrade up front, whether we're in Butler or anywhere along the northern corridor.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "How long does a garage door motor last?",
    answer:
      "Ten to fifteen years is typical — the failed Avanti we replaced on a recent Butler job was a builder-fitted unit from when the home was built, right on schedule. Two things shorten that: a door that's out of balance (weak springs make the motor lift weight it was never designed for), and coastal air corroding the hardware the motor drives. When one does fail, we test the door's balance before fitting the new opener so the replacement starts on a healthy door — see our motor replacement cost guide for what the common scenarios involve.",
  },
  {
    question: "How much does a garage door service cost in Butler?",
    answer:
      "A standard service is one of the guide-price rows on this page, and it's the same price across the northern suburbs. It covers spring tension and balance, track alignment, hardware tightening, lubrication, opener limits and safety reverse — and on Butler's coastal doors it's where we catch a corroding spring or cable before it fails. Our garage door service cost guide explains exactly what's included.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Garage Door Motors — Capital 1100N & 1500N", href: "/garage-door-motors-perth" },
  { label: "Motor Replacement Cost Guide", href: "/garage-door-motor-replacement-cost-perth" },
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
  if (BUTLER_SEO.title.length > 60) throw new Error(`seoTitle ${BUTLER_SEO.title.length} chars (>60)`);
  if (BUTLER_SEO.description.length > 160) throw new Error(`seoDescription ${BUTLER_SEO.description.length} chars (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ PROOF_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!PROOF_PARAGRAPH.includes(PROOF_MARKER)) throw new Error("PROOF_PARAGRAPH must contain PROOF_MARKER.");

  console.log(`Butler enhancement → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>("/api/admin/pages?pageSize=300");
  const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === TARGET_SLUG);
  if (!ref) throw new Error(`${TARGET_SLUG} (Flat) not found.`);
  const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);

  const notes: string[] = [];

  if (page.seoTitle !== BUTLER_SEO.title) {
    page.seoTitle = BUTLER_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== BUTLER_SEO.description) {
    page.seoDescription = BUTLER_SEO.description;
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
