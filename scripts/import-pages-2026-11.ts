/**
 * Nov-2026 page program importer (docs/seo/plan-2026-11-pages.md).
 *
 * Creates the new money/service pages of the 10-day program in the CMS as
 * DRAFTS (Phase A) and, once the user has published a page from /admin, wires
 * it into the site (Phase B). Both phases are idempotent and re-runnable; a
 * dry run is the default and prints exactly what would change.
 *
 *   Phase A — POST /api/admin/pages as status "Draft" with the catalog price
 *             rows pinned by exact scenario NAME, the real Google reviews
 *             pinned by customer name, FAQs and the page's own RelatedServices
 *             links. 409 = already exists, skipped. After the POST the page is
 *             re-read and its slug/status/pin counts verified.
 *
 *   Phase B — runs ONLY for pages whose CMS status is "Published" (a Draft is a
 *             live 404, and linking to it would break the HREF rule):
 *               1. append-if-missing RelatedServices links on the parent Flat
 *                  pages (hub, cost guide, sibling money pages);
 *               2. the same on the matching problem pages and blog posts
 *                  (RelatedServices — never RelatedArticles, which the article
 *                  mapper re-prefixes with /blog/);
 *               3. the same on the listed case studies, so the service page's
 *                  "Recent work" picks them up (lib/case-studies/service-pick.ts
 *                  matches on relatedServices href);
 *             every PUT is re-read and the link's presence verified; the
 *             destination URL is checked for a plain 200 first.
 *
 * Usage (dry run by default; CMS_API_URL is REQUIRED — no localhost default,
 * because the local :5179 CMS can serve another client's database):
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/import-pages-2026-11.ts
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/import-pages-2026-11.ts --only garage-door-cable-repair-perth --phase a --apply
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/import-pages-2026-11.ts --phase b --apply
 *
 * The admin password comes from CMS_ADMIN_PASSWORD, else (production only) from
 * the CMS repo's gitignored appsettings.Production.json (SeedAdmin.Password).
 */

import { readFileSync } from "node:fs";
import type { ServicePage } from "../types/service-page";
import { garageDoorCableRepairPerth } from "../content/service-pages/garage-door-cable-repair-perth";
import { garageDoorLockRepairPerth } from "../content/service-pages/garage-door-lock-repair-perth";
import { garageDoorSensorRepairPerth } from "../content/service-pages/garage-door-sensor-repair-perth";
import { garageDoorOffTrackRepairPerth } from "../content/service-pages/garage-door-off-track-repair-perth";

export {};

/* ------------------------------------------------------------------ *
 * Manifest
 * ------------------------------------------------------------------ */

interface LinkTarget {
  /** Slug of the page that receives a link TO the new page. */
  slug: string;
  /** Admin route group of that page ("Flat", "Problems", "Blog", "CaseStudies"). */
  routeGroup: "Flat" | "Problems" | "Blog" | "CaseStudies";
}

interface PagePlan {
  source: ServicePage;
  /** Exact `PricingItems.scenario` strings, in display order. */
  pricingPins: string[];
  /** Exact `customerName` values of the Google reviews to pin (2–3). */
  reviewPins: string[];
  /** Pages that get an append-if-missing RelatedServices link to the new page once it is Published. */
  inboundLinks: LinkTarget[];
}

const PLANS: PagePlan[] = [
  {
    source: garageDoorCableRepairPerth,
    pricingPins: ["Cable snapped or off the drum", "Door off track / stuck", "After-hours / emergency call-out"],
    reviewPins: ["Duane S.", "Marty P.", "Ross L."],
    inboundLinks: [
      { slug: "garage-door-repairs-perth", routeGroup: "Flat" },
      { slug: "garage-door-spring-repair-perth", routeGroup: "Flat" },
      { slug: "emergency-garage-door-repairs-perth", routeGroup: "Flat" },
      { slug: "garage-door-repair-cost-perth", routeGroup: "Flat" },
      { slug: "garage-door-spring-or-cable-broken", routeGroup: "Problems" },
      { slug: "garage-door-wont-open", routeGroup: "Problems" },
      { slug: "garage-door-cable-repair-signs-and-cost", routeGroup: "Blog" },
      // Photo-backed cable jobs → "Recent work" on the new page.
      { slug: "garage-door-repairs-jane-brook-snapped-cable-brackets-perth", routeGroup: "CaseStudies" },
      { slug: "garage-door-repairs-byford-roller-door-cable-off-drum-perth", routeGroup: "CaseStudies" },
      { slug: "garage-door-cable-drum-repair-fremantle-perth", routeGroup: "CaseStudies" },
      { slug: "garage-door-cable-replacement-willetton-perth", routeGroup: "CaseStudies" },
      { slug: "garage-door-lift-cable-replacement-bayswater-perth", routeGroup: "CaseStudies" },
      { slug: "garage-door-repairs-forrestfield-snapped-cable-brackets-perth", routeGroup: "CaseStudies" },
      { slug: "garage-door-repairs-spearwood-stuck-door-cables-brackets-perth", routeGroup: "CaseStudies" },
      { slug: "garage-door-repairs-kardinya-cable-springs-motor-perth", routeGroup: "CaseStudies" },
    ],
  },
  {
    source: garageDoorLockRepairPerth,
    pricingPins: ["Roller door lock + arms", "Hinges & rollers / wheels"],
    reviewPins: ["Janelle S.", "Chantelle N.", "Ross L."],
    inboundLinks: [
      { slug: "roller-door-repairs-perth", routeGroup: "Flat" },
      { slug: "garage-door-repairs-perth", routeGroup: "Flat" },
      { slug: "garage-door-repair-cost-perth", routeGroup: "Flat" },
      { slug: "garage-door-maintenance-perth", routeGroup: "Flat" },
      { slug: "garage-door-wont-open", routeGroup: "Problems" },
    ],
  },
  {
    source: garageDoorSensorRepairPerth,
    pricingPins: ["Safety sensors / photo eyes", "Motor / opener not working (repair)"],
    reviewPins: ["Ross L.", "Jacques D.", "Kasem S."],
    inboundLinks: [
      { slug: "garage-door-opener-repair-perth", routeGroup: "Flat" },
      { slug: "garage-door-repairs-perth", routeGroup: "Flat" },
      { slug: "garage-door-maintenance-perth", routeGroup: "Flat" },
      { slug: "garage-door-wont-close", routeGroup: "Problems" },
      { slug: "garage-door-motor-not-responding", routeGroup: "Problems" },
      { slug: "how-to-fix-garage-door-sensor", routeGroup: "Blog" },
    ],
  },
  {
    source: garageDoorOffTrackRepairPerth,
    pricingPins: ["Door off track / stuck", "Cable snapped or off the drum", "Hinges & rollers / wheels"],
    reviewPins: ["Marty P.", "Duane S.", "Ross L."],
    inboundLinks: [
      { slug: "garage-door-repairs-perth", routeGroup: "Flat" },
      { slug: "roller-door-repairs-perth", routeGroup: "Flat" },
      { slug: "emergency-garage-door-repairs-perth", routeGroup: "Flat" },
      { slug: "garage-door-repair-cost-perth", routeGroup: "Flat" },
      { slug: "garage-door-off-track", routeGroup: "Problems" },
      { slug: "garage-door-stuck-halfway", routeGroup: "Problems" },
      { slug: "roller-door-off-track-repair-gosnells-perth", routeGroup: "CaseStudies" },
      { slug: "garage-door-repairs-secret-harbour-door-off-track-perth", routeGroup: "CaseStudies" },
      { slug: "garage-door-repairs-padbury-roller-door-tracks-perth", routeGroup: "CaseStudies" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Config / args
 * ------------------------------------------------------------------ */

const CMS_API_URL = (process.env.CMS_API_URL ?? "").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const SITE_URL = (process.env.SITE_URL ?? "https://capitalgaragedoors.com.au").replace(/\/$/, "");
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const PHASE = (args.includes("--phase") ? args[args.indexOf("--phase") + 1] ?? "" : "both").toLowerCase();
const ONLY = args.includes("--only") ? (args[args.indexOf("--only") + 1] ?? null) : null;
if (!["a", "b", "both"].includes(PHASE)) throw new Error(`--phase must be a, b or both (got "${PHASE}")`);

function resolveAdminPassword(): string {
  if (process.env.CMS_ADMIN_PASSWORD) return process.env.CMS_ADMIN_PASSWORD;
  if (!IS_PROD) throw new Error("CMS_ADMIN_PASSWORD is required for a non-production CMS_API_URL.");
  const raw = readFileSync(CMS_APPSETTINGS_PROD, "utf8").replace(/^\uFEFF/, "");
  const pw = (JSON.parse(raw) as { SeedAdmin?: { Password?: string } }).SeedAdmin?.Password;
  if (!pw) throw new Error("SeedAdmin.Password missing from appsettings.Production.json.");
  return pw;
}

/* ------------------------------------------------------------------ *
 * CMS types + client
 * ------------------------------------------------------------------ */

interface PageRef {
  id: number;
  slug: string;
  routeGroup: string;
  status: string;
  templateType: string;
}
interface AdminPage extends PageRef {
  title: string;
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

let token = "";

async function api<T>(path: string, init: RequestInit = {}): Promise<{ status: number; body: T }> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = text;
  }
  if (!res.ok && res.status !== 409) {
    throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return { status: res.status, body: body as T };
}
const get = async <T,>(path: string): Promise<T> => (await api<T>(path)).body;

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

async function listAllPages(): Promise<PageRef[]> {
  const out: PageRef[] = [];
  for (let pageNumber = 1; pageNumber <= 50; pageNumber++) {
    const body = await get<{ items: PageRef[]; totalPages?: number }>(
      `/api/admin/pages?pageNumber=${pageNumber}&pageSize=500`,
    );
    out.push(...(body.items ?? []));
    if (pageNumber >= (body.totalPages ?? 1)) break;
  }
  return out;
}

async function findOrCreateAsset(cdnUrl: string, altText: string): Promise<number | null> {
  for (let pageNumber = 1; pageNumber <= 50; pageNumber++) {
    const body = await get<{ items: { id: number; cdnUrl: string }[]; totalPages: number }>(
      `/api/admin/assets?pageNumber=${pageNumber}&pageSize=100`,
    );
    const existing = (body.items ?? []).find((a) => a.cdnUrl === cdnUrl);
    if (existing) return existing.id;
    if (pageNumber >= (body.totalPages || 1)) break;
  }
  if (!APPLY) return null;
  const { body } = await api<{ id: number }>(`/api/admin/assets`, {
    method: "POST",
    body: JSON.stringify({ cdnUrl, altText, width: null, height: null }),
  });
  return body.id;
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

/** Same transform as scripts/import-new-service-pages.ts, but status Draft. */
function toCreatePayload(
  page: ServicePage,
  heroImageAssetId: number | null,
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: null }[],
  reviews: { reviewId: number; sortOrder: number }[],
) {
  return {
    templateType: "ServicePage",
    routeGroup: "Flat",
    slug: page.slug,
    title: page.serviceName,
    seoTitle: page.seo.title,
    seoDescription: page.seo.description,
    noIndex: false,
    status: "Draft",
    heroImageAssetId,
    data: {
      hero: {
        h1: page.hero.h1,
        subtitle: page.hero.subtitle,
        badges: page.hero.badges,
        imageAlt: page.hero.imageAlt,
        floatingCardLabel: page.hero.floatingCardLabel,
      },
      directAnswer: page.directAnswer,
      intro: page.intro,
      problems: page.problems.map((p) => ({ label: p.label, icon: p.icon })),
      includedItems: page.includedItems,
      processSteps: page.processSteps,
      costGuidanceIntro: page.costGuidance.intro,
      whyChoose: page.whyChoose,
      serviceAreas: page.serviceAreas,
      cta: page.cta,
    },
    faqs: page.faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
    relatedLinks: page.relatedServices.map((l, i) => ({
      targetPageId: null,
      staticHref: l.href,
      labelOverride: l.name,
      linkGroup: "RelatedServices",
      sortOrder: i,
    })),
    pricingRows,
    reviews,
    services: [],
  };
}

/* ------------------------------------------------------------------ *
 * Guards
 * ------------------------------------------------------------------ */

const codePoints = (s: string) => Array.from(s).length;

function guard(plan: PagePlan): void {
  const p = plan.source;
  const errors: string[] = [];
  if (codePoints(p.seo.title) > 60) errors.push(`seo.title is ${codePoints(p.seo.title)} code points (>60)`);
  if (codePoints(p.seo.description) > 160) errors.push(`seo.description is ${codePoints(p.seo.description)} code points (>160)`);
  // Prose must be price-free; only the fallback costGuidance rows may carry catalog figures.
  const { costGuidance, ...prose } = p;
  void costGuidance;
  if (/\$\s?\d/.test(JSON.stringify(prose))) errors.push("prose contains a dollar figure — prices come only from the pinned catalog rows");
  if (/licensed|insured|lifetime|#1|authori[sz]ed dealer|\b20\+? years\b/i.test(JSON.stringify(prose))) {
    errors.push("prose contains an unverified claim (licensed/insured/lifetime/#1/dealer/years)");
  }
  if (p.faqs.length < 6) errors.push(`only ${p.faqs.length} FAQs (need ≥6)`);
  if (p.relatedServices.length < 3) errors.push(`only ${p.relatedServices.length} related links (need ≥3)`);
  if (!p.hero.image.startsWith("https://jadara-hub.b-cdn.net/")) errors.push("hero image must be on the Bunny CDN");
  if (errors.length) throw new Error(`${p.slug}: ${errors.join("; ")}`);
}

async function assertLive200(href: string): Promise<boolean> {
  try {
    const res = await fetch(`${SITE_URL}${href}`, { method: "HEAD", redirect: "manual" });
    return res.status === 200;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ *
 * Phase A
 * ------------------------------------------------------------------ */

async function phaseA(plan: PagePlan, pages: PageRef[]): Promise<void> {
  const p = plan.source;
  console.log(`\n== Phase A: ${p.slug}`);
  const existing = pages.find((x) => x.routeGroup === "Flat" && x.slug === p.slug);
  if (existing) {
    console.log(`  = already exists (id ${existing.id}, ${existing.status}) — skipped`);
    return;
  }

  const pricingBody = await get<{ items?: { id: number; scenario: string }[] } | { id: number; scenario: string }[]>(
    "/api/admin/pricing-items?pageSize=200",
  );
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const byScenario = new Map(pricingItems.map((i) => [i.scenario, i.id]));
  const pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: null }[] = [];
  for (const scenario of plan.pricingPins) {
    const id = byScenario.get(scenario);
    if (!id) throw new Error(`${p.slug}: pricing scenario not in the catalog: "${scenario}"`);
    pricingRows.push({ pricingItemId: id, sortOrder: pricingRows.length, noteOverride: null });
  }

  const reviewBody = await get<{ items?: { id: number; customerName: string }[] } | { id: number; customerName: string }[]>(
    "/api/admin/reviews?pageSize=200",
  );
  const reviewItems = Array.isArray(reviewBody) ? reviewBody : (reviewBody.items ?? []);
  const byName = new Map(reviewItems.map((r) => [r.customerName, r.id]));
  const reviews: { reviewId: number; sortOrder: number }[] = [];
  for (const name of plan.reviewPins) {
    const id = byName.get(name);
    if (!id) throw new Error(`${p.slug}: review not found by customerName: "${name}"`);
    reviews.push({ reviewId: id, sortOrder: reviews.length });
  }

  const heroImageAssetId = await findOrCreateAsset(p.hero.image, p.hero.imageAlt);
  const payload = toCreatePayload(p, heroImageAssetId, pricingRows, reviews);
  console.log(
    `  plan: Draft ServicePage "${p.seo.title}" — ${pricingRows.length} price rows, ${reviews.length} reviews, ` +
      `${payload.faqs.length} FAQs, ${payload.relatedLinks.length} related links, hero asset ${heroImageAssetId ?? "(new)"}`,
  );
  if (!APPLY) {
    console.log("  dry run — nothing written (add --apply)");
    return;
  }

  const { status, body } = await api<{ id: number }>("/api/admin/pages", { method: "POST", body: JSON.stringify(payload) });
  if (status === 409) {
    console.log("  = 409 already exists — skipped");
    return;
  }
  const created = await get<AdminPage>(`/api/admin/pages/${body.id}`);
  const problems: string[] = [];
  if (created.slug !== p.slug) problems.push(`slug ${created.slug}`);
  if (created.status !== "Draft") problems.push(`status ${created.status}`);
  if (created.pricingRows.length !== pricingRows.length) problems.push(`pricingRows ${created.pricingRows.length}`);
  if (created.reviews.length !== reviews.length) problems.push(`reviews ${created.reviews.length}`);
  if (created.faqs.length !== payload.faqs.length) problems.push(`faqs ${created.faqs.length}`);
  if (problems.length) {
    process.exitCode = 1;
    console.error(`  ! created (id ${body.id}) but verification failed: ${problems.join(", ")}`);
  } else {
    console.log(`  ✓ created as Draft (id ${body.id}) and verified — publish it from /admin, then run --phase b`);
  }
}

/* ------------------------------------------------------------------ *
 * Phase B
 * ------------------------------------------------------------------ */

async function phaseB(plan: PagePlan, pages: PageRef[]): Promise<void> {
  const p = plan.source;
  const href = `/${p.slug}`;
  console.log(`\n== Phase B: ${p.slug}`);
  const target = pages.find((x) => x.routeGroup === "Flat" && x.slug === p.slug);
  if (!target) {
    console.log("  - not in the CMS yet (run Phase A first)");
    return;
  }
  if (target.status !== "Published") {
    console.log(`  - still ${target.status} — publish it from /admin, then re-run --phase b`);
    return;
  }
  if (!(await assertLive200(href))) {
    console.log(`  ! ${SITE_URL}${href} does not return 200 yet — wait for revalidation, then re-run`);
    return;
  }

  for (const link of plan.inboundLinks) {
    const ref = pages.find((x) => x.routeGroup === link.routeGroup && x.slug === link.slug);
    if (!ref) {
      console.warn(`  ! ${link.routeGroup}/${link.slug} not found — skipped`);
      continue;
    }
    const page = await get<AdminPage>(`/api/admin/pages/${ref.id}`);
    if (page.relatedLinks.some((l) => l.linkGroup === "RelatedServices" && l.staticHref === href)) {
      console.log(`  = ${link.routeGroup}/${link.slug} already links ${href}`);
      continue;
    }
    const sortOrder = page.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1;
    page.relatedLinks.push({
      id: 0,
      targetPageId: null,
      staticHref: href,
      labelOverride: p.serviceName,
      linkGroup: "RelatedServices",
      sortOrder,
    });
    if (!APPLY) {
      console.log(`  plan: ${link.routeGroup}/${link.slug} += RelatedServices ${href}`);
      continue;
    }
    await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    const after = await get<AdminPage>(`/api/admin/pages/${page.id}`);
    const ok = after.relatedLinks.some((l) => l.linkGroup === "RelatedServices" && l.staticHref === href);
    if (!ok) {
      process.exitCode = 1;
      console.error(`  ! ${link.routeGroup}/${link.slug}: written but the link is missing on re-read`);
    } else {
      console.log(`  ✓ ${link.routeGroup}/${link.slug} += RelatedServices ${href}`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

async function main() {
  if (!CMS_API_URL) throw new Error("CMS_API_URL is required (e.g. https://cgd.runasp.net). No localhost default on purpose.");
  const plans = PLANS.filter((pl) => !ONLY || pl.source.slug === ONLY);
  if (!plans.length) throw new Error(`no plan matches --only ${ONLY}`);
  for (const pl of plans) guard(pl);

  console.log(`${APPLY ? "APPLY" : "DRY RUN"} → ${CMS_API_URL} (phase ${PHASE}; ${plans.length} page(s))`);
  await login();
  console.log("✓ logged in");
  const pages = await listAllPages();

  if (PHASE === "a" || PHASE === "both") for (const pl of plans) await phaseA(pl, pages);
  const fresh = PHASE === "both" && APPLY ? await listAllPages() : pages;
  if (PHASE === "b" || PHASE === "both") for (const pl of plans) await phaseB(pl, fresh);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
