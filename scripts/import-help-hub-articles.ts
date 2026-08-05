/**
 * Imports the four 2026-08 remote/opener help-hub articles into the CMS as
 * DRAFTS (user reviews + publishes from /admin):
 *
 *   /blog/how-to-program-a-garage-door-remote        — program/sync cluster ~4k/mo, KD ≤18
 *   /blog/how-to-reset-a-garage-door-opener-and-remote — reset cluster ~1k/mo, KD ≤10
 *   /blog/how-to-open-a-garage-door-manually          — manual-open cluster ~1k/mo, KD 8–28
 *   /blog/how-to-fix-garage-door-sensor               — 1,300/mo at KD 0
 *
 * Research: docs/marketing/semrush-2026-08/. Same payload transform as
 * scripts/import-springs-guide.ts, but status "Draft" and a loop. 409 = skip.
 *
 * PUBLISH ORDER NOTE: the program-remote + reset articles link to
 * /garage-door-remote-replacement-perth (created as a Draft by
 * import-semrush-money-pages.ts) — publish that page before or together with
 * these articles so the links resolve.
 *
 * Local CMS (default):   npx tsx scripts/import-help-hub-articles.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-help-hub-articles.ts
 */

import type { Article } from "../types/article";
import { howToProgramAGarageDoorRemote } from "../content/articles/how-to-program-a-garage-door-remote";
import { howToResetAGarageDoorOpenerAndRemote } from "../content/articles/how-to-reset-a-garage-door-opener-and-remote";
import { howToOpenAGarageDoorManually } from "../content/articles/how-to-open-a-garage-door-manually";
import { howToFixGarageDoorSensor } from "../content/articles/how-to-fix-garage-door-sensor";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const NEW_ARTICLES: Article[] = [
  howToProgramAGarageDoorRemote,
  howToResetAGarageDoorOpenerAndRemote,
  howToOpenAGarageDoorManually,
  howToFixGarageDoorSensor,
];

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

/** Find an asset by exact cdnUrl (paging the whole library), or create it. */
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

/** Same transform as scripts/import-springs-guide.ts — but Draft. */
function toPayload(article: Article, heroImageAssetId: number | null) {
  return {
    templateType: "Article",
    routeGroup: "Blog",
    slug: article.slug,
    title: article.title,
    seoTitle: article.seo.title,
    seoDescription: article.seo.description,
    noIndex: false,
    status: "Draft",
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

async function main() {
  console.log(`Importing help-hub articles (as Drafts) into ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  for (const article of NEW_ARTICLES) {
    const heroImageAssetId = article.featuredImage
      ? await findOrCreateAsset(article.featuredImage, article.featuredImageAlt)
      : null;

    const { status } = await api<{ id: number }>(`/api/admin/pages`, {
      method: "POST",
      body: JSON.stringify(toPayload(article, heroImageAssetId)),
    });

    if (status === 409) {
      console.log(`  = ${article.slug} already exists (skipped)`);
    } else {
      console.log(`  ✓ ${article.slug} created as DRAFT`);
    }
  }

  console.log(
    "\nDone. Publish from /admin — publish /garage-door-remote-replacement-perth before (or with) the remote/reset articles so their links resolve.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
