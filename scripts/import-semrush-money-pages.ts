/**
 * Imports the three 2026-08 Semrush-research money pages into the CMS as
 * DRAFTS (user reviews + publishes from /admin):
 *
 *   /industrial-roller-doors-perth        — industrial roller doors 1,000/mo KD 14
 *   /garage-door-remote-replacement-perth — garage door remote replacement 1,000/mo KD 16
 *   /garage-door-panel-replacement-perth  — garage door panels 590/mo KD 14
 *
 * Research: docs/marketing/semrush-2026-08/keyword-map.md. Same contract as
 * scripts/import-new-service-pages.ts (pricing pins by catalog scenario name,
 * review pins by customer name, hero asset by CDN URL; 409 = skip), except
 * pages are created with status "Draft".
 *
 * PHASE B (run again AFTER the user publishes — idempotent): adds upward
 * RelatedServices links from existing pages to whichever of the three are
 * Published (commercial pages → industrial; opener/motors-adjacent pages →
 * remote replacement; repairs page → panel replacement). Without this the
 * published pages would be near-orphans.
 *
 * Local CMS (default):   npx tsx scripts/import-semrush-money-pages.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-semrush-money-pages.ts
 */

import type { ServicePage } from "../types/service-page";
import { industrialRollerDoorsPerth } from "../content/service-pages/industrial-roller-doors-perth";
import { garageDoorRemoteReplacementPerth } from "../content/service-pages/garage-door-remote-replacement-perth";
import { garageDoorPanelReplacementPerth } from "../content/service-pages/garage-door-panel-replacement-perth";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const NEW_PAGES: ServicePage[] = [
  industrialRollerDoorsPerth,
  garageDoorRemoteReplacementPerth,
  garageDoorPanelReplacementPerth,
];

/** Pricing pins per slug — catalog scenario names (exact strings), in display order. */
const PRICING_PINS: Record<string, string[]> = {
  "industrial-roller-doors-perth": [
    "New door — commercial / custom",
    "Commercial roller door (service, from)",
    "Roller door removal & reinstall",
    "Motor / opener replacement",
  ],
  "garage-door-remote-replacement-perth": [
    "Remote (extra / replacement)",
    "Motor / opener not working (repair)",
    "Motor / opener replacement",
    "WiFi / smart control (supply & install)",
  ],
  "garage-door-panel-replacement-perth": [
    "Door damaged (panel / section)",
    "Hinges & rollers / wheels",
    "Door off track / stuck",
    "New garage door — standard (supply & install)",
  ],
};

/** Review pins per slug — real Google reviews the pages quote (content/reviews.ts). */
const REVIEW_PINS: Record<string, string[]> = {
  "industrial-roller-doors-perth": ["Charlotte D."],
  "garage-door-remote-replacement-perth": ["Jacques D."],
  "garage-door-panel-replacement-perth": ["Marty P."],
};

/** Phase B: upward RelatedServices links added to EXISTING pages once a new
 * page is Published. `{ from existing slug → link to add }` */
const UPWARD_LINKS: Record<string, { name: string; href: string; description: string; icon: string }[]> = {
  "commercial-roller-doors-perth": [
    {
      name: "Industrial Roller Doors Perth",
      href: "/industrial-roller-doors-perth",
      description: "Heavy-duty doors and maintenance programs for warehouses and factories.",
      icon: "Building2",
    },
  ],
  "commercial-garage-doors-perth": [
    {
      name: "Industrial Roller Doors Perth",
      href: "/industrial-roller-doors-perth",
      description: "Heavy-duty industrial doors, operators and fleet servicing.",
      icon: "Building2",
    },
  ],
  "roller-door-repairs-perth": [
    {
      name: "Industrial Roller Doors Perth",
      href: "/industrial-roller-doors-perth",
      description: "Industrial curtains, guides and operators — supplied and repaired.",
      icon: "Building2",
    },
  ],
  "garage-door-opener-repair-perth": [
    {
      name: "Garage Door Remote Replacement Perth",
      href: "/garage-door-remote-replacement-perth",
      description: "Remotes for every brand, programmed on the spot — lost remotes wiped.",
      icon: "Radio",
    },
  ],
  "garage-door-repairs-perth": [
    {
      name: "Garage Door Panel Replacement Perth",
      href: "/garage-door-panel-replacement-perth",
      description: "Dented or rusted panels swapped and colour-matched — no new door needed.",
      icon: "Layers",
    },
    {
      name: "Garage Door Remote Replacement Perth",
      href: "/garage-door-remote-replacement-perth",
      description: "Replacement remotes for all major brands, programmed same visit.",
      icon: "Radio",
    },
  ],
  "sectional-garage-doors-perth": [
    {
      name: "Garage Door Panel Replacement Perth",
      href: "/garage-door-panel-replacement-perth",
      description: "One damaged section? Panels replaced individually, colour-matched.",
      icon: "Layers",
    },
  ],
};

/** Which new page each upward link points at (gates Phase B on Published). */
const LINK_TARGET_SLUG = (href: string) => href.replace(/^\//, "");

interface AdminPageListItem {
  id: number;
  slug: string;
  routeGroup: string;
  status: string;
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

/** Find an asset by exact cdnUrl (paging the whole library), or create it. */
async function findOrCreateAsset(cdnUrl: string, altText: string): Promise<number> {
  for (let pageNumber = 1; pageNumber <= 50; pageNumber++) {
    const { body } = await api<{ items: { id: number; cdnUrl: string }[]; totalPages: number }>(
      `/api/admin/assets?pageNumber=${pageNumber}&pageSize=100`,
    );
    const existing = (body.items ?? []).find((a) => a.cdnUrl === cdnUrl);
    if (existing) return existing.id;
    if (pageNumber >= (body.totalPages || 1)) break;
  }
  const { body } = await api<{ id: number }>(`/api/admin/assets`, {
    method: "POST",
    body: JSON.stringify({ cdnUrl, altText, width: null, height: null }),
  });
  return body.id;
}

/** Same data transform as scripts/import-new-service-pages.ts — but Draft. */
function toPayload(
  page: ServicePage,
  heroImageAssetId: number | null,
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[],
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
  console.log(`Importing Semrush money pages (as Drafts) into ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  // Catalog lookups (ids differ between local and production DBs).
  const { body: pricingBody } = await api<{ items?: { id: number; scenario: string }[] } | { id: number; scenario: string }[]>(
    "/api/admin/pricing-items?pageSize=200",
  );
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const pricingByScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));

  const { body: reviewsBody } = await api<{ items: { id: number; customerName: string }[] }>(
    "/api/admin/reviews?pageSize=200",
  );
  const reviewByName = new Map((reviewsBody.items ?? []).map((r) => [r.customerName, r.id]));

  // ---- Phase A: create the drafts (409 = exists, skip) ----
  for (const page of NEW_PAGES) {
    const pricingRows = (PRICING_PINS[page.slug] ?? [])
      .map((scenario, i) => {
        const id = pricingByScenario.get(scenario);
        if (!id) {
          console.warn(`  ! pricing scenario not in catalog, pin skipped: "${scenario}"`);
          return null;
        }
        return { pricingItemId: id, sortOrder: i, noteOverride: null };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    const reviews = (REVIEW_PINS[page.slug] ?? [])
      .map((name, i) => {
        const id = reviewByName.get(name);
        if (!id) {
          console.warn(`  ! review not in catalog, pin skipped: "${name}"`);
          return null;
        }
        return { reviewId: id, sortOrder: i };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    const heroImageAssetId = page.hero.image
      ? await findOrCreateAsset(page.hero.image, page.hero.imageAlt)
      : null;

    const { status } = await api<{ id: number }>(`/api/admin/pages`, {
      method: "POST",
      body: JSON.stringify(toPayload(page, heroImageAssetId, pricingRows, reviews)),
    });

    if (status === 409) {
      console.log(`  = ${page.slug} already exists (skipped)`);
    } else {
      console.log(
        `  ✓ ${page.slug} created as DRAFT (pricing pins: ${pricingRows.length}, review pins: ${reviews.length})`,
      );
    }
  }

  // ---- Phase B: upward links, only toward Published new pages ----
  const { body: list } = await api<{ items: AdminPageListItem[] }>("/api/admin/pages?pageSize=200");
  const flat = list.items.filter((p) => p.routeGroup === "Flat");
  const statusBySlug = new Map(flat.map((p) => [p.slug, p.status]));

  let phaseBTouched = 0;
  for (const [fromSlug, links] of Object.entries(UPWARD_LINKS)) {
    const publishable = links.filter((l) => statusBySlug.get(LINK_TARGET_SLUG(l.href)) === "Published");
    if (publishable.length === 0) continue;

    const ref = flat.find((p) => p.slug === fromSlug);
    if (!ref) {
      console.warn(`  ! upward-link source not found: ${fromSlug}`);
      continue;
    }
    const { body: page } = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
    const existingHrefs = new Set(page.relatedLinks.map((l) => l.staticHref));
    let nextSort = page.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1;
    const added: string[] = [];
    for (const link of publishable) {
      if (existingHrefs.has(link.href)) continue;
      page.relatedLinks.push({
        id: 0,
        targetPageId: null,
        staticHref: link.href,
        labelOverride: link.name,
        linkGroup: "RelatedServices",
        sortOrder: nextSort++,
      });
      added.push(link.href);
    }
    if (added.length > 0) {
      await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
      console.log(`  ✓ ${fromSlug}: linked → ${added.join(", ")}`);
      phaseBTouched++;
    }
  }
  if (phaseBTouched === 0) {
    console.log("  = Phase B: no upward links added (new pages still Draft, or links already present)");
  }

  console.log("\nDone. Publish the drafts from /admin, then RE-RUN this script for Phase B wiring.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
