/**
 * On-page enhancement pass from the Semrush On-Page SEO Checker export
 * (~/Downloads/semrush/ideas_capitalgaragedoors.com.au_20260805.xlsx, triaged
 * 2026-08-05). Of 206 ideas, ~47 targeted legacy 301'd URLs (artifacts) — the
 * real signal was thin/keyword-gapped content on 8 LIVE money pages:
 *
 *  1. /emergency-garage-door-repairs-perth — losing to our own homepage for
 *     "emergency garage door repairs (perth)", flagged for LOW word count AND
 *     exact-phrase over-repetition. Fix: 2 paragraphs that grow the page
 *     WITHOUT repeating the exact phrase (semantic terms: tilt doors,
 *     replacement parts, qualified technician, Western Australia, opening and
 *     closing) + 2 FAQs. The homepage is deliberately NOT touched — it ranks
 *     #1 and both results are ours.
 *  2. /garage-door-opener-repair-perth — ranks #2 for "garage door opener
 *     repair" (1,000/mo), flagged low word count vs the #1/#3 rivals. Fix:
 *     2 paragraphs (roller door opener, springs-masquerading-as-motor-fault,
 *     models of garage doors, prompt service) + 1 FAQ.
 *  3–7. One semantically-enriching paragraph each on roller-doors,
 *     roller-door-repairs, commercial-roller-doors, installation and
 *     spring-repair, working in that page's flagged missing terms naturally.
 *  8. /garage-door-repair-cost-perth (CostGuidePage — no intro.paragraphs):
 *     desired-state rewrite of the "Broken spring/cable" scenario note to name
 *     torsion/extension springs and wear-and-tear (its flagged terms).
 *
 * Idempotent: paragraphs are appended only when their PARA_MARKER is absent,
 * FAQs only when the question text is absent, the scenario note only when it
 * differs from desired state. No dollar figures in any copy (guard in main()).
 *
 * Local CMS (default):   npx tsx scripts/enhance-ideas-2026-08.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/enhance-ideas-2026-08.ts
 */

export {}; // module scope — avoids top-level const collisions across scripts/*.ts

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/**
 * Per-page appended paragraphs. `marker` is a phrase the paragraph contains
 * that (a) proves it exists on re-run and (b) IS a flagged missing term —
 * don't reuse a marker phrase in another page's intro copy.
 */
const PARAGRAPHS: { slug: string; marker: string; text: string }[] = [
  {
    slug: "emergency-garage-door-repairs-perth",
    marker: "tilt doors",
    text: "An urgent call-out covers every door type we work on — sectional doors, roller doors, tilt doors and commercial shutters. Our vans carry the common replacement parts, from springs and cables to rollers, hinges and locks, so most urgent jobs are finished on the first visit. Before leaving, a qualified technician runs the door through its full opening and closing cycle and checks the balance and safety reverse, so the door that failed tonight doesn't fail again next week.",
  },
  {
    slug: "emergency-garage-door-repairs-perth",
    marker: "Western Australia",
    text: "Storm fronts coming off the coast are the busiest nights of the year for urgent door work in Western Australia — wind-damaged doors, debris in the tracks, and power cuts that leave cars stuck behind closed doors. If your door has been damaged in a storm, don't force it: a bent track or a slack cable can let the curtain or panels drop without warning. Keep people and cars clear, and call us — we'll talk you through making it safe until the technician arrives.",
  },
  {
    slug: "garage-door-opener-repair-perth",
    marker: "roller door opener",
    text: "We repair sectional door openers and roller door opener units alike — belt, chain and direct-drive — across all the common models of garage doors fitted in Perth homes. One caution from years of call-outs: an opener that suddenly strains, stops halfway or trips its overload is often not the motor at all, but a broken or fatigued garage door spring making the door too heavy for it. Our technicians check the door's balance and springs before condemning the opener, so you never pay to replace a motor that wasn't the problem.",
  },
  {
    slug: "garage-door-opener-repair-perth",
    marker: "prompt service",
    text: "Most opener faults are diagnosed and repaired in a single visit — we carry common logic boards, safety sensors, remotes and receivers on the van, and prompt service is the standard our customers review us on. If your opener genuinely does need replacing, we'll say so plainly, explain what a like-for-like unit or an upgrade would involve, and leave the decision with you.",
  },
  {
    slug: "roller-doors-perth",
    marker: "door manufacturer",
    text: "Whether it's for a home garage or a business roll-up, we match the door to the job rather than the other way around. Every door manufacturer we install for — B&D, Steel-Line, Gliderol and Avanti — builds to slightly different curtain profiles, weights and drum sizes, which is why a made-to-measure order from the right maker always beats trimming a stock door to fit. It's also why the same high-quality Australian-made steel curtain works as hard on a Wangara warehouse as it does on a family garage — one door solution, specified properly for the opening it has to protect.",
  },
  {
    slug: "roller-door-repairs-perth",
    marker: "lubricate the moving parts",
    text: "Half the roller doors we're called to haven't failed — they've simply worn. Guides dry out, the curtain starts to scrape, and the spring loses a little tension each year until one morning the door works perfectly going down and refuses to come back up. During every repair we lubricate the moving parts, re-tension the spring and check the guides for wear and tear, because fixing today's fault without addressing the wear behind it just books the next breakdown.",
  },
  {
    slug: "commercial-roller-doors-perth",
    marker: "remote control",
    text: "Access control is part of the specification too. We set up everything from a simple remote control in the forklift to keypads, key-switches and phone-app operation for staff entries, plus hold-to-run stations where a door must only close under supervision. And because downtime is the real cost of a commercial door, we service the wide range of doors we install under scheduled maintenance contracts — one invoice, every door on the site checked, and genuine peace of mind that the dock door will lift on Monday morning.",
  },
  {
    slug: "garage-door-installation-perth",
    marker: "automatic openers",
    text: "Almost every door we fit leaves with one of the automatic openers we stock — sized to the door's actual weight rather than whatever is on special — and we install roller doors, sectional doors and tilt doors with the same made-to-measure approach. As an authorised dealer for B&D and Steel-Line garage doors, we supply the same high-quality Australian-made doors the big installers quote, fitted by our own installers rather than subcontractors — which is why the finish is the thing customers most often mention when they recommend us.",
  },
  {
    slug: "garage-door-spring-repair-perth",
    marker: "torsion springs",
    text: "Most Perth sectional doors run on torsion springs — the tightly wound shaft above the opening — while older and lighter doors use extension springs stretched along the tracks. They fail differently: torsion springs usually let go with a loud bang and leave the door dead on the floor, while extension springs fade gradually, the door drifting crooked or feeling heavier on one side. Knowing which system your door uses is the first step in an honest garage door spring replacement quote — and if you want to understand the numbers first, our spring replacement cost guide explains exactly what drives the price.",
  },
];

const FAQS: { slug: string; question: string; answer: string }[] = [
  {
    slug: "emergency-garage-door-repairs-perth",
    question: "Can you make my garage door safe if parts have to be ordered?",
    answer:
      "Yes — that's exactly how we handle the rare job that can't be finished on the first visit. The technician will secure the door so it can't fall or be forced, get it holding safely open or closed depending on what you need, and where possible restore manual operation so your car isn't trapped. You'll leave that visit with the door safe, a clear explanation of what part is on order, and a booked return date — not an open-ended wait.",
  },
  {
    slug: "emergency-garage-door-repairs-perth",
    question: "Do you handle urgent call-outs for businesses as well as homes?",
    answer:
      "Yes. A roller shutter stuck half-open on a shopfront or a dock door jammed shut is lost trading, so commercial call-outs get the same priority response as residential ones. We work on commercial roller doors, shutters and their three-phase motors across the Perth metro area, and we can make a damaged door secure outside trading hours so you can open as normal the next morning.",
  },
  {
    slug: "garage-door-opener-repair-perth",
    question: "Can you repair the opener on a roller door?",
    answer:
      "Yes — roller door openers are a different design to sectional door openers (the motor drives the curtain's drum rather than a trolley on a rail), and we repair and replace both. Common roller-door opener faults include worn drive gears, failed limit switches and receivers that no longer hold their programming. If the unit is at end of life we can fit a modern replacement with soft start and stop, which is noticeably quieter and kinder to the curtain than the older units.",
  },
];

/** Desired-state rewrite on /garage-door-repair-cost-perth (CostGuidePage). */
const COST_GUIDE_SLUG = "garage-door-repair-cost-perth";
const SPRING_SCENARIO_TITLE = "Broken spring/cable";
const SPRING_SCENARIO_NOTE =
  "A safety-critical repair. Torsion springs and extension springs are priced differently, a spring usually breaks from metal fatigue after years of wear and tear, and on a double door both springs are normally replaced together so the second doesn't fail weeks later. Snapped cables are often replaced in pairs for the same reason.";

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
  const copy = JSON.stringify({ PARAGRAPHS, FAQS, SPRING_SCENARIO_NOTE });
  if (/\$\d/.test(copy)) {
    throw new Error("Copy contains a dollar figure — prices may only come from the pricing catalog.");
  }

  console.log(`Semrush-ideas on-page enhancement → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );
  // Admin slugs are only unique per route group — always filter Flat.
  const bySlug = (slug: string) => list.items.find((p) => p.routeGroup === "Flat" && p.slug === slug);

  const slugs = [...new Set([...PARAGRAPHS.map((p) => p.slug), ...FAQS.map((f) => f.slug), COST_GUIDE_SLUG])];

  for (const slug of slugs) {
    const ref = bySlug(slug);
    if (!ref) {
      console.warn(`  ! ${slug} (Flat) not found — skipped`);
      continue;
    }
    const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
    const notes: string[] = [];

    // Appended intro paragraphs (ServicePage shape), marker-guarded.
    const paras = PARAGRAPHS.filter((p) => p.slug === slug);
    if (paras.length > 0) {
      const intro = (page.data.intro ?? {}) as { heading?: string; paragraphs?: string[] };
      intro.paragraphs = intro.paragraphs ?? [];
      for (const p of paras) {
        if (intro.paragraphs.some((existing) => existing.includes(p.marker))) continue;
        intro.paragraphs.push(p.text);
        notes.push(`paragraph appended (marker "${p.marker}")`);
      }
      page.data.intro = intro;
    }

    // Appended FAQs, keyed by question text.
    const faqs = FAQS.filter((f) => f.slug === slug);
    if (faqs.length > 0) {
      const existing = new Set(page.faqs.map((f) => f.question));
      let nextSort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
      for (const faq of faqs) {
        if (existing.has(faq.question)) continue;
        page.faqs.push({ id: 0, question: faq.question, answer: faq.answer, sortOrder: nextSort++, faqItemId: null });
        notes.push(`FAQ added: "${faq.question}"`);
      }
    }

    // Cost-guide spring scenario: desired-state note rewrite.
    if (slug === COST_GUIDE_SLUG) {
      const scenarios = (page.data.scenarios ?? {}) as { items?: { title?: string; mayAffectQuote?: string }[] };
      const spring = (scenarios.items ?? []).find((s) => s.title === SPRING_SCENARIO_TITLE);
      if (!spring) {
        console.warn(`  ! "${SPRING_SCENARIO_TITLE}" scenario not found on ${slug}`);
      } else if (spring.mayAffectQuote !== SPRING_SCENARIO_NOTE) {
        spring.mayAffectQuote = SPRING_SCENARIO_NOTE;
        notes.push("spring/cable scenario note → torsion/extension variant");
      }
    }

    if (notes.length === 0) {
      console.log(`  = ${slug}: nothing to change`);
      continue;
    }
    await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ ${slug} updated (status stays ${page.status}):`);
    for (const n of notes) console.log(`      - ${n}`);
  }

  console.log("\nDone. The CMS fires the revalidate webhook on update — changes go live immediately.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
