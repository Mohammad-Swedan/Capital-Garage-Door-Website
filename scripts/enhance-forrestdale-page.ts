/**
 * /garage-door-repairs-forrestdale — 2026-08-22 refactor of the batch-3 DRAFT
 * before it publishes alongside the (corridor) Byford case study (idempotent).
 *
 * Why (GSC Domain property 90d + DataForSEO live Perth SERP, 2026-08-22):
 *  - "garage door repairs forrestdale" 34 imp @ pos 14.5 — page 2, on the
 *    HOMEPAGE. The biggest remaining draft-suburb opportunity after Riverton.
 *  - The SERP is the weakest we have pulled: organic #1 is Otto's thin location
 *    page ("Garage Door Repairs Forrestdale WA" — state in title again), #2 is
 *    24 Seven's "Industrial Door Repairs Forrestdale", and #3 is Eden Roc
 *    advertising "Over **7** Jobs Completed". Positions 4-13 are generic Perth,
 *    Fremantle and Armadale pages. Real photos and real depth win here.
 *  - Related searches lead with **"Residential** garage door repairs forrestdale",
 *    then "Mobile", "prices", "Cheap", "Best", "cost" — the draft copy leaned
 *    commercial (Business Park) and under-served that residential intent, so the
 *    title now carries BOTH ("Homes & Commercial") while keeping the industrial
 *    angle that competitor #2 is targeting.
 *  - PAA: "How expensive is it to repair a garage door?", "What are the most
 *    common garage door repairs?", "How much to fix a roller garage door?",
 *    "What's the average lifespan of a garage door?"
 *
 * What it does (single PUT, safe to re-run, KEEPS the page's current status):
 *  1. Pins the standard guide-price scenarios if pricingRows is empty (this
 *     batch-3 draft already ships 9 rows, so the step is a no-op here).
 *  2. seoTitle/seoDescription -> desired state (WA + homes/commercial + mobile).
 *     Lockstep: the seo block in content/service-suburb-pages-batch3.ts.
 *  3. Appends ONE proof paragraph to data.localIntro (PROOF_MARKER-guarded).
 *  4. Appends 3 PAA FAQs (de-duped; no dollar figures).
 *  5. Appends RelatedPages links (roller door repairs, industrial roller doors,
 *     service cost guide).
 *
 * PRODUCTION is the default:  npx tsx scripts/enhance-forrestdale-page.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const TARGET_SLUG = "garage-door-repairs-forrestdale";

/** Desired state — duplicated in content/service-suburb-pages-batch3.ts (keep in lockstep). */
export const FORRESTDALE_SEO = {
  title: "Garage Door Repairs Forrestdale WA | Homes & Commercial",
  description:
    "Mobile garage door repairs in Forrestdale WA — homes, sheds and Business Park roller doors, with guide prices listed. Also Harrisdale, Piara Waters & Haynes.",
};

/** Standard pin set (exact catalog scenario strings — note the × in "×2").
 *  No-op on this page: the batch-3 importer already pinned 9 rows (incl. commercial). */
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

// NB: the marker must be a phrase that appears ONLY in PROOF_PARAGRAPH — the draft's
// own copy already says "Forrestdale Business Park", which silently no-ops the guard.
const PROOF_MARKER = "rather tell you that than sell you a door";
const PROOF_PARAGRAPH =
  "Every repair here is mobile and quoted before it starts: the van comes to you — a house in the Harrisdale-side estates, a shed off Nicholson or Rowley Road, or a tenancy in the Forrestdale Business Park — with springs, cables, rollers, brackets and openers on board, and the price agreed from the published list on this page before anything is touched. Roller doors are the bulk of the work in this corner of Perth, and most of what stops them is smaller than people fear: the crooked, jammed roller door in the recent work below is a nearby Byford job where a lift cable had simply jumped its drum, re-seated and re-tensioned the same afternoon with no new parts at all. We would rather tell you that than sell you a door.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "What are the most common garage door repairs?",
    answer:
      "Across Forrestdale it is a short list: broken torsion springs (the door suddenly feels impossibly heavy), frayed or jumped lift cables, worn rollers and hinges, doors off their tracks, and openers that have stopped holding their travel limits. On the Business Park and shed doors it is curtain tension, bent guides and industrial motors that have been fighting an under-sprung door. All of them are on the guide-price table above, and all of them are same-visit repairs when we arrive with the right parts.",
  },
  {
    question: "How much does it cost to fix a roller garage door?",
    answer:
      "It depends on what has actually failed — a cable that has jumped its drum can be re-seated and re-tensioned with no new parts, while a worn barrel, a snapped spring or a bent guide is a parts job. The guide-price table on this page lists the common roller door scenarios, and commercial roller doors have their own row because they cycle far more often than a home door. You always get a fixed quote before work starts.",
  },
  {
    question: "What is the average lifespan of a garage door?",
    answer:
      "The door itself — the panels or the curtain — will usually last 20 to 30 years if it is not damaged, and often longer on a sheltered opening. The moving parts are what wear out: springs are rated in open-close cycles (roughly 7 to 10 years of normal family use), cables, rollers and hinges a similar span, and openers 10 to 15 years. That is why replacing a tired door is rarely the answer on a sound panel — it is nearly always the hardware around it that needs renewing.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
  { label: "Industrial Roller Doors Perth", href: "/industrial-roller-doors-perth" },
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
  if (FORRESTDALE_SEO.title.length > 60) throw new Error(`seoTitle ${FORRESTDALE_SEO.title.length} chars (>60)`);
  if (FORRESTDALE_SEO.description.length > 160) throw new Error(`seoDescription ${FORRESTDALE_SEO.description.length} chars (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ PROOF_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!PROOF_PARAGRAPH.includes(PROOF_MARKER)) throw new Error("PROOF_PARAGRAPH must contain PROOF_MARKER.");

  console.log(`Forrestdale enhancement → ${CMS_API_URL}`);
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

  if (page.seoTitle !== FORRESTDALE_SEO.title) {
    page.seoTitle = FORRESTDALE_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== FORRESTDALE_SEO.description) {
    page.seoDescription = FORRESTDALE_SEO.description;
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
