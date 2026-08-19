/**
 * One-shot publisher for /garage-door-repairs-maddington (user-run wrapper —
 * the auto-mode classifier blocks the assistant issuing the publish call
 * directly, same as the Cockburn Central launch).
 *
 * Targets PRODUCTION by default (this page only exists as a prod draft).
 * The admin password is read from CMS_ADMIN_PASSWORD, else from the CMS
 * repo's gitignored appsettings.Production.json on disk (BOM-tolerant) —
 * never hardcoded here, this repo is public.
 *
 * Run:  npx tsx scripts/publish-maddington.ts
 */

import { readFileSync } from "node:fs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const APPSETTINGS =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";
const TARGET_SLUG = "garage-door-repairs-maddington";

function resolvePassword(): string {
  if (process.env.CMS_ADMIN_PASSWORD) return process.env.CMS_ADMIN_PASSWORD;
  const raw = readFileSync(APPSETTINGS, "utf8").replace(/^\uFEFF/, "");
  const parsed = JSON.parse(raw) as { SeedAdmin?: { Password?: string } };
  const pw = parsed.SeedAdmin?.Password;
  if (!pw) throw new Error(`No SeedAdmin.Password in ${APPSETTINGS}`);
  return pw;
}

async function main() {
  console.log(`Publishing ${TARGET_SLUG} → ${CMS_API_URL}`);
  const loginRes = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: resolvePassword() }),
  });
  if (!loginRes.ok) throw new Error(`Login failed (${loginRes.status})`);
  const { token } = (await loginRes.json()) as { token: string };
  const auth = { Authorization: `Bearer ${token}` };

  const listRes = await fetch(`${CMS_API_URL}/api/admin/pages?pageSize=200`, { headers: auth });
  const list = (await listRes.json()) as { items: { id: number; slug: string; routeGroup: string; status: string }[] };
  const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === TARGET_SLUG);
  if (!ref) throw new Error(`${TARGET_SLUG} (Flat) not found`);
  if (ref.status === "Published") {
    console.log("  = already Published — nothing to do");
    return;
  }

  const pubRes = await fetch(`${CMS_API_URL}/api/admin/pages/${ref.id}/publish`, { method: "POST", headers: auth });
  if (!pubRes.ok) throw new Error(`Publish failed (${pubRes.status}): ${(await pubRes.text()).slice(0, 300)}`);
  const page = (await pubRes.json()) as { status: string; publishedAt?: string };
  console.log(`  ✓ published (status ${page.status}, at ${page.publishedAt})`);
  console.log("\nNext: run scripts/finalize-suburb-pages-batch2.ts against prod for link wiring.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
