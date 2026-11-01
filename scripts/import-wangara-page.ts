/**
 * Wangara suburb page (2026-11-01, the Nov-2026 program's one suburb page) — create as DRAFT
 * with the guide-price table pinned at creation (Cockburn Central pattern: the standard 8
 * scenarios PLUS the commercial roller door service row), then wire in after publishing.
 *
 * Evidence: content/service-suburb-pages-wangara.ts header and docs/seo/serp-pulls-2026-11-01.md.
 * Two phases, both idempotent, dry run by default:
 *
 *   Phase A — create /garage-door-repairs-wangara as a DRAFT with the pins. 409 = exists, skipped.
 *             The created page is re-read and its slug/status/pin count verified.
 *
 *   Phase B — runs ONLY once the page is Published AND returns a plain 200 on the live site:
 *               1. links the "Wangara" suburb row (Northern Suburbs region) via `pageId` —
 *                  without it the /service-areas chip is plain text and the page is an orphan;
 *               2. repoints every Flat page's "Wangara" NearbySuburbs chip that still points at
 *                  the /service-areas placeholder;
 *               3. appends "Wangara" to the /garage-door-repairs-perth hub grid;
 *               4. appends a RelatedPages link from the Wanneroo and Joondalup suburb pages and a
 *                  RelatedServices link from the commercial hub.
 *             Every write is re-read and verified.
 *
 *   CMS_API_URL=https://cgd.runasp.net npx tsx scripts/import-wangara-page.ts [--phase a|b] [--apply]
 */

import { readFileSync } from "node:fs";
import { wangaraPage } from "../content/service-suburb-pages-wangara";

export {};

const CMS_API_URL = (process.env.CMS_API_URL ?? "").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const SITE_URL = (process.env.SITE_URL ?? "https://capitalgaragedoors.com.au").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";
const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const PHASE = (args.includes("--phase") ? (args[args.indexOf("--phase") + 1] ?? "") : "both").toLowerCase();
if (!["a", "b", "both"].includes(PHASE)) throw new Error(`--phase must be a, b or both (got "${PHASE}")`);

const TARGET_SLUG = wangaraPage.slug;
const SUBURB_NAME = wangaraPage.suburb;
const HUB_SLUG = "garage-door-repairs-perth";
const RELATED_PAGES_FROM = ["garage-door-repairs-wanneroo", "garage-door-repairs-joondalup"];
const RELATED_SERVICES_FROM = ["commercial-garage-doors-perth"];

/** Standard pin set + the commercial row (exact catalog scenario strings — note the × in "×2"). */
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
interface Suburb {
  id: number;
  name: string;
  slug: string | null;
  pageId: number | null;
  sortOrder: number;
}
interface Region {
  id: number;
  name: string;
  suburbs: Suburb[];
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
  if (!res.ok && res.status !== 409) throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
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
    const body = await get<{ items: PageRef[]; totalPages?: number }>(`/api/admin/pages?pageNumber=${pageNumber}&pageSize=500`);
    out.push(...(body.items ?? []));
    if (pageNumber >= (body.totalPages ?? 1)) break;
  }
  return out;
}

function staticLink(href: string, label: string, linkGroup: string, sortOrder: number) {
  return { targetPageId: null, staticHref: href, labelOverride: label, linkGroup, sortOrder };
}

function toCreatePayload(pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: null }[]) {
  const page = wangaraPage;
  return {
    templateType: "ServiceSuburbPage",
    routeGroup: "Flat",
    slug: page.slug,
    title: `${page.service} ${page.suburb}`,
    seoTitle: page.seo.title,
    seoDescription: page.seo.description,
    noIndex: false,
    status: "Draft",
    heroImageAssetId: null,
    data: {
      service: page.service,
      suburb: page.suburb,
      region: page.region,
      hero: { subtitle: page.hero.subtitle, trustBadges: page.hero.trustBadges },
      directAnswer: page.directAnswer,
      localIntro: page.localIntro,
      availableServices: page.availableServices.map((s) => ({ title: s.title, description: s.description, icon: s.icon })),
      problems: page.problems.map((p) => ({ title: p.title, description: p.description, icon: p.icon })),
      costGuidance: { intro: page.costGuidance.intro, factors: page.costGuidance.factors, note: page.costGuidance.note ?? "" },
      whyChooseUs: page.whyChooseUs.map((w) => ({ title: w.title, description: w.description, icon: w.icon })),
      localProof: [],
      caseStudySlugs: page.caseStudySlugs ?? [],
    },
    faqs: page.faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
    relatedLinks: [
      ...page.nearbySuburbs.map((l, i) => staticLink(l.href, l.label, "NearbySuburbs", i)),
      ...page.relatedPages.map((l, i) => staticLink(l.href, l.label, "RelatedPages", i)),
    ],
    pricingRows,
    reviews: [],
    services: [],
  };
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

async function putAndVerify(page: AdminPage, check: (after: AdminPage) => boolean, what: string): Promise<void> {
  if (!APPLY) {
    console.log(`  plan: ${what}`);
    return;
  }
  await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
  const after = await get<AdminPage>(`/api/admin/pages/${page.id}`);
  if (check(after)) console.log(`  ✓ ${what}`);
  else {
    process.exitCode = 1;
    console.error(`  ! ${what}: written but verification failed`);
  }
}

async function isLive200(href: string): Promise<boolean> {
  try {
    const res = await fetch(`${SITE_URL}${href}`, { method: "HEAD", redirect: "manual" });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function main() {
  if (!CMS_API_URL) throw new Error("CMS_API_URL is required (e.g. https://cgd.runasp.net).");
  const codePoints = (s: string) => Array.from(s).length;
  const { title, description } = wangaraPage.seo;
  if (codePoints(title) > 60) throw new Error(`seo.title is ${codePoints(title)} code points (>60)`);
  if (codePoints(description) > 160) throw new Error(`seo.description is ${codePoints(description)} code points (>160)`);
  if (/\$\s?\d/.test(JSON.stringify(wangaraPage))) throw new Error("Copy contains a dollar figure — prices may only come from the pricing catalog.");
  if (/licensed|insured|lifetime|#1\b|authori[sz]ed dealer/i.test(JSON.stringify(wangaraPage))) throw new Error("Copy contains an unverified claim.");

  console.log(`${APPLY ? "APPLY" : "DRY RUN"}: Wangara page → ${CMS_API_URL} (phase ${PHASE})`);
  await login();
  console.log("✓ logged in");
  let pages = await listAllPages();
  const flat = () => pages.filter((p) => p.routeGroup === "Flat");

  /* ---------------- Phase A ---------------- */
  if (PHASE === "a" || PHASE === "both") {
    const existing = flat().find((p) => p.slug === TARGET_SLUG);
    if (existing) {
      console.log(`  = ${TARGET_SLUG} already exists (id ${existing.id}, ${existing.status}) — Phase A skipped`);
    } else {
      const pricingBody = await get<{ items?: { id: number; scenario: string }[] } | { id: number; scenario: string }[]>("/api/admin/pricing-items?pageSize=200");
      const items = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
      const byScenario = new Map(items.map((p) => [p.scenario, p.id]));
      const pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: null }[] = [];
      for (const scenario of PRICING_PINS) {
        const id = byScenario.get(scenario);
        if (!id) throw new Error(`pricing scenario not in catalog: "${scenario}"`);
        pricingRows.push({ pricingItemId: id, sortOrder: pricingRows.length, noteOverride: null });
      }
      const payload = toCreatePayload(pricingRows);
      console.log(`  plan: Draft ServiceSuburbPage "${payload.seoTitle}" — ${pricingRows.length} price rows, ${payload.faqs.length} FAQs, ${payload.relatedLinks.length} links`);
      if (APPLY) {
        const { status, body } = await api<{ id: number }>("/api/admin/pages", { method: "POST", body: JSON.stringify(payload) });
        if (status === 409) console.log("  = 409 already exists — skipped");
        else {
          const created = await get<AdminPage>(`/api/admin/pages/${body.id}`);
          const ok = created.slug === TARGET_SLUG && created.status === "Draft" && created.pricingRows.length === pricingRows.length;
          if (ok) console.log(`  ✓ created as Draft (id ${body.id}) and verified — publish it from /admin, then run --phase b`);
          else {
            process.exitCode = 1;
            console.error(`  ! created (id ${body.id}) but verification failed`);
          }
        }
        pages = await listAllPages();
      }
    }
  }

  /* ---------------- Phase B ---------------- */
  if (PHASE === "b" || PHASE === "both") {
    const target = flat().find((p) => p.slug === TARGET_SLUG);
    if (!target) {
      console.log("  - Phase B: page not in the CMS yet");
      return;
    }
    if (target.status !== "Published") {
      console.log(`  - Phase B: ${TARGET_SLUG} is still ${target.status} — publish it from /admin, then re-run --phase b`);
      return;
    }
    const href = `/${TARGET_SLUG}`;
    if (!(await isLive200(href))) {
      console.log(`  ! ${SITE_URL}${href} does not return 200 yet — wait for revalidation, then re-run`);
      return;
    }
    console.log("Page is published and live — wiring it in:");

    // B1. Suburb row pageId.
    const regionsRaw = await get<Region[] | { items: Region[] }>("/api/admin/service-area-regions");
    const regions = Array.isArray(regionsRaw) ? regionsRaw : regionsRaw.items;
    let found = false;
    for (const region of regions) {
      const suburb = region.suburbs.find((s) => s.name.toLowerCase() === SUBURB_NAME.toLowerCase());
      if (!suburb) continue;
      found = true;
      if (suburb.pageId === target.id) {
        console.log(`  = "${SUBURB_NAME}" suburb row already linked`);
        break;
      }
      if (!APPLY) {
        console.log(`  plan: "${SUBURB_NAME}" suburb row (region "${region.name}") → pageId ${target.id}`);
        break;
      }
      await api(`/api/admin/suburbs/${suburb.id}`, {
        method: "PUT",
        body: JSON.stringify({ id: suburb.id, regionId: region.id, name: suburb.name, slug: suburb.slug, pageId: target.id, sortOrder: suburb.sortOrder }),
      });
      console.log(`  ✓ "${SUBURB_NAME}" suburb row → page ${target.id} (region "${region.name}")`);
      break;
    }
    if (!found) console.warn(`  ! no "${SUBURB_NAME}" suburb row found — link it in /admin/service-areas`);

    // B2. Placeholder chip repoints on every Flat page.
    for (const ref of flat()) {
      const page = await get<AdminPage>(`/api/admin/pages/${ref.id}`);
      let changed = false;
      for (const link of page.relatedLinks) {
        if (link.linkGroup === "NearbySuburbs" && link.labelOverride === SUBURB_NAME && link.staticHref === "/service-areas") {
          link.staticHref = href;
          changed = true;
        }
      }
      if (changed) {
        await putAndVerify(page, (a) => a.relatedLinks.some((l) => l.linkGroup === "NearbySuburbs" && l.labelOverride === SUBURB_NAME && l.staticHref === href), `${page.slug}: "${SUBURB_NAME}" chip → ${href}`);
      }
    }

    // B3. Hub grid.
    const hubRef = flat().find((p) => p.slug === HUB_SLUG);
    if (hubRef) {
      const hub = await get<AdminPage>(`/api/admin/pages/${hubRef.id}`);
      const areas = hub.data.serviceAreas as string[] | undefined;
      if (!Array.isArray(areas)) console.warn(`  ! ${HUB_SLUG} has no data.serviceAreas array`);
      else if (areas.includes(SUBURB_NAME)) console.log(`  = ${HUB_SLUG} grid already lists ${SUBURB_NAME}`);
      else {
        areas.push(SUBURB_NAME);
        await putAndVerify(hub, (a) => ((a.data.serviceAreas as string[]) ?? []).includes(SUBURB_NAME), `${HUB_SLUG}: grid += ${SUBURB_NAME}`);
      }
    }

    // B4. Inbound related links.
    const inbound: { slug: string; group: string }[] = [
      ...RELATED_PAGES_FROM.map((slug) => ({ slug, group: "RelatedPages" })),
      ...RELATED_SERVICES_FROM.map((slug) => ({ slug, group: "RelatedServices" })),
    ];
    for (const { slug, group } of inbound) {
      const ref = flat().find((p) => p.slug === slug);
      if (!ref) {
        console.warn(`  ! ${slug} not found — skipped`);
        continue;
      }
      const page = await get<AdminPage>(`/api/admin/pages/${ref.id}`);
      if (page.relatedLinks.some((l) => l.linkGroup === group && l.staticHref === href)) {
        console.log(`  = ${slug} already links ${href}`);
        continue;
      }
      page.relatedLinks.push({ id: 0, targetPageId: null, staticHref: href, labelOverride: `Garage Door Repairs ${SUBURB_NAME}`, linkGroup: group, sortOrder: page.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1 });
      await putAndVerify(page, (a) => a.relatedLinks.some((l) => l.linkGroup === group && l.staticHref === href), `${slug}: ${group} += ${href}`);
    }
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
