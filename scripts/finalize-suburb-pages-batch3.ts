/**
 * Post-publish wiring for the 15 batch-3 suburb pages
 * (scripts/import-suburb-pages-batch3.ts created them as Drafts).
 *
 * A suburb page is invisible until it's linked (CLAUDE.md): this script does,
 * for every batch-3 page that is PUBLISHED (drafts are skipped, so it can be
 * re-run as pages are published in stages):
 *
 *  1. /service-areas chip — sets the matching suburb row's `pageId` (creates
 *     the suburb row first if it doesn't exist, placed in the same region as
 *     the nearby anchor suburb listed in REGION_ANCHOR below).
 *  2. Nearby-chip repoints — on EVERY Flat page, any NearbySuburbs chip whose
 *     label is a published batch-3 suburb and whose href is the /service-areas
 *     placeholder is repointed at the real page (this also cross-links the
 *     batch-3 pages to each other once both sides are published).
 *  3. Hub grid — appends the published suburb names to
 *     /garage-door-repairs-perth's data.serviceAreas (the areaLinks frontend
 *     links matching chips automatically).
 *
 * Idempotent throughout. Slug lookups filter routeGroup === "Flat" (slugs are
 * only unique per route group — see scripts/enhance-suburb-pages.ts).
 *
 * Production: CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/finalize-suburb-pages-batch3.ts
 */

import { serviceSuburbPagesBatch3 } from "../content/service-suburb-pages-batch3";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** When a suburb row doesn't exist yet, create it in the same region as this
 * anchor suburb (an existing row we know the right region for). */
const REGION_ANCHOR: Record<string, string> = {
  // Canning River corridor
  Shelley: "Cannington",
  Rossmoyne: "Cannington",
  Parkwood: "Cannington",
  Langford: "Thornlie",
  Lynwood: "Thornlie",
  Ferndale: "Cannington",
  Wilson: "Cannington",
  // Southern growth corridor
  Harrisdale: "Southern River",
  "Piara Waters": "Southern River",
  Forrestdale: "Southern River",
  // Armadale corridor
  Kelmscott: "Armadale",
  Camillo: "Armadale",
  "Champion Lakes": "Armadale",
  "Seville Grove": "Armadale",
  Brookdale: "Armadale",
};

const HUB_SLUG = "garage-door-repairs-perth";

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

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : undefined) as T;
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
  console.log(`Finalizing batch-3 suburb pages on ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const pageList = await api<{
    items: { id: number; slug: string; routeGroup: string; status: string }[];
  }>("/api/admin/pages?pageSize=200");
  const flatPages = pageList.items.filter((p) => p.routeGroup === "Flat");
  const bySlug = new Map(flatPages.map((p) => [p.slug, p]));

  // Only published batch-3 pages get wired in; drafts stay invisible.
  const published = serviceSuburbPagesBatch3.filter(
    (p) => bySlug.get(p.slug)?.status === "Published",
  );
  const skipped = serviceSuburbPagesBatch3.filter((p) => bySlug.get(p.slug)?.status !== "Published");
  if (skipped.length) {
    console.log(
      `  (still Draft/missing, skipped: ${skipped.map((p) => p.suburb).join(", ")})`,
    );
  }
  if (!published.length) {
    console.log("No batch-3 pages are published yet — nothing to do.");
    return;
  }
  console.log(`Wiring ${published.length} published page(s): ${published.map((p) => p.suburb).join(", ")}`);

  /* ---- 1. suburb rows → pageId ---- */
  const regionsRaw = await api<Region[] | { items: Region[] }>("/api/admin/service-area-regions");
  const regions = Array.isArray(regionsRaw) ? regionsRaw : regionsRaw.items;

  const findSuburb = (name: string): { region: Region; suburb: Suburb } | null => {
    for (const r of regions) {
      const s = r.suburbs.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (s) return { region: r, suburb: s };
    }
    return null;
  };

  for (const page of published) {
    const pageId = bySlug.get(page.slug)!.id;
    const found = findSuburb(page.suburb);

    if (!found) {
      const anchorName = REGION_ANCHOR[page.suburb];
      const anchor = anchorName ? findSuburb(anchorName) : null;
      if (!anchor) {
        console.warn(`  ! no suburb row and no anchor region for ${page.suburb} — link it manually in /admin/service-areas`);
        continue;
      }
      const sortOrder = anchor.region.suburbs.reduce((m, s) => Math.max(m, s.sortOrder), -1) + 1;
      const created = await api<Suburb>(`/api/admin/suburbs`, {
        method: "POST",
        body: JSON.stringify({
          regionId: anchor.region.id,
          name: page.suburb,
          slug: page.suburb.toLowerCase().replace(/\s+/g, "-"),
          pageId,
          sortOrder,
        }),
      });
      anchor.region.suburbs.push({ ...created, pageId });
      console.log(`  ✓ suburb row created + linked: ${page.suburb} (region "${anchor.region.name}")`);
      continue;
    }

    if (found.suburb.pageId === pageId) {
      console.log(`  = ${page.suburb} suburb row already linked`);
      continue;
    }
    await api(`/api/admin/suburbs/${found.suburb.id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: found.suburb.id,
        regionId: found.region.id,
        name: found.suburb.name,
        slug: found.suburb.slug,
        pageId,
        sortOrder: found.suburb.sortOrder,
      }),
    });
    console.log(`  ✓ ${page.suburb} suburb row → page ${pageId}`);
  }

  /* ---- 2. repoint placeholder chips on every Flat page ---- */
  const hrefByLabel = new Map(published.map((p) => [p.suburb, `/${p.slug}`]));
  for (const item of flatPages) {
    const page = await api<AdminPage>(`/api/admin/pages/${item.id}`);
    let changed = false;
    const notes: string[] = [];
    for (const link of page.relatedLinks) {
      if (link.linkGroup !== "NearbySuburbs" || !link.labelOverride) continue;
      const target = hrefByLabel.get(link.labelOverride);
      if (!target || target === `/${page.slug}`) continue;
      if (link.staticHref !== "/service-areas") continue;
      link.staticHref = target;
      changed = true;
      notes.push(link.labelOverride);
    }
    if (changed) {
      await api(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        body: JSON.stringify(toUpdateBody(page)),
      });
      console.log(`  ✓ ${page.slug}: chips → ${notes.join(", ")}`);
    }
  }

  /* ---- 3. hub grid ---- */
  const hub = bySlug.get(HUB_SLUG);
  if (!hub) {
    console.warn(`  ! hub page not found: ${HUB_SLUG}`);
  } else {
    const hubPage = await api<AdminPage>(`/api/admin/pages/${hub.id}`);
    const areas = hubPage.data.serviceAreas as string[] | undefined;
    if (!Array.isArray(areas)) {
      console.warn(`  ! ${HUB_SLUG} has no data.serviceAreas array, skipped`);
    } else {
      const added = published.map((p) => p.suburb).filter((n) => !areas.includes(n));
      if (added.length) {
        areas.push(...added);
        await api(`/api/admin/pages/${hubPage.id}`, {
          method: "PUT",
          body: JSON.stringify(toUpdateBody(hubPage)),
        });
        console.log(`  ✓ ${HUB_SLUG}: grid += ${added.join(", ")}`);
      } else {
        console.log(`  = ${HUB_SLUG} grid already complete`);
      }
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
