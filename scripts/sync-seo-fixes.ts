/**
 * Re-runnable CMS SEO-fix sync — implements the content-side items of the
 * July 2026 site audit (see the frontend commits from the same change for the
 * code-side items):
 *
 *  1. Rewrites over-length seo titles (>60 chars) + fixes short/long
 *     descriptions on the flagged pages.
 *  2. Repoints every broken related-link (10 internal 404s: never-built
 *     service/cost pages and phantom blog slugs) at the closest live page.
 *  3. Adds de-orphaning links: comparison page from installation + the two
 *     door-comparison articles; case studies from their matching suburb pages.
 *  4. Pins real pricing-catalog rows to the two cost tables that rendered
 *     empty (/garage-door-repair-cost-perth + /garage-door-repairs-perth) —
 *     the v1 importer deliberately left relational pins empty, which is why
 *     the live tables had headers and zero rows.
 *  5. Enriches the pinned PricingItems with includes/costFactors/nextStep so
 *     the cost-table columns aren't blank.
 *  6. Repoints the two broken hero images (og:image 404s) at their CDN assets.
 *  7. Updates the cost guide's directAnswer/intro to actually state the ranges.
 *
 * Run against the LOCAL CMS (default):
 *   npx tsx scripts/sync-seo-fixes.ts
 * Run against PRODUCTION (deliberate, explicit):
 *   CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=<real> npx tsx scripts/sync-seo-fixes.ts
 *
 * Idempotent: every mutation is expressed as "desired state"; pages are only
 * PUT when something actually changed. Published pages stay published — the
 * CMS fires the revalidate webhook on update, so changes go live immediately.
 */

export {}; // force module scope — an import/export-less file is a global script to TS, which on
// this Windows checkout collides with itself under a clean `tsc --noEmit` (no tsbuildinfo cache).

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/* ------------------------------------------------------------------ *
 * Desired state
 * ------------------------------------------------------------------ */

/** slug → new seo title / description (only fields present are changed). */
const SEO_FIXES: Record<string, { title?: string; description?: string }> = {
  "garage-door-opener-repair-perth": {
    title: "Garage Door Opener Repair Perth | Capital Garage Doors",
    description:
      "Garage door opener repair and installation across Perth. Motor faults, remotes and sensors, plus smart Wi-Fi upgrades. Fast local service — get a free quote.",
  },
  "garage-door-installation-perth": {
    title: "Garage Door Installation Perth | Capital Garage Doors",
  },
  "garage-door-spring-repair-perth": {
    title: "Garage Door Spring Repair Perth | Capital Garage Doors",
  },
  "garage-door-maintenance-perth": {
    title: "Garage Door Servicing Perth | Capital Garage Doors",
    description:
      "Garage door servicing and maintenance across Perth. Preventive tune-ups from $140 that catch problems early and keep your door quiet, safe and reliable.",
  },
  "emergency-garage-door-repairs-perth": {
    title: "Emergency Garage Door Repairs Perth | 24/7 Response",
  },
  "roller-door-vs-sectional-door": {
    title: "Roller Door vs Sectional Door: Which Is Better? | Perth",
    description:
      "Compare roller doors and sectional doors on cost, space, insulation and maintenance to find the best fit for your Perth garage. Local expert advice.",
  },
  "garage-door-repairs-perth": {
    title: "Garage Door Repairs Perth | Same-Day | Capital Garage Doors",
  },
  "residential-garage-doors-perth-buying-guide": {
    title: "Residential Garage Doors Perth: 2026 Buying Guide",
  },
  "how-often-should-you-service-a-garage-door": {
    title: "How Often Should You Service a Garage Door? (Perth Guide)",
  },
  "garage-door-repairs-baldivis": {
    title: "Garage Door Repairs Baldivis | Same-Day Local Service",
  },
  "garage-door-motor-replacement-joondalup": {
    title: "Garage Door Motor Replacement in Joondalup | Case Study",
  },
  "garage-door-repairs-success": {
    title: "Garage Door Repairs Success & Cockburn | Same-Day Service",
  },
  "garage-door-motor-replacement-cost-perth": {
    title: "Garage Door Motor Replacement Cost Perth (2026 Guide)",
  },
  "garage-door-cable-repair-signs-and-cost": {
    title: "Garage Door Cable Repair Perth: Signs & Costs",
  },
  "garage-door-repairs-midland": {
    title: "Garage Door Repairs Midland | Same-Day & Commercial",
  },
  "garage-door-wont-open": {
    title: "Garage Door Won't Open? Causes, Fixes & Repairs Perth",
    description:
      "Garage door won't open? Common causes — broken springs, motor faults, snapped cables — what's safe to check yourself, and when to call. Same-day Perth repairs.",
  },
  "roller-door-repair-canning-vale": {
    description:
      "See how Capital Garage Doors diagnosed and repaired a jamming commercial roller door in Canning Vale — track straightening, roller replacement and testing.",
  },
  "garage-door-repair-cost-perth": {
    description:
      "Garage door repair costs in Perth: springs $240–$1,000, cables $280–$550, motors $380–$990, off-track doors $440–$770. Real ranges, quoted upfront.",
  },
};

/**
 * Broken → live href map (applies to relatedLinks.staticHref on every page).
 * Each broken target is repointed at the closest existing page; labels are
 * updated alongside so the anchor text matches the real destination.
 */
const HREF_FIXES: Record<string, { href: string; label?: string }> = {
  "/garage-door-motor-replacement-perth": {
    href: "/garage-door-opener-repair-perth",
    label: "Garage Door Opener & Motor Repair Perth",
  },
  "/garage-door-servicing-perth": {
    href: "/garage-door-maintenance-perth",
    label: "Garage Door Servicing & Maintenance Perth",
  },
  // NOTE: /roller-door-installation-perth and /sectional-garage-doors-perth
  // used to be repointed here while they 404'd — both are REAL pages now
  // (built + imported via scripts/import-new-service-pages.ts), so they must
  // never be rewritten again. The interim repoints on the comparison page are
  // reversed by the page-specific rules below.
  "/emergency-garage-door-repair-cost-perth": {
    href: "/emergency-garage-door-repairs-perth",
    label: "Emergency Garage Door Repairs Perth",
  },
  "/garage-door-motor-replacement-cost-perth": {
    href: "/blog/garage-door-motor-replacement-cost-perth",
    label: "Garage Door Motor Replacement Cost Perth",
  },
  "/blog/garage-door-safety-checklist": {
    href: "/blog/garage-door-maintenance-tips-checklist",
    label: "Garage Door Maintenance & Safety Checklist",
  },
  "/blog/best-garage-door-motors-australia": {
    href: "/blog/garage-door-motor-replacement-cost-perth",
    label: "Garage Door Motor Replacement Cost Perth",
  },
  // The comparison lives at the flat URL, not under /blog.
  "/blog/roller-door-vs-sectional-door": {
    href: "/roller-door-vs-sectional-door",
  },
};

/** De-orphaning link additions: slug → links to append when missing. */
const LINK_ADDITIONS: Record<
  string,
  { href: string; label: string; linkGroup: "RelatedServices" | "RelatedPages" | "RelatedArticles" }[]
> = {
  // Comparison page had ZERO inlinks (orphan). Link it from the installation
  // service page and both door-comparison articles.
  "garage-door-installation-perth": [
    {
      href: "/roller-door-vs-sectional-door",
      label: "Roller Door vs Sectional Door: Which Is Better?",
      linkGroup: "RelatedServices",
    },
  ],
  // NOTE: linkGroup must be RelatedServices, not RelatedArticles — the article
  // mapper slugs RelatedArticles hrefs and re-prefixes them with /blog/, so a
  // non-blog URL in that group renders as a phantom /blog/... link.
  "sectional-vs-roller-vs-tilt-garage-doors": [
    {
      href: "/roller-door-vs-sectional-door",
      label: "Roller Door vs Sectional Door: Which Is Better?",
      linkGroup: "RelatedServices",
    },
  ],
  "residential-garage-doors-perth-buying-guide": [
    {
      href: "/roller-door-vs-sectional-door",
      label: "Roller Door vs Sectional Door: Which Is Better?",
      linkGroup: "RelatedServices",
    },
  ],
  // Case studies had a single inlink each — link each from its own suburb page
  // (local proof exactly where a "near me" searcher lands).
  "garage-door-repairs-joondalup": [
    {
      href: "/case-studies/garage-door-motor-replacement-joondalup",
      label: "Case Study: Garage Door Motor Replacement in Joondalup",
      linkGroup: "RelatedPages",
    },
  ],
  "garage-door-repairs-canning-vale": [
    {
      href: "/case-studies/roller-door-repair-canning-vale",
      label: "Case Study: Roller Door Repair in Canning Vale",
      linkGroup: "RelatedPages",
    },
  ],
  "garage-door-repairs-fremantle": [
    {
      href: "/case-studies/sectional-door-installation-fremantle",
      label: "Case Study: Sectional Door Installation in Fremantle",
      linkGroup: "RelatedPages",
    },
  ],
};

/**
 * Pricing-catalog enrichment: scenario → the includes/costFactors/nextStep
 * columns the cost tables render. Only set when the catalog field is empty.
 */
const PRICING_ENRICHMENT: Record<
  string,
  { includes?: string; costFactors?: string; nextStep?: string }
> = {
  "Broken spring (single)": {
    costFactors: "Spring type and size, single vs double door",
    nextStep: "Call for same-day replacement",
  },
  "Broken springs (×2)": {
    costFactors: "Pairs are replaced together for even balance",
    nextStep: "Call for same-day replacement",
  },
  "Spring re-fit / re-tension": {
    includes: "Re-tensioning or re-fitting springs that have slipped or lost balance",
    costFactors: "Spring condition, door weight and balance",
    nextStep: "Book a quick adjustment",
  },
  "Cable snapped or off the drum": {
    includes: "Replacing snapped or frayed cables and re-seating them on the drum",
    costFactors: "One or both cables, drum condition",
    nextStep: "Describe the issue for a fast quote",
  },
  "Motor / opener not working (repair)": {
    includes: "Diagnosing and repairing the opener motor, board or drive",
    costFactors: "Opener brand, age and fault type",
    nextStep: "Book an inspection",
  },
  "Motor / opener replacement": {
    costFactors: "Motor model, door weight, rail type",
    nextStep: "Get a supplied-and-installed quote",
  },
  "Door off track / stuck": {
    includes: "Re-seating the door, straightening tracks, checking rollers",
    costFactors: "Damage extent, door size",
    nextStep: "Call now if the door is unsafe",
  },
  "Door damaged (panel / section)": {
    includes: "Replacing a damaged panel or section to match the door",
    costFactors: "Panel availability, door brand and colour",
    nextStep: "Send a photo for a quote",
  },
  "Hinges & rollers / wheels": {
    includes: "Replacing worn hinges, rollers and wheels",
    costFactors: "Number of parts, door type",
    nextStep: "Bundle with a service visit",
  },
  "Safety sensors / photo eyes": {
    includes: "Aligning or replacing safety sensors / photo eyes",
    costFactors: "Sensor model, wiring condition",
    nextStep: "Quick fix — book same-day",
  },
  "Remote (extra / replacement)": {
    includes: "Supplying and programming extra or replacement remotes",
    costFactors: "Remotes needed, opener compatibility",
    nextStep: "Tell us your opener brand",
  },
  "Service / tune-up": {
    includes: "Full tune-up: lubricate, re-tension, balance and safety check",
    costFactors: "Door condition, any parts needed",
    nextStep: "Book an annual service",
  },
  "After-hours / emergency call-out": {
    includes: "Priority after-hours response on top of the repair price",
    costFactors: "Time of day, urgency",
    nextStep: "Call now — 24/7",
  },
};

/** Cost-guide page: ordered pins (by catalog scenario name). */
const COST_GUIDE_PINS: string[] = [
  "Broken spring (single)",
  "Broken springs (×2)",
  "Spring re-fit / re-tension",
  "Cable snapped or off the drum",
  "Motor / opener not working (repair)",
  "Motor / opener replacement",
  "Door off track / stuck",
  "Door damaged (panel / section)",
  "Hinges & rollers / wheels",
  "Safety sensors / photo eyes",
  "Remote (extra / replacement)",
  "Service / tune-up",
  "After-hours / emergency call-out",
];

/** Service page "Cost Guidance" table: a tighter, repair-focused set. */
const SERVICE_PAGE_PINS: string[] = [
  "Broken spring (single)",
  "Broken springs (×2)",
  "Cable snapped or off the drum",
  "Motor / opener not working (repair)",
  "Door off track / stuck",
  "Door damaged (panel / section)",
  "Service / tune-up",
  "After-hours / emergency call-out",
];

/** /problems/garage-door-wont-open cost table (the pre-existing problem page; new ones get pins at import). */
const WONT_OPEN_PINS: string[] = [
  "Remote (extra / replacement)",
  "Motor / opener not working (repair)",
  "Broken spring (single)",
  "Cable snapped or off the drum",
  "After-hours / emergency call-out",
];

/** New direct answer for the cost guide — states the actual ranges (the audit's #1 content gap). */
const COST_GUIDE_DIRECT_ANSWER =
  "Most garage door repairs in Perth cost between $150 and $1,100. As a guide from our price list: broken springs run $240–$1,000 depending on the door and number of springs, a snapped cable is $280–$550, motor/opener repairs are $380–$490 (a full replacement is $770–$990 supplied and installed), an off-track door is $440–$770 and panel damage is $550–$1,100. After-hours emergency call-outs add a flat $500. Every job is quoted upfront before any work starts — no call-out fee to quote.";

const COST_GUIDE_TABLE_INTRO =
  "These are the typical Perth price ranges from our own price list for the most common jobs. Your exact quote depends on the door and parts involved — we confirm it clearly before any work begins.";

/** Broken hero images (also the live og:image + image-sitemap 404s) → CDN assets. */
const HERO_FIXES: Record<string, { cdnUrl: string; altText: string }> = {
  "how-often-should-you-service-a-garage-door": {
    cdnUrl: "https://jadara-hub.b-cdn.net/capital-garage-door/4d804e09b10b497da43d4d92e26eea1b.png",
    altText: "Technician servicing a residential garage door opener and tracks in Perth",
  },
  "garage-door-wont-open": {
    cdnUrl: "https://jadara-hub.b-cdn.net/capital-garage-door/422b9b76bdc5448b9ebb2c058509746c.png",
    altText: "Technician diagnosing a garage door that won't open in Perth",
  },
};

/* ------------------------------------------------------------------ *
 * API plumbing
 * ------------------------------------------------------------------ */

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

interface PricingItem {
  id: number;
  scenario: string;
  priceMin: number | null;
  priceMax: number | null;
  priceLabel: string | null;
  note: string | null;
  internalNote: string | null;
  category: string | null;
  includes: string | null;
  costFactors: string | null;
  nextStep: string | null;
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
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function login(): Promise<void> {
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
  if (!data.token) throw new Error("Login succeeded but no token was returned.");
  token = data.token;
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

/**
 * Find an asset by exact cdnUrl, or create it. Pages through the whole library
 * client-side — the backend's `search` matches alt text, not URLs, which made
 * a lookup-by-filename create a duplicate on every run.
 */
async function findOrCreateAsset(cdnUrl: string, altText: string): Promise<number> {
  for (let pageNumber = 1; pageNumber <= 50; pageNumber++) {
    const list = await api<{ items: { id: number; cdnUrl: string }[]; totalPages: number }>(
      `/api/admin/assets?pageNumber=${pageNumber}&pageSize=100`,
    );
    const existing = (list.items ?? []).find((a) => a.cdnUrl === cdnUrl);
    if (existing) return existing.id;
    if (pageNumber >= (list.totalPages || 1)) break;
  }
  const created = await api<{ id: number }>(`/api/admin/assets`, {
    method: "POST",
    body: JSON.stringify({ cdnUrl, altText, width: null, height: null }),
  });
  return created.id;
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

async function main() {
  console.log(`Syncing SEO fixes to ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  // ---- 1. Pricing catalog: enrich table columns ----
  const pricingBody = await api<PricingItem[] | { items: PricingItem[] }>(
    "/api/admin/pricing-items",
  );
  const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
  const byScenario = new Map(pricingItems.map((p) => [p.scenario, p]));

  let enriched = 0;
  for (const [scenario, extra] of Object.entries(PRICING_ENRICHMENT)) {
    const item = byScenario.get(scenario);
    if (!item) {
      console.warn(`  ! pricing scenario not found in catalog: "${scenario}"`);
      continue;
    }
    const next = {
      includes: item.includes || extra.includes || null,
      costFactors: item.costFactors || extra.costFactors || null,
      nextStep: item.nextStep || extra.nextStep || null,
    };
    if (
      next.includes === (item.includes ?? null) &&
      next.costFactors === (item.costFactors ?? null) &&
      next.nextStep === (item.nextStep ?? null)
    ) {
      continue; // already enriched
    }
    await api(`/api/admin/pricing-items/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: item.id,
        scenario: item.scenario,
        priceMin: item.priceMin,
        priceMax: item.priceMax,
        priceLabel: item.priceLabel,
        note: item.note,
        category: item.category,
        internalNote: item.internalNote,
        ...next,
      }),
    });
    enriched++;
  }
  console.log(`✓ pricing catalog: ${enriched} item(s) enriched`);

  const pinsFor = (scenarios: string[]) =>
    scenarios
      .map((scenario, i) => {
        const item = byScenario.get(scenario);
        if (!item) {
          console.warn(`  ! pin skipped, scenario not in catalog: "${scenario}"`);
          return null;
        }
        return { pricingItemId: item.id, sortOrder: i, noteOverride: null };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

  // ---- 2. Page list → slug → id ----
  const pageList = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const idBySlug = new Map(pageList.items.map((p) => [p.slug, p.id]));

  // Every slug this run may touch:
  const targetSlugs = new Set<string>([
    ...Object.keys(SEO_FIXES),
    ...Object.keys(LINK_ADDITIONS),
    ...Object.keys(HERO_FIXES),
    // pages with known broken links:
    "how-often-should-you-service-a-garage-door",
    "roller-door-vs-sectional-door",
    "garage-door-repair-cost-perth",
    "garage-door-repairs-perth",
    "garage-door-motor-replacement-joondalup",
    "roller-door-repair-canning-vale",
    "sectional-door-installation-fremantle",
  ]);

  let updated = 0;
  for (const slug of targetSlugs) {
    const id = idBySlug.get(slug);
    if (!id) {
      console.warn(`  ! page not found for slug: ${slug}`);
      continue;
    }

    const page = await api<AdminPage>(`/api/admin/pages/${id}`);
    let changed = false;
    const notes: string[] = [];

    // Titles / descriptions
    const seo = SEO_FIXES[slug];
    if (seo?.title && page.seoTitle !== seo.title) {
      page.seoTitle = seo.title;
      changed = true;
      notes.push("title");
    }
    if (seo?.description && page.seoDescription !== seo.description) {
      page.seoDescription = seo.description;
      changed = true;
      notes.push("description");
    }

    // Broken related links → live targets (dedupe if the fix collides with an existing link)
    const seenHrefs = new Set(
      page.relatedLinks.map((l) => `${l.linkGroup}:${l.staticHref ?? `page:${l.targetPageId}`}`),
    );
    page.relatedLinks = page.relatedLinks.filter((l) => {
      const fix = l.staticHref ? HREF_FIXES[l.staticHref] : undefined;
      if (!fix) return true;
      const key = `${l.linkGroup}:${fix.href}`;
      if (seenHrefs.has(key)) {
        // The corrected target already exists in this group — drop the duplicate.
        changed = true;
        notes.push(`link dropped (dup): ${l.staticHref}`);
        return false;
      }
      seenHrefs.add(key);
      notes.push(`link: ${l.staticHref} → ${fix.href}`);
      l.staticHref = fix.href;
      if (fix.label) l.labelOverride = fix.label;
      changed = true;
      return true;
    });

    // RelatedArticles entries pointing at non-blog URLs render as phantom
    // /blog/... links (the article mapper slugs the href and re-prefixes it).
    // Convert them to RelatedServices, whose hrefs pass through verbatim.
    for (const l of page.relatedLinks) {
      if (
        l.linkGroup === "RelatedArticles" &&
        l.staticHref &&
        !l.staticHref.startsWith("/blog/")
      ) {
        seenHrefs.delete(`${l.linkGroup}:${l.staticHref}`);
        l.linkGroup = "RelatedServices";
        const key = `${l.linkGroup}:${l.staticHref}`;
        if (seenHrefs.has(key)) {
          // already linked as a service card — handled below by the dedupe filter
        }
        seenHrefs.add(key);
        changed = true;
        notes.push(`link group fixed: ${l.staticHref} → RelatedServices`);
      }
    }

    // De-orphaning additions (skip when the href is already linked from this page)
    for (const add of LINK_ADDITIONS[slug] ?? []) {
      const key = `${add.linkGroup}:${add.href}`;
      if (seenHrefs.has(key)) continue;
      const maxSort = Math.max(-1, ...page.relatedLinks.map((l) => l.sortOrder));
      page.relatedLinks.push({
        id: 0,
        targetPageId: null,
        staticHref: add.href,
        labelOverride: add.label,
        linkGroup: add.linkGroup,
        sortOrder: maxSort + 1,
      });
      seenHrefs.add(key);
      changed = true;
      notes.push(`link added: ${add.href}`);
    }

    // Comparison page: while the two door-type pages didn't exist, their cards
    // were interim-repointed at roller-repairs / the motors page. Now that
    // /roller-door-installation-perth and /sectional-garage-doors-perth are
    // real, restore the cards to their proper targets.
    if (slug === "roller-door-vs-sectional-door") {
      const restore: Record<string, { href: string; label: string }> = {
        "/roller-door-repairs-perth": {
          href: "/roller-door-installation-perth",
          label: "Roller Door Installation Perth",
        },
        "/garage-door-motors-perth": {
          href: "/sectional-garage-doors-perth",
          label: "Sectional Garage Doors Perth",
        },
      };
      for (const l of page.relatedLinks) {
        const fix = l.staticHref ? restore[l.staticHref] : undefined;
        if (!fix || seenHrefs.has(`${l.linkGroup}:${fix.href}`)) continue;
        seenHrefs.delete(`${l.linkGroup}:${l.staticHref}`);
        l.staticHref = fix.href;
        l.labelOverride = fix.label;
        seenHrefs.add(`${l.linkGroup}:${fix.href}`);
        changed = true;
        notes.push(`comparison card → ${fix.href}`);
      }
    }

    // Cost guide: the "Garage Door Servicing Perth" card pointed at the
    // repairs page (a mislabeled duplicate of the first card) — send it to the
    // actual servicing/maintenance page instead.
    if (slug === "garage-door-repair-cost-perth") {
      for (const l of page.relatedLinks) {
        if (l.labelOverride === "Garage Door Servicing Perth" && l.staticHref === "/garage-door-repairs-perth") {
          l.staticHref = "/garage-door-maintenance-perth";
          l.labelOverride = "Garage Door Servicing & Maintenance Perth";
          changed = true;
          notes.push("servicing card → /garage-door-maintenance-perth");
        }
      }
    }

    // Pricing pins for the two cost tables
    if (slug === "garage-door-repair-cost-perth" && page.pricingRows.length === 0) {
      page.pricingRows = pinsFor(COST_GUIDE_PINS);
      changed = true;
      notes.push(`pricing pins: ${page.pricingRows.length}`);
      // State the ranges in the direct answer + table intro too.
      const data = page.data as { directAnswer?: string; costTable?: { intro?: string } };
      data.directAnswer = COST_GUIDE_DIRECT_ANSWER;
      if (data.costTable) data.costTable.intro = COST_GUIDE_TABLE_INTRO;
      notes.push("directAnswer + table intro");
    }
    if (slug === "garage-door-repairs-perth" && page.pricingRows.length === 0) {
      page.pricingRows = pinsFor(SERVICE_PAGE_PINS);
      changed = true;
      notes.push(`pricing pins: ${page.pricingRows.length}`);
    }
    if (slug === "garage-door-wont-open" && page.pricingRows.length === 0) {
      page.pricingRows = pinsFor(WONT_OPEN_PINS);
      changed = true;
      notes.push(`pricing pins: ${page.pricingRows.length}`);
    }

    // Broken hero image (og:image 404) → CDN asset
    const hero = HERO_FIXES[slug];
    if (hero) {
      const assetId = await findOrCreateAsset(hero.cdnUrl, hero.altText);
      if (page.heroImageAssetId !== assetId) {
        page.heroImageAssetId = assetId;
        changed = true;
        notes.push(`hero asset → #${assetId}`);
      }
    }

    if (!changed) {
      console.log(`  = ${slug} (no change)`);
      continue;
    }

    await api(`/api/admin/pages/${id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    updated++;
    console.log(`  ✓ ${slug}: ${notes.join("; ")}`);
  }

  console.log(`\nDone. ${updated} page(s) updated on ${CMS_API_URL}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
