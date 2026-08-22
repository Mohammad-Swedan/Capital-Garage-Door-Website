/**
 * /garage-door-repairs-huntingdale — 2026-08-22 refactor of the batch-2 DRAFT
 * before publishing (idempotent).
 *
 * Why (GSC Domain property 90d + DataForSEO live Perth SERP, 2026-08-22):
 *  - Huntingdale is the closest any draft suburb sits to page 1: "garage door
 *    repairs huntingdale" 20 imp @ **pos 5.7**, all of it landing on the HOMEPAGE,
 *    plus "garage door installation huntingdale" 6 imp @ 34.2. A dedicated page
 *    should convert a 5.7 into a top-3.
 *  - **Huntingdale is ambiguous** (Huntingdale VIC 3166 is a Melbourne suburb) and
 *    the organic #1 knows it — Otto's title is literally "Garage Door Repairs
 *    Huntingdale **WA**", and hipages' is "…in Huntingdale WA". The draft title
 *    carried no state signal at all.
 *  - The #3 result (Jim's) sells on "No hidden fees, upfront pricing" — and the
 *    related searches are "residential", "prices", "cost". Price transparency is
 *    the battleground, which is exactly what the pinned guide-price table answers.
 *  - Positions 7-14 drift to CANNING VALE and HARRISDALE pages: Google is short of
 *    Huntingdale-specific content, the same gap the Riverton SERP showed.
 *  - PAA: "How expensive is it to repair a garage door?", "What is the difference
 *    between B&D and Gliderol?", "How much does it cost to replace a garage door in
 *    Australia?", "What is the average lifespan of a garage door motor?"
 *
 * What it does (single PUT, safe to re-run, KEEPS the page's current status):
 *  1. Pins the 8 standard guide-price scenarios if pricingRows is empty.
 *  2. seoTitle/seoDescription -> desired state (WA disambiguation + upfront prices).
 *     Lockstep: the seo block in content/service-suburb-pages-batch2.ts.
 *  3. Appends ONE proof paragraph to data.localIntro (PROOF_MARKER-guarded).
 *  4. Appends 3 PAA/related-search FAQs (de-duped; no dollar figures).
 *  5. Appends RelatedPages links (repair + service cost guides, motors).
 *
 * PRODUCTION is the default:  npx tsx scripts/enhance-huntingdale-page.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const TARGET_SLUG = "garage-door-repairs-huntingdale";

/** Desired state — duplicated in content/service-suburb-pages-batch2.ts (keep in lockstep). */
export const HUNTINGDALE_SEO = {
  title: "Garage Door Repairs Huntingdale WA | Same-Day Service",
  description:
    "Same-day residential garage door repairs in Huntingdale WA 6110 — springs, cables, motors, prices agreed upfront. Also Gosnells, Thornlie & Southern River.",
};

/** Standard pin set (exact catalog scenario strings — note the × in "×2").
 *  No commercial row: Huntingdale is residential territory. */
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

const PROOF_MARKER = "Huntingdale WA 6110";
const PROOF_PARAGRAPH =
  "For the avoidance of doubt: this is Huntingdale WA 6110, the pocket bounded by Ranford Road and Warton Road between Gosnells, Thornlie, Southern River and Canning Vale — not the Huntingdale in Melbourne. It is one of the fastest suburbs in Perth for us to reach, because our vans are working on all four sides of it every day. Most of the housing went up through the 1980s and 90s, so the doors here are deep into the age where torsion springs reach the end of their cycle life, lift cables fray at the bottom brackets and first-generation openers stop holding their limits. Whatever the fault, you get the price before the work: every job is quoted from a published price list, the common repairs are on the guide-price table below, and nothing gets touched until you have agreed the number.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "What is the average lifespan of a garage door motor?",
    answer:
      "Ten to fifteen years for a typical Huntingdale household, which is why so many of the 1990s-built homes here are on their second opener. What shortens it is a door that has drifted out of balance: weak springs leave the motor lifting weight it was never rated for, so it runs hot and wears its drive out early. We test the door's balance before quoting any opener, because replacing the motor without fixing the springs just starts the same clock again.",
  },
  {
    question: "How much does a garage door service cost in Huntingdale?",
    answer:
      "A standard service is one of the guide-price rows on this page, and it is the same price right across the Gosnells–Thornlie corridor. It covers spring tension and balance, track alignment, hardware tightening, lubrication, opener travel limits and the safety reverse test — the check that catches a fraying cable or a tired spring on an older Huntingdale door before it fails with the car inside. Our garage door service cost guide sets out exactly what is included.",
  },
  {
    question: "What is the difference between B&D and Gliderol?",
    answer:
      "Both are long-established Australian door makers and we repair, service and install both across Huntingdale. In practice the differences that matter to you are the hardware and the parts, not the badge: they use different track profiles, spring fittings and opener mounts, so a technician needs the right components on the van for your door. We carry parts for B&D, Steel-Line, Centurion, Gliderol and Dominator, so either brand is a one-visit repair — send a photo with your quote request and we will identify what you have before we arrive.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Garage Door Repair Cost Guide", href: "/garage-door-repair-cost-perth" },
  { label: "Garage Door Service Cost Perth", href: "/garage-door-service-cost-perth" },
  { label: "Garage Door Motors — Capital 1100N & 1500N", href: "/garage-door-motors-perth" },
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
  if (HUNTINGDALE_SEO.title.length > 60) throw new Error(`seoTitle ${HUNTINGDALE_SEO.title.length} chars (>60)`);
  if (HUNTINGDALE_SEO.description.length > 160) throw new Error(`seoDescription ${HUNTINGDALE_SEO.description.length} chars (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ PROOF_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!PROOF_PARAGRAPH.includes(PROOF_MARKER)) throw new Error("PROOF_PARAGRAPH must contain PROOF_MARKER.");

  console.log(`Huntingdale enhancement → ${CMS_API_URL}`);
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

  if (page.seoTitle !== HUNTINGDALE_SEO.title) {
    page.seoTitle = HUNTINGDALE_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== HUNTINGDALE_SEO.description) {
    page.seoDescription = HUNTINGDALE_SEO.description;
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
