/**
 * Imports the four new garage-door-repairs SUBURB pages into the CMS.
 *
 *   garage-door-repairs-gosnells         → Published (goes live immediately)
 *   garage-door-repairs-cannington       → Draft
 *   garage-door-repairs-lathlain         → Draft
 *   garage-door-repairs-southern-river   → Draft
 *
 * Publish state is set per-slug in STATUS_BY_SLUG below (create-as-published /
 * create-as-draft in a single POST — no separate publish call). The backend
 * fires the ISR revalidation webhook itself for the published page; drafts
 * change nothing public until you later hit /api/admin/pages/{id}/publish (in
 * the admin dashboard "Publish" button). Existing slugs return 409 and are
 * skipped, so re-running is safe.
 *
 * Suburb pages carry no hero image and no pricing/review/service pins, so this
 * script drops the asset/catalog machinery the service-page importer needs.
 *
 * Local CMS (default):   npx tsx scripts/import-service-suburb-pages.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-service-suburb-pages.ts
 */

import { serviceSuburbPages } from "../content/service-suburb-pages";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** The four new slugs and the publish state each should be created with. */
const STATUS_BY_SLUG: Record<string, "Published" | "Draft"> = {
  "garage-door-repairs-gosnells": "Published",
  "garage-door-repairs-cannington": "Draft",
  "garage-door-repairs-lathlain": "Draft",
  "garage-door-repairs-southern-river": "Draft",
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

/** Related link in the CMS create shape (escape-hatch static href form). */
function staticLink(href: string, label: string, linkGroup: string, sortOrder: number) {
  return { targetPageId: null, staticHref: href, labelOverride: label, linkGroup, sortOrder };
}

/**
 * Same data transform as lib/cms/import/service-suburb-pages.ts (kept inline so
 * the script has no "@/" imports), except `status` is passed in per-slug.
 */
function toPayload(page: (typeof serviceSuburbPages)[number], status: "Published" | "Draft") {
  const title = `${page.service} ${page.suburb}`;

  const data: Record<string, unknown> = {
    service: page.service,
    suburb: page.suburb,
    region: page.region,
    hero: {
      subtitle: page.hero?.subtitle ?? "",
      trustBadges: page.hero?.trustBadges ?? [],
    },
    directAnswer: page.directAnswer ?? "",
    localIntro: page.localIntro ?? [],
    availableServices: (page.availableServices ?? []).map((s) => ({
      title: s.title,
      description: s.description,
      icon: s.icon,
    })),
    problems: (page.problems ?? []).map((p) => ({
      title: p.title,
      description: p.description,
      icon: p.icon,
    })),
    costGuidance: {
      intro: page.costGuidance?.intro ?? "",
      factors: page.costGuidance?.factors ?? [],
      note: page.costGuidance?.note ?? "",
    },
    whyChooseUs: (page.whyChooseUs ?? []).map((w) => ({
      title: w.title,
      description: w.description,
      icon: w.icon,
    })),
    localProof: (page.localProof ?? []).map((p) => ({
      serviceType: p.serviceType,
      suburb: p.suburb,
      problem: p.problem,
      solution: p.solution,
    })),
  };

  const relatedLinks = [
    ...(page.nearbySuburbs ?? []).map((l, i) => staticLink(l.href, l.label, "NearbySuburbs", i)),
    ...(page.relatedPages ?? []).map((l, i) => staticLink(l.href, l.label, "RelatedPages", i)),
  ];

  return {
    templateType: "ServiceSuburbPage",
    routeGroup: "Flat",
    slug: page.slug,
    title,
    seoTitle: page.seo?.title ?? "",
    seoDescription: page.seo?.description ?? "",
    noIndex: false,
    status,
    heroImageAssetId: null,
    data,
    faqs: (page.faqs ?? []).map((f, i) => ({
      question: f.question,
      answer: f.answer,
      sortOrder: i,
    })),
    relatedLinks,
    pricingRows: [],
    reviews: [],
    services: [],
  };
}

async function main() {
  console.log(`Importing service-suburb pages into ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const targets = serviceSuburbPages.filter((p) => p.slug in STATUS_BY_SLUG);
  if (targets.length !== Object.keys(STATUS_BY_SLUG).length) {
    const found = new Set(targets.map((p) => p.slug));
    const missing = Object.keys(STATUS_BY_SLUG).filter((s) => !found.has(s));
    throw new Error(`Missing target slugs in content/service-suburb-pages.ts: ${missing.join(", ")}`);
  }

  for (const page of targets) {
    const status = STATUS_BY_SLUG[page.slug];
    const { status: httpStatus } = await api<{ id: number }>(`/api/admin/pages`, {
      method: "POST",
      body: JSON.stringify(toPayload(page, status)),
    });

    if (httpStatus === 409) {
      console.log(`  = ${page.slug} already exists (skipped)`);
    } else {
      console.log(`  ✓ ${page.slug} created (${status})`);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
