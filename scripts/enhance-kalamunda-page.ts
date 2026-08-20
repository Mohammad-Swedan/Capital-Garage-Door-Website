/**
 * /garage-door-repairs-kalamunda — 2026-08-20 refactor of the batch-2 DRAFT
 * before it publishes alongside the Forrestfield case study (idempotent).
 *
 * Why (GSC Domain property 90d + DataForSEO live Perth SERP, 2026-08-20):
 *  - "garage doors kalamunda" = 40 imp @ pos 1.1 — the published rusted-spring
 *    Kalamunda case study already owns the head term; the suburb page captures
 *    the cluster behind it. "garage door repairs kalamunda" 1 imp @ 9.
 *  - SERP: Gecko (Forrestfield-based) leads the pack + has a dedicated
 *    Kalamunda page; B&D's corporate location page #2; Eden Roc "70 jobs" #3.
 *    Related searches: "reviews", "cost", "Perth prices". PAA is BUYING-intent
 *    heavy — new-door budget/cost ×3 + "difference between B&D and Gliderol" —
 *    while the draft copy was repairs-only.
 *  → Angle added: new-door supply-and-install for the hills + price
 *    transparency, on top of the existing rust/hills-climate repair story.
 *
 * What it does (single PUT, safe to re-run, KEEPS the page's current status):
 *  1. Pins the standard 8 guide-price scenarios if pricingRows is empty
 *     (the batch-2 importer left drafts unpinned).
 *  2. seoTitle/seoDescription → desired state (head term "Garage Doors …").
 *     Lockstep: the seo block in content/service-suburb-pages-batch2.ts.
 *  3. Appends ONE buying-intent paragraph to data.localIntro (PROOF_MARKER).
 *  4. Appends 2 PAA-matched FAQs (de-duped; no dollar figures).
 *  5. Appends RelatedPages links to /garage-doors-perth + the repair cost guide.
 *
 * PRODUCTION is the default:  npx tsx scripts/enhance-kalamunda-page.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const TARGET_SLUG = "garage-door-repairs-kalamunda";

/** Desired state — duplicated in content/service-suburb-pages-batch2.ts (keep in lockstep). */
export const KALAMUNDA_SEO = {
  title: "Garage Doors & Repairs Kalamunda | Same-Day Hills Team",
  description:
    "Garage door repairs & new doors in Kalamunda — rusted springs, older hills doors fixed same-day, sectional doors supplied & installed. Upfront guide prices.",
};

/** Standard pin set (exact catalog scenario strings — note the × in "×2"). */
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

const PROOF_MARKER = "replacing the door outright";
const PROOF_PARAGRAPH =
  "Repairs are only half the story in the hills — when a tilt or roller door has rusted past saving, replacing the door outright is often the smarter spend, and we supply and install new sectional and roller doors across Kalamunda, Lesmurdie and Gooseberry Hill from B&D, Steel-Line, Centurion and Gliderol, chosen with finishes that stand up to the damp. Every new door starts with a free on-site measure and a fixed quote, and every repair is priced from a published price list before work starts — the rusted-spring job in the recent work below is a real Kalamunda example of a door we saved rather than sold.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "How much does a new garage door cost in Kalamunda?",
    answer:
      "It depends on the size (single or double), the door type (sectional, roller or custom), insulation, and the opener you pair with it. Every new door starts with a free on-site measure and a fixed written quote — no allowances or surprises — and our garage doors range page walks through the options and what drives the price. If your current door is repairable, we'll tell you that first: the guide-price table on this page shows where the common repairs land.",
  },
  {
    question: "B&D or Gliderol — which is better for a hills home?",
    answer:
      "Both are quality Australian brands and we supply and service both. For Kalamunda the bigger factor is the finish and hardware: the hills' extra rain and morning damp punish bare steel, so a door with a corrosion-resistant finish, galvanised tracks and sealed hardware will outlast the brand badge on the front. We'll recommend the right combination for your opening and exposure at the free measure.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Garage Doors Perth — Full Range", href: "/garage-doors-perth" },
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
  if (KALAMUNDA_SEO.title.length > 60) throw new Error(`seoTitle ${KALAMUNDA_SEO.title.length} chars (>60)`);
  if (KALAMUNDA_SEO.description.length > 160) throw new Error(`seoDescription ${KALAMUNDA_SEO.description.length} chars (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ PROOF_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!PROOF_PARAGRAPH.includes(PROOF_MARKER)) throw new Error("PROOF_PARAGRAPH must contain PROOF_MARKER.");

  console.log(`Kalamunda enhancement → ${CMS_API_URL}`);
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

  if (page.seoTitle !== KALAMUNDA_SEO.title) {
    page.seoTitle = KALAMUNDA_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== KALAMUNDA_SEO.description) {
    page.seoDescription = KALAMUNDA_SEO.description;
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
