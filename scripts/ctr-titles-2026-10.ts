/**
 * CTR title pass, 2026-10: changes ONLY `seoTitle`, on five striking-distance pages.
 *
 * Why: 90 days of AU Search Console data (the 2026-10 SEO growth program) has these pages on page one
 * or two for their head query with 0 clicks, and their titles don't echo the query's modifier:
 *
 *   /garage-door-repair-cost-perth              "garage door repair cost"          299 imp @ 7.8
 *                                               "garage door cable repair perth"   264 imp @ 8.7
 *   /garage-door-spring-repair-perth            "garage door spring replacement"   498 imp @ 14.7
 *   /emergency-garage-door-repairs-perth        "24 hour garage door repair"       290 imp @ 14.9
 *                                               "urgent garage door repair"        122 imp @ 7.7
 *   /garage-door-service-cost-perth             ranks ~68 for its own head term (the repair-cost page
 *                                               ranks 10.8 for "garage door service cost perth"); its old
 *                                               title split the phrase ("Service & Maintenance Cost")
 *   /garage-door-spring-replacement-cost-perth  its old title split the phrase ("Spring & Cable
 *                                               Replacement Cost")
 *
 * This is deliberately NOT scripts/sync-seo-fixes.ts. A full sync re-applies the July 2026 desired
 * state (directAnswer/intro text, pins, links) and could revert later enhancements. This script
 * writes one field. Every other field is preserved through the same full-children PUT body the
 * other CMS scripts use, and each write is verified from the PUT response: if anything besides
 * `seoTitle` changed, the run stops.
 *
 * LOCKSTEP: these five strings also live in
 *   - scripts/sync-seo-fixes.ts `SEO_FIXES`, so a future full sync can't revert them, and
 *   - content/cost-guides/{garage-door-repair-cost,garage-door-spring-replacement-cost,
 *     garage-door-service-cost}-perth.ts `seo.title` (the local fallback and importer source).
 * lib/brands/__tests__/ctr-titles.test.ts fails if any of them drifts. Change all together.
 *
 * Route group: admin slugs are only unique per route group, so every lookup filters
 * `routeGroup === "Flat"`.
 *
 * Modes:
 *   dry run (default)  read-only. Prints `slug: "old" → "new"` for every page that would change.
 *   --apply            performs the PUTs. The CMS fires the revalidate webhook on update, so the new
 *                      titles go live immediately (no explicit revalidate step).
 *
 * `CMS_API_URL` and `CMS_ADMIN_PASSWORD` are REQUIRED, with no defaults. There is deliberately no
 * localhost fallback: the local :5179 CMS can serve another client's database.
 *
 *   CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/ctr-titles-2026-10.ts
 *   CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/ctr-titles-2026-10.ts --apply
 *
 * Idempotent: a page whose title already equals the desired one is skipped. A slug that isn't found
 * is warned about and skipped (the run continues, then exits 1 so the gap is visible).
 */

// Module scope: this file also has named exports, but the explicit `export {}` matches every other
// script here and keeps the top-level consts from colliding with other scripts' in a `tsc` run.
export {};

/** The repo's title limit: `buildMetadata` warns above it and CLAUDE.md says author titles ≤60. Counted in code points. */
const TITLE_MAX = 60;

/** How many pages to request per list call. The loop below follows `totalPages` if the CMS caps it lower. */
const LIST_PAGE_SIZE = 500;

/**
 * slug (route group Flat) → the new `seoTitle`. Descriptions are deliberately untouched.
 * Verbatim from the task brief; each is ≤60 code points (the test and `main()` both enforce it).
 */
export const CTR_TITLES_2026_10: Readonly<Record<string, string>> = {
  "garage-door-repair-cost-perth": "Garage Door Repair Cost Perth (2026 Price Guide)",
  "garage-door-spring-replacement-cost-perth": "Garage Door Spring Replacement Cost Perth (2026 Guide)",
  "garage-door-service-cost-perth": "Garage Door Service Cost Perth (2026 Price Guide)",
  "garage-door-spring-repair-perth": "Garage Door Spring Replacement Perth | Same-Day Repairs",
  "emergency-garage-door-repairs-perth": "Emergency Garage Door Repairs Perth | 24 Hour Call-Outs",
};

/* ------------------------------------------------------------------ *
 * Admin page shape + the full-children PUT body
 * ------------------------------------------------------------------ */

export interface AdminPage {
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

interface PageListItem {
  id: number;
  slug: string;
  routeGroup: string;
}

interface Paged<T> {
  items?: T[];
  totalPages?: number;
  totalCount?: number;
}

/** Round-trip a PageDetailDto into the UpdatePageCommand body. The PUT replaces every child, so all of them go back. */
export function toUpdateBody(page: AdminPage) {
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

/** The PUT body for a title change: a plain round trip of the page with `seoTitle` swapped. Nothing else moves. */
export function buildTitleUpdateBody(page: AdminPage, seoTitle: string) {
  return { ...toUpdateBody(page), seoTitle };
}

/** Top-level PUT-body keys whose values differ between two versions of a page (compared as JSON). */
export function changedBodyKeys(before: AdminPage, after: AdminPage): string[] {
  const a: Record<string, unknown> = toUpdateBody(before);
  const b: Record<string, unknown> = toUpdateBody(after);
  return Object.keys(a).filter((key) => JSON.stringify(a[key]) !== JSON.stringify(b[key]));
}

/* ------------------------------------------------------------------ *
 * API plumbing
 * ------------------------------------------------------------------ */

let cmsApiUrl = "";
let token = "";

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${cmsApiUrl}${path}`, {
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

async function login(email: string, password: string): Promise<void> {
  const res = await fetch(`${cmsApiUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status}) at ${cmsApiUrl}. Check CMS_ADMIN_EMAIL / CMS_ADMIN_PASSWORD.`);
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Login succeeded but no token was returned.");
  token = data.token;
}

/**
 * Every page in the admin list (`?pageSize=` alone silently truncates once the CMS outgrows it). All
 * pages are collected BEFORE any write: the list is ordered by last update, so a PUT mid-listing would
 * reshuffle the pages still to be fetched.
 */
async function listAllPages(): Promise<{ pages: PageListItem[]; totalCount: number | undefined }> {
  const pages: PageListItem[] = [];
  let totalCount: number | undefined;
  for (let pageNumber = 1; pageNumber <= 50; pageNumber++) {
    const res = await api<Paged<PageListItem>>(`/api/admin/pages?pageNumber=${pageNumber}&pageSize=${LIST_PAGE_SIZE}`);
    const items = res.items ?? [];
    pages.push(...items);
    totalCount ??= res.totalCount;
    if (items.length === 0 || pageNumber >= (res.totalPages ?? 1)) break;
  }
  return { pages, totalCount };
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

const USAGE =
  "Usage: CMS_API_URL=<https://…> CMS_ADMIN_PASSWORD=<…> npx tsx scripts/ctr-titles-2026-10.ts [--apply]\n" +
  "  (default is a read-only dry run; --dry-run is accepted as an explicit no-op)";

const codePoints = (s: string) => Array.from(s).length;

async function main(argv: string[]): Promise<void> {
  const unknown = argv.filter((a) => a !== "--apply" && a !== "--dry-run");
  if (unknown.length > 0) throw new Error(`Unknown argument(s): ${unknown.join(" ")}\n${USAGE}`);
  if (argv.includes("--apply") && argv.includes("--dry-run")) throw new Error(`--apply and --dry-run conflict.\n${USAGE}`);
  const apply = argv.includes("--apply");

  const url = process.env.CMS_API_URL?.trim().replace(/\/$/, "");
  if (!url) {
    throw new Error(
      "CMS_API_URL is required (no default: the local :5179 CMS can serve another client's database).\n" + USAGE,
    );
  }
  if (!/^https?:\/\//.test(url)) throw new Error(`CMS_API_URL must start with http:// or https:// (got "${url}").\n${USAGE}`);
  const password = process.env.CMS_ADMIN_PASSWORD;
  if (!password?.trim()) throw new Error(`CMS_ADMIN_PASSWORD is required (no default).\n${USAGE}`);
  const email = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
  cmsApiUrl = url;

  // Refuse to write an over-length title, whatever a future edit of the map does.
  for (const [slug, title] of Object.entries(CTR_TITLES_2026_10)) {
    const n = codePoints(title);
    if (n === 0 || n > TITLE_MAX || title !== title.trim()) {
      throw new Error(`${slug}: title must be 1–${TITLE_MAX} characters with no edge whitespace (got ${n}): "${title}"`);
    }
  }

  console.log(`CTR title pass 2026-10 → ${cmsApiUrl}`);
  console.log(apply ? "Mode: APPLY (writes seoTitle only)" : "Mode: DRY RUN (read-only; re-run with --apply to write)");
  await login(email, password);
  console.log("✓ logged in");

  const { pages: list, totalCount } = await listAllPages();
  if (totalCount !== undefined && list.length < totalCount) {
    console.warn(`  ! listed ${list.length} of ${totalCount} pages; a "not found" below may be a truncated listing`);
  }

  let changed = 0;
  let current = 0;
  let missing = 0;
  for (const [slug, desired] of Object.entries(CTR_TITLES_2026_10)) {
    const ref = list.find((p) => p.routeGroup === "Flat" && p.slug === slug);
    if (!ref) {
      console.warn(`  ! ${slug} (Flat) not found — skipped`);
      missing++;
      continue;
    }
    const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
    if (page.seoTitle === desired) {
      console.log(`  = ${slug}: already "${desired}" (skipped)`);
      current++;
      continue;
    }

    console.log(`${slug}: "${page.seoTitle}" → "${desired}"`);
    changed++;
    if (!apply) continue;

    const after = await api<AdminPage>(`/api/admin/pages/${page.id}`, {
      method: "PUT",
      body: JSON.stringify(buildTitleUpdateBody(page, desired)),
    });
    // Prove from the response that nothing besides seoTitle moved (children, status, data, hero…).
    const moved = changedBodyKeys(page, after);
    if (after.seoTitle !== desired || moved.length !== 1 || moved[0] !== "seoTitle") {
      throw new Error(
        `${slug}: the PUT did not change exactly seoTitle (changed: ${moved.join(", ") || "nothing"}; ` +
          `seoTitle is now "${after.seoTitle}"). Stopping; check the page in /admin before re-running.`,
      );
    }
    console.log(`  ✓ ${slug} updated (status stays ${page.status}; only seoTitle changed)`);
  }

  const summary = apply
    ? `${changed} updated, ${current} already current, ${missing} not found`
    : `${changed} would change, ${current} already current, ${missing} not found`;
  console.log(`\nDone (${apply ? "applied" : "dry run"}): ${summary}.`);
  if (apply && changed > 0) console.log("The CMS fires the revalidate webhook on update, so the new titles are live.");
  if (missing > 0) process.exitCode = 1;
}

// Run only when executed directly (`npx tsx scripts/ctr-titles-2026-10.ts`), never when a test imports the module.
// Errors set `exitCode` instead of calling `process.exit(1)`: exiting while fetch sockets are still closing
// crashes Node on Windows (libuv "UV_HANDLE_CLOSING" assertion, exit code 3221226505 instead of 1).
if (typeof require !== "undefined" && require.main === module) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
