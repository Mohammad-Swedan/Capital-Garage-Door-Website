/**
 * Phase-1 SEO recovery, from the 2026-07-24 GSC analysis. Two jobs:
 *
 *  1. Creates + publishes the recreated spring pillar at /blog/garage-door-springs-guide.
 *     The old site's /blogs/garage-door-springs-guide held 1,834 impressions at avg
 *     position 10.7 (the domain's best-performing substantial page) and has been
 *     404ing since the rebuild. next.config.ts already 301s /blogs/<slug> →
 *     /blog/<slug>, so publishing this slug is what makes that redirect land.
 *     Then appends it (append-if-missing) to the RelatedServices group on the two
 *     spring money pages so it isn't orphaned.
 *
 *  2. Unpublishes the DUPLICATE blog copy of garage-door-motor-replacement-cost-perth.
 *     That slug exists in both the `flat` and `blog` route groups. Google indexed the
 *     blog copy (90 impressions, pos 19) and ignored the flat one (zero), but the blog
 *     copy quotes $450–$1,200 for a motor replacement and $150–$450 for a repair while
 *     the real price list says $770–$990 and $380–$490 — and the flat cost-guide page is
 *     pinned to that price list. Keeping the accurate page also matches the rest of the
 *     cost-guide family at the top level. next.config.ts 301s the blog URL to it;
 *     unpublishing is what drops the URL out of the sitemap.
 *
 * Idempotent: an existing slug is skipped (409), the link additions are
 * append-if-missing, and an already-unpublished page is left alone. The CMS fires the
 * ISR revalidation webhook itself post-commit, so no explicit revalidate here.
 *
 * Local CMS (default):   npx tsx scripts/import-springs-guide.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-springs-guide.ts
 */

import type { Article } from "../types/article";
import { garageDoorSpringsGuide } from "../content/articles/garage-door-springs-guide";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** Pages that should link to the new guide, and the label to use. */
const LINK_ADDITIONS: { slug: string; href: string; label: string }[] = [
  {
    slug: "garage-door-spring-repair-perth",
    href: "/blog/garage-door-springs-guide",
    label: "Garage Door Springs: The Complete Perth Guide",
  },
  {
    slug: "garage-door-spring-replacement-cost-perth",
    href: "/blog/garage-door-springs-guide",
    label: "Garage Door Springs: The Complete Perth Guide",
  },
];

/** The duplicate to retire — see the header note. */
const DUPLICATE_SLUG = "garage-door-motor-replacement-cost-perth";

interface AdminPage {
  id: number;
  templateType: string;
  routeGroup?: string;
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

/** Find an asset by exact cdnUrl (paging the library), or create it. Same helper as import-door-type-pages.ts. */
async function findOrCreateAsset(cdnUrl: string, altText: string): Promise<number> {
  for (let pageNumber = 1; pageNumber <= 50; pageNumber++) {
    const { body } = await api<{ items: { id: number; cdnUrl: string }[]; totalPages: number }>(
      `/api/admin/assets?pageNumber=${pageNumber}&pageSize=100`,
    );
    const existing = (body.items ?? []).find((a) => a.cdnUrl === cdnUrl);
    if (existing) return existing.id;
    if (pageNumber >= (body.totalPages || 1)) break;
  }
  const { body } = await api<{ id: number }>(`/api/admin/assets`, {
    method: "POST",
    body: JSON.stringify({ cdnUrl, altText, width: null, height: null }),
  });
  return body.id;
}

/** Same transform as lib/cms/import/articles.ts, inlined for one article (no image content blocks to register). */
function toPayload(article: Article, heroImageAssetId: number | null) {
  return {
    templateType: "Article",
    routeGroup: "Blog",
    slug: article.slug,
    title: article.title,
    seoTitle: article.seo.title,
    seoDescription: article.seo.description,
    noIndex: false,
    status: "Published",
    heroImageAssetId,
    data: {
      category: article.category,
      excerpt: article.excerpt,
      author: article.author,
      authorTitle: article.authorTitle,
      authorBio: article.authorBio,
      shortAnswer: article.shortAnswer,
      readingTimeOverride: article.readingTime,
      tableOfContentsOverride: (article.tableOfContents ?? []).map((t) => ({
        id: t.id,
        label: t.label,
      })),
      contentBlocks: article.contentBlocks,
      expertTips: article.expertTips.map((t) => ({ kind: t.kind, title: t.title, body: t.body })),
    },
    faqs: article.faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
    relatedLinks: [
      ...article.relatedServices.map((l, i) => ({
        targetPageId: null,
        staticHref: l.href,
        labelOverride: l.label,
        linkGroup: "RelatedServices",
        sortOrder: i,
      })),
      // NOTE: map-article.ts slug-ifies RelatedArticles hrefs and re-prefixes /blog/,
      // so only real blog slugs belong in this group (see CLAUDE.md).
      ...article.relatedArticles.map((a, i) => ({
        targetPageId: null,
        staticHref: `/blog/${a.slug}`,
        labelOverride: a.title,
        linkGroup: "RelatedArticles",
        sortOrder: i,
      })),
    ],
    pricingRows: [],
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
  console.log(`Phase-1 SEO recovery against ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  // ---- 1. Create + publish the recreated spring pillar ----
  const article = garageDoorSpringsGuide;
  const heroImageAssetId = article.featuredImage
    ? await findOrCreateAsset(article.featuredImage, article.featuredImageAlt)
    : null;

  const { status } = await api<{ id: number }>("/api/admin/pages", {
    method: "POST",
    body: JSON.stringify(toPayload(article, heroImageAssetId)),
  });
  if (status === 409) {
    console.log(`  = blog/${article.slug} already exists (skipped)`);
  } else {
    console.log(`  ✓ blog/${article.slug} created + published`);
  }

  // ---- 2. Page index (needed for both the link additions and the duplicate) ----
  const { body: pageList } = await api<{
    items: { id: number; slug: string; routeGroup?: string; status?: string }[];
  }>("/api/admin/pages?pageSize=200");
  const items = pageList.items ?? [];

  // ---- 3. Append the guide to the spring money pages (append-if-missing) ----
  for (const add of LINK_ADDITIONS) {
    const match = items.find((p) => p.slug === add.slug);
    if (!match) {
      console.warn(`  ! ${add.slug} not found — link not added`);
      continue;
    }
    const { body: page } = await api<AdminPage>(`/api/admin/pages/${match.id}`);
    if (page.relatedLinks.some((l) => l.staticHref === add.href)) {
      console.log(`  = ${add.slug} already links to the guide`);
      continue;
    }
    const group = "RelatedServices";
    const nextSort = page.relatedLinks.filter((l) => l.linkGroup === group).length;
    page.relatedLinks.push({
      targetPageId: null,
      staticHref: add.href,
      labelOverride: add.label,
      linkGroup: group,
      sortOrder: nextSort,
    });
    await api(`/api/admin/pages/${match.id}`, {
      method: "PUT",
      body: JSON.stringify(toUpdateBody(page)),
    });
    console.log(`  ✓ ${add.slug} → links to the guide`);
  }

  // ---- 4. Unpublish the duplicate blog motor-cost page ----
  // Route group naming differs between list DTOs; match case-insensitively and
  // require BOTH the flat and blog copies to exist before retiring either one.
  const dupes = items.filter((p) => p.slug === DUPLICATE_SLUG);
  const blogCopy = dupes.find((p) => (p.routeGroup ?? "").toLowerCase() === "blog");
  const flatCopy = dupes.find((p) => (p.routeGroup ?? "").toLowerCase() === "flat");

  if (!blogCopy || !flatCopy) {
    console.warn(
      `  ! expected both a flat and a blog copy of ${DUPLICATE_SLUG} (found ${dupes.length}) — unpublish skipped`,
    );
  } else {
    const { body: page } = await api<AdminPage>(`/api/admin/pages/${blogCopy.id}`);
    if (page.status.toLowerCase() === "draft") {
      console.log(`  = blog/${DUPLICATE_SLUG} already unpublished`);
    } else {
      page.status = "Draft";
      await api(`/api/admin/pages/${blogCopy.id}`, {
        method: "PUT",
        body: JSON.stringify(toUpdateBody(page)),
      });
      console.log(`  ✓ blog/${DUPLICATE_SLUG} unpublished (flat copy kept — it has the real prices)`);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
