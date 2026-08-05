/**
 * Fixes the internal-link findings of the 2026-08-05 Semrush site audit
 * (exports in ~/Downloads/semrush/SITE-AUDIT; triage in the session log):
 *
 *  1. Three pages link case studies by their OLD slugs, which now 308:
 *       /case-studies/sectional-door-installation-fremantle
 *         → /case-studies/garage-door-cable-drum-repair-fremantle-perth
 *       /case-studies/garage-door-motor-replacement-joondalup
 *         → /case-studies/garage-door-motor-installation-ellenbrook-perth
 *     (no Joondalup case study exists in the 21 real ones; the redirect target
 *     is the same job type in the northern corridor.) These links live inside
 *     the pages' `data` blobs, so the fix is exact-substring replacement over
 *     the serialised JSON — the fix-blog-pricing.ts pattern: path-independent
 *     and idempotent.
 *  2. The common-problems article links /blog/garage-door-motor-replacement-cost-perth
 *     (308 → the flat cost guide) from its RelatedArticles group. Per the
 *     CLAUDE.md mapper gotcha, RelatedArticles hrefs are slugified and
 *     re-prefixed "/blog/", so the row must MOVE to RelatedServices with the
 *     flat href — just rewriting the href would render the phantom /blog/ URL
 *     again. Handled on relatedLinks rows; any in-body occurrences are covered
 *     by the data-blob replacement.
 *
 * Local CMS (default):   npx tsx scripts/fix-audit-links-2026-08.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/fix-audit-links-2026-08.ts
 */

export {}; // module scope — avoids top-level const collisions across scripts/*.ts

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** Exact-substring replacements applied to each page's serialised `data`. */
const DATA_REPLACEMENTS: [string, string][] = [
  [
    "/case-studies/sectional-door-installation-fremantle",
    "/case-studies/garage-door-cable-drum-repair-fremantle-perth",
  ],
  [
    "Case Study: Sectional Door Installation in Fremantle",
    "Case Study: Garage Door Cable & Drum Repair in Fremantle",
  ],
  [
    "/case-studies/garage-door-motor-replacement-joondalup",
    "/case-studies/garage-door-motor-installation-ellenbrook-perth",
  ],
  [
    "Case Study: Garage Door Motor Replacement in Joondalup",
    "Case Study: Garage Door Motor Installation in Ellenbrook",
  ],
  ["/blog/garage-door-motor-replacement-cost-perth", "/garage-door-motor-replacement-cost-perth"],
];

const OLD_BLOG_COST_HREF = "/blog/garage-door-motor-replacement-cost-perth";
const FLAT_COST_HREF = "/garage-door-motor-replacement-cost-perth";

interface RelatedLink {
  targetPageId: number | null;
  staticHref: string | null;
  labelOverride: string | null;
  linkGroup: string;
  sortOrder: number;
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
  faqs: { question: string; answer: string; sortOrder: number; faqItemId: number | null }[];
  relatedLinks: RelatedLink[];
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
  console.log(`Audit link fixes → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );

  let touched = 0;
  for (const ref of list.items) {
    const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
    const notes: string[] = [];

    // 1. Data-blob replacements (exact substring over serialised JSON).
    let serialized = JSON.stringify(page.data);
    for (const [from, to] of DATA_REPLACEMENTS) {
      if (serialized.includes(from)) {
        serialized = serialized.split(from).join(to);
        notes.push(`data: "${from}" → "${to}"`);
      }
    }
    if (notes.length > 0) page.data = JSON.parse(serialized);

    // 2. relatedLinks rows pointing at the 301'd blog cost guide — move to
    //    RelatedServices with the flat href (RelatedArticles re-prefixing gotcha).
    for (const link of page.relatedLinks) {
      if (link.staticHref === OLD_BLOG_COST_HREF || link.staticHref === FLAT_COST_HREF) {
        if (link.staticHref === OLD_BLOG_COST_HREF) {
          link.staticHref = FLAT_COST_HREF;
          notes.push("relatedLink href → flat cost guide");
        }
        if (link.linkGroup === "RelatedArticles") {
          link.linkGroup = "RelatedServices";
          link.labelOverride = "Garage Door Motor Replacement Cost Perth";
          notes.push("relatedLink moved RelatedArticles → RelatedServices");
        }
      }
      // Same stale case-study slugs if any live as relatedLinks rows.
      for (const [from, to] of DATA_REPLACEMENTS) {
        if (link.staticHref === from) {
          link.staticHref = to;
          notes.push(`relatedLink href: "${from}" → "${to}"`);
        }
      }
    }

    if (notes.length === 0) continue;
    await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ ${page.routeGroup}/${page.slug}:`);
    for (const n of notes) console.log(`      - ${n}`);
    touched++;
  }

  console.log(touched === 0 ? "  = nothing to fix — all links already clean" : `\nDone — ${touched} page(s) updated.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
