/**
 * /sectional-garage-doors-perth enhancement (2026-08-05) — from the Semrush
 * pull (docs/marketing/semrush-2026-08/): the NATIONAL terms "sectional garage
 * door" (1,300/mo KD 14) and "sectional garage doors" (1,300/mo KD 16) are far
 * bigger than the "perth" variant (320/mo) the page targets, and both SERPs
 * are winnable at that difficulty. The page never defines what a sectional
 * door IS or covers sizes — the two definitional intents those generic
 * queries carry (and what AI answer engines quote).
 *
 * What this script changes (idempotent, safe to re-run):
 *   - one appended intro paragraph with generic/definitional sectional-door
 *     phrasing (idempotency marker: "What is a sectional garage door")
 *   - two appended FAQs: the definition + standard AU sizes
 *     (append-if-missing by question text)
 *
 * No dollar figures in the new copy (guard below). SEO fields untouched.
 *
 * Local CMS (default):   npx tsx scripts/enhance-sectional-page-2026-08.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/enhance-sectional-page-2026-08.ts
 */

export {}; // module scope — avoids top-level const collisions across scripts/*.ts

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

const TARGET_SLUG = "sectional-garage-doors-perth";

/** Idempotency marker — also the definitional query itself. */
const PARA_MARKER = "What is a sectional garage door";

const NEW_PARAGRAPH =
  `${PARA_MARKER}? It's a door made of four or five horizontal panels hinged together, running in tracks that curve from the opening up along the ceiling — unlike a roller door, which coils into a drum above the opening, or a one-piece tilt door that swings out. Because the panels sit flat against the ceiling when open, a sectional garage door needs no room in front of the house to operate, seals tightly around all four sides of the opening, and can be insulated panel-by-panel — the reasons it has become the standard choice on new Australian homes.`;

const NEW_FAQS: { question: string; answer: string }[] = [
  {
    question: "What is a sectional garage door?",
    answer:
      "A sectional garage door is built from four or five horizontal steel panels joined by hinges. As the door opens, the panels travel up vertical tracks and curve back along the ceiling, so the door ends up lying flat overhead. Compared with a roller door (which coils into a drum) or a tilt door (one swinging panel), a sectional door seals better around the opening, runs more quietly, takes insulation well, and offers the widest choice of profiles and finishes — which is why it's the most common door on new Perth homes.",
  },
  {
    question: "What sizes do sectional garage doors come in?",
    answer:
      "In Australia, a standard single sectional door is around 2.5 m wide and a double around 4.8–5.5 m wide, with common heights of 2.1–2.4 m — but sectional doors are made to measure, so non-standard widths, extra-high openings for 4WDs and caravans, and custom sizes are all routine. We measure your opening, headroom and side room on the quote visit and confirm the exact manufactured size, because a made-to-measure door should fit the brickwork you have, not the nearest catalogue size.",
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

async function main() {
  if (/\$\d/.test(JSON.stringify({ NEW_PARAGRAPH, NEW_FAQS }))) {
    throw new Error("New copy contains a dollar figure — prices may only come from the pricing catalog.");
  }

  console.log(`Sectional-page enhancement → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === TARGET_SLUG);
  if (!ref) throw new Error(`${TARGET_SLUG} (Flat) not found.`);

  const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
  const notes: string[] = [];

  const intro = (page.data.intro ?? {}) as { heading?: string; paragraphs?: string[] };
  intro.paragraphs = intro.paragraphs ?? [];
  if (!intro.paragraphs.some((p) => p.includes(PARA_MARKER))) {
    intro.paragraphs.push(NEW_PARAGRAPH);
    page.data.intro = intro;
    notes.push("definitional paragraph appended");
  }

  const existing = new Set(page.faqs.map((f) => f.question));
  let nextSort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
  for (const faq of NEW_FAQS) {
    if (existing.has(faq.question)) continue;
    page.faqs.push({ id: 0, question: faq.question, answer: faq.answer, sortOrder: nextSort++, faqItemId: null });
    notes.push(`FAQ added: "${faq.question}"`);
  }

  if (notes.length === 0) {
    console.log("  = nothing to change — page already enhanced");
    return;
  }

  await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
  console.log(`  ✓ ${TARGET_SLUG} updated (status stays ${page.status}):`);
  for (const n of notes) console.log(`      - ${n}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
