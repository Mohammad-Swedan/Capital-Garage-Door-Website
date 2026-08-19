/**
 * Padbury suburb page (2026-08-19) — create as DRAFT (guide-price table pinned
 * at creation, batch-3 style), then wire in after publishing. Same two-phase,
 * idempotent contract as scripts/import-dayton-page.ts; research in the header
 * of content/service-suburb-pages-padbury.ts (73 imp/90d @ pos 31 on the
 * homepage, weak SERP, anchored by the real Padbury roller-door-tracks job).
 *
 *   Phase A — create /garage-door-repairs-padbury as a DRAFT with the standard
 *             8-scenario pricing pins. 409 = already exists, skipped.
 *
 *   Phase B — runs ONLY once that page is Published:
 *               1. Links the "Padbury" suburb row (Northern Suburbs) via pageId.
 *               2. Repoints every Flat page's "Padbury" NearbySuburbs chip that
 *                  still points at /service-areas (Kingsley + Duncraig carry one).
 *               3. Appends a "Padbury" chip to Joondalup (it has no placeholder).
 *               4. Appends "Padbury" to the /garage-door-repairs-perth hub grid.
 *               5. Adds a Kingsley → Padbury RelatedPages link.
 *
 * PRODUCTION is the default (same as scripts/import-job-pages-2026-08.ts); the
 * admin password resolves from CMS_ADMIN_PASSWORD, else SeedAdmin.Password in the
 * CMS repo's appsettings.Production.json (never printed).
 *   npx tsx scripts/import-padbury-page.ts
 */

import { readFileSync } from "node:fs";
import { padburyPage } from "../content/service-suburb-pages-padbury";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

function resolveAdminPassword(): string {
  if (process.env.CMS_ADMIN_PASSWORD) return process.env.CMS_ADMIN_PASSWORD;
  if (!IS_PROD) return "Admin#12345";
  const raw = readFileSync(CMS_APPSETTINGS_PROD, "utf8").replace(/^\uFEFF/, "");
  const pw = (JSON.parse(raw) as { SeedAdmin?: { Password?: string } }).SeedAdmin?.Password;
  if (!pw) throw new Error("SeedAdmin.Password missing from appsettings.Production.json.");
  return pw;
}
const ADMIN_PASSWORD = resolveAdminPassword();

const TARGET_SLUG = padburyPage.slug;
const KINGSLEY_SLUG = "garage-door-repairs-kingsley";
const JOONDALUP_SLUG = "garage-door-repairs-joondalup";
const HUB_SLUG = "garage-door-repairs-perth";
const SUBURB_NAME = "Padbury";

/** Standard pin set (exact catalog scenario strings — note the × in "×2").
 * No commercial pin: Padbury is residential territory. */
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

interface PricingItem {
  id: number;
  scenario: string;
}

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

let token = "";

async function api<T>(path: string, init: RequestInit = {}): Promise<{ status: number; body: T }> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
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

async function get<T>(path: string): Promise<T> {
  return (await api<T>(path)).body;
}

async function login(): Promise<void> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status}) at ${CMS_API_URL}.`);
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Login succeeded but no token was returned.");
  token = data.token;
}

function staticLink(href: string, label: string, linkGroup: string, sortOrder: number) {
  return { targetPageId: null, staticHref: href, labelOverride: label, linkGroup, sortOrder };
}

function toCreatePayload(pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: null }[]) {
  const page = padburyPage;
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
      availableServices: page.availableServices.map((s) => ({
        title: s.title,
        description: s.description,
        icon: s.icon,
      })),
      problems: page.problems.map((p) => ({
        title: p.title,
        description: p.description,
        icon: p.icon,
      })),
      costGuidance: {
        intro: page.costGuidance.intro,
        factors: page.costGuidance.factors,
        note: page.costGuidance.note ?? "",
      },
      whyChooseUs: page.whyChooseUs.map((w) => ({
        title: w.title,
        description: w.description,
        icon: w.icon,
      })),
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
    faqs: page.faqs.map((f) => ({
      question: f.question,
      answer: f.answer,
      sortOrder: f.sortOrder,
      faqItemId: f.faqItemId,
    })),
    relatedLinks: page.relatedLinks.map((l) => ({
      targetPageId: l.targetPageId,
      staticHref: l.staticHref,
      labelOverride: l.labelOverride,
      linkGroup: l.linkGroup,
      sortOrder: l.sortOrder,
    })),
    pricingRows: page.pricingRows.map((r) => ({
      pricingItemId: r.pricingItemId,
      sortOrder: r.sortOrder,
      noteOverride: r.noteOverride,
    })),
    reviews: page.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder })),
    services: page.services.map((s) => ({ serviceId: s.serviceId, sortOrder: s.sortOrder })),
  };
}

async function main() {
  // Copy guards (same rules as the other suburb scripts).
  const { title, description } = padburyPage.seo;
  if (title.length > 60) console.warn(`! seo.title >60 chars (${title.length})`);
  if (description.length > 160) console.warn(`! seo.description >160 chars (${description.length})`);
  const allCopy = JSON.stringify(padburyPage);
  if (/\$\d/.test(allCopy)) throw new Error("Copy contains a dollar figure — prices may only come from the pricing catalog.");

  console.log(`Padbury page → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  /* ---------------- Phase A: create as draft (with pins) ---------------- */
  const pricingBody = await get<PricingItem[] | { items: PricingItem[] }>(
    "/api/admin/pricing-items?pageSize=200",
  );
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const byScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));
  const pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: null }[] = [];
  for (const scenario of PRICING_PINS) {
    const pricingItemId = byScenario.get(scenario);
    if (!pricingItemId) {
      console.warn(`  ! pricing scenario not in catalog, pin skipped: "${scenario}"`);
      continue;
    }
    pricingRows.push({ pricingItemId, sortOrder: pricingRows.length, noteOverride: null });
  }

  const { status } = await api<{ id: number }>("/api/admin/pages", {
    method: "POST",
    body: JSON.stringify(toCreatePayload(pricingRows)),
  });
  console.log(
    status === 409
      ? `  = ${TARGET_SLUG} already exists (skipped)`
      : `  ✓ ${TARGET_SLUG} created (Draft, ${pricingRows.length} price rows)`,
  );

  /* ---------------- Phase B: post-publish wiring ---------------- */
  const list = await get<{ items: { id: number; slug: string; routeGroup: string; status: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const flatPages = list.items.filter((p) => p.routeGroup === "Flat");
  const bySlug = new Map(flatPages.map((p) => [p.slug, p]));

  const target = bySlug.get(TARGET_SLUG);
  if (!target) throw new Error(`${TARGET_SLUG} missing from the Flat page list after create.`);
  if (target.status !== "Published") {
    console.log(
      `\n${TARGET_SLUG} is still a Draft — skipping the wiring phase.\n` +
        "Publish it in /admin, then re-run this script to link everything in.",
    );
    return;
  }

  console.log("\nPage is published — wiring it in:");

  // B1. Link the "Padbury" suburb row.
  const regionsRaw = await get<Region[] | { items: Region[] }>("/api/admin/service-area-regions");
  const regions = Array.isArray(regionsRaw) ? regionsRaw : regionsRaw.items;
  let linked = false;
  for (const region of regions) {
    const suburb = region.suburbs.find((s) => s.name.toLowerCase() === SUBURB_NAME.toLowerCase());
    if (!suburb) continue;
    linked = true;
    if (suburb.pageId === target.id) {
      console.log(`  = "${SUBURB_NAME}" suburb row already linked`);
      break;
    }
    await api(`/api/admin/suburbs/${suburb.id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: suburb.id,
        regionId: region.id,
        name: suburb.name,
        slug: suburb.slug,
        pageId: target.id,
        sortOrder: suburb.sortOrder,
      }),
    });
    console.log(`  ✓ "${SUBURB_NAME}" suburb row → page ${target.id} (region "${region.name}")`);
    break;
  }
  if (!linked) console.warn(`  ! no "${SUBURB_NAME}" suburb row found — link it in /admin/service-areas`);

  // B2. Repoint placeholder chips across every Flat page.
  for (const item of flatPages) {
    const page = await get<AdminPage>(`/api/admin/pages/${item.id}`);
    let changed = false;
    for (const link of page.relatedLinks) {
      if (link.linkGroup !== "NearbySuburbs") continue;
      if (link.labelOverride !== SUBURB_NAME) continue;
      if (link.staticHref !== "/service-areas") continue;
      link.staticHref = `/${TARGET_SLUG}`;
      changed = true;
    }
    if (changed) {
      await api(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        body: JSON.stringify(toUpdateBody(page)),
      });
      console.log(`  ✓ ${page.slug}: "${SUBURB_NAME}" chip → /${TARGET_SLUG}`);
    }
  }

  // B3. Hub grid.
  const hubRef = bySlug.get(HUB_SLUG);
  if (!hubRef) {
    console.warn(`  ! hub page not found: ${HUB_SLUG}`);
  } else {
    const hub = await get<AdminPage>(`/api/admin/pages/${hubRef.id}`);
    const areas = hub.data.serviceAreas as string[] | undefined;
    if (!Array.isArray(areas)) {
      console.warn(`  ! ${HUB_SLUG} has no data.serviceAreas array, skipped`);
    } else if (areas.includes(SUBURB_NAME)) {
      console.log(`  = ${HUB_SLUG} grid already lists ${SUBURB_NAME}`);
    } else {
      areas.push(SUBURB_NAME);
      await api(`/api/admin/pages/${hub.id}`, {
        method: "PUT",
        body: JSON.stringify(toUpdateBody(hub)),
      });
      console.log(`  ✓ ${HUB_SLUG}: grid += ${SUBURB_NAME}`);
    }
  }

  // B3b. Joondalup has no "Padbury" placeholder chip — append one.
  const joondalupRef = bySlug.get(JOONDALUP_SLUG);
  if (!joondalupRef) {
    console.warn(`  ! ${JOONDALUP_SLUG} not found — chip skipped`);
  } else {
    const joondalup = await get<AdminPage>(`/api/admin/pages/${joondalupRef.id}`);
    const hasChip = joondalup.relatedLinks.some(
      (l) => l.linkGroup === "NearbySuburbs" && l.staticHref === `/${TARGET_SLUG}`,
    );
    if (hasChip) {
      console.log(`  = ${JOONDALUP_SLUG} already has a ${SUBURB_NAME} chip`);
    } else {
      const chips = joondalup.relatedLinks.filter((l) => l.linkGroup === "NearbySuburbs");
      joondalup.relatedLinks.push({
        id: 0,
        targetPageId: null,
        staticHref: `/${TARGET_SLUG}`,
        labelOverride: SUBURB_NAME,
        linkGroup: "NearbySuburbs",
        sortOrder: chips.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1,
      });
      await api(`/api/admin/pages/${joondalup.id}`, {
        method: "PUT",
        body: JSON.stringify(toUpdateBody(joondalup)),
      });
      console.log(`  ✓ ${JOONDALUP_SLUG}: NearbySuburbs += ${SUBURB_NAME}`);
    }
  }

  // B4. Cross-link Kingsley → Padbury.
  const kingsleyRef = bySlug.get(KINGSLEY_SLUG);
  if (!kingsleyRef) {
    console.warn(`  ! ${KINGSLEY_SLUG} not found — cross-link skipped`);
  } else {
    const kingsley = await get<AdminPage>(`/api/admin/pages/${kingsleyRef.id}`);
    const hasLink = kingsley.relatedLinks.some(
      (l) => l.linkGroup === "RelatedPages" && l.staticHref === `/${TARGET_SLUG}`,
    );
    if (hasLink) {
      console.log(`  = ${KINGSLEY_SLUG} already links to /${TARGET_SLUG}`);
    } else {
      kingsley.relatedLinks.push({
        id: 0,
        targetPageId: null,
        staticHref: `/${TARGET_SLUG}`,
        labelOverride: "Garage Door Repairs Padbury",
        linkGroup: "RelatedPages",
        sortOrder: kingsley.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1,
      });
      await api(`/api/admin/pages/${kingsley.id}`, {
        method: "PUT",
        body: JSON.stringify(toUpdateBody(kingsley)),
      });
      console.log(`  ✓ ${KINGSLEY_SLUG}: RelatedPages += /${TARGET_SLUG}`);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
