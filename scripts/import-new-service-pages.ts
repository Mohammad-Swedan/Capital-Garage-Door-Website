/**
 * Imports the two audit-gap service pages into the CMS (create + publish):
 *
 *   /roller-door-installation-perth
 *   /sectional-garage-doors-perth
 *
 * Unlike the one-time bulk importer (app/admin/api/import), this script also
 * attaches the relational pins the pages need on day one: pricing rows (looked
 * up in the PricingItems catalog by scenario name) and the real Google review
 * each page quotes (looked up in Reviews by customer name). Existing slugs are
 * skipped (409), so re-running is safe.
 *
 * Local CMS (default):   npx tsx scripts/import-new-service-pages.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-new-service-pages.ts
 */

import type { ServicePage } from "../types/service-page";
import { rollerDoorInstallationPerth } from "../content/service-pages/roller-door-installation-perth";
import { sectionalGarageDoorsPerth } from "../content/service-pages/sectional-garage-doors-perth";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** Pricing pins per slug — catalog scenario names, in display order. */
const PRICING_PINS: Record<string, string[]> = {
  "roller-door-installation-perth": [
    "New garage door — standard (supply & install)",
    "Roller door removal & reinstall",
    "New door — commercial / custom",
    "Motor / opener replacement",
  ],
  "sectional-garage-doors-perth": [
    "New garage door — standard (supply & install)",
    "Sectional door removal & reinstall",
    "New door — commercial / custom",
    "Motor / opener replacement",
  ],
};

/** Review pins per slug — the real Google reviews the pages quote. */
const REVIEW_PINS: Record<string, string[]> = {
  "roller-door-installation-perth": ["Janelle S."],
  "sectional-garage-doors-perth": ["Khaled K."],
};

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

/** Same data transform as lib/cms/import/service-pages.ts (kept inline so the script has no "@/" imports). */
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
    status: "Published",
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

async function main() {
  console.log(`Importing new service pages into ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  // Catalog lookups (ids differ between local and production DBs).
  const { body: pricingBody } = await api<{ items?: { id: number; scenario: string }[] } | { id: number; scenario: string }[]>(
    "/api/admin/pricing-items",
  );
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const pricingByScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));

  const { body: reviewsBody } = await api<{ items: { id: number; customerName: string }[] }>(
    "/api/admin/reviews?pageSize=200",
  );
  const reviewByName = new Map((reviewsBody.items ?? []).map((r) => [r.customerName, r.id]));

  for (const page of [rollerDoorInstallationPerth, sectionalGarageDoorsPerth]) {
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
        `  ✓ ${page.slug} created + published (pricing pins: ${pricingRows.length}, review pins: ${reviews.length})`,
      );
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
