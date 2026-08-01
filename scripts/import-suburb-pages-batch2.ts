/**
 * Imports the 15 batch-2 suburb pages (content/service-suburb-pages-batch2.ts)
 * into the CMS — ALL AS DRAFTS. Nothing public changes until each page is
 * published from /admin; after publishing, run
 * scripts/finalize-suburb-pages-batch2.ts to wire the internal links
 * (suburb pageIds, nearby-chip repoints, hub grid) — a suburb page is
 * invisible without them (see CLAUDE.md).
 *
 * Existing slugs return 409 and are skipped, so re-running is safe.
 *
 * Local CMS (default):   npx tsx scripts/import-suburb-pages-batch2.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-suburb-pages-batch2.ts
 */

import { serviceSuburbPagesBatch2 } from "../content/service-suburb-pages-batch2";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

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

/** Same data transform as scripts/import-service-suburb-pages.ts, status Draft. */
function toPayload(page: (typeof serviceSuburbPagesBatch2)[number]) {
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
    localProof: [],
    caseStudySlugs: page.caseStudySlugs ?? [],
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
    status: "Draft",
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
  // Copy-limit guards (same rules as scripts/enhance-suburb-pages.ts).
  for (const page of serviceSuburbPagesBatch2) {
    if (page.seo.title.length > 60)
      console.warn(`! seo.title >60 chars (${page.seo.title.length}) on ${page.slug}`);
    if (page.seo.description.length > 160)
      console.warn(`! seo.description >160 chars (${page.seo.description.length}) on ${page.slug}`);
    if (!page.localIntro.some((p) => p.includes("B&D, Steel-Line, Centurion")))
      throw new Error(`${page.slug} intro is missing the brands marker paragraph`);
  }

  console.log(
    `Importing ${serviceSuburbPagesBatch2.length} batch-2 suburb pages (as DRAFTS) into ${CMS_API_URL}`,
  );
  await login();
  console.log("✓ logged in");

  for (const page of serviceSuburbPagesBatch2) {
    const { status: httpStatus } = await api<{ id: number }>(`/api/admin/pages`, {
      method: "POST",
      body: JSON.stringify(toPayload(page)),
    });

    if (httpStatus === 409) {
      console.log(`  = ${page.slug} already exists (skipped)`);
    } else {
      console.log(`  ✓ ${page.slug} created (Draft)`);
    }
  }

  console.log("Done. Publish from /admin, then run scripts/finalize-suburb-pages-batch2.ts.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
