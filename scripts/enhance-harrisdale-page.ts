/**
 * /garage-door-repairs-harrisdale — 2026-08-25 refactor of the batch-3 DRAFT
 * before publishing (idempotent).
 *
 * Why (GSC Domain property 90d + DataForSEO live Perth SERP, 2026-08-25):
 *  - "garage door repairs harrisdale" 18 imp @ **pos 1.1** — we already rank #1,
 *    but on the HOMEPAGE. The upside here is conversion rather than ranking: a
 *    suburb page with local copy, a price table and job photos converts a #1
 *    impression far better than a generic homepage hit does.
 *  - It completes the southern-growth trio. Forrestdale and Piara Waters shipped
 *    this week and BOTH already carry a Harrisdale chip, so publishing closes the
 *    last placeholder in that corridor and makes all three mutually linked.
 *  - SERP: Gecko #1, Eden Roc "Over 112 Jobs Completed" #2, Otto's #3 — then the
 *    two angles that keep recurring in this corridor: 24 Seven with "**Residential**
 *    Garage Door Repairs Harrisdale" (#4) and Jim's with "**No hidden fees, upfront
 *    pricing**" (#5); Aussie Homes runs "Residential Garage Door Maintenance
 *    Harrisdale" at #9. Related searches: "residential", "prices", "cost". The
 *    draft title said only "Same-Day Local Service" — no price signal at all.
 *  - PAA is repair-vs-replace and cost: "Is it cheaper to repair or replace a
 *    garage door?", "How much does it cost to replace a garage door in Australia?",
 *    "How much does it cost to fix a garage door near me?", "How much to repair an
 *    up and over garage door?" — the first is answered honestly by this suburb's
 *    defining fact: the doors here are barely a decade old.
 *
 * What it does (single PUT, safe to re-run, KEEPS the page's current status):
 *  1. Pins the standard guide-price scenarios if pricingRows is empty (this
 *     batch-3 draft already ships 8 rows, so the step is a no-op here).
 *  2. seoTitle/seoDescription -> desired state (same-day + fixed prices).
 *     Lockstep: the seo block in content/service-suburb-pages-batch3.ts.
 *  3. Appends ONE proof paragraph to data.localIntro (PROOF_MARKER-guarded —
 *     marker verified absent from the live draft copy before writing this).
 *  4. Appends 3 PAA FAQs (de-duped; no dollar figures).
 *  5. Appends RelatedPages links (doors range, service cost guide, servicing).
 *
 * PRODUCTION is the default:  npx tsx scripts/enhance-harrisdale-page.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const TARGET_SLUG = "garage-door-repairs-harrisdale";

/** Desired state — duplicated in content/service-suburb-pages-batch3.ts (keep in lockstep). */
export const HARRISDALE_SEO = {
  title: "Garage Door Repairs Harrisdale | Same-Day, Fixed Prices",
  description:
    "Same-day garage door repairs in Harrisdale — estate-home springs, cables and smart Wi-Fi openers, quoted as a fixed price. Also Piara Waters & Forrestdale.",
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

// Marker verified against the live draft copy (curl of the resolve endpoint) before writing.
const PROOF_MARKER = "not a candidate for replacement";
const PROOF_PARAGRAPH =
  "Because the streets here are barely a decade old, the question we field most in Harrisdale is whether a door is worth fixing or should simply be replaced — and the honest answer is nearly always the former. A ten-year-old estate door is not a candidate for replacement: its panels have decades of life left, and what has actually worn out is the hardware around them, usually the springs, a cable, a set of rollers or the opener. Those are the jobs listed in the guide-price table on this page, and each one is quoted as a fixed price before any work starts. We run this corridor as one route — Piara Waters and Forrestdale both have their own pages now — so a Harrisdale booking normally slots into a day we are already working the estates.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "Is it cheaper to repair or replace a garage door?",
    answer:
      "Repairing, and in Harrisdale that is not a close call. The doors here are young — the oldest estates are only a decade or so old — so the panels are sound and it is the springs, cables, rollers or opener that have reached the end of their working life. Replacing those parts costs a fraction of a new door. A replacement only makes sense once a panel has been creased by an impact, the frame has been bent, or corrosion has gone right through, none of which is common on a door this age.",
  },
  {
    question: "How much does it cost to replace a garage door in Australia?",
    answer:
      "A new sectional or roller door varies with size (single or double), the panel profile, insulation and whether you pair it with a new opener — which is why we quote it after a free on-site measure rather than from a price list. Our garage doors range page walks through the options. Before quoting a replacement we will always tell you whether the existing door can be repaired instead; on a Harrisdale estate home it usually can, and the repair prices are on the table above.",
  },
  {
    question: "How much does it cost to repair an up-and-over garage door?",
    answer:
      "Up-and-over (tilt) doors are uncommon in Harrisdale itself, since the estates were all built with sectional doors, but we repair plenty of them on older homes in the surrounding suburbs. The usual fix is a tilt-door arms kit with new springs, which is its own line on our price list, and it is nearly always cheaper than converting to a sectional door. We quote it the same way as everything else: a fixed price agreed before the work starts.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Garage Doors Perth — Full Range", href: "/garage-doors-perth" },
  { label: "Garage Door Service Cost Perth", href: "/garage-door-service-cost-perth" },
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
  if (HARRISDALE_SEO.title.length > 60) throw new Error(`seoTitle ${HARRISDALE_SEO.title.length} chars (>60)`);
  if (HARRISDALE_SEO.description.length > 160) throw new Error(`seoDescription ${HARRISDALE_SEO.description.length} chars (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ PROOF_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!PROOF_PARAGRAPH.includes(PROOF_MARKER)) throw new Error("PROOF_PARAGRAPH must contain PROOF_MARKER.");

  console.log(`Harrisdale enhancement → ${CMS_API_URL}`);
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

  if (page.seoTitle !== HARRISDALE_SEO.title) {
    page.seoTitle = HARRISDALE_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== HARRISDALE_SEO.description) {
    page.seoDescription = HARRISDALE_SEO.description;
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
