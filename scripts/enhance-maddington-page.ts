/**
 * Pre-publish enhancement of the /garage-door-repairs-maddington DRAFT
 * (2026-08-12), driven by a fresh DataForSEO/GSC research pass:
 *
 *  - GSC 90d: "garage door repairs maddington" 19 imp @ pos 7.0 and
 *    "garage door repair maddington" 7 imp @ 10.7 with NO page — plus a
 *    22-imp roller cluster ("roller garage door(s) maddington" @ 44–59)
 *    the draft under-served.
 *  - Live Perth SERP: the local pack is 3 GBP listings (Desmond Brown is
 *    BASED in Maddington and sells on "prices from $176"); organic winners
 *    win on specificity — Eden Roc's title is "Over 127 Jobs", doic leads
 *    with open pricing. Related searches: "Residential…", "Mobile garage
 *    door repairs maddington", "Garage doors Perth prices". PAA: repair
 *    cost / worth repairing vs replacing / most common repair.
 *
 * What this script applies to the draft (idempotent, safe to re-run):
 *   1. CTR-refactored seoTitle/seoDescription — roller doors in the title
 *      (the uncaptured cluster), "upfront guide prices" + "mobile techs"
 *      in the description (the SERP's two proven click motivators).
 *   2. A roller-door localIntro paragraph (residential + Albany Highway
 *      commercial) — marker-guarded for idempotency.
 *   3. Three FAQs matching the roller cluster, the repair-vs-replace PAA,
 *      and the "mobile repairs" related search. No dollar figures.
 *   4. Guide-price table pins — the standard 8-scenario set PLUS the
 *      commercial roller pin (the copy is commercial-flavoured), answering
 *      the SERP's price transparency demand from the catalog, never prose.
 *
 * It does NOT publish. After publishing, run
 * scripts/finalize-suburb-pages-batch2.ts for the link wiring.
 *
 * Local CMS (default):   npx tsx scripts/enhance-maddington-page.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/enhance-maddington-page.ts
 */

export {};

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const TARGET_SLUG = "garage-door-repairs-maddington";

const NEW_SEO_TITLE = "Garage Door Repairs Maddington | Roller Doors & Same-Day";
const NEW_SEO_DESCRIPTION =
  "Same-day garage door & roller door repairs in Maddington. Upfront guide prices, mobile techs nearby in Gosnells & Thornlie daily. Springs, motors, cables.";

/** Idempotency marker — this exact phrase must not be reused elsewhere. */
const ROLLER_PARA_MARKER = "roller doors are half the work in Maddington";
const ROLLER_PARA = `Residential and commercial roller doors are half the work in Maddington — re-tensioning curtains that have gone slack, freeing doors that jam in their guides, replacing worn roller-door springs, and keeping the high-cycle commercial rollers along Albany Highway running. If your roller door has become heavy, crooked or noisy, that's usually tension or guide wear, and both are quick, well-priced fixes.`;

/** Same catalog scenarios as scripts/import-suburb-pages-batch3.ts (exact
 * strings — note the multiplication sign in "×2"), plus the commercial pin
 * because this page carries commercial roller-door copy. */
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

/** Research-matched FAQs. Appended only if the question is not already present. */
const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "Do you repair roller doors in Maddington?",
    answer:
      "Yes — roller doors are one of our most common Maddington jobs, residential and commercial. We re-tension curtains that have gone slack or crooked, repair and replace roller-door springs, free doors that jam or stick in their guides, and service the hard-working commercial rollers in the workshops and yards along Albany Highway. Most residential roller-door repairs are finished in a single visit, and commercial units can be put on a scheduled maintenance program.",
  },
  {
    question: "Is it worth repairing a garage door, or should I replace it?",
    answer:
      "Usually a repair — springs, cables, rollers and openers can all be replaced individually, and the solid doors on Maddington's established homes have plenty of life beyond any single worn part. Replacement only makes sense when the door itself is structurally tired: rusted or cracked panels, a twisted frame, or repeated failures on a door that's decades old. We assess honestly on site — most Maddington call-outs end in a same-day repair, and if replacing genuinely is the smarter option we'll say so and quote it without pressure.",
  },
  {
    question: "Do you offer mobile garage door repairs in Maddington?",
    answer:
      "Yes — every repair we do is mobile. Our technicians come to you anywhere in Maddington, Kenwick, Orange Grove or Beckenham with vans stocked with springs, cables, rollers, remotes and openers for the major Australian brands, so most jobs are diagnosed and fixed on the spot in one visit rather than quoted and rebooked.",
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
  if (/\$\d/.test(JSON.stringify(NEW_FAQS)) || /\$\d/.test(ROLLER_PARA) || /\$\d/.test(NEW_SEO_DESCRIPTION)) {
    throw new Error("New copy contains a dollar figure — prices may only come from the pricing catalog.");
  }
  if (NEW_SEO_TITLE.length > 60) throw new Error(`seoTitle is ${NEW_SEO_TITLE.length} chars (>60).`);
  if (NEW_SEO_DESCRIPTION.length > 160) throw new Error(`seoDescription is ${NEW_SEO_DESCRIPTION.length} chars (>160).`);

  console.log(`Maddington pre-publish enhancement → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === TARGET_SLUG);
  if (!ref) throw new Error(`${TARGET_SLUG} (Flat) not found — run import-suburb-pages-batch2.ts first.`);

  const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
  const notes: string[] = [];

  // 1. CTR title/description.
  if (page.seoTitle !== NEW_SEO_TITLE) {
    page.seoTitle = NEW_SEO_TITLE;
    notes.push("seoTitle → roller-door + same-day variant");
  }
  if (page.seoDescription !== NEW_SEO_DESCRIPTION) {
    page.seoDescription = NEW_SEO_DESCRIPTION;
    notes.push("seoDescription → upfront-prices/mobile variant");
  }

  // 2. Roller-door local paragraph (marker-guarded, inserted before the brands para).
  const intro = (page.data.localIntro as string[] | undefined) ?? [];
  if (!intro.some((p) => p.includes(ROLLER_PARA_MARKER))) {
    const brandsIdx = intro.findIndex((p) => p.includes("B&D"));
    intro.splice(brandsIdx === -1 ? intro.length : brandsIdx, 0, ROLLER_PARA);
    page.data.localIntro = intro;
    notes.push("roller-door localIntro paragraph added");
  }

  // 3. Research-matched FAQs (append-if-missing, matched by question).
  const existing = new Set(page.faqs.map((f) => f.question));
  let nextSort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
  for (const faq of NEW_FAQS) {
    if (existing.has(faq.question)) continue;
    page.faqs.push({ id: 0, question: faq.question, answer: faq.answer, sortOrder: nextSort++, faqItemId: null });
    notes.push(`FAQ added: "${faq.question.slice(0, 50)}…"`);
  }

  // 4. Guide-price table pins (standard 8 + commercial).
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

  if (notes.length === 0) {
    console.log("  = nothing to change — page already enhanced");
    return;
  }

  await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
  console.log(`  ✓ ${TARGET_SLUG} updated (status stays ${page.status}):`);
  for (const n of notes) console.log(`      - ${n}`);
  console.log("\nNext: publish the page, then run scripts/finalize-suburb-pages-batch2.ts.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
