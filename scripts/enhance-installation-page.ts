/**
 * GSC-opportunity enhancement for /garage-door-installation-perth (July 2026).
 *
 * Search Console showed the page surging to 300+ impressions/week with large
 * query clusters the page didn't target: "garage door replacement" (37),
 * "garage door installers" (39+), residential/commercial/custom installation,
 * opener/motor installation (~18) and an empty "As a guide:" cost section
 * (zero pinned pricing rows). This script encodes the desired state:
 *
 *  A. /garage-door-installation-perth — title/description capture
 *     replacement + installers; hero subtitle + a replacement-focused intro
 *     paragraph; 3 new FAQs (cost / replacement / opener); pricing pins for
 *     the cost table; related links to the motors + door-type pages; suburb
 *     additions (Willetton, Southern River, Gosnells, Cannington, Osborne
 *     Park) to the service-area grid.
 *  B. Publishes the two remaining suburb-page drafts
 *     (garage-door-repairs-southern-river, garage-door-repairs-lathlain).
 *  C. Repoints the Gosnells ⇄ Southern River NearbySuburbs chips at each
 *     other's real pages (they pointed at /service-areas while drafts).
 *
 * NOTE: scripts/sync-seo-fixes.ts pins this page's seoTitle too — its
 * SEO_FIXES entry is updated in the same commit so both scripts express the
 * SAME desired state (re-running either must not fight the other).
 *
 * Run against the LOCAL CMS (default):
 *   npx tsx scripts/enhance-installation-page.ts
 * Run against PRODUCTION (deliberate, explicit):
 *   CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=<real> npx tsx scripts/enhance-installation-page.ts
 *
 * Idempotent: every mutation is desired-state with an equality/dedup guard;
 * pages are only PUT when something actually changed, publishes are skipped
 * when already published. The CMS fires the revalidate webhook on update and
 * publish, so changes go live within seconds — no frontend deploy needed.
 */

export {}; // force module scope (see sync-seo-fixes.ts for why)

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/* ------------------------------------------------------------------ *
 * Desired state
 * ------------------------------------------------------------------ */

const TARGET_SLUG = "garage-door-installation-perth";

// 57 chars — keyword-first, adds the "replacement" (37 impr) and
// "installers" (39+ impr) GSC clusters the old title missed.
const NEW_SEO_TITLE = "Garage Door Installation & Replacement Perth | Installers";

// ~151 chars — replacement + installers + door types + openers + CTA.
const NEW_SEO_DESCRIPTION =
  "New garage door installation & replacement across Perth. Local installers fit sectional, roller, tilt & custom doors and openers. Free measure & quote.";

const NEW_HERO_SUBTITLE =
  "New garage door supply, installation and replacement across Perth — sectional, roller, tilt and custom doors fitted by licensed local installers, with old door removal and a final safety check included.";

// Appended to intro.paragraphs unless a paragraph already covers replacement.
const REPLACEMENT_PARAGRAPH =
  "Replacing an old garage door? We handle complete garage door replacement — swapping tired, damaged or dated doors for modern sectional, roller, tilt or custom designs — for both residential and commercial properties. Our local installers also fit and program new openers and motors, so the whole upgrade is completed in a single visit.";

const NEW_INCLUDED_ITEM = "Residential, commercial and custom installations";

// Real GSC suburb queries + the live suburb pages missing from the grid.
const NEW_SERVICE_AREAS = ["Willetton", "Southern River", "Gosnells", "Cannington", "Osborne Park"];

/** Appended when the question isn't already on the page. No hardcoded dollar
 * figures — the pinned pricing rows carry the live catalog prices (visible
 * copy must never diverge from the catalog). */
const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "How much does garage door installation cost in Perth?",
    answer:
      "It depends on the door type, size, material, insulation and the opener you choose — see the price guide on this page for typical supplied-and-installed ranges. After a free on-site measure we give you a fixed written quote, so you know the full cost before any work is booked.",
  },
  {
    question: "Do you replace old garage doors?",
    answer:
      "Yes. Garage door replacement is one of our most common jobs — we remove and dispose of the old door, then supply and install a new sectional, roller, tilt or custom door in its place. We replace doors on both residential and commercial properties across Perth.",
  },
  {
    question: "Can you install or replace the garage door opener at the same time?",
    answer:
      "Yes. Most new doors are installed together with a new opener — we supply quality motors, fit and program them with your remotes, and set the travel limits as part of the installation. We can also fit a new opener to your existing door if the door itself is still in good shape.",
  },
];

/** Cost-table pins (catalog scenario names, display order). Only applied when
 * the page has ZERO rows — the intro already promises "As a guide:". */
const PRICING_PINS = [
  "New garage door — standard (supply & install)",
  "New door — commercial / custom",
  "Motor / opener replacement",
];

/** Internal-link additions (RelatedServices is the only group ServicePage
 * renders; hrefs pass through verbatim — never RelatedArticles here). */
const NEW_RELATED_LINKS: { href: string; label: string }[] = [
  { href: "/garage-door-motors-perth", label: "Garage Door Motors Perth" },
  { href: "/roller-door-installation-perth", label: "Roller Door Installation Perth" },
  { href: "/sectional-garage-doors-perth", label: "Sectional Garage Doors Perth" },
  { href: "/custom-garage-doors-perth", label: "Custom Garage Doors Perth" },
  { href: "/commercial-garage-doors-perth", label: "Commercial Garage Doors Perth" },
];

/** Drafts to publish (idempotent — skipped when already Published). */
const PUBLISH_SLUGS = ["garage-door-repairs-southern-river", "garage-door-repairs-lathlain"];

/** NearbySuburbs chips to repoint now both pages are live (they were created
 * pointing at /service-areas so the published page never linked a 404). */
const NEARBY_REPOINTS: { pageSlug: string; label: string; href: string }[] = [
  {
    pageSlug: "garage-door-repairs-gosnells",
    label: "Southern River",
    href: "/garage-door-repairs-southern-river",
  },
  {
    pageSlug: "garage-door-repairs-southern-river",
    label: "Gosnells",
    href: "/garage-door-repairs-gosnells",
  },
];

/* ------------------------------------------------------------------ *
 * API plumbing (same shapes as scripts/sync-seo-fixes.ts)
 * ------------------------------------------------------------------ */

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

interface PricingItem {
  id: number;
  scenario: string;
}

let token = "";

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function login(): Promise<void> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(
      `Login failed (${res.status}). Check CMS_ADMIN_EMAIL/PASSWORD and that the CMS is running at ${CMS_API_URL}.`,
    );
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Login succeeded but no token was returned.");
  token = data.token;
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

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

async function main() {
  console.log(`Enhancing installation page + publishing drafts at ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const pageList = await api<{ items: { id: number; slug: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const idBySlug = new Map(pageList.items.map((p) => [p.slug, p.id]));

  /* ---- Phase A: /garage-door-installation-perth ---- */
  const installId = idBySlug.get(TARGET_SLUG);
  if (!installId) throw new Error(`Page not found in CMS: ${TARGET_SLUG}`);
  const page = await api<AdminPage>(`/api/admin/pages/${installId}`);
  let changed = false;

  if (page.seoTitle !== NEW_SEO_TITLE) {
    page.seoTitle = NEW_SEO_TITLE;
    changed = true;
  }
  if (page.seoDescription !== NEW_SEO_DESCRIPTION) {
    page.seoDescription = NEW_SEO_DESCRIPTION;
    changed = true;
  }

  const hero = page.data.hero as { subtitle?: string } | undefined;
  if (hero && hero.subtitle !== NEW_HERO_SUBTITLE) {
    hero.subtitle = NEW_HERO_SUBTITLE;
    changed = true;
  }

  const intro = page.data.intro as { heading?: string; paragraphs?: string[] } | undefined;
  if (
    intro?.paragraphs &&
    !intro.paragraphs.some((p) => p.toLowerCase().includes("garage door replacement"))
  ) {
    intro.paragraphs.push(REPLACEMENT_PARAGRAPH);
    changed = true;
  }

  const includedItems = page.data.includedItems as string[] | undefined;
  if (includedItems && !includedItems.includes(NEW_INCLUDED_ITEM)) {
    includedItems.push(NEW_INCLUDED_ITEM);
    changed = true;
  }

  const serviceAreas = page.data.serviceAreas as string[] | undefined;
  if (serviceAreas) {
    for (const suburb of NEW_SERVICE_AREAS) {
      if (!serviceAreas.includes(suburb)) {
        serviceAreas.push(suburb);
        changed = true;
      }
    }
  }

  const existingQuestions = new Set(page.faqs.map((f) => f.question));
  let faqSort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
  for (const faq of NEW_FAQS) {
    if (existingQuestions.has(faq.question)) continue;
    page.faqs.push({ id: 0, question: faq.question, answer: faq.answer, sortOrder: faqSort++, faqItemId: null });
    changed = true;
  }

  if (page.pricingRows.length === 0) {
    const pricingBody = await api<PricingItem[] | { items: PricingItem[] }>(
      "/api/admin/pricing-items",
    );
    const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
    const byScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));
    let pinSort = 0;
    for (const scenario of PRICING_PINS) {
      const pricingItemId = byScenario.get(scenario);
      if (!pricingItemId) {
        console.warn(`  ! pricing scenario not in catalog, pin skipped: "${scenario}"`);
        continue;
      }
      page.pricingRows.push({ pricingItemId, sortOrder: pinSort++, noteOverride: null });
      changed = true;
    }
  }

  const linkKeys = new Set(
    page.relatedLinks.map((l) => `${l.linkGroup}:${l.staticHref ?? `page:${l.targetPageId}`}`),
  );
  let linkSort = page.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1;
  for (const link of NEW_RELATED_LINKS) {
    if (linkKeys.has(`RelatedServices:${link.href}`)) continue;
    page.relatedLinks.push({
      id: 0,
      targetPageId: null,
      staticHref: link.href,
      labelOverride: link.label,
      linkGroup: "RelatedServices",
      sortOrder: linkSort++,
    });
    changed = true;
  }

  if (changed) {
    await api(`/api/admin/pages/${page.id}`, {
      method: "PUT",
      body: JSON.stringify(toUpdateBody(page)),
    });
    console.log(`  ✓ ${TARGET_SLUG} updated`);
  } else {
    console.log(`  = ${TARGET_SLUG} (no change)`);
  }

  /* ---- Phase B: publish remaining drafts ---- */
  for (const slug of PUBLISH_SLUGS) {
    const id = idBySlug.get(slug);
    if (!id) {
      console.warn(`  ! page not found, publish skipped: ${slug}`);
      continue;
    }
    const draft = await api<AdminPage>(`/api/admin/pages/${id}`);
    if (draft.status === "Published") {
      console.log(`  = ${slug} already published`);
      continue;
    }
    await api(`/api/admin/pages/${id}/publish`, { method: "POST" });
    console.log(`  ✓ ${slug} published`);
  }

  /* ---- Phase C: repoint Gosnells ⇄ Southern River nearby-suburb chips ---- */
  for (const repoint of NEARBY_REPOINTS) {
    const id = idBySlug.get(repoint.pageSlug);
    if (!id) {
      console.warn(`  ! page not found, repoint skipped: ${repoint.pageSlug}`);
      continue;
    }
    const suburbPage = await api<AdminPage>(`/api/admin/pages/${id}`);
    const row = suburbPage.relatedLinks.find(
      (l) => l.linkGroup === "NearbySuburbs" && l.labelOverride === repoint.label,
    );
    if (!row) {
      console.warn(`  ! "${repoint.label}" chip not found on ${repoint.pageSlug}, repoint skipped`);
      continue;
    }
    if (row.staticHref === repoint.href) {
      console.log(`  = ${repoint.pageSlug} → ${repoint.label} already repointed`);
      continue;
    }
    row.staticHref = repoint.href;
    await api(`/api/admin/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(toUpdateBody(suburbPage)),
    });
    console.log(`  ✓ ${repoint.pageSlug}: "${repoint.label}" chip → ${repoint.href}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
