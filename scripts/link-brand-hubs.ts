/**
 * Phase-B CMS cross-links for the brand pages: appends a RelatedServices link
 * to the three existing Flat pages that should feed the two new brand hubs.
 *
 *   /garage-doors-perth                    → /garage-door-brands-perth
 *   /garage-door-opener-repair-perth       → /garage-door-motor-brands-perth
 *   /garage-door-remote-replacement-perth  → /garage-door-motor-brands-perth
 *
 * Same shape as scripts/link-suburb-pages.ts / the cross-link step in
 * scripts/import-garage-doors-perth-page.ts: login → GET the admin page →
 * append-if-missing (matched by href) → PUT the round-tripped page back.
 * Idempotent: a link already present (by `staticHref`) is skipped.
 *
 * GOTCHA encoded here (same as every other importer): admin page slugs are
 * only unique PER ROUTE GROUP (`garage-door-repairs-perth` exists as both
 * Flat and Lp), so the slug → id lookup filters `routeGroup === "Flat"`.
 *
 * Destination guard (CLAUDE.md's HREF_FIXES rule — never link to a URL that
 * redirects or 404s): before touching the CMS, this script GETs each brand
 * hub href against SITE_URL and requires a plain 200. The controller's plan
 * is to run this only AFTER the brand pages deploy — until then the check is
 * expected to fail against production, which is why `--dry-run` exists: it
 * still runs the destination check and the CMS read/diff, it just skips the
 * PUT.
 *
 * NOTE on the CMS `relatedLinks` schema: `AdminPage.relatedLinks` only
 * carries `staticHref` / `labelOverride` (see `toUpdateBody` below, mirrored
 * from `import-garage-doors-perth-page.ts`) — there is no persisted
 * description/icon on a CMS-authored RelatedServices row today
 * (`lib/cms/map-service-page.ts` hardcodes `description: ""` /
 * `icon: "DoorOpen"` for every CMS-sourced link). The task brief's
 * description/icon strings are kept below for documentation/parity with the
 * local `ServiceRelatedLink` shape, but only `href` + `label` are sent to
 * the API — same as every other Phase-B link script.
 *
 * Local CMS (default, dry-run):
 *   npx tsx scripts/link-brand-hubs.ts --dry-run
 * Local CMS (write):
 *   npx tsx scripts/link-brand-hubs.ts
 * Production (explicit, run ONLY after the brand pages are deployed):
 *   CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/link-brand-hubs.ts
 */

export {}; // module scope — keeps top-level consts from colliding with sibling scripts under tsc

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";
const SITE_URL = (process.env.SITE_URL ?? "https://capitalgaragedoors.com.au").replace(/\/$/, "");
const DRY_RUN = process.argv.includes("--dry-run");

interface LinkAddition {
  href: string;
  label: string;
  /** Documentation only — see the NOTE above; not sent to the CMS. */
  description: string;
  icon: string;
}

/** slug (Flat route group) → RelatedServices links to append. */
const LINK_ADDITIONS: Record<string, LinkAddition[]> = {
  "garage-doors-perth": [
    {
      href: "/garage-door-brands-perth",
      label: "Garage door brands in Perth",
      description: "Every door brand we service, repair and install — find yours.",
      icon: "BadgeCheck",
    },
  ],
  "garage-door-opener-repair-perth": [
    {
      href: "/garage-door-motor-brands-perth",
      label: "Garage door motor brands",
      description: "Merlin, Chamberlain, B&D, Gliderol and every opener brand we repair.",
      icon: "Cpu",
    },
  ],
  "garage-door-remote-replacement-perth": [
    {
      href: "/garage-door-motor-brands-perth",
      label: "Garage door motor brands",
      description: "Merlin, Chamberlain, B&D, Gliderol and every opener brand we repair.",
      icon: "Cpu",
    },
  ],
};

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

/**
 * Require the destination to return a plain 200 on SITE_URL — a 3xx or 404
 * aborts the whole run (CLAUDE.md's HREF_FIXES rule: never link to a URL
 * that redirects or doesn't resolve). `redirect: "manual"` so a 3xx is seen
 * as a 3xx rather than silently followed to whatever it points at.
 */
async function checkDestination(href: string): Promise<void> {
  const url = `${SITE_URL}${href}`;
  let res: Response;
  try {
    res = await fetch(url, { method: "GET", redirect: "manual" });
  } catch (err) {
    throw new Error(
      `Destination check FAILED for ${url}: ${(err as Error).message}\n` +
        `The brand hub must be live at this URL before this script can add links to it.`,
    );
  }
  if (res.status !== 200) {
    throw new Error(
      `Destination check FAILED: ${url} returned ${res.status} (expected 200).\n` +
        `Per CLAUDE.md's HREF_FIXES rule, never link to a URL that redirects or 404s — ` +
        `the brand pages must be deployed (and this run must target the live SITE_URL) before ` +
        `this script mutates the CMS.`,
    );
  }
  console.log(`  ✓ ${url} → 200`);
}

/** Shape returned by GET /api/admin/pages/{id}, round-tripped by toUpdateBody. */
interface AdminPage {
  id: number;
  templateType: string;
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
  console.log(`Linking brand hubs into related-services on ${CMS_API_URL}${DRY_RUN ? " (--dry-run)" : ""}`);

  // ---- 0. Destination guard: every href we're about to link to must 200 on SITE_URL ----
  const destinations = [...new Set(Object.values(LINK_ADDITIONS).flatMap((links) => links.map((l) => l.href)))];
  console.log(`\nChecking ${destinations.length} destination(s) against ${SITE_URL}:`);
  for (const href of destinations) {
    await checkDestination(href);
  }

  // ---- 1. Login + resolve slugs (Flat route group only — slugs aren't globally unique) ----
  await login();
  console.log("\n✓ logged in");

  const pageList = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const idBySlug = new Map(
    pageList.items.filter((p) => p.routeGroup === "Flat").map((p) => [p.slug, p.id]),
  );

  // ---- 2. Append-if-missing on each target page ----
  let updated = 0;
  for (const [slug, additions] of Object.entries(LINK_ADDITIONS)) {
    const id = idBySlug.get(slug);
    if (!id) {
      console.warn(`  ! page not found for slug "${slug}" (routeGroup Flat) — skipped`);
      continue;
    }

    const page = await api<AdminPage>(`/api/admin/pages/${id}`);
    const existingHrefs = new Set(
      page.relatedLinks.filter((l) => l.linkGroup === "RelatedServices").map((l) => l.staticHref),
    );
    const toAdd = additions.filter((a) => !existingHrefs.has(a.href));

    if (toAdd.length === 0) {
      console.log(`  = [${id}] ${slug}: link(s) already present — skipped`);
      continue;
    }

    if (DRY_RUN) {
      console.log(
        `  → [${id}] ${slug}: would add ${toAdd.map((a) => `"${a.label}" → ${a.href}`).join(", ")}`,
      );
      continue;
    }

    let nextSort =
      Math.max(0, ...page.relatedLinks.filter((l) => l.linkGroup === "RelatedServices").map((l) => l.sortOrder)) +
      1;
    for (const a of toAdd) {
      page.relatedLinks.push({
        targetPageId: null,
        staticHref: a.href,
        labelOverride: a.label,
        linkGroup: "RelatedServices",
        sortOrder: nextSort++,
      });
    }

    await api(`/api/admin/pages/${id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ [${id}] ${slug}: added ${toAdd.map((a) => `"${a.label}" → ${a.href}`).join(", ")}`);
    updated++;
  }

  console.log(`\nDone. ${DRY_RUN ? `${updated} page(s) would be updated (dry run).` : `${updated} page(s) updated.`}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
