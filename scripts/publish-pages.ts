/**
 * Generic publisher for CMS pages — the reusable form of scripts/publish-dayton.ts /
 * publish-maddington.ts. Publishes one or more pages by route group + slug via
 * POST /api/admin/pages/{id}/publish (already-Published = no-op). Nothing else.
 *
 * PRODUCTION is the default; the admin password resolves from CMS_ADMIN_PASSWORD,
 * else SeedAdmin.Password in the CMS repo's gitignored appsettings.Production.json
 * (BOM-tolerant, never printed — this repo is public).
 *
 *   npx tsx scripts/publish-pages.ts --flat garage-door-repairs-padbury
 *   npx tsx scripts/publish-pages.ts --case-study garage-door-repairs-clarkson-emergency-jammed-door-perth
 *   (flags repeatable; --dry-run lists what would be published)
 *
 * After publishing a suburb page, re-run its importer for Phase B wiring; after
 * publishing job case studies, run scripts/import-job-pages-2026-08.ts --finalize.
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const APPSETTINGS =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

const ROUTE_GROUP_FLAGS: Record<string, string> = {
  "--flat": "Flat",
  "--case-study": "CaseStudies",
  "--blog": "Blog",
  "--problem": "Problems",
};

function resolvePassword(): string {
  if (process.env.CMS_ADMIN_PASSWORD) return process.env.CMS_ADMIN_PASSWORD;
  if (!IS_PROD) return "Admin#12345";
  const raw = readFileSync(APPSETTINGS, "utf8").replace(/^\uFEFF/, "");
  const pw = (JSON.parse(raw) as { SeedAdmin?: { Password?: string } }).SeedAdmin?.Password;
  if (!pw) throw new Error(`No SeedAdmin.Password in ${APPSETTINGS}`);
  return pw;
}

function parseTargets(): { routeGroup: string; slug: string }[] {
  const out: { routeGroup: string; slug: string }[] = [];
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const rg = ROUTE_GROUP_FLAGS[argv[i]];
    if (!rg) continue;
    const slug = argv[i + 1];
    if (!slug || slug.startsWith("--")) throw new Error(`${argv[i]} needs a slug`);
    out.push({ routeGroup: rg, slug });
    i++;
  }
  return out;
}

async function main() {
  const targets = parseTargets();
  const dryRun = process.argv.includes("--dry-run");
  if (!targets.length) {
    console.log("Usage: npx tsx scripts/publish-pages.ts [--flat <slug>] [--case-study <slug>] ... [--dry-run]");
    return;
  }
  console.log(`Publishing ${targets.length} page(s) → ${CMS_API_URL}${dryRun ? " (DRY RUN)" : ""}`);

  const loginRes = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: resolvePassword() }),
  });
  if (!loginRes.ok) throw new Error(`Login failed (${loginRes.status})`);
  const { token } = (await loginRes.json()) as { token: string };
  const auth = { Authorization: `Bearer ${token}` };

  const listRes = await fetch(`${CMS_API_URL}/api/admin/pages?pageSize=500`, { headers: auth });
  const list = (await listRes.json()) as { items: { id: number; slug: string; routeGroup: string; status: string }[] };

  let failed = 0;
  for (const t of targets) {
    const ref = list.items.find((p) => p.routeGroup === t.routeGroup && p.slug === t.slug);
    if (!ref) {
      console.error(`  ! ${t.routeGroup}/${t.slug} not found`);
      failed++;
      continue;
    }
    if (ref.status === "Published") {
      console.log(`  = ${t.routeGroup}/${t.slug} already Published`);
      continue;
    }
    if (dryRun) {
      console.log(`  would publish ${t.routeGroup}/${t.slug} (id ${ref.id})`);
      continue;
    }
    const pubRes = await fetch(`${CMS_API_URL}/api/admin/pages/${ref.id}/publish`, { method: "POST", headers: auth });
    if (!pubRes.ok) {
      console.error(`  ! ${t.routeGroup}/${t.slug} publish failed (${pubRes.status}): ${(await pubRes.text()).slice(0, 200)}`);
      failed++;
      continue;
    }
    const page = (await pubRes.json()) as { status: string; publishedAt?: string };
    console.log(`  ✓ ${t.routeGroup}/${t.slug} → ${page.status}${page.publishedAt ? ` at ${page.publishedAt}` : ""}`);
  }
  if (failed) process.exit(1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
