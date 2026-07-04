/**
 * Re-runnable CMS pricing importer.
 *
 * Replaces every row in the backend `PricingItems` table with the single source of truth in
 * `components/sections/smart-calculator/pricing-data.ts` (`buildSeedRows()`). This is what the AI
 * assistant (DeepSeek + RAG) quotes from — the `internalNote` on each row becomes the model-only
 * `InternalNote` (never shown to the public site).
 *
 * Run it (CMS must be running — default http://localhost:5179):
 *   npx tsx scripts/seed-pricing.ts
 *
 * Config via env (dev defaults match the CMS `SeedAdmin` account):
 *   CMS_API_URL          (default http://localhost:5179)
 *   CMS_ADMIN_EMAIL      (default admin@capitalgaragedoor.local)
 *   CMS_ADMIN_PASSWORD   (default Admin#12345)
 *
 * Idempotent: it deletes existing rows first, then inserts the new set. Rows that can't be deleted
 * because a CMS page pins them (PagePricingRow FK) are logged and skipped rather than failing the run.
 */

import {
  buildSeedRows,
  type CmsSeedRow,
} from "../components/sections/smart-calculator/pricing-data";

const CMS_API_URL = (
  process.env.CMS_API_URL ?? "https://cgd.runasp.net"
).replace(/\/$/, "");
const ADMIN_EMAIL =
  process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

interface AdminPricingItem {
  id: number;
  scenario: string;
}

async function login(): Promise<string> {
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
  if (!data.token)
    throw new Error("Login succeeded but no token was returned.");
  return data.token;
}

async function listExisting(token: string): Promise<AdminPricingItem[]> {
  const res = await fetch(`${CMS_API_URL}/api/admin/pricing-items`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Listing pricing items failed (${res.status}).`);
  const body = (await res.json()) as
    | AdminPricingItem[]
    | { items: AdminPricingItem[] };
  return Array.isArray(body) ? body : (body.items ?? []);
}

async function deleteItem(
  token: string,
  item: AdminPricingItem,
): Promise<boolean> {
  const res = await fetch(`${CMS_API_URL}/api/admin/pricing-items/${item.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) return true;
  // Likely blocked by a PagePricingRow FK (a CostGuide page pins this row) — skip, don't fail the run.
  const text = await res.text().catch(() => "");
  console.warn(
    `  ! skipped delete of #${item.id} "${item.scenario}" (${res.status}) ${text.slice(0, 120)}`,
  );
  return false;
}

async function createItem(token: string, row: CmsSeedRow): Promise<void> {
  const res = await fetch(`${CMS_API_URL}/api/admin/pricing-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      scenario: row.scenario,
      priceMin: row.priceMin,
      priceMax: row.priceMax,
      priceLabel: row.priceLabel,
      note: row.note,
      category: row.category,
      includes: row.includes,
      internalNote: row.internalNote,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Create "${row.scenario}" failed (${res.status}): ${text.slice(0, 200)}`,
    );
  }
}

async function main() {
  const rows = buildSeedRows();
  console.log(`CMS: ${CMS_API_URL}`);
  console.log(`Prepared ${rows.length} pricing rows from pricing-data.ts.\n`);

  const token = await login();
  console.log("Logged in as", ADMIN_EMAIL);

  const existing = await listExisting(token);
  console.log(`\nDeleting ${existing.length} existing row(s)…`);
  let deleted = 0;
  for (const item of existing) {
    if (await deleteItem(token, item)) deleted++;
  }
  console.log(`Deleted ${deleted}/${existing.length}.`);

  console.log(`\nInserting ${rows.length} new row(s)…`);
  for (const row of rows) {
    await createItem(token, row);
    const price =
      row.priceMin != null && row.priceMax != null
        ? `$${row.priceMin}–$${row.priceMax}`
        : (row.priceLabel ??
          (row.priceMin != null ? `from $${row.priceMin}` : "POA"));
    console.log(`  + ${row.scenario} (${price}) [${row.category}]`);
  }

  console.log(
    `\n✓ Done. ${rows.length} pricing rows are live. The assistant will use them on the next chat turn.`,
  );
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
