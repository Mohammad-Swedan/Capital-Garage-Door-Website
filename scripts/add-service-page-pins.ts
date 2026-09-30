/**
 * Pins catalog price rows and real reviews on the money service pages that render an empty price
 * table / review section (2026-10, SEO growth program).
 *
 *   - Six pages have NO pricing pins, so their cost table was empty: spring repair, emergency,
 *     maintenance, opener repair, roller-door repairs, commercial hub.
 *   - Eight pages have NO pinned reviews: those six plus installation and repairs.
 *
 * Same shape as scripts/add-suburb-price-pins.ts: login -> GET each admin page -> a full-children
 * PUT that carries every existing child (data, FAQs, related links, services, existing pins)
 * plus the new pins. What gets pinned, and how reviews are chosen, lives in lib/cms/service-pins.ts
 * (pure + unit-tested: lib/brands/__tests__/service-pins.test.ts).
 *
 *   - Price rows: exact catalog `scenario` strings (note the multiplication sign in "×2"). Only a
 *     page whose pricingRows is EMPTY gets them. A scenario missing from the catalog is warned
 *     about and skipped; if NOTHING matches the catalog at all, the run aborts before writing.
 *   - Reviews: 2-3 real reviews from /api/admin/reviews per page, only while the page has none
 *     pinned. Relevance first (keyword hits in the review text + job tag, then 5 stars, then
 *     newest), rating >= 4 only, never the same review twice on a page; a page with fewer than
 *     two keyword matches is topped up with the newest 5-star reviews.
 *
 * Safe by default:
 *   - CMS_API_URL is REQUIRED (no localhost default: the local :5179 CMS can serve another
 *     client's database). CMS_ADMIN_PASSWORD is required too; CMS_ADMIN_EMAIL has a default.
 *   - It is a DRY RUN unless --apply is passed: it reads, plans and prints, and writes nothing.
 *   - Idempotent: a page that already has price rows / pinned reviews is reported and skipped, so
 *     re-running after a partial failure only does the remaining work.
 *   - Each write is re-read and compared with the page as it was (faqs, related links, services,
 *     data, status, SEO fields, pins); any difference is reported and the run exits non-zero.
 *
 * GOTCHA encoded here (same as every other page script): admin page slugs are only unique PER
 * ROUTE GROUP (`garage-door-repairs-perth` exists as both Flat and Lp), so the slug -> id lookup
 * filters `routeGroup === "Flat"`.
 *
 * The CMS's own post-commit webhook revalidates a page when it is updated, so no manual
 * revalidate step is needed.
 *
 *   Dry run:     CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/add-service-page-pins.ts
 *   Apply:       CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/add-service-page-pins.ts --apply
 *   Some pages:  … npx tsx scripts/add-service-page-pins.ts --apply --only garage-door-spring-repair-perth,roller-door-repairs-perth
 *   (PowerShell: set $env:CMS_API_URL and $env:CMS_ADMIN_PASSWORD first, then run the npx line.)
 */

// Module scope (the imports below make this a module too): keeps this script's top-level consts
// from colliding with sibling scripts under the build's global type check.
export {};

import {
  PRICE_PINS_BY_SLUG,
  SERVICE_PIN_SLUGS,
  buildUpdateBody,
  diffPageState,
  planPagePins,
  type AdminPage,
  type PagePinPlan,
  type PinReview,
} from "../lib/cms/service-pins";

const USAGE = "Usage: npx tsx scripts/add-service-page-pins.ts [--apply] [--only <slug,slug>]";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

/* ------------------------------ configuration ------------------------------ */

function cmsUrl(): string {
  const raw = process.env.CMS_API_URL?.trim();
  if (!raw) {
    fail(
      "CMS_API_URL is required (there is deliberately no default — the local :5179 CMS serves another " +
        "client's database).\nFor production: CMS_API_URL=https://cgd.runasp.net",
    );
  }
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    fail(`CMS_API_URL is not a valid URL: ${raw}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") fail(`CMS_API_URL must be http(s): ${raw}`);
  return raw.replace(/\/+$/, "");
}

const CMS_API_URL = cmsUrl();
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "";
if (!ADMIN_PASSWORD) fail("CMS_ADMIN_PASSWORD is required (no default).");

function parseArgs(argv: string[]): { apply: boolean; only: string[] | null } {
  let apply = false;
  let dryRun = false;
  let only: string[] | null = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--apply") apply = true;
    else if (arg === "--dry-run") dryRun = true;
    else if (arg === "--only" || arg.startsWith("--only=")) {
      const value = arg === "--only" ? argv[++i] : arg.slice("--only=".length);
      if (!value || value.startsWith("--")) fail(`--only needs a comma-separated list of page slugs.\n${USAGE}`);
      only = value.split(",").map((s) => s.trim()).filter(Boolean);
      if (only.length === 0) fail(`--only needs at least one page slug.\n${USAGE}`);
    } else {
      fail(`Unknown argument "${arg}".\n${USAGE}`);
    }
  }
  if (apply && dryRun) fail("Pass either --apply or --dry-run, not both.");
  const known: readonly string[] = SERVICE_PIN_SLUGS;
  const unknown = (only ?? []).filter((slug) => !known.includes(slug));
  if (unknown.length > 0) {
    fail(`--only: not a page this script pins: ${unknown.join(", ")}\nKnown pages:\n  ${SERVICE_PIN_SLUGS.join("\n  ")}`);
  }
  return { apply, only };
}

/* ------------------------------ CMS client ------------------------------ */

interface PricingItem {
  id: number;
  scenario: string;
}

interface PageListItem {
  id: number;
  slug: string;
  routeGroup: string;
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

/** A list endpoint that may answer with a bare array or a `{ items, totalPages }` page — all pages. */
async function fetchAll<T>(path: string): Promise<T[]> {
  const out: T[] = [];
  for (let pageNumber = 1; pageNumber <= 50; pageNumber++) {
    const url = pageNumber === 1 ? path : `${path}${path.includes("?") ? "&" : "?"}pageNumber=${pageNumber}`;
    const body = await api<T[] | { items?: T[]; totalPages?: number }>(url);
    if (Array.isArray(body)) return body;
    const items = body.items ?? [];
    out.push(...items);
    if (items.length === 0 || pageNumber >= (body.totalPages ?? 1)) break;
  }
  return out;
}

/* ------------------------------ output ------------------------------ */

const snippet = (text: string | null | undefined, max = 90) => {
  const flat = (text ?? "").replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
};

function logPlan(tag: string, plan: PagePinPlan): void {
  const ids = plan.reviews.map((r) => r.reviewId);
  console.log(
    `${tag} ${plan.slug}: +${plan.priceRows.length} price rows, +${ids.length} reviews (ids ${ids.join(", ") || "none"})`,
  );
  if (plan.priceRows.length > 0) console.log(`      price rows: ${plan.priceRows.map((r) => r.scenario).join(" | ")}`);
  else if (plan.priceSkipReason) console.log(`      price rows: skipped, ${plan.priceSkipReason}`);
  for (const scenario of plan.missingScenarios) console.warn(`      ! not in catalog, pin skipped: "${scenario}"`);
  for (const r of plan.reviews) {
    const why = r.source === "keyword" ? `${r.hits} hit${r.hits === 1 ? "" : "s"}` : "fallback";
    const who = `${r.review.customerName ?? "?"}, ${r.review.rating}*, ${r.review.reviewDate ?? "no date"}`;
    console.log(`      review #${r.reviewId} (${why}; ${who}): ${snippet(r.review.text)}`);
  }
  if (plan.reviews.length === 0 && plan.reviewSkipReason) console.log(`      reviews: skipped, ${plan.reviewSkipReason}`);
}

/* ------------------------------ main ------------------------------ */

interface Entry {
  slug: string;
  page?: AdminPage;
  plan?: PagePinPlan;
  problem?: string;
}

async function main() {
  const { apply, only } = parseArgs(process.argv.slice(2));
  const targets = SERVICE_PIN_SLUGS.filter((slug) => !only || only.includes(slug));

  console.log(`Service-page pin rollout → ${CMS_API_URL}  [${apply ? "APPLY: will write" : "DRY RUN: nothing is written"}]`);
  if (/^(localhost|127\.0\.0\.1|\[::1\]):5179$/.test(new URL(CMS_API_URL).host)) {
    console.warn("  ! localhost:5179 can serve another client's database — be sure this is the CMS you mean.");
  }
  await login();
  console.log("✓ logged in");

  const catalog = await fetchAll<PricingItem>("/api/admin/pricing-items?pageSize=200");
  const reviewPool = await fetchAll<PinReview>("/api/admin/reviews?pageSize=200");
  const pageList = await fetchAll<PageListItem>("/api/admin/pages?pageSize=200");
  console.log(`  catalog: ${catalog.length} pricing items, review pool: ${reviewPool.length}, CMS pages: ${pageList.length}`);

  // ---- 1. Read every target page and plan it (no writes) ----
  const flatIds = new Map(pageList.filter((p) => p.routeGroup.toLowerCase() === "flat").map((p) => [p.slug, p.id]));
  const entries: Entry[] = [];
  for (const slug of targets) {
    const entry: Entry = { slug };
    entries.push(entry);
    const id = flatIds.get(slug);
    if (id === undefined) {
      entry.problem = "page not found in the Flat route group";
      continue;
    }
    try {
      const page = await api<AdminPage>(`/api/admin/pages/${id}`);
      if (page.templateType !== "ServicePage") {
        entry.problem = `unexpected template "${page.templateType}" (expected ServicePage)`;
        continue;
      }
      entry.page = page;
      entry.plan = planPagePins(page, catalog, reviewPool);
    } catch (e) {
      entry.problem = e instanceof Error ? e.message : String(e);
    }
  }

  // Guard: pages that still need a price table but not one scenario resolves means this is the
  // wrong CMS (or the wrong catalog) — stop before writing anything.
  const wantsPrices = entries.filter((e) => e.page && PRICE_PINS_BY_SLUG[e.slug] && e.page.pricingRows.length === 0);
  const plannedRows = entries.reduce((sum, e) => sum + (e.plan?.priceRows.length ?? 0), 0);
  if (wantsPrices.length > 0 && plannedRows === 0) {
    throw new Error("No pin scenarios matched the catalog — aborting (nothing was written).");
  }

  // ---- 2. Report (dry run) or write (--apply) ----
  const counts = { updated: 0, skipped: 0, failed: 0, warnings: 0, priceRows: 0, reviews: 0, priceRowPages: 0, reviewPages: 0 };
  const tally = (plan: PagePinPlan) => {
    counts.updated++;
    counts.priceRows += plan.priceRows.length;
    counts.reviews += plan.reviews.length;
    if (plan.priceRows.length > 0) counts.priceRowPages++;
    if (plan.reviews.length > 0) counts.reviewPages++;
  };
  for (const entry of entries) {
    const { slug, page, plan } = entry;
    if (!page || !plan) {
      counts.failed++;
      console.error(`[FAILED] ${slug}: ${entry.problem}`);
      continue;
    }
    counts.warnings += plan.missingScenarios.length;
    if (plan.priceRows.length + plan.reviews.length === 0) {
      counts.skipped++;
      logPlan("[skip]  ", plan);
      continue;
    }
    if (!apply) {
      logPlan("[dry run]", plan);
      tally(plan);
      continue;
    }
    try {
      await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(buildUpdateBody(page, plan)) });
      logPlan("[applied]", plan);
      tally(plan);
      const problems = diffPageState(page, await api<AdminPage>(`/api/admin/pages/${page.id}`), plan);
      if (problems.length === 0) console.log("      ✓ re-read after the write: page and children intact");
      else {
        counts.failed++;
        for (const p of problems) console.error(`      ✗ post-write check: ${p}`);
      }
    } catch (e) {
      counts.failed++;
      console.error(`[FAILED] ${slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // ---- 3. Summary ----
  const verb = apply ? "added" : "to add";
  const pages = (n: number) => `${n} page${n === 1 ? "" : "s"}`;
  console.log(
    `\nSummary${apply ? "" : " (DRY RUN — nothing was written)"}: ${pages(targets.length)} targeted, ` +
      `${counts.updated} ${apply ? "updated" : "to update"}, ${counts.skipped} skipped (nothing to add), ${counts.failed} failed.`,
  );
  console.log(`  price rows ${verb}: ${counts.priceRows} across ${pages(counts.priceRowPages)}`);
  console.log(`  reviews ${verb}: ${counts.reviews} across ${pages(counts.reviewPages)}`);
  if (counts.warnings > 0) console.log(`  warnings: ${counts.warnings} catalog scenario(s) missing, pin(s) skipped`);
  if (!apply && counts.updated > 0) console.log("Re-run with --apply to write these changes.");
  if (counts.failed > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  // exitCode, not process.exit(): on Windows a hard exit while fetch sockets are still closing
  // crashes Node (libuv assertion, exit 127) and hides the real error's exit status.
  process.exitCode = 1;
});
