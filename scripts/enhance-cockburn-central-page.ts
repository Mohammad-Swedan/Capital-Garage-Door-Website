/**
 * Pre-publish enhancement of the /garage-door-repairs-cockburn-central DRAFT
 * (2026-08-04), driven by a fresh DataForSEO/GSC research pass:
 *
 *  - Live Perth SERPs ("…cockburn central", "…cockburn", "garage door service
 *    cockburn"): the #1 EMD (cockburngaragedoorrepairs.com.au) has ZERO
 *    backlink rank (14 links, 9/11 nofollow, spam 38, Wix, live since 2025-01)
 *    and sells entirely on price ("$150–$160 servicing, no call-out fee");
 *    Mann ranks #3 on a rank-23 domain with a template page — content depth
 *    wins this SERP, not authority.
 *  - "cost" appears in the related searches of every variant, and the PAA set
 *    is: repair cost / worth repairing vs replacing / service frequency +
 *    cost / lifespan / most common problem.
 *
 * What this script adds to the draft (idempotent, safe to re-run):
 *   1. Guide-price table pins — the batch-3 PRICING_PINS set plus the
 *      commercial pin (this page has a Bibra Lake/Jandakot commercial
 *      section). Real catalog prices answer the "cost" demand the EMD
 *      monetises, without violating the no-hardcoded-prices rule.
 *   2. Three FAQs mirroring the unanswered PAA questions (repair-vs-replace,
 *      service frequency, lifespan). No dollar figures — the same guard as
 *      the importer.
 *
 * It does NOT publish. Publish from /admin (or via the publish endpoint),
 * then run scripts/import-cockburn-central-page.ts for Phase B wiring.
 *
 * Local CMS (default):   npx tsx scripts/enhance-cockburn-central-page.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/enhance-cockburn-central-page.ts
 */

// No imports needed — this export makes the file a module so its top-level
// consts don't collide with other scripts' in the build's global type check.
export {};

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const TARGET_SLUG = "garage-door-repairs-cockburn-central";

/** Same catalog scenarios as scripts/import-suburb-pages-batch3.ts (exact
 * strings — note the multiplication sign in "×2"), plus the commercial pin
 * because this page carries a commercial section for the industrial belt. */
const PRICING_PINS = [
  "Broken spring (single)",
  "Broken springs (×2)",
  "Cable snapped or off the drum",
  "Motor / opener not working (repair)",
  "Motor / opener replacement",
  "Door off track / stuck",
  "Service / tune-up",
  "Remote (extra / replacement)",
  "Commercial roller door (service, from)",
];

/** PAA-matched FAQs. Appended only if the question is not already present. */
const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "Is it worth repairing a garage door, or is it better to replace it?",
    answer:
      "In most cases a repair is the economical choice — springs, cables, rollers, sensors and even motors can be replaced individually, and a well-made door has plenty of life beyond any single failed part. Replacement starts to make sense when the door itself is structurally tired: rusted or cracked panels, a frame twisted out of square, or repeated failures on a door that's decades old. We give you an honest assessment on site — most Cockburn Central call-outs end in a same-day repair, and if a replacement genuinely is the smarter option we'll say so and quote it without pressure.",
  },
  {
    question: "How often should a garage door be serviced?",
    answer:
      "Once a year for a typical Cockburn Central home — an annual service keeps the door balanced, quiet and safe, and catches wear before it becomes a breakdown. Doors that work harder need attention sooner: busy family homes near the station precinct where the door cycles several times a day, and the coastal-side doors around Spearwood, Coogee and Munster where salt air attacks springs and fittings. High-cycle commercial rollers in Bibra Lake and Jandakot are usually put on a scheduled maintenance program rather than serviced ad hoc.",
  },
  {
    question: "How long do garage doors, springs and openers last?",
    answer:
      "A quality garage door lasts 15–30 years when it's serviced regularly. The wear parts are shorter-lived: torsion springs are rated in cycles rather than years — around ten thousand opens for standard springs, which is roughly 7–10 years in an average home but noticeably less for the hard-working double doors in Cockburn Central's estates — and openers typically give 10–15 years. If the door itself is sound, replacing a worn spring or motor buys the rest of the door many more years of service.",
  },
];

interface PricingItem {
  id: number;
  scenario: string;
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
  // Copy guard: prices may only come from the pricing catalog.
  if (/\$\d/.test(JSON.stringify(NEW_FAQS))) {
    throw new Error("New FAQ copy contains a dollar figure — prices may only come from the pricing catalog.");
  }

  console.log(`Cockburn Central pre-publish enhancement → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === TARGET_SLUG);
  if (!ref) throw new Error(`${TARGET_SLUG} (Flat) not found — run import-cockburn-central-page.ts first.`);

  const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
  const notes: string[] = [];

  // 1. Guide-price table pins.
  if (page.pricingRows.length === 0) {
    const pricingBody = await api<PricingItem[] | { items: PricingItem[] }>(
      "/api/admin/pricing-items?pageSize=200",
    );
    const pricingItems = Array.isArray(pricingBody) ? pricingBody : (pricingBody.items ?? []);
    const byScenario = new Map(pricingItems.map((p) => [p.scenario, p.id]));
    for (const scenario of PRICING_PINS) {
      const pricingItemId = byScenario.get(scenario);
      if (!pricingItemId) {
        console.warn(`  ! pricing scenario not in catalog, pin skipped: "${scenario}"`);
        continue;
      }
      page.pricingRows.push({ pricingItemId, sortOrder: page.pricingRows.length, noteOverride: null });
    }
    notes.push(`${page.pricingRows.length} price rows pinned`);
  } else {
    console.log(`  = pricing rows already present (${page.pricingRows.length}) — pins untouched`);
  }

  // 2. PAA FAQs (append-if-missing, matched by question).
  const existing = new Set(page.faqs.map((f) => f.question));
  let nextSort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
  for (const faq of NEW_FAQS) {
    if (existing.has(faq.question)) continue;
    page.faqs.push({ id: 0, question: faq.question, answer: faq.answer, sortOrder: nextSort++, faqItemId: null });
    notes.push(`FAQ added: "${faq.question.slice(0, 50)}…"`);
  }

  if (notes.length === 0) {
    console.log("  = nothing to change — page already enhanced");
    return;
  }

  await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
  console.log(`  ✓ ${TARGET_SLUG} updated (status stays ${page.status}):`);
  for (const n of notes) console.log(`      - ${n}`);
  console.log("\nNext: publish the page, then run scripts/import-cockburn-central-page.ts (Phase B).");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
