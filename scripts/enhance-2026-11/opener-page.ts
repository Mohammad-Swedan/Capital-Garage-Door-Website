/**
 * /garage-door-opener-repair-perth — Nov-2026 enhancement E1 (idempotent).
 *
 * Why (Search Console AU 90d to 2026-10-29 + Keyword Planner + live Perth SERP,
 * recorded in docs/seo/serp-pulls-2026-11-01.md):
 *  - Keyword Planner: "garage door opener repair" 320/mo in Perth, LOW
 *    competition — the biggest low-competition term on the site.
 *  - The page sits at 18.2 ("garage door opener repair", 350 impr), 13.7
 *    ("garage door openers perth", 228) and 8.7 ("garage door opener
 *    replacement perth", 92) with 0 clicks; "garage door motor replacement
 *    perth" (491 impr @ 37) and "garage door motor repair perth" (223 @ 16)
 *    land on the home page and brand pages because no page claims the
 *    replacement intent in its title.
 *  - PAA on "garage door motor replacement perth" is all cost + "can I just
 *    replace the motor" + "how to tell if the motor is broken".
 *
 * What it does (one PUT, safe to re-run):
 *  1. seoTitle/seoDescription → OPENER_SEO. **Kept in lockstep with
 *     scripts/sync-seo-fixes.ts SEO_FIXES["garage-door-opener-repair-perth"]**,
 *     which owns the same two fields and would otherwise revert them.
 *  2. Appends ONE replacement/motor paragraph to data.intro.paragraphs
 *     (guarded by PARA_MARKER).
 *  3. Appends 3 PAA-matched FAQs (de-duped by question; no dollar figures —
 *     the pinned "Motor / opener replacement" row carries the price).
 *  4. Appends a RelatedServices link to /garage-door-motors-perth if missing.
 *  The 2026-09-30 price pins and the 8 motor-job case studies already point at
 *  this page (verified 2026-11-01), so "Recent work" needs no wiring.
 *
 * Dry run by default; CMS_API_URL is REQUIRED (no localhost default):
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/opener-page.ts
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/enhance-2026-11/opener-page.ts --apply
 */

import { readFileSync } from "node:fs";

export {};

const CMS_API_URL = (process.env.CMS_API_URL ?? "").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";
const APPLY = process.argv.includes("--apply");

const TARGET_SLUG = "garage-door-opener-repair-perth";

/** Desired state — duplicated in scripts/sync-seo-fixes.ts SEO_FIXES (keep in lockstep). */
export const OPENER_SEO = {
  title: "Garage Door Opener Repair & Replacement Perth | Same-Day",
  description:
    "Garage door opener repair & motor replacement across Perth. Faulty motors, logic boards, sensors and remotes fixed same-day; new openers installed. Free quote.",
};

const PARA_MARKER = "repair or replace the motor";
const REPLACEMENT_PARAGRAPH =
  "The question we are asked most is whether to repair or replace the motor. Our rule is simple: a receiver, logic board, gear or sensor fault on a motor under ten years old is worth repairing, while a burnt-out motor, a stripped drive gear on an older unit, or an opener whose parts are no longer made is replaced with a new garage door motor on the same visit. Motor replacement is one of our most common jobs across Perth, from Claremont and Belmont to Aveley, Butler and Kingsley, and the recent work on this page shows real replacements. The new opener comes with remotes, a wall button and the safety sensors set up, and the price for a replacement is the listed row in the guide-price table, agreed before we start.";

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "How much does it cost to replace a garage door motor in Perth?",
    answer:
      "The guide-price table on this page shows our listed range for a motor replacement, which covers the new opener, the rail or drive, remotes, a wall button, safety-sensor setup and the fitting itself. Where it lands inside that range depends on the door's size and weight (a heavy double sectional needs a stronger motor than a single roller door) and whether you add Wi-Fi phone control or battery backup. Our garage door motor replacement cost guide breaks the figures down further.",
  },
  {
    question: "Can I just replace the garage door motor and keep the rest of the door?",
    answer:
      "Usually, yes. The motor is a separate unit from the door, so a worn-out opener can be swapped while the panels, tracks and springs stay. The one check we always make first is the door's balance: if a spring has lost tension, the old motor may have burnt out from dragging a heavy door, and a new motor will fail the same way. We balance the door before the new opener goes on so it lasts.",
  },
  {
    question: "How can I tell if my garage door motor is broken?",
    answer:
      "The usual signs are a motor that hums or clicks but the door does not move (a stripped gear or a jammed carriage), a motor that runs for a second and stops (a logic-board or limit fault), a door that only works from the wall button and not the remotes (receiver), or no response at all with the light out (power supply or a dead board). A door that reverses before it closes is almost always the safety sensors, not the motor. We diagnose which on the first visit and quote repair against replacement on the spot.",
  },
];

const NEW_RELATED: { label: string; href: string }[] = [
  { label: "Garage Door Motors Perth", href: "/garage-door-motors-perth" },
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
  if (!IS_PROD) throw new Error("CMS_ADMIN_PASSWORD is required for a non-production CMS_API_URL.");
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

const codePoints = (s: string) => Array.from(s).length;
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** Apply the desired state to a page in memory; returns the change notes (empty = nothing to do). */
export function planChanges(page: AdminPage): string[] {
  const notes: string[] = [];
  if (page.seoTitle !== OPENER_SEO.title) {
    page.seoTitle = OPENER_SEO.title;
    notes.push("seoTitle");
  }
  if (page.seoDescription !== OPENER_SEO.description) {
    page.seoDescription = OPENER_SEO.description;
    notes.push("seoDescription");
  }
  const intro = (page.data.intro ?? {}) as { heading?: string; paragraphs?: string[] };
  const paragraphs = Array.isArray(intro.paragraphs) ? intro.paragraphs : [];
  if (!paragraphs.some((p) => p.includes(PARA_MARKER))) {
    page.data.intro = { ...intro, paragraphs: [...paragraphs, REPLACEMENT_PARAGRAPH] };
    notes.push("intro.paragraphs += replacement paragraph");
  }
  const questions = new Set(page.faqs.map((f) => norm(f.question)));
  let faqSort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
  for (const f of NEW_FAQS) {
    if (questions.has(norm(f.question))) continue;
    page.faqs.push({ id: 0, question: f.question, answer: f.answer, sortOrder: faqSort++, faqItemId: null });
    notes.push(`faq: ${f.question}`);
  }
  let linkSort = page.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1;
  for (const l of NEW_RELATED) {
    if (page.relatedLinks.some((x) => x.linkGroup === "RelatedServices" && x.staticHref === l.href)) continue;
    page.relatedLinks.push({ id: 0, targetPageId: null, staticHref: l.href, labelOverride: l.label, linkGroup: "RelatedServices", sortOrder: linkSort++ });
    notes.push(`related: ${l.href}`);
  }
  return notes;
}

async function main() {
  if (!CMS_API_URL) throw new Error("CMS_API_URL is required (e.g. https://cgd.runasp.net).");
  if (codePoints(OPENER_SEO.title) > 60) throw new Error(`seoTitle ${codePoints(OPENER_SEO.title)} code points (>60)`);
  if (codePoints(OPENER_SEO.description) > 160) throw new Error(`seoDescription ${codePoints(OPENER_SEO.description)} code points (>160)`);
  if (/\$\s?\d/.test(JSON.stringify({ REPLACEMENT_PARAGRAPH, NEW_FAQS }))) throw new Error("Copy contains a dollar figure — prices come only from the catalog.");
  if (!REPLACEMENT_PARAGRAPH.includes(PARA_MARKER)) throw new Error("REPLACEMENT_PARAGRAPH must contain PARA_MARKER.");

  console.log(`${APPLY ? "APPLY" : "DRY RUN"}: opener enhancement → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string; templateType: string }[] }>(
    "/api/admin/pages?pageSize=500",
  );
  const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === TARGET_SLUG);
  if (!ref) throw new Error(`${TARGET_SLUG} (Flat) not found.`);
  if (ref.templateType !== "ServicePage") throw new Error(`${TARGET_SLUG} is a ${ref.templateType}, expected ServicePage.`);
  const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
  if (page.pricingRows.length === 0) console.warn("  ! the page has NO pinned price rows — run add-service-page-pins.ts first");

  const notes = planChanges(page);
  if (!notes.length) {
    console.log("  = already at desired state — nothing to do");
    return;
  }
  console.log(`  ${APPLY ? "applying" : "would apply"} to ${TARGET_SLUG} [${page.status}]:\n    - ${notes.join("\n    - ")}`);
  if (!APPLY) return;

  await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
  const after = await api<AdminPage>(`/api/admin/pages/${page.id}`);
  const drift = planChanges(after);
  if (drift.length) {
    process.exitCode = 1;
    console.error(`  ! written but verification failed — still pending: ${drift.join(", ")}`);
  } else {
    console.log("  ✓ written and verified");
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
