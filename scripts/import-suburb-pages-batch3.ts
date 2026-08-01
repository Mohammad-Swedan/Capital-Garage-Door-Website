/**
 * Imports the 15 batch-3 suburb pages (content/service-suburb-pages-batch3.ts)
 * into the CMS — ALL AS DRAFTS, each with catalog-driven pricing pins.
 *
 * The pins are the point of difference for this batch: every one of the 15 live
 * SERPs pulled during research showed cost intent in its related searches
 * ("{suburb} cost / prices / price list"), so these pages carry a real
 * guide-price table. Prices come from the CMS pricing catalog by scenario name
 * — never hand-typed (CLAUDE.md), which is also why the copy guard below
 * hard-fails if a dollar figure appears in the content file.
 *
 * Nothing public changes until each page is published from /admin; after
 * publishing, run scripts/finalize-suburb-pages-batch3.ts to wire the internal
 * links (a suburb page with no inbound links won't rank).
 *
 * Existing slugs return 409 and are skipped, so re-running is safe.
 *
 * Local CMS (default):   npx tsx scripts/import-suburb-pages-batch3.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-suburb-pages-batch3.ts
 */

import { serviceSuburbPagesBatch3 } from "../content/service-suburb-pages-batch3";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/**
 * Catalog scenarios pinned to every batch-3 page, in display order. Matched by
 * EXACT scenario string against /api/admin/pricing-items (note the "×" in the
 * springs row — it is a multiplication sign, not an "x"). Missing scenarios are
 * warned about and skipped rather than failing the import.
 */
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

/** Extra pin for the commercial-flavoured pages. */
const COMMERCIAL_PIN = "Commercial roller door (service, from)";
const COMMERCIAL_SLUGS = new Set([
  "garage-door-repairs-forrestdale",
  "garage-door-repairs-brookdale",
]);

interface PricingItem {
  id: number;
  scenario: string;
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

function staticLink(href: string, label: string, linkGroup: string, sortOrder: number) {
  return { targetPageId: null, staticHref: href, labelOverride: label, linkGroup, sortOrder };
}

function toPayload(
  page: (typeof serviceSuburbPagesBatch3)[number],
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: null }[],
) {
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

async function main() {
  // Copy guards.
  for (const page of serviceSuburbPagesBatch3) {
    if (page.seo.title.length > 60)
      console.warn(`! seo.title >60 chars (${page.seo.title.length}) on ${page.slug}`);
    if (page.seo.description.length > 160)
      console.warn(`! seo.description >160 chars (${page.seo.description.length}) on ${page.slug}`);
    if (!page.localIntro.some((p) => p.includes("B&D, Steel-Line, Centurion")))
      throw new Error(`${page.slug} intro is missing the brands marker paragraph`);
    if (page.localIntro.length < 5) throw new Error(`${page.slug} has fewer than 5 intro paragraphs`);
    if (page.faqs.length < 10) throw new Error(`${page.slug} has fewer than 10 FAQs`);
  }
  const allCopy = JSON.stringify(serviceSuburbPagesBatch3);
  if (/\$\d/.test(allCopy))
    throw new Error("Copy contains a dollar figure — prices may only come from the pricing catalog.");

  console.log(
    `Importing ${serviceSuburbPagesBatch3.length} batch-3 suburb pages (as DRAFTS) into ${CMS_API_URL}`,
  );
  await login();
  console.log("✓ logged in");

  const { body: pricingBody } = await api<PricingItem[] | { items: PricingItem[] }>(
    "/api/admin/pricing-items",
  );
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const byScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));
  console.log(`  catalog: ${pricingItems.length} pricing items`);

  for (const page of serviceSuburbPagesBatch3) {
    const scenarios = COMMERCIAL_SLUGS.has(page.slug)
      ? [...PRICING_PINS, COMMERCIAL_PIN]
      : PRICING_PINS;
    const pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: null }[] = [];
    for (const scenario of scenarios) {
      const pricingItemId = byScenario.get(scenario);
      if (!pricingItemId) {
        console.warn(`  ! pricing scenario not in catalog, pin skipped: "${scenario}"`);
        continue;
      }
      pricingRows.push({ pricingItemId, sortOrder: pricingRows.length, noteOverride: null });
    }

    const { status } = await api<{ id: number }>("/api/admin/pages", {
      method: "POST",
      body: JSON.stringify(toPayload(page, pricingRows)),
    });

    if (status === 409) {
      console.log(`  = ${page.slug} already exists (skipped)`);
    } else {
      console.log(`  ✓ ${page.slug} created (Draft, ${pricingRows.length} price rows)`);
    }
  }

  console.log("Done. Publish from /admin, then run scripts/finalize-suburb-pages-batch3.ts.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
