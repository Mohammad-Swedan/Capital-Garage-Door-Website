/**
 * Wires the "Common Problems We Fix" chips on service pages to their dedicated
 * /problems/* pages (2026-08-05 Semrush audit: 5 of the 8 problem pages had
 * only ONE internal link — the /problems index — while every service page
 * rendered their exact fault names as plain, unlinked chips).
 *
 * ServiceProblemCards already renders a chip as a link when `problem.slug` is
 * set (types/service-page.ts has carried the field since v1); the content just
 * never set it, and lib/cms/map-service-page.ts dropped it (fixed in the same
 * change). This script sets `data.problems[].slug` on every Flat page whose
 * chip label matches a live problem page — matched on a normalised label so
 * "Door won't open" and "Door Won't Open?" both hit. Idempotent: pages are
 * only PUT when a slug was actually added; existing slugs are never changed.
 *
 * Local CMS (default):   npx tsx scripts/link-problem-chips.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/link-problem-chips.ts
 */

export {}; // module scope — avoids top-level const collisions across scripts/*.ts

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** normalised chip label → live problem-page slug (all 8 problem pages). */
const LABEL_TO_SLUG: Record<string, string> = {
  // garage-door-wont-open
  "door wont open": "garage-door-wont-open",
  "garage door wont open": "garage-door-wont-open",
  // garage-door-wont-close
  "door wont close": "garage-door-wont-close",
  "door not closing properly": "garage-door-wont-close",
  "garage door wont close": "garage-door-wont-close",
  // garage-door-stuck-halfway
  "door stuck halfway": "garage-door-stuck-halfway",
  "garage door stuck halfway": "garage-door-stuck-halfway",
  // garage-door-off-track
  "door off track": "garage-door-off-track",
  "door off its tracks": "garage-door-off-track",
  "door has come off its tracks": "garage-door-off-track",
  // garage-door-remote-not-working
  "remote not working": "garage-door-remote-not-working",
  "garage remote not working": "garage-door-remote-not-working",
  "remote or keypad not working": "garage-door-remote-not-working",
  // garage-door-motor-not-responding
  "motor not responding": "garage-door-motor-not-responding",
  "motor not working": "garage-door-motor-not-responding",
  "industrial motor tripping or burnt out": "garage-door-motor-not-responding",
  // garage-door-spring-or-cable-broken
  "broken spring or cable": "garage-door-spring-or-cable-broken",
  "broken springs or cables": "garage-door-spring-or-cable-broken",
  "broken spring": "garage-door-spring-or-cable-broken",
  "snapped spring or cable": "garage-door-spring-or-cable-broken",
  "snapped cable": "garage-door-spring-or-cable-broken",
  // noisy-garage-door
  "noisy garage door": "noisy-garage-door",
  "noisy door": "noisy-garage-door",
  "noisy door under a bedroom or living area": "noisy-garage-door",
};

function normalise(label: string): string {
  return label
    .toLowerCase()
    .replace(/['’?!.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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
  data: Record<string, unknown> & { problems?: { label?: string; icon?: string; slug?: string }[] };
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
  console.log(`Problem-chip link wiring → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const flat = list.items.filter((p) => p.routeGroup === "Flat");

  let touched = 0;
  for (const ref of flat) {
    const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
    const problems = page.data.problems;
    if (!Array.isArray(problems) || problems.length === 0) continue;

    const added: string[] = [];
    for (const p of problems) {
      if (!p.label || p.slug) continue;
      const slug = LABEL_TO_SLUG[normalise(p.label)];
      if (slug) {
        p.slug = slug;
        added.push(`"${p.label}" → /problems/${slug}`);
      }
    }
    if (added.length === 0) continue;

    await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ ${page.slug}: ${added.length} chip(s) linked`);
    for (const a of added) console.log(`      - ${a}`);
    touched++;
  }

  console.log(touched === 0 ? "  = nothing to wire" : `\nDone — ${touched} page(s) updated.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
