/**
 * Imports the 7 audit-gap problem pages into the CMS (create + publish), with
 * their pricing pins attached at create time (the bulk importer leaves pins
 * empty, which is how the cost tables ended up blank on live pages).
 *
 *   /problems/garage-door-stuck-halfway
 *   /problems/garage-door-remote-not-working
 *   /problems/garage-door-motor-not-responding
 *   /problems/garage-door-spring-or-cable-broken
 *   /problems/garage-door-off-track
 *   /problems/noisy-garage-door
 *   /problems/garage-door-wont-close
 *
 * (The existing /problems/garage-door-wont-open gets its pins via
 * scripts/sync-seo-fixes.ts, which updates existing pages.)
 *
 * Existing slugs are skipped (409), so re-running is safe.
 *
 * Local CMS (default):   npx tsx scripts/import-new-problem-pages.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/import-new-problem-pages.ts
 */

import type { Problem } from "../types";
import { problems } from "../content/problems";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** The slugs this script imports (everything in content/problems.ts except the pre-existing page). */
const NEW_SLUGS = new Set([
  "garage-door-stuck-halfway",
  "garage-door-remote-not-working",
  "garage-door-motor-not-responding",
  "garage-door-spring-or-cable-broken",
  "garage-door-off-track",
  "noisy-garage-door",
  "garage-door-wont-close",
]);

/** Pricing pins per slug — catalog scenario names, in display order. */
const PRICING_PINS: Record<string, string[]> = {
  "garage-door-stuck-halfway": [
    "Door off track / stuck",
    "Cable snapped or off the drum",
    "Hinges & rollers / wheels",
    "Spring re-fit / re-tension",
    "After-hours / emergency call-out",
  ],
  "garage-door-remote-not-working": [
    "Remote (extra / replacement)",
    "Safety sensors / photo eyes",
    "Motor / opener not working (repair)",
    "WiFi / smart control (supply & install)",
  ],
  "garage-door-motor-not-responding": [
    "Motor / opener not working (repair)",
    "Motor / opener replacement",
    "Remote (extra / replacement)",
    "After-hours / emergency call-out",
  ],
  "garage-door-spring-or-cable-broken": [
    "Broken spring (single)",
    "Broken springs (×2)",
    "Cable snapped or off the drum",
    "Spring re-fit / re-tension",
    "After-hours / emergency call-out",
  ],
  "garage-door-off-track": [
    "Door off track / stuck",
    "Hinges & rollers / wheels",
    "Cable snapped or off the drum",
    "Door damaged (panel / section)",
    "After-hours / emergency call-out",
  ],
  "noisy-garage-door": [
    "Service / tune-up",
    "Hinges & rollers / wheels",
    "Spring re-fit / re-tension",
    "Motor / opener not working (repair)",
  ],
  "garage-door-wont-close": [
    "Safety sensors / photo eyes",
    "Door off track / stuck",
    "Cable snapped or off the drum",
    "Service / tune-up",
    "After-hours / emergency call-out",
  ],
};

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

/** Same data transform as lib/cms/import/problems.ts (kept inline so the script has no "@/" imports). */
function toPayload(
  problem: Problem,
  heroImageAssetId: number | null,
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[],
) {
  return {
    templateType: "ProblemPage",
    routeGroup: "Problems",
    slug: problem.slug,
    title: problem.h1,
    seoTitle: problem.metaTitle,
    seoDescription: problem.metaDescription,
    noIndex: false,
    status: "Published",
    heroImageAssetId,
    data: {
      heroSubtitle: problem.heroSubtitle,
      directAnswer: problem.directAnswer,
      causes: problem.causes.map((c) => ({
        icon: c.icon,
        title: c.title,
        description: c.description,
      })),
      safeChecks: problem.safeChecks,
      doNotDo: problem.doNotDo,
      callTechnicianSigns: problem.callTechnicianSigns,
      emergency: problem.emergency,
    },
    faqs: problem.faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
    // The problem mapper recovers the service slug from the href's last path
    // segment, so "/<slug>" round-trips cleanly (see lib/cms/import/problems.ts).
    relatedLinks: problem.relatedServices.map((s, i) => ({
      targetPageId: null,
      staticHref: `/${s.slug}`,
      labelOverride: s.label,
      linkGroup: "RelatedServices",
      sortOrder: i,
    })),
    pricingRows,
    reviews: [],
    services: [],
  };
}

async function main() {
  console.log(`Importing new problem pages into ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const { body: pricingBody } = await api<
    { items?: { id: number; scenario: string }[] } | { id: number; scenario: string }[]
  >("/api/admin/pricing-items");
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const pricingByScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));

  for (const problem of problems) {
    if (!NEW_SLUGS.has(problem.slug)) continue;

    const pricingRows = (PRICING_PINS[problem.slug] ?? [])
      .map((scenario, i) => {
        const id = pricingByScenario.get(scenario);
        if (!id) {
          console.warn(`  ! pricing scenario not in catalog, pin skipped: "${scenario}"`);
          return null;
        }
        return { pricingItemId: id, sortOrder: i, noteOverride: null };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    const heroImageAssetId = problem.heroImage
      ? await findOrCreateAsset(problem.heroImage, problem.h1)
      : null;

    const { status } = await api<{ id: number }>(`/api/admin/pages`, {
      method: "POST",
      body: JSON.stringify(toPayload(problem, heroImageAssetId, pricingRows)),
    });

    if (status === 409) {
      console.log(`  = ${problem.slug} already exists (skipped)`);
    } else {
      console.log(`  ✓ ${problem.slug} created + published (pricing pins: ${pricingRows.length})`);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
