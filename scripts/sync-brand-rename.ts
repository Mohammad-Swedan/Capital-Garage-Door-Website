/**
 * One-time re-runnable sync: corrects the public brand name from "Capital
 * Garage Door" to "Capital Garage Doors" across every CMS-backed page,
 * wherever it appears in page text (title/seoTitle/seoDescription, the
 * bespoke `data` JSON, and FAQ question/answer). The trading name is "Capital
 * Garage Doors" (matches the domain, Google Business Profile, and social
 * handles) — only `config/site.ts` local edits reach static/code text; pages
 * whose type is CMS-cutover (services, case studies, articles, problems,
 * cost guides, …) are served from this database, so those need this sync to
 * actually go live. Deliberately generic (sweeps every page, not a fixed
 * slug list) so it also catches pages with no local `content/*.ts` mirror.
 *
 * Does NOT touch: `legalName` (not stored per-page — it's a config/site.ts
 * business-wide field, and the ABR-verified legal entity name is
 * deliberately unchanged), asset/CDN URLs or hrefs (the brand-name regex
 * requires literal spaces and won't match hyphenated URL slugs), or Review
 * entities (separate from Page — see the console warning this script prints
 * if it finds a singular mention in review text, left for manual review
 * since that's a customer's quoted words).
 *
 * Idempotent: only PUTs a page when its content actually changes.
 *
 * Local CMS (default):   npx tsx scripts/sync-brand-rename.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/sync-brand-rename.ts
 */

export {}; // force module scope — this file has no imports, and TS treats an import/export-less
// file as a global script, which collides with the same top-level names in other CMS scripts.

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** Same rule as the local file sweep: possessive first, then the plain noun (never re-matches an already-plural "Doors"). */
function renameBrand(text: string): string {
  return text
    .replace(/Capital Garage Door's/g, "Capital Garage Doors'")
    .replace(/Capital Garage Door(?!s)/g, "Capital Garage Doors");
}

/** Recursively apply renameBrand to every string leaf in an arbitrary JSON value. */
function deepRename<T>(value: T): T {
  if (typeof value === "string") return renameBrand(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => deepRename(v)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = deepRename(v);
    return out as T;
  }
  return value;
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

async function main() {
  console.log(`Syncing brand-name rename to ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string }[]; totalPages: number }>(
    "/api/admin/pages?pageSize=200",
  );
  console.log(`Found ${list.items.length} page(s).`);

  let updated = 0;
  let skipped = 0;
  for (const { id, slug } of list.items) {
    const page = await api<AdminPage>(`/api/admin/pages/${id}`);

    const next: AdminPage = {
      ...page,
      title: renameBrand(page.title),
      seoTitle: renameBrand(page.seoTitle),
      seoDescription: renameBrand(page.seoDescription),
      data: deepRename(page.data),
      faqs: page.faqs.map((f) => ({
        ...f,
        question: renameBrand(f.question),
        answer: renameBrand(f.answer),
      })),
    };

    if (JSON.stringify(next) === JSON.stringify(page)) {
      skipped++;
      continue;
    }

    await api(`/api/admin/pages/${id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(next)) });
    console.log(`  ✓ ${slug}: brand name corrected`);
    updated++;
  }

  console.log(`\nDone. ${updated} page(s) updated, ${skipped} unchanged.`);

  // Reviews are separate entities (real customer quotes) — flag rather than silently rewrite.
  const reviews = await api<{ items: { id: number; customerName: string; text: string }[] }>(
    "/api/admin/reviews?pageSize=200",
  );
  const flagged = (reviews.items ?? []).filter((r) => /Capital Garage Door(?!s)/.test(r.text));
  if (flagged.length > 0) {
    console.log(`\n⚠ ${flagged.length} review(s) contain the singular brand name (left untouched — customer's own words):`);
    for (const r of flagged) console.log(`  - "${r.customerName}": ${r.text.slice(0, 100)}...`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
