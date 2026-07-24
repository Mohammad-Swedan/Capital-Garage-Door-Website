/**
 * Links the four July-2026 suburb pages into /service-areas by setting each suburb row's
 * `pageId`. Until this is set, the suburb renders as a plain text chip and the page gets
 * NO inbound internal link (see CLAUDE.md). A 2026-07-24 crawl found Cannington and Lathlain
 * with zero inbound links and Gosnells⇄Southern River a closed pair; GSC has them at
 * positions 13.8–68.5 while linked suburb pages sit at 4–6.
 *
 * `scripts/import-service-suburb-pages.ts` created the pages but never set `pageId`. This is
 * the missing step. Mapping (discovered from the production admin API on 2026-07-24):
 *
 *   suburb id / regionId / sortOrder   →   ServiceSuburbPage id (slug)
 *   Gosnells        225 / 3 / 13       →   1062 (garage-door-repairs-gosnells)
 *   Cannington      219 / 3 / 7        →   1063 (garage-door-repairs-cannington)
 *   Lathlain         51 / 2 / 30       →   1064 (garage-door-repairs-lathlain)
 *   Southern River  230 / 3 / 18       →   1065 (garage-door-repairs-southern-river)
 *
 * Idempotent: reads the current suburb row first and skips any already pointing at its page.
 * Re-verifies the page id by slug before writing, so it won't silently mislink if ids shift.
 *
 * Production: CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/link-suburb-pages.ts
 */

export {}; // module scope — keeps top-level consts from colliding with sibling scripts under tsc

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** suburb slug → the page slug it should link to. */
const LINKS: { suburbSlug: string; pageSlug: string }[] = [
  { suburbSlug: "gosnells", pageSlug: "garage-door-repairs-gosnells" },
  { suburbSlug: "cannington", pageSlug: "garage-door-repairs-cannington" },
  { suburbSlug: "lathlain", pageSlug: "garage-door-repairs-lathlain" },
  { suburbSlug: "southern-river", pageSlug: "garage-door-repairs-southern-river" },
];

interface Suburb {
  id: number;
  name: string;
  slug: string | null;
  pageId: number | null;
  sortOrder: number;
}
interface Region {
  id: number;
  name: string;
  suburbs: Suburb[];
}

let token = "";

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
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

async function main() {
  console.log(`Linking suburb pages into /service-areas on ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const regionsRaw = await api<Region[] | { items: Region[] }>("/api/admin/service-area-regions");
  const regions = Array.isArray(regionsRaw) ? regionsRaw : regionsRaw.items;

  const pagesRaw = await api<{ items: { id: number; slug: string }[] }>("/api/admin/pages?pageSize=200");
  const pageIdBySlug = new Map(pagesRaw.items.map((p) => [p.slug, p.id]));

  let linked = 0;
  for (const { suburbSlug, pageSlug } of LINKS) {
    let region: Region | undefined;
    let suburb: Suburb | undefined;
    for (const r of regions) {
      const s = r.suburbs.find((x) => x.slug === suburbSlug);
      if (s) {
        region = r;
        suburb = s;
        break;
      }
    }
    if (!region || !suburb) {
      console.warn(`  ! suburb "${suburbSlug}" not found — skipped`);
      continue;
    }
    const pageId = pageIdBySlug.get(pageSlug);
    if (!pageId) {
      console.warn(`  ! page "${pageSlug}" not found — skipped`);
      continue;
    }
    if (suburb.pageId === pageId) {
      console.log(`  = ${suburb.name} already linked to page ${pageId}`);
      continue;
    }

    await api(`/api/admin/suburbs/${suburb.id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: suburb.id,
        regionId: region.id,
        name: suburb.name,
        slug: suburb.slug,
        pageId,
        sortOrder: suburb.sortOrder,
      }),
    });
    console.log(`  ✓ ${suburb.name} → page ${pageId} (/${pageSlug})`);
    linked++;
  }

  console.log(`\nDone. ${linked} suburb(s) linked.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
