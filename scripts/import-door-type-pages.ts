/**
 * Imports the four door-type pages into the CMS (create + publish) and
 * cross-links them from the existing door pages:
 *
 *   /roller-doors-perth              (residential roller — product page)
 *   /tilt-garage-doors-perth         (tilt / counterweight doors)
 *   /custom-garage-doors-perth       (designer / architectural doors)
 *   /commercial-roller-doors-perth   (commercial & industrial roller doors)
 *
 * Like scripts/import-new-service-pages.ts, this attaches the relational pins
 * the pages need on day one: pricing rows (looked up in PricingItems by
 * scenario name) and the real Google review each page quotes (looked up in
 * Reviews by customer name). It then appends RelatedServices links on the
 * three existing pages (sectional, roller-installation, commercial hub) so the
 * new pages aren't orphaned. Idempotent: existing slugs are skipped (409) and
 * link additions are append-if-missing.
 *
 * Local CMS (default):   npx tsx scripts/import-door-type-pages.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-door-type-pages.ts
 */

import type { ServicePage } from "../types/service-page";
import { rollerDoorsPerth } from "../content/service-pages/roller-doors-perth";
import { tiltGarageDoorsPerth } from "../content/service-pages/tilt-garage-doors-perth";
import { customGarageDoorsPerth } from "../content/service-pages/custom-garage-doors-perth";
import { commercialRollerDoorsPerth } from "../content/service-pages/commercial-roller-doors-perth";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const NEW_PAGES: ServicePage[] = [
  rollerDoorsPerth,
  tiltGarageDoorsPerth,
  customGarageDoorsPerth,
  commercialRollerDoorsPerth,
];

/** Pricing pins per slug — catalog scenario names, in display order. */
const PRICING_PINS: Record<string, string[]> = {
  "roller-doors-perth": [
    "New garage door — standard (supply & install)",
    "Roller door removal & reinstall",
    "New door — commercial / custom",
    "Motor / opener replacement",
  ],
  "tilt-garage-doors-perth": [
    "New garage door — standard (supply & install)",
    "Tilt-door arms kit + springs",
    "New door — commercial / custom",
    "Motor / opener replacement",
  ],
  "custom-garage-doors-perth": [
    "New door — commercial / custom",
    "New garage door — standard (supply & install)",
    "Motor / opener replacement",
  ],
  "commercial-roller-doors-perth": [
    "New door — commercial / custom",
    "Commercial roller door (service, from)",
    "Motor / opener replacement",
  ],
};

/** Review pins per slug — the real Google reviews the pages quote. */
const REVIEW_PINS: Record<string, string[]> = {
  "roller-doors-perth": ["Janelle S."],
  "tilt-garage-doors-perth": ["Trina S."],
  "custom-garage-doors-perth": ["Khaled K."],
  "commercial-roller-doors-perth": ["Silva F."],
};

/**
 * RelatedServices links to append on EXISTING pages (mirrors the local
 * content/service-pages edits shipped alongside this script). Append-if-missing.
 */
const LINK_ADDITIONS: Record<string, { href: string; label: string }[]> = {
  "sectional-garage-doors-perth": [
    { href: "/custom-garage-doors-perth", label: "Custom Garage Doors Perth" },
    { href: "/tilt-garage-doors-perth", label: "Tilt Garage Doors Perth" },
  ],
  "roller-door-installation-perth": [
    { href: "/roller-doors-perth", label: "Roller Doors Perth" },
    { href: "/commercial-roller-doors-perth", label: "Commercial Roller Doors Perth" },
  ],
  "commercial-garage-doors-perth": [
    { href: "/commercial-roller-doors-perth", label: "Commercial Roller Doors Perth" },
    { href: "/custom-garage-doors-perth", label: "Custom Garage Doors Perth" },
  ],
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

/** Shape returned by GET /api/admin/pages/{id}, round-tripped by toUpdateBody. */
interface AdminPage {
  id: number;
  templateType: string;
  slug: string;
  title: string;
  status: string;
  noIndex: boolean;
  seoTitle: string;
  seoDescription: string;
  heroImageAssetId: number | null;
  socialImageAssetId: number | null;
  data: Record<string, unknown>;
  faqs: { question: string; answer: string; sortOrder: number; faqItemId: number | null }[];
  relatedLinks: {
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

/** Round-trip a PageDetailDto into the UpdatePageCommand body (full replace). */
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
  console.log(`Importing door-type pages into ${CMS_API_URL}`);
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

  // ---- 1. Create + publish the four new pages ----
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
        `  ✓ ${page.slug} created + published (pricing pins: ${pricingRows.length}, review pins: ${reviews.length})`,
      );
    }
  }

  // ---- 2. Cross-link the new pages from the existing door pages ----
  const { body: pageList } = await api<{ items: { id: number; slug: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const idBySlug = new Map(pageList.items.map((p) => [p.slug, p.id]));

  for (const [slug, additions] of Object.entries(LINK_ADDITIONS)) {
    const id = idBySlug.get(slug);
    if (!id) {
      console.warn(`  ! page not found for slug: ${slug} — links not added`);
      continue;
    }
    const { body: page } = await api<AdminPage>(`/api/admin/pages/${id}`);
    const existing = new Set(
      page.relatedLinks.filter((l) => l.linkGroup === "RelatedServices").map((l) => l.staticHref),
    );
    const toAdd = additions.filter((a) => !existing.has(a.href));
    if (toAdd.length === 0) {
      console.log(`  = ${slug}: links already present (skipped)`);
      continue;
    }
    let nextSort =
      Math.max(0, ...page.relatedLinks.filter((l) => l.linkGroup === "RelatedServices").map((l) => l.sortOrder)) + 1;
    for (const a of toAdd) {
      page.relatedLinks.push({
        targetPageId: null,
        staticHref: a.href,
        labelOverride: a.label,
        linkGroup: "RelatedServices",
        sortOrder: nextSort++,
      });
    }
    await api(`/api/admin/pages/${id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ ${slug}: added ${toAdd.map((a) => a.href).join(", ")}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
