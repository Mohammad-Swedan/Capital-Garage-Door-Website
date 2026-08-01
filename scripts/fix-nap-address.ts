/**
 * NAP fix (2026-08): the site said the workshop was on "Carnegie Parade" while
 * the Google Business Profile says "13 Amrock Street, Southern River WA 6110".
 * A mismatch between the website's address and the GBP weakens local/map-pack
 * ranking, because Google cross-checks the two when matching the entity.
 *
 * config/site.ts (which feeds the footer, contact page, service contact panel
 * and all JSON-LD) is corrected in the same commit. This script fixes the other
 * place the street name is written out in prose: the LIVE CMS copy of the
 * Southern River suburb page (its intro paragraph and the "Are you based in
 * Southern River?" FAQ). The local content/service-suburb-pages.ts fallback is
 * corrected in the same commit too.
 *
 * Exact-substring replacement over the whole page payload — path-independent
 * and idempotent (a no-op once the strings are already correct). Run --check
 * first to confirm the source strings still exist before writing.
 *
 *   npx tsx scripts/fix-nap-address.ts --check
 *   CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/fix-nap-address.ts
 */

export {}; // module scope

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";
const CHECK_ONLY = process.argv.includes("--check");

/** Every page whose prose names the street, and the replacements to apply. */
const TARGET_SLUG = "garage-door-repairs-southern-river";
const REPLACEMENTS: { from: string; to: string }[] = [
  { from: "our workshop is right here on Carnegie Parade", to: "our workshop is right here on Amrock Street" },
  { from: "based in Southern River, on Carnegie Parade", to: "based in Southern River, on Amrock Street" },
  // Catch-all for any other phrasing that slipped in.
  { from: "Carnegie Parade", to: "Amrock Street" },
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
  if (CHECK_ONLY) {
    // Anonymous public resolve — no credentials needed for the check.
    const res = await fetch(
      `${CMS_API_URL}/api/pages/resolve?routeGroup=flat&slug=${encodeURIComponent(TARGET_SLUG)}`,
    );
    if (!res.ok) throw new Error(`Resolve failed (${res.status}) for ${TARGET_SLUG}`);
    const blob = await res.text();
    console.log(`Checking ${TARGET_SLUG} at ${CMS_API_URL}`);
    let stale = 0;
    for (const { from } of REPLACEMENTS) {
      const present = blob.includes(from);
      if (present) stale++;
      console.log(`  ${present ? "FOUND (will fix)" : "absent"}: "${from}"`);
    }
    console.log(stale ? `\n${stale} stale string(s) present — run without --check to fix.` : "\nNothing to fix.");
    return;
  }

  console.log(`Fixing NAP street name on ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const match = list.items.find((p) => p.routeGroup === "Flat" && p.slug === TARGET_SLUG);
  if (!match) throw new Error(`Page not found: ${TARGET_SLUG}`);

  const page = await api<AdminPage>(`/api/admin/pages/${match.id}`);
  const body = toUpdateBody(page);
  let serialised = JSON.stringify(body);
  const before = serialised;
  for (const { from, to } of REPLACEMENTS) {
    serialised = serialised.split(from).join(to);
  }
  if (serialised === before) {
    console.log(`  = ${TARGET_SLUG} already correct (no change)`);
    return;
  }
  await api(`/api/admin/pages/${match.id}`, { method: "PUT", body: serialised });
  console.log(`  ✓ ${TARGET_SLUG} updated — street name now matches the Google Business Profile`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
