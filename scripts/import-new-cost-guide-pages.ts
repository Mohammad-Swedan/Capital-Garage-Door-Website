/**
 * Imports the three new cost-guide pages into the CMS (create + publish),
 * pins their cost-table rows to the pricing catalog, and cross-links them from
 * the existing Repair Cost page:
 *
 *   /garage-door-spring-replacement-cost-perth   (spring & cable)
 *   /garage-door-service-cost-perth              (servicing & maintenance)
 *   /garage-door-motor-replacement-cost-perth    (motor / opener replacement)
 *
 * Like scripts/import-door-type-pages.ts, this attaches the relational pins the
 * pages need on day one — the cost-table rows are PricingItems looked up by
 * scenario name (the catalog is seeded from pricing-data.ts). Cost-guide rows
 * render `includes`/`costFactors`/`nextStep` from the PricingItem itself, so
 * this first enriches the handful of scenarios that don't have those columns
 * yet (mirrors scripts/sync-seo-fixes.ts's PRICING_ENRICHMENT), then pins them.
 *
 * It also updates the existing Repair Cost page: repoints its blog motor-cost
 * link to the new flat motor cost page and appends the two other new siblings
 * (append-if-missing). Idempotent: existing slugs are skipped (409), enrichment
 * only fills empty columns, and link additions are append-if-missing.
 *
 * Local CMS (default):   npx tsx scripts/import-new-cost-guide-pages.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-new-cost-guide-pages.ts
 */

import type { CostGuidePage } from "../types/cost-guide";
import { garageDoorSpringReplacementCostPerth } from "../content/cost-guides/garage-door-spring-replacement-cost-perth";
import { garageDoorServiceCostPerth } from "../content/cost-guides/garage-door-service-cost-perth";
import { garageDoorMotorReplacementCostPerth } from "../content/cost-guides/garage-door-motor-replacement-cost-perth";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const NEW_PAGES: CostGuidePage[] = [
  garageDoorSpringReplacementCostPerth,
  garageDoorServiceCostPerth,
  garageDoorMotorReplacementCostPerth,
];

/** Ordered cost-table pins per slug — catalog scenario names (from pricing-data.ts). */
const PRICING_PINS: Record<string, string[]> = {
  "garage-door-spring-replacement-cost-perth": [
    "Broken spring (single)",
    "Broken springs (×2)",
    "Springs (×3)",
    "Springs (×4)",
    "Spring re-fit / re-tension",
    "Cable snapped or off the drum",
    "After-hours / emergency call-out",
  ],
  "garage-door-service-cost-perth": [
    "Service / tune-up",
    "Safety check-up / inspection",
    "Weather seal (rubber & brush)",
    "Hinges & rollers / wheels",
    "After-hours / emergency call-out",
  ],
  "garage-door-motor-replacement-cost-perth": [
    "Motor / opener replacement",
    "Motor / opener not working (repair)",
    "WiFi / smart control (supply & install)",
    "Remote (extra / replacement)",
    "After-hours / emergency call-out",
  ],
};

/**
 * Fill the `includes`/`costFactors`/`nextStep` columns the cost tables render,
 * for the scenarios these new pages pin that sync-seo-fixes.ts didn't already
 * enrich. Only ever sets an empty column (see the `||` merge below), so it's
 * safe to re-run and won't clobber existing copy.
 */
const PRICING_ENRICHMENT: Record<
  string,
  { includes?: string; costFactors?: string; nextStep?: string }
> = {
  "Springs (×3)": {
    includes: "Three springs supplied and fitted for larger or heavier doors",
    costFactors: "Door size and weight",
    nextStep: "Call for same-day replacement",
  },
  "Springs (×4)": {
    includes: "Four springs for oversized or commercial doors",
    costFactors: "Door width and weight",
    nextStep: "Call for same-day replacement",
  },
  "WiFi / smart control (supply & install)": {
    includes: "Adding WiFi/smart control to a compatible opener",
    costFactors: "Opener compatibility, app or hub required",
    nextStep: "Check your opener is smart-ready",
  },
  "Safety check-up / inspection": {
    includes: "20-point safety inspection and written report",
    costFactors: "Door type and condition",
    nextStep: "Book a safety check",
  },
  "Weather seal (rubber & brush)": {
    includes: "Bottom rubber and/or brush seals supplied and fitted",
    costFactors: "Single vs double door, seal type",
    nextStep: "Measure your opening width",
  },
};

/**
 * Cross-links to apply on the EXISTING Repair Cost page (mirrors the local
 * content/cost-guides/garage-door-repair-cost-perth.ts edit shipped alongside).
 * Repoints the stale blog motor-cost link, then appends the two other siblings.
 */
const REPAIR_SLUG = "garage-door-repair-cost-perth";
const REPAIR_LINK_REPOINTS: Record<string, { href: string; label: string }> = {
  "/blog/garage-door-motor-replacement-cost-perth": {
    href: "/garage-door-motor-replacement-cost-perth",
    label: "Garage Door Motor Replacement Cost Perth",
  },
};
const REPAIR_LINK_ADDITIONS: { href: string; label: string }[] = [
  { href: "/garage-door-spring-replacement-cost-perth", label: "Spring & Cable Replacement Cost Perth" },
  { href: "/garage-door-service-cost-perth", label: "Garage Door Servicing Cost Perth" },
];

interface PricingItem {
  id: number;
  scenario: string;
  priceMin: number | null;
  priceMax: number | null;
  priceLabel: string | null;
  note: string | null;
  internalNote: string | null;
  category: string | null;
  includes: string | null;
  costFactors: string | null;
  nextStep: string | null;
}

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

/** Inverse of lib/cms/map-cost-guide-page.ts. costTable.rows are relational (pins), so skipped here. */
function toPayload(
  page: CostGuidePage,
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[],
) {
  return {
    templateType: "CostGuidePage",
    routeGroup: "Flat",
    slug: page.slug,
    title: page.hero.h1 || page.topicLabel,
    seoTitle: page.seo.title,
    seoDescription: page.seo.description,
    noIndex: false,
    status: "Published",
    heroImageAssetId: null,
    data: {
      topicLabel: page.topicLabel,
      hero: { h1: page.hero.h1, subtitle: page.hero.subtitle },
      directAnswer: page.directAnswer,
      costTable: {
        heading: page.costTable.heading,
        intro: page.costTable.intro,
        // rows are relational (pricing pins) and skipped this pass.
        disclaimer: page.costTable.disclaimer ?? "",
      },
      factors: {
        heading: page.factors.heading,
        items: page.factors.items.map((i) => ({ icon: i.icon, title: i.title, description: i.description })),
      },
      scenarios: {
        heading: page.scenarios.heading,
        items: page.scenarios.items.map((i) => ({
          icon: i.icon,
          title: i.title,
          mayAffectQuote: i.mayAffectQuote,
        })),
      },
      repairVsReplace: {
        heading: page.repairVsReplace.heading,
        intro: page.repairVsReplace.intro,
        repairWhen: page.repairVsReplace.repairWhen,
        replaceWhen: page.repairVsReplace.replaceWhen,
      },
      howToQuote: {
        heading: page.howToQuote.heading,
        steps: page.howToQuote.steps.map((s) => ({ icon: s.icon, title: s.title, description: s.description })),
      },
      cta: { heading: page.cta.heading, subtitle: page.cta.subtitle },
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
    reviews: [],
    services: [],
  };
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
  console.log(`Importing new cost-guide pages into ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  // ---- 1. Pricing catalog: look up ids + enrich the columns cost tables render ----
  const { body: pricingBody } = await api<PricingItem[] | { items?: PricingItem[] }>(
    "/api/admin/pricing-items",
  );
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const byScenario = new Map(pricingItems.map((p) => [p.scenario, p]));

  let enriched = 0;
  for (const [scenario, extra] of Object.entries(PRICING_ENRICHMENT)) {
    const item = byScenario.get(scenario);
    if (!item) {
      console.warn(`  ! pricing scenario not in catalog (enrich skipped): "${scenario}"`);
      continue;
    }
    const next = {
      includes: item.includes || extra.includes || null,
      costFactors: item.costFactors || extra.costFactors || null,
      nextStep: item.nextStep || extra.nextStep || null,
    };
    if (
      next.includes === (item.includes ?? null) &&
      next.costFactors === (item.costFactors ?? null) &&
      next.nextStep === (item.nextStep ?? null)
    ) {
      continue; // already enriched
    }
    await api(`/api/admin/pricing-items/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: item.id,
        scenario: item.scenario,
        priceMin: item.priceMin,
        priceMax: item.priceMax,
        priceLabel: item.priceLabel,
        note: item.note,
        category: item.category,
        internalNote: item.internalNote,
        ...next,
      }),
    });
    enriched++;
  }
  console.log(`✓ pricing catalog: ${enriched} item(s) enriched`);

  // ---- 2. Create + publish the three new pages with pinned cost-table rows ----
  for (const page of NEW_PAGES) {
    const pricingRows = (PRICING_PINS[page.slug] ?? [])
      .map((scenario, i) => {
        const item = byScenario.get(scenario);
        if (!item) {
          console.warn(`  ! pricing scenario not in catalog, pin skipped: "${scenario}"`);
          return null;
        }
        return { pricingItemId: item.id, sortOrder: i, noteOverride: null };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    const { status } = await api<{ id: number }>(`/api/admin/pages`, {
      method: "POST",
      body: JSON.stringify(toPayload(page, pricingRows)),
    });

    if (status === 409) {
      console.log(`  = ${page.slug} already exists (skipped)`);
    } else {
      console.log(`  ✓ ${page.slug} created + published (pricing pins: ${pricingRows.length})`);
    }
  }

  // ---- 3. Cross-link the new pages from the existing Repair Cost page ----
  const { body: pageList } = await api<{ items: { id: number; slug: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const idBySlug = new Map(pageList.items.map((p) => [p.slug, p.id]));

  const repairId = idBySlug.get(REPAIR_SLUG);
  if (!repairId) {
    console.warn(`  ! ${REPAIR_SLUG} not found — cross-links not added`);
  } else {
    const { body: page } = await api<AdminPage>(`/api/admin/pages/${repairId}`);
    let changed = false;
    const notes: string[] = [];

    // Repoint stale links (e.g. the blog motor-cost link → the new flat page).
    for (const l of page.relatedLinks) {
      const repoint = l.staticHref ? REPAIR_LINK_REPOINTS[l.staticHref] : undefined;
      if (repoint) {
        notes.push(`repoint ${l.staticHref} → ${repoint.href}`);
        l.staticHref = repoint.href;
        l.labelOverride = repoint.label;
        changed = true;
      }
    }

    // Append the two other new siblings if not already linked.
    const existing = new Set(
      page.relatedLinks.filter((l) => l.linkGroup === "RelatedServices").map((l) => l.staticHref),
    );
    let nextSort =
      Math.max(0, ...page.relatedLinks.filter((l) => l.linkGroup === "RelatedServices").map((l) => l.sortOrder)) + 1;
    for (const add of REPAIR_LINK_ADDITIONS) {
      if (existing.has(add.href)) continue;
      page.relatedLinks.push({
        targetPageId: null,
        staticHref: add.href,
        labelOverride: add.label,
        linkGroup: "RelatedServices",
        sortOrder: nextSort++,
      });
      existing.add(add.href);
      notes.push(`add ${add.href}`);
      changed = true;
    }

    if (changed) {
      await api(`/api/admin/pages/${repairId}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
      console.log(`  ✓ ${REPAIR_SLUG}: ${notes.join(", ")}`);
    } else {
      console.log(`  = ${REPAIR_SLUG}: cross-links already present (skipped)`);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
