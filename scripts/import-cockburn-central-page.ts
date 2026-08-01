/**
 * Cockburn Central suburb page (2026-08) — create as DRAFT, then wire in.
 *
 * Built from dedicated keyword research (see the header of
 * content/service-suburb-pages-cockburn-central.ts for the GSC/DataForSEO/SERP
 * evidence). Two phases, both idempotent:
 *
 *   Phase A — create /garage-door-repairs-cockburn-central as a DRAFT.
 *             Nothing public changes. 409 = already exists, skipped.
 *
 *   Phase B — runs ONLY once that page is Published (skipped with a message
 *             while it's still a draft, so re-run this script after publishing):
 *               1. Narrows the LIVE Success page — it was titled "Success &
 *                  Cockburn" and claimed Cockburn in its hero + intro copy,
 *                  while GSC showed it capturing ZERO Cockburn impressions
 *                  (the homepage was, at position 49.8). The new page owns
 *                  those terms now. Desired state here is kept in lockstep with
 *                  scripts/sync-seo-fixes.ts (pinned title) and
 *                  scripts/enhance-suburb-pages.ts (description + paragraph).
 *               2. Links the existing "Cockburn Central" suburb row (Southern
 *                  Suburbs region) to the page via `pageId` — without this the
 *                  /service-areas chip is plain text and the page is an orphan.
 *               3. Repoints every Flat page's "Cockburn Central" NearbySuburbs
 *                  chip that still points at the /service-areas placeholder.
 *               4. Appends "Cockburn Central" to the /garage-door-repairs-perth
 *                  hub grid (chips auto-link via the areaLinks frontend).
 *               5. Adds a Success → Cockburn Central related link.
 *
 * Local CMS (default):   npx tsx scripts/import-cockburn-central-page.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-cockburn-central-page.ts
 */

import { cockburnCentralPage } from "../content/service-suburb-pages-cockburn-central";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const TARGET_SLUG = cockburnCentralPage.slug;
const SUCCESS_SLUG = "garage-door-repairs-success";
const HUB_SLUG = "garage-door-repairs-perth";
const SUBURB_NAME = "Cockburn Central";

/* ---- Success page desired state after narrowing (lockstep — see header) ---- */
const SUCCESS_SEO_TITLE = "Garage Door Repairs Success | Same-Day Local Service";
const SUCCESS_SEO_DESCRIPTION =
  "Same-day garage door repairs in Success — springs, motors, cables & roller doors. Covering Atwell, Aubin Grove, Hammond Park & Beeliar. Free quotes.";
const SUCCESS_HERO_SUBTITLE =
  "Fast, reliable garage door repairs for Success families and the surrounding estates, with same-day options.";
/** Cockburn-claiming phrase → narrowed replacement. Applied to the hero,
 * directAnswer and every localIntro paragraph by exact substring swap (the
 * same path-independent approach scripts/fix-blog-pricing.ts uses), so it
 * no-ops cleanly once the page already reads this way. */
const SUCCESS_TEXT_FIXES: { from: string; to: string }[] = [
  {
    from:
      "Success and the surrounding Cockburn suburbs are full of newer family homes near Cockburn Gateway, so we see plenty of double sectional doors and smart Wi-Fi openers",
    to: "Success and the neighbouring estates are full of newer family homes, so we see plenty of double sectional doors and smart Wi-Fi openers",
  },
  {
    from: "Our local technicians repair residential and commercial doors throughout Success and the wider Cockburn area.",
    to: "Our local technicians repair residential and commercial doors throughout Success, Atwell, Aubin Grove and Hammond Park.",
  },
  {
    from: "We also regularly cover Cockburn Central, Atwell, Hammond Park, Aubin Grove and Beeliar.",
    to: "We also regularly cover Atwell, Hammond Park, Aubin Grove, Beeliar and Yangebup.",
  },
  {
    from:
      "From Cockburn Gateway out through the newer streets of Success, Atwell, Aubin Grove, Hammond Park and Beeliar, we're in the Cockburn corridor most days",
    to: "Through the newer streets of Success, Atwell, Aubin Grove, Hammond Park and Beeliar, we're in the area most days",
  },
];

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

function toCreatePayload() {
  const page = cockburnCentralPage;
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
    pricingRows: [],
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
  const { title, description } = cockburnCentralPage.seo;
  if (title.length > 60) console.warn(`! seo.title >60 chars (${title.length})`);
  if (description.length > 160) console.warn(`! seo.description >160 chars (${description.length})`);
  const allCopy = JSON.stringify(cockburnCentralPage);
  if (/\$\d/.test(allCopy)) throw new Error("Copy contains a dollar figure — prices may only come from the pricing catalog.");

  console.log(`Cockburn Central page → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  /* ---------------- Phase A: create as draft ---------------- */
  const { status } = await api<{ id: number }>("/api/admin/pages", {
    method: "POST",
    body: JSON.stringify(toCreatePayload()),
  });
  console.log(
    status === 409 ? `  = ${TARGET_SLUG} already exists (skipped)` : `  ✓ ${TARGET_SLUG} created (Draft)`,
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
        "Publish it in /admin, then re-run this script to narrow the Success page and link everything in.",
    );
    return;
  }

  console.log("\nPage is published — wiring it in:");

  // B1. Narrow the Success page.
  const successRef = bySlug.get(SUCCESS_SLUG);
  if (!successRef) {
    console.warn(`  ! ${SUCCESS_SLUG} not found — narrowing skipped`);
  } else {
    const success = await get<AdminPage>(`/api/admin/pages/${successRef.id}`);
    let changed = false;
    const notes: string[] = [];

    if (success.seoTitle !== SUCCESS_SEO_TITLE) {
      success.seoTitle = SUCCESS_SEO_TITLE;
      changed = true;
      notes.push("title");
    }
    if (success.seoDescription !== SUCCESS_SEO_DESCRIPTION) {
      success.seoDescription = SUCCESS_SEO_DESCRIPTION;
      changed = true;
      notes.push("description");
    }
    const hero = success.data.hero as { subtitle?: string } | undefined;
    if (hero && hero.subtitle !== SUCCESS_HERO_SUBTITLE) {
      hero.subtitle = SUCCESS_HERO_SUBTITLE;
      changed = true;
      notes.push("hero");
    }
    const applyFixes = (text: string) => {
      let out = text;
      for (const { from, to } of SUCCESS_TEXT_FIXES) if (out.includes(from)) out = out.replace(from, to);
      return out;
    };
    const direct = success.data.directAnswer;
    if (typeof direct === "string") {
      const next = applyFixes(direct);
      if (next !== direct) {
        success.data.directAnswer = next;
        changed = true;
        notes.push("directAnswer");
      }
    }
    const intro = success.data.localIntro as string[] | undefined;
    if (Array.isArray(intro)) {
      intro.forEach((p, i) => {
        const next = applyFixes(p);
        if (next !== p) {
          intro[i] = next;
          changed = true;
          notes.push(`intro[${i}]`);
        }
      });
    }
    // Cross-link Success → Cockburn Central.
    const hasLink = success.relatedLinks.some(
      (l) => l.linkGroup === "RelatedPages" && l.staticHref === `/${TARGET_SLUG}`,
    );
    if (!hasLink) {
      success.relatedLinks.push({
        id: 0,
        targetPageId: null,
        staticHref: `/${TARGET_SLUG}`,
        labelOverride: "Garage Door Repairs Cockburn Central",
        linkGroup: "RelatedPages",
        sortOrder: success.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1,
      });
      changed = true;
      notes.push("cross-link");
    }

    if (changed) {
      await api(`/api/admin/pages/${success.id}`, {
        method: "PUT",
        body: JSON.stringify(toUpdateBody(success)),
      });
      console.log(`  ✓ ${SUCCESS_SLUG} narrowed: ${notes.join(", ")}`);
    } else {
      console.log(`  = ${SUCCESS_SLUG} already narrowed`);
    }
  }

  // B2. Link the "Cockburn Central" suburb row.
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

  // B3. Repoint placeholder chips across every Flat page.
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

  // B4. Hub grid.
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

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
