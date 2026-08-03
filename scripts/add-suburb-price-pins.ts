/**
 * Adds the guide-price table pins to every PUBLISHED suburb page that has none
 * (2026-08-04). Batch 3 introduced the crawlable price table (CostGuidance
 * rows ← CMS pricingRows) because every live suburb SERP surfaces
 * "{suburb} cost/prices" in its related searches — but the 19 pre-batch-3
 * pages (plus any batch-2 page published since) were created without pins and
 * so render no table. CLAUDE.md recorded that as "an easy follow-up"; this is
 * that follow-up, promoted to a script after the same pattern lifted the
 * Cockburn Central launch (scripts/enhance-cockburn-central-page.ts).
 *
 * Selection is data-driven, not a hardcoded slug list: routeGroup Flat +
 * templateType ServiceSuburbPage + status Published + pricingRows empty.
 * Idempotent — pages that already have rows are never touched, so re-running
 * after more batch-2/3 publishes pins only the new ones.
 *
 * Pins are the standard batch-3 set (exact catalog scenario strings — note
 * the multiplication sign in "×2"). The commercial pin is NOT added here;
 * commercial-flavoured pages get it individually (batch-3 importer /
 * enhance-cockburn-central-page.ts).
 *
 * Local CMS (default):   npx tsx scripts/add-suburb-price-pins.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/add-suburb-price-pins.ts
 */

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

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

interface PricingItem {
  id: number;
  scenario: string;
}

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
  console.log(`Suburb price-pin rollout → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const pricingBody = await api<PricingItem[] | { items: PricingItem[] }>(
    "/api/admin/pricing-items?pageSize=200",
  );
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const byScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));
  const pinIds: number[] = [];
  for (const scenario of PRICING_PINS) {
    const id = byScenario.get(scenario);
    if (!id) {
      console.warn(`  ! pricing scenario not in catalog, pin skipped: "${scenario}"`);
      continue;
    }
    pinIds.push(id);
  }
  if (pinIds.length === 0) throw new Error("No pin scenarios matched the catalog — aborting.");
  console.log(`  catalog: ${pricingItems.length} items, ${pinIds.length}/${PRICING_PINS.length} pins matched`);

  const list = await api<{ items: { id: number; slug: string; routeGroup: string; status: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );

  let pinned = 0;
  let skipped = 0;
  for (const item of list.items) {
    if (item.routeGroup !== "Flat" || item.status !== "Published") continue;
    const page = await api<AdminPage>(`/api/admin/pages/${item.id}`);
    if (page.templateType !== "ServiceSuburbPage") continue;
    if (page.pricingRows.length > 0) {
      skipped++;
      continue;
    }
    page.pricingRows = pinIds.map((pricingItemId, i) => ({ pricingItemId, sortOrder: i, noteOverride: null }));
    await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ ${page.slug}: ${page.pricingRows.length} price rows pinned`);
    pinned++;
  }

  console.log(`Done. ${pinned} pages pinned, ${skipped} already had rows.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
