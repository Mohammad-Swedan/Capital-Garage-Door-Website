/**
 * Imports the /garage-doors-perth product hub into the CMS (create + publish)
 * and cross-links it from the pages that should feed it.
 *
 * Why (GSC, 28 days to 2026-08-01): the "garage doors perth" buy cluster pulls
 * 1,641 impressions / 2 clicks across 68 queries at average position 30–58 with
 * no page targeting it — the four door-TYPE pages existed but had no parent hub
 * for the head term. This page is also the new 301 destination for the legacy
 * /services/garage-doors URL (the #4 URL site-wide by impressions, 1,525), which
 * previously pointed at the thin /services listing.
 *
 * Same shape as scripts/import-door-type-pages.ts: attaches the relational pins
 * the page needs on day one (pricing rows looked up in PricingItems by scenario
 * name, and the real Google review it quotes looked up in Reviews by customer
 * name), then appends RelatedServices links on the existing pages so neither
 * side is orphaned. Idempotent: an existing slug is skipped (409) and every link
 * addition is append-if-missing.
 *
 * GOTCHA encoded here: admin page slugs are only unique PER ROUTE GROUP
 * (garage-door-repairs-perth exists as both Flat and Lp), so every slug lookup
 * filters routeGroup === "Flat".
 *
 * Local CMS (default):   npx tsx scripts/import-garage-doors-perth-page.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-garage-doors-perth-page.ts
 */

import type { ServicePage } from "../types/service-page";
import { garageDoorsPerth } from "../content/service-pages/garage-doors-perth";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const NEW_PAGES: ServicePage[] = [garageDoorsPerth];

/** Pricing pins per slug — catalog scenario names, in display order. */
const PRICING_PINS: Record<string, string[]> = {
  "garage-doors-perth": [
    "New garage door — standard (supply & install)",
    "New door — commercial / custom",
    "Motor / opener replacement",
    "Roller door removal & reinstall",
  ],
};

/** Review pins per slug — the real Google review the page quotes. */
const REVIEW_PINS: Record<string, string[]> = {
  "garage-doors-perth": ["Jacques D."],
};

/**
 * RelatedServices links to append on EXISTING pages. The four door-type entries
 * mirror the local content/service-pages edits shipped alongside this script
 * (upward links to the new parent hub); the rest fix internal-link gaps the same
 * GSC pull surfaced — /garage-door-motor-replacement-cost-perth had ZERO
 * impressions while its 301'd blog predecessor still earned 134, because nothing
 * links to the flat cost guide.
 */
const LINK_ADDITIONS: Record<string, { href: string; label: string }[]> = {
  "roller-doors-perth": [{ href: "/garage-doors-perth", label: "Garage Doors Perth" }],
  "sectional-garage-doors-perth": [{ href: "/garage-doors-perth", label: "Garage Doors Perth" }],
  "tilt-garage-doors-perth": [{ href: "/garage-doors-perth", label: "Garage Doors Perth" }],
  "custom-garage-doors-perth": [{ href: "/garage-doors-perth", label: "Garage Doors Perth" }],
  "garage-door-installation-perth": [{ href: "/garage-doors-perth", label: "Garage Doors Perth" }],
  "commercial-garage-doors-perth": [{ href: "/garage-doors-perth", label: "Garage Doors Perth" }],
  "roller-door-installation-perth": [{ href: "/garage-doors-perth", label: "Garage Doors Perth" }],
  "garage-door-opener-repair-perth": [
    {
      href: "/garage-door-motor-replacement-cost-perth",
      label: "Garage Door Motor Replacement Cost Perth",
    },
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

/** Guard: the copy must never hand-type a price the catalog doesn't back. */
function assertCopyIsSane(page: ServicePage): void {
  if (page.seo.title.length > 60) {
    throw new Error(`seo.title too long (${page.seo.title.length}): ${page.seo.title}`);
  }
  if (page.seo.description.length > 160) {
    throw new Error(`seo.description too long (${page.seo.description.length})`);
  }
  const pinned = PRICING_PINS[page.slug] ?? [];
  if (page.costGuidance.rows.length !== pinned.length) {
    throw new Error(
      `costGuidance.rows (${page.costGuidance.rows.length}) must match PRICING_PINS (${pinned.length}) for ${page.slug}`,
    );
  }
  page.costGuidance.rows.forEach((row, i) => {
    // The pinned catalog row is what actually renders; the local label must name
    // the same scenario so the fallback content can't drift from the live price.
    if (row.label !== pinned[i] && !pinned[i].startsWith(row.label.split(" (")[0])) {
      console.warn(`  ! row "${row.label}" doesn't obviously match pin "${pinned[i]}" — check the order`);
    }
  });
}

async function main() {
  console.log(`Importing the garage-doors-perth hub into ${CMS_API_URL}`);
  NEW_PAGES.forEach(assertCopyIsSane);
  await login();
  console.log("✓ logged in");

  // Catalog lookups (ids differ between local and production DBs).
  const { body: pricingBody } = await api<
    { items?: { id: number; scenario: string }[] } | { id: number; scenario: string }[]
  >("/api/admin/pricing-items");
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const pricingByScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));

  const { body: reviewsBody } = await api<{ items: { id: number; customerName: string }[] }>(
    "/api/admin/reviews?pageSize=200",
  );
  const reviewByName = new Map((reviewsBody.items ?? []).map((r) => [r.customerName, r.id]));

  // ---- 1. Create + publish the hub ----
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

  // ---- 2. Cross-link from the existing pages ----
  const { body: pageList } = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  // Slugs are only unique per route group — garage-door-repairs-perth exists as
  // both Flat and Lp, so never key on slug alone.
  const idBySlug = new Map(
    pageList.items.filter((p) => p.routeGroup === "Flat").map((p) => [p.slug, p.id]),
  );

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
      Math.max(
        0,
        ...page.relatedLinks.filter((l) => l.linkGroup === "RelatedServices").map((l) => l.sortOrder),
      ) + 1;
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
