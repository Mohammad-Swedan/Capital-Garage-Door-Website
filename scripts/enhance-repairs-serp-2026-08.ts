/**
 * Repair-cluster SERP enhancement (2026-08-05) — driven by the Semrush
 * competitive pull saved in docs/marketing/semrush-2026-08/:
 *
 *  - The #1 competitor (perthgaragedoorsrepairs.com.au) earns most of its
 *    ~5–8k/mo traffic from the LOCALIZED generic + "near me" repair SERPs
 *    (garage door repair 5,400/mo KD 28, garage door repairs 3,600/20,
 *    repairs/fix "near me" 1,300 ea KD 18–20, garage door service 1,600/28,
 *    roller door repairs 2,900/28) — NOT from the "perth" terms. Our repairs
 *    page has zero "near me"/servicing phrasing, so it can't match that
 *    (much larger) query surface.
 *  - Our homepage cannibalises "garage door repairs perth" (pos 23 on "/")
 *    while the dedicated page ranks nowhere. The paired code-side fix (same
 *    change set) adds the exact-match homepage anchor to
 *    /garage-door-repairs-perth in components/sections/services-grid.tsx.
 *
 * What this script changes (idempotent, safe to re-run):
 *   1. /garage-door-repairs-perth (Flat):
 *      - seoDescription gains "near you" phrasing (title stays pinned by
 *        scripts/sync-seo-fixes.ts — NOT touched here).
 *      - one appended intro paragraph covering near-me + roller-door +
 *        servicing intent (idempotency marker: "garage door repairs near me").
 *      - three appended FAQs matching the near-me / roller-door-repairs /
 *        servicing query clusters (append-if-missing by question text).
 *   2. /garage-door-maintenance-perth (Flat):
 *      - one appended FAQ for the "garage door service near me" cluster
 *        (720/mo KD 25). Its pinned seo fields are NOT touched.
 *
 * No dollar figures in any copy (guard below) — prices come only from pins.
 *
 * Local CMS (default):   npx tsx scripts/enhance-repairs-serp-2026-08.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/enhance-repairs-serp-2026-08.ts
 */

export {}; // module scope — avoids top-level const collisions across scripts/*.ts

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** Marker phrase that both proves the paragraph exists and IS the target
 * query — do not reuse in other pages' intro paragraphs. */
const PARA_MARKER = "garage door repairs near me";

const REPAIRS_SLUG = "garage-door-repairs-perth";
const MAINTENANCE_SLUG = "garage-door-maintenance-perth";

const REPAIRS_DESCRIPTION =
  "Garage door repairs near you, anywhere in Perth — broken springs, snapped cables, faulty motors and off-track doors fixed same-day. Free upfront quotes.";

const REPAIRS_PARAGRAPH =
  `Searching for "${PARA_MARKER}"? Our technicians are based across the Perth metro area, so the closest van — not a distant call centre — takes your job, from the northern suburbs around Joondalup and Wanneroo to the southern corridor through Cockburn, Rockingham and Mandurah. We repair every door type on the same visit: sectional doors, roller doors, tilt doors and commercial shutters, and we can service the door while we're there so you don't pay for a second call-out. If you'd rather not wait, same-day appointments are usually available across all of Perth.`;

const REPAIRS_FAQS: { question: string; answer: string }[] = [
  {
    question: "Do you do garage door repairs near me?",
    answer:
      "Almost certainly — we cover the whole Perth metro area with local technicians, from Two Rocks down to Mandurah and inland to the Hills. Because our techs are spread across the city rather than dispatched from one depot, the van that takes your job is usually already working in your area, which is how we keep same-day repairs realistic for most suburbs. Tell us your suburb when you call or book online and we'll give you an honest arrival window — and if you want to check first, our service-areas page lists every region and suburb we work in.",
  },
  {
    question: "Do you repair roller doors as well as sectional doors?",
    answer:
      "Yes — roller door repairs are one of the most common jobs we do. Single-skin steel roller doors have their own failure points: the curtain can jam or track off line, the spring inside the drum weakens until the door feels impossibly heavy, and the nylon guides wear until the door rattles in the tracks. We repair all of it, along with roller-door motors and lock-and-arm sets, and we carry the common parts on the van. The same goes for tilt doors and commercial roller shutters — one call covers every door type, residential or commercial.",
  },
  {
    question: "Do you service garage doors as well as repair them?",
    answer:
      "Yes. Alongside repairs we run scheduled garage door servicing across Perth — a full tune-up that lubricates and re-tensions the moving parts, checks the door's balance and safety reverse, and inspects springs, cables and rollers for wear before they fail. Many customers have us service the door during a repair visit, since the technician is already on site and the door is already apart. If your door is working but noisy, slow or overdue for attention, booking a service is the cheapest way to avoid the next breakdown.",
  },
];

const MAINTENANCE_FAQS: { question: string; answer: string }[] = [
  {
    question: "Do you offer garage door servicing near me?",
    answer:
      "Yes — our service runs cover the entire Perth metro area, from Yanchep and Joondalup in the north through the CBD and eastern suburbs to Rockingham, Baldivis and Mandurah in the south. Because servicing is scheduled work rather than an emergency call-out, we group bookings by area, which usually means you can pick a day when a technician is already servicing doors in your suburb. Coastal suburbs are worth booking a little more often: salt air is hard on springs, cables and fixings, and a regular tune-up is what catches that corrosion early.",
  },
];

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

function appendFaqs(
  page: AdminPage,
  faqs: { question: string; answer: string }[],
  notes: string[],
): void {
  const existing = new Set(page.faqs.map((f) => f.question));
  let nextSort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
  for (const faq of faqs) {
    if (existing.has(faq.question)) continue;
    page.faqs.push({ id: 0, question: faq.question, answer: faq.answer, sortOrder: nextSort++, faqItemId: null });
    notes.push(`FAQ added: "${faq.question}"`);
  }
}

async function enhancePage(
  ref: { id: number },
  mutate: (page: AdminPage, notes: string[]) => void,
): Promise<void> {
  const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
  const notes: string[] = [];
  mutate(page, notes);
  if (notes.length === 0) {
    console.log(`  = ${page.slug}: nothing to change`);
    return;
  }
  await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
  console.log(`  ✓ ${page.slug} updated (status stays ${page.status}):`);
  for (const n of notes) console.log(`      - ${n}`);
}

async function main() {
  // Copy guard: prices may only come from the pricing catalog.
  const copy = JSON.stringify({ REPAIRS_DESCRIPTION, REPAIRS_PARAGRAPH, REPAIRS_FAQS, MAINTENANCE_FAQS });
  if (/\$\d/.test(copy)) {
    throw new Error("Copy contains a dollar figure — prices may only come from the pricing catalog.");
  }

  console.log(`Repair-cluster SERP enhancement → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const bySlug = (slug: string) => list.items.find((p) => p.routeGroup === "Flat" && p.slug === slug);

  const repairs = bySlug(REPAIRS_SLUG);
  if (!repairs) throw new Error(`${REPAIRS_SLUG} (Flat) not found.`);
  await enhancePage(repairs, (page, notes) => {
    if (page.seoDescription !== REPAIRS_DESCRIPTION) {
      page.seoDescription = REPAIRS_DESCRIPTION;
      notes.push("seoDescription → near-me variant");
    }
    const intro = (page.data.intro ?? {}) as { heading?: string; paragraphs?: string[] };
    intro.paragraphs = intro.paragraphs ?? [];
    if (!intro.paragraphs.some((p) => p.includes(PARA_MARKER))) {
      intro.paragraphs.push(REPAIRS_PARAGRAPH);
      page.data.intro = intro;
      notes.push("near-me intro paragraph appended");
    }
    appendFaqs(page, REPAIRS_FAQS, notes);
  });

  const maintenance = bySlug(MAINTENANCE_SLUG);
  if (!maintenance) throw new Error(`${MAINTENANCE_SLUG} (Flat) not found.`);
  await enhancePage(maintenance, (page, notes) => {
    appendFaqs(page, MAINTENANCE_FAQS, notes);
  });

  console.log("\nDone. The CMS fires the revalidate webhook on update — changes go live immediately.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
