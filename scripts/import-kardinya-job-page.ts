/**
 * JOB 1 (Kardinya, 22 July 2026) → gallery items + a case-study page + suburb wiring.
 *
 * The job: a Kardinya sectional door's lift cable snapped; we replaced both
 * cables, both torsion springs WITH the torsion pipe, and swapped the old ATA
 * GDO-9 opener for a Capital-branded motor. 7 real photos (2 before/after pairs
 * + 3 singles) — the "after" motor shot shows our branded head unit.
 *
 * Research behind the targeting (2026-08-04, GSC + DataForSEO, Perth 1000676):
 *  - Site has ZERO Kardinya impressions in 90 days — this page creates the foothold.
 *  - "garage door repairs kardinya" SERP top-5 is thin location pages; the only
 *    proof-based page (Eden Roc, "+108 jobs") ranks #2 → a real-job page competes.
 *  - Cable cluster is live: "garage door cable repair perth" 46 imp/28d @ pos 8.5
 *    landing on a cost page; "snapped garage door cable" 10/mo @ ~$30 CPC.
 *  - Related searches are "kardinya prices/cost" → FAQs point at the pinned cost
 *    guides; NO dollar figures on this page (prices live only in the CMS catalog).
 *
 * What it does (idempotent, safe to re-run):
 *  1. Compress (sharp .rotate() → EXIF-true, max 1600px WebP q80) + upload the 7
 *     photos to Bunny under capital-garage-door/gallery/ (PUT overwrites by slug).
 *  2. Register assets + create 5 suburb-tagged gallery items — SKIPPED for any
 *     title already present in GET /api/gallery; sortOrder continues above max.
 *  3. Create the case study /case-studies/garage-door-repairs-kardinya-cable-springs-motor-perth
 *     (create-as-Published fires the ISR webhook; existing slug → 409 → skip).
 *  4. Wire it into the "Recent work" of garage-door-repairs-cockburn-central and
 *     garage-door-repairs-success: appends to data.caseStudySlugs, PRESERVING
 *     any existing hand-picks and reproducing the auto-match (same-suburb slugs)
 *     before appending, so nothing the pages show today is lost.
 *  5. Revalidate /gallery, /case-studies, the new page and both suburb pages.
 *
 * Run (PRODUCTION is the default, same as scripts/add-gallery-images.ts):
 *   npx tsx scripts/import-kardinya-job-page.ts [--dry-run] [--dir "C:\...\JOB 1"]
 * Credentials resolve without printing: CMS_ADMIN_PASSWORD env, else SeedAdmin.Password
 * from the CMS repo's appsettings.Production.json (BOM-stripped) when targeting prod;
 * BUNNY_STORAGE_KEY env, else AssetStorage.Bunny.ApiKey from the CMS appsettings.json;
 * REVALIDATE_SECRET env, else parsed from this repo's .env.local.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const STORAGE_HOST = "https://storage.bunnycdn.com";
const STORAGE_ZONE = "jadara-hub";
const REMOTE_FOLDER = "capital-garage-door/gallery";
const PULL_ZONE = "https://jadara-hub.b-cdn.net";
const CDN = `${PULL_ZONE}/${REMOTE_FOLDER}`;

const CMS_REPO_DIR = "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api";
const DEFAULT_JOB_DIR = "C:\\Users\\Mohammad swedan\\Downloads\\JOB 1";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const SITE_URL = (process.env.SITE_URL ?? "https://capitalgaragedoors.com.au").replace(/\/$/, "");

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

const CASE_STUDY_SLUG = "garage-door-repairs-kardinya-cable-springs-motor-perth";
const WIRE_SUBURB_SLUGS = ["garage-door-repairs-cockburn-central", "garage-door-repairs-success"];

/* ------------------------------------------------------------------ *
 * Gallery manifest — titles/alts/captions describe the actual photos.
 * ------------------------------------------------------------------ */

type CategoryEnum = "Repairs" | "Installations" | "Motors" | "RollerDoors" | "Commercial" | "BeforeAfter";

interface PhotoEntry {
  file: string;
  slug: string;
  title: string;
  alt: string;
  caption: string;
  category: CategoryEnum;
  serviceType: string;
  suburb: string;
  beforeFile?: string;
  beforeAlt?: string;
}

const PHOTOS: PhotoEntry[] = [
  {
    file: "After — New garage door springs.jpeg",
    slug: "garage-door-spring-replacement-kardinya-perth",
    title: "Garage Door Spring Replacement in Kardinya",
    alt: "Two new torsion springs on a new torsion pipe above a sectional garage door in Kardinya, Perth",
    caption:
      "Before and after in Kardinya: one rusted, worn-out torsion spring replaced with two new high-cycle springs on a brand-new torsion pipe, then balanced and safety-tested.",
    category: "BeforeAfter",
    serviceType: "Spring Replacement",
    suburb: "Kardinya",
    beforeFile: "Before — Garage door springs.jpeg",
    beforeAlt: "Old rusted torsion spring on a worn shaft above a sectional garage door in Kardinya, Perth before replacement",
  },
  {
    file: "After — Garage door motor (he replace the old motor with or motor (capital garage door motor)).jpeg",
    slug: "garage-door-motor-replacement-kardinya-perth",
    title: "Garage Door Motor Replacement in Kardinya",
    alt: "New Capital Garage Door branded opener with its LED light on, mounted above a sectional door in Kardinya, Perth",
    caption:
      "The tired old opener on this Kardinya sectional door was replaced with a new Capital garage door motor — quieter, stronger and covered by our warranty.",
    category: "Motors",
    serviceType: "Motor Replacement",
    suburb: "Kardinya",
    beforeFile: "Before — Garage door motor.jpeg",
    beforeAlt: "Old ATA GDO-9 Dynamo garage door opener on the ceiling rail in Kardinya, Perth before replacement",
  },
  {
    file: "After — Garage door cable.jpeg",
    slug: "snapped-garage-door-cable-replacement-kardinya-perth",
    title: "Snapped Garage Door Cable Replaced in Kardinya",
    alt: "New galvanised garage door lift cable coiled next to the old snapped, corroded cable in Kardinya, Perth",
    caption:
      "The snapped, corroded lift cable that stopped this Kardinya garage door — next to the new galvanised cable that replaced it. Cables are always replaced in pairs.",
    category: "Repairs",
    serviceType: "Cable Replacement",
    suburb: "Kardinya",
  },
  {
    file: "Other — Garage door springs and torsion pipe.jpeg",
    slug: "garage-door-springs-torsion-pipe-kardinya-perth",
    title: "Springs & Torsion Pipe Replaced, Kardinya",
    alt: "Old rusted garage door torsion springs and shaft laid next to the new springs and torsion pipe in Kardinya, Perth",
    caption:
      "Straight off the door in Kardinya: rusted springs and a worn shaft next to their brand-new replacements — why we quote springs and pipe together when both are done.",
    category: "Repairs",
    serviceType: "Spring & Torsion Pipe Replacement",
    suburb: "Kardinya",
  },
  {
    file: "Other — Completed garage door repair.jpeg",
    slug: "garage-door-repair-completed-kardinya-perth",
    title: "Completed Garage Door Repair in Kardinya",
    alt: "Fully repaired sectional garage door open above a Kardinya driveway with the new Capital motor visible on the ceiling",
    caption:
      "Job done in Kardinya: new cables, twin springs on a new torsion pipe and a Capital motor — the whole lifting system renewed in a single same-day visit.",
    category: "Repairs",
    serviceType: "Garage Door Repair",
    suburb: "Kardinya",
  },
];

/* ------------------------------------------------------------------ *
 * The case study — /case-studies/{CASE_STUDY_SLUG}
 * ------------------------------------------------------------------ */

type Img = { src: string; alt: string; caption: string };
const img = (file: string, alt: string, caption: string): Img => ({ src: `${CDN}/${file}.webp`, alt, caption });

const CASE_STUDY = {
  slug: CASE_STUDY_SLUG,
  title: "Garage Door Repairs in Kardinya: Snapped Cable, New Springs & Motor",
  subtitle:
    "A Kardinya sectional door dropped a snapped lift cable and wouldn't move. In one same-day visit we renewed the whole lifting system — new cables both sides, two new springs on a new torsion pipe, and a Capital motor to finish.",
  service: "Cable, Spring & Motor Replacement",
  suburb: "Kardinya",
  doorType: "Sectional",
  jobType: "Repair",
  result: "Full lifting system renewed in one visit — cables, springs, torsion pipe and a new Capital motor.",
  summary: {
    problem: "Lift cable snapped — the door jammed and unsafe to use.",
    diagnosis: "Cables, springs and shaft all at end of life; the old opener straining against them.",
    solution: "Replaced cables, twin springs and torsion pipe, and fitted a new Capital motor.",
  },
  problem: {
    intro:
      "The homeowner called after a bang from the garage: a lift cable had snapped and the sectional door was sitting jammed and lopsided. With one cable gone, the full weight of the door hangs on the remaining hardware — dangerous to operate and a classic call-out we see across Kardinya's 1990s-built homes, where original door hardware is reaching the end of its working life.",
    points: [
      "Lift cable snapped — frayed and corroded through at the bottom",
      "Door jammed part-way, unsafe to open or close",
      "Original hardware from the door's first install, decades old",
    ],
  },
  diagnosis: {
    intro:
      "On inspection the snapped cable was only the first domino. The torsion springs were heavily rusted with stretched, tired coils, the torsion pipe was worn where the springs and drums ride on it, and the old ATA GDO-9 opener had been straining against the failing balance for months. Replacing the cable alone would have put new parts on top of worn ones — and had us back within the year.",
    points: [
      "Both lift cables corroded and past safe service life",
      "Torsion springs rusted, at the end of their cycle life",
      "Torsion pipe worn at the bearing and drum points",
      "Ageing opener working far harder than it should against the unbalanced door",
    ],
  },
  solution: {
    intro:
      "We renewed the entire lifting system in a single visit: a matched pair of new galvanised lift cables, two new high-cycle torsion springs mounted on a brand-new torsion pipe, and — with the mechanicals right — a new Capital garage door motor to replace the tired opener. The door was balanced, the opener's travel and force limits set, and the safety reversal tested before handover.",
    points: [
      "New galvanised lift cables fitted both sides",
      "Two new high-cycle torsion springs on a new torsion pipe",
      "New Capital garage door motor installed and tuned",
      "Door balanced, limits set and safety reversal tested",
    ],
  },
  images: [
    img("garage-door-spring-replacement-kardinya-perth-before", "Old rusted torsion spring on a worn shaft above the Kardinya sectional door", "Before"),
    img("garage-door-spring-replacement-kardinya-perth", "Two new torsion springs on a new torsion pipe above the Kardinya door", "After"),
    img("garage-door-motor-replacement-kardinya-perth-before", "The old ATA GDO-9 opener on the ceiling rail before replacement", "The old opener"),
    img("garage-door-motor-replacement-kardinya-perth", "New Capital garage door motor with its LED light on, mounted above the door", "The Capital motor that went in"),
    img("snapped-garage-door-cable-replacement-kardinya-perth", "New galvanised lift cable coiled beside the old snapped, corroded cable", "The snapped cable beside its replacement"),
    img("garage-door-springs-torsion-pipe-kardinya-perth", "Old rusted springs and shaft laid out next to the new springs and torsion pipe", "Old parts out, quality parts in"),
    img("garage-door-repair-completed-kardinya-perth", "The repaired sectional door open above the Kardinya driveway, Capital motor on the ceiling", "Job done — the whole lifting system renewed"),
  ],
  partsUsed: [
    "Galvanised lift cables (pair)",
    "High-cycle torsion springs ×2",
    "New torsion pipe (shaft)",
    "Capital garage door motor",
    "Balance, limit & safety-reversal test",
  ],
  relatedServices: [
    { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Garage Door Spring Repair", href: "/garage-door-spring-repair-perth" },
    { label: "Capital Garage Door Motors", href: "/garage-door-motors-perth" },
    { label: "Spring Replacement Cost Guide", href: "/garage-door-spring-replacement-cost-perth" },
    { label: "Motor Replacement Cost Guide", href: "/garage-door-motor-replacement-cost-perth" },
  ],
  faqs: [
    {
      question: "Is a garage door with a snapped cable safe to use?",
      answer:
        "No. With one cable gone the door's full weight hangs unevenly on the remaining cable, springs and tracks — forcing it can drop the door or pull more hardware apart. Stop using it, leave it where it sits and call us; we attend Kardinya call-outs same-day.",
    },
    {
      question: "Why replace the springs and torsion pipe at the same time as a cable?",
      answer:
        "Cables, springs and the torsion pipe wear together as one lifting system. On this Kardinya job the snapped cable was the symptom — the springs were rusted through their cycle life and the pipe was worn where they ride on it. Renewing the system in one visit costs far less than three separate call-outs a few months apart, and it's why we always inspect the whole door before quoting.",
    },
    {
      question: "What does a repair like this cost in Kardinya?",
      answer:
        "It depends on what your door actually needs — a cable pair alone is a much smaller job than cables, springs, pipe and a motor together. We quote the full scope up front from a published price list before any work starts. See our spring replacement and motor replacement cost guides, or use the price calculator on this site for an instant range.",
    },
    {
      question: "What motor did you install?",
      answer:
        "A Capital garage door motor — the opener range we supply and stand behind with our own warranty and locally-held spare parts. It suits sectional doors like this one, runs quietly and includes safety reversal, soft start/stop and rolling-code remotes.",
    },
    {
      question: "Do you service Kardinya and the surrounding suburbs same-day?",
      answer:
        "Yes — Kardinya, Murdoch, Winthrop, Bateman, North Lake, Bibra Lake, Melville, Willagee and the wider Melville–Cockburn area are all covered by our same-day mobile service, with the common cables, springs and motors carried on board.",
    },
    {
      question: "How long does a full cable, spring and motor replacement take?",
      answer:
        "This Kardinya job — both cables, two springs with a new torsion pipe and a motor swap — was completed in a single visit of a few hours. The door was back in service the same day it broke.",
    },
  ],
  seo: {
    title: "Garage Door Repairs Kardinya — Cable, Springs & Motor Job",
    description:
      "A Kardinya sectional door with a snapped cable, worn springs and a tired opener — fully restored in one same-day visit. See the real photos and parts.",
  },
};

/* ------------------------------------------------------------------ *
 * Credential + secret resolution (never printed)
 * ------------------------------------------------------------------ */

async function resolveAdminPassword(): Promise<string> {
  if (process.env.CMS_ADMIN_PASSWORD) return process.env.CMS_ADMIN_PASSWORD;
  if (!IS_PROD) return "Admin#12345";
  const raw = await readFile(path.join(CMS_REPO_DIR, "appsettings.Production.json"), "utf8").catch(() => {
    throw new Error("CMS_ADMIN_PASSWORD not set and appsettings.Production.json unreadable.");
  });
  const parsed = JSON.parse(raw.replace(/^\uFEFF/, "")) as { SeedAdmin?: { Password?: string } };
  const pw = parsed.SeedAdmin?.Password;
  if (!pw) throw new Error("SeedAdmin.Password missing from appsettings.Production.json.");
  return pw;
}

async function resolveStorageKey(): Promise<string> {
  if (process.env.BUNNY_STORAGE_KEY) return process.env.BUNNY_STORAGE_KEY.trim();
  const raw = await readFile(path.join(CMS_REPO_DIR, "appsettings.json"), "utf8").catch(() => {
    throw new Error("BUNNY_STORAGE_KEY not set and the CMS appsettings.json could not be read.");
  });
  const parsed = JSON.parse(raw.replace(/^\uFEFF/, "")) as { AssetStorage?: { Bunny?: { ApiKey?: string } } };
  const key = parsed.AssetStorage?.Bunny?.ApiKey;
  if (!key) throw new Error("Could not resolve the Bunny storage key.");
  return key;
}

async function resolveRevalidateSecret(): Promise<string | undefined> {
  if (process.env.REVALIDATE_SECRET) return process.env.REVALIDATE_SECRET;
  const raw = await readFile(path.join(process.cwd(), ".env.local"), "utf8").catch(() => "");
  const m = raw.match(/^REVALIDATE_SECRET=(.+)$/m);
  return m?.[1]?.trim().replace(/^["']|["']$/g, "");
}

/* ------------------------------------------------------------------ *
 * API plumbing (same shapes as scripts/enhance-suburb-pages.ts)
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

let token = "";
let ADMIN_PASSWORD = "";

async function api<T>(pathname: string, init: RequestInit = {}): Promise<{ status: number; body: T }> {
  const res = await fetch(`${CMS_API_URL}${pathname}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok && res.status !== 409) {
    const body = await res.text().catch(() => "");
    throw new Error(`${init.method ?? "GET"} ${pathname} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const text = await res.text().catch(() => "");
  return { status: res.status, body: (text ? JSON.parse(text) : undefined) as T };
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

/* ------------------------------------------------------------------ *
 * Steps
 * ------------------------------------------------------------------ */

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function compress(sourcePath: string): Promise<Buffer> {
  return sharp(await readFile(sourcePath))
    .rotate() // EXIF-true orientation (job photos carry orientation 3/6 tags)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

async function uploadToBunny(key: string, remoteName: string, body: Buffer): Promise<void> {
  const res = await fetch(`${STORAGE_HOST}/${STORAGE_ZONE}/${REMOTE_FOLDER}/${remoteName}`, {
    method: "PUT",
    headers: { AccessKey: key, "Content-Type": "image/webp" },
    body: new Uint8Array(body),
  });
  if (!res.ok) throw new Error(`Bunny upload of ${remoteName} failed (${res.status} ${res.statusText}).`);
}

function caseStudyPayload() {
  const cs = CASE_STUDY;
  return {
    templateType: "CaseStudyPage",
    routeGroup: "CaseStudies",
    slug: cs.slug,
    title: cs.title,
    seoTitle: cs.seo.title,
    seoDescription: cs.seo.description,
    noIndex: false,
    status: "Published" as const,
    heroImageAssetId: null,
    data: {
      title: cs.title,
      subtitle: cs.subtitle,
      service: cs.service,
      suburb: cs.suburb,
      doorType: cs.doorType,
      jobType: cs.jobType,
      result: cs.result,
      summary: cs.summary,
      problem: cs.problem,
      diagnosis: cs.diagnosis,
      solution: cs.solution,
      // Real CDN srcs (not assetIds) so map-case-study-page.ts img.src resolves.
      images: cs.images,
      partsUsed: cs.partsUsed,
    },
    faqs: cs.faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
    relatedLinks: cs.relatedServices.map((l, i) => ({
      targetPageId: null,
      staticHref: l.href,
      labelOverride: l.label,
      linkGroup: "RelatedServices",
      sortOrder: i,
    })),
    pricingRows: [],
    reviews: [],
    services: [],
  };
}

async function main() {
  const jobDir = argValue("--dir") ?? DEFAULT_JOB_DIR;
  const dryRun = process.argv.includes("--dry-run");
  console.log(`Kardinya job import → CMS ${CMS_API_URL}${dryRun ? " (DRY RUN)" : ""}\n`);

  /* 1. Compress + upload all 7 photos. */
  const storageKey = await resolveStorageKey();
  const uploads: Array<{ file: string; remoteName: string }> = [];
  for (const p of PHOTOS) {
    uploads.push({ file: p.file, remoteName: `${p.slug}.webp` });
    if (p.beforeFile) uploads.push({ file: p.beforeFile, remoteName: `${p.slug}-before.webp` });
  }
  for (const { file, remoteName } of uploads) {
    const buf = await compress(path.join(jobDir, file));
    if (dryRun) {
      console.log(`  would upload ${remoteName} (${(buf.length / 1024).toFixed(0)} KB)`);
      continue;
    }
    await uploadToBunny(storageKey, remoteName, buf);
    console.log(`  uploaded ${remoteName} (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  if (dryRun) {
    console.log(`\nWould create ${PHOTOS.length} gallery items + /case-studies/${CASE_STUDY_SLUG}`);
    console.log(`Would wire caseStudySlugs on: ${WIRE_SUBURB_SLUGS.join(", ")}`);
    return;
  }

  ADMIN_PASSWORD = await resolveAdminPassword();
  await login();
  console.log("\n✓ logged in");

  /* 2. Gallery items (skip any title that already exists — re-run safe). */
  const { body: existingGallery } = await api<Array<{ title?: string | null; sortOrder?: number }>>("/api/gallery");
  const existingTitles = new Set((existingGallery ?? []).map((g) => (g.title ?? "").trim()));
  let sortOrder = Math.max(0, ...(existingGallery ?? []).map((g) => g.sortOrder ?? 0)) + 1;

  for (const p of PHOTOS) {
    if (existingTitles.has(p.title)) {
      console.log(`  = gallery "${p.title}" already exists (skipped)`);
      continue;
    }
    const { body: mainAsset } = await api<{ id: number }>("/api/admin/assets", {
      method: "POST",
      body: JSON.stringify({ cdnUrl: `${CDN}/${p.slug}.webp`, altText: p.alt, category: p.category }),
    });
    let beforeAssetId: number | null = null;
    if (p.beforeFile) {
      const { body: beforeAsset } = await api<{ id: number }>("/api/admin/assets", {
        method: "POST",
        body: JSON.stringify({
          cdnUrl: `${CDN}/${p.slug}-before.webp`,
          altText: p.beforeAlt ?? `${p.title} — before`,
          category: p.category,
        }),
      });
      beforeAssetId = beforeAsset.id;
    }
    await api("/api/admin/gallery", {
      method: "POST",
      body: JSON.stringify({
        assetId: mainAsset.id,
        beforeAssetId,
        category: p.category,
        title: p.title,
        serviceType: p.serviceType,
        suburb: p.suburb,
        caption: p.caption,
        sortOrder: sortOrder++,
      }),
    });
    console.log(`  ✓ gallery "${p.title}"${beforeAssetId ? " (with before shot)" : ""}`);
  }

  /* 3. The case study (409 = already exists = skip). */
  const { status: csStatus } = await api<{ id: number }>("/api/admin/pages", {
    method: "POST",
    body: JSON.stringify(caseStudyPayload()),
  });
  console.log(csStatus === 409 ? `  = case study already exists (skipped)` : `  ✓ case study /case-studies/${CASE_STUDY_SLUG}`);

  /* 4. Suburb wiring — append, preserving hand-picks AND today's auto-match. */
  const { body: pageList } = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=300",
  );
  const flatIdBySlug = new Map(
    pageList.items.filter((p) => p.routeGroup === "Flat").map((p) => [p.slug, p.id]),
  );
  const caseStudyPages = pageList.items.filter((p) => p.routeGroup === "CaseStudies");

  /** suburb (lowercased) → case-study slugs, for reproducing the auto-match. */
  const caseSlugsBySuburb = new Map<string, string[]>();
  async function autoMatchSlugs(suburb: string): Promise<string[]> {
    const key = suburb.trim().toLowerCase();
    if (!key) return [];
    if (!caseSlugsBySuburb.size) {
      for (const p of caseStudyPages) {
        const { body: page } = await api<AdminPage>(`/api/admin/pages/${p.id}`);
        const s = String((page.data.suburb as string | undefined) ?? "").trim().toLowerCase();
        if (!s) continue;
        caseSlugsBySuburb.set(s, [...(caseSlugsBySuburb.get(s) ?? []), page.slug]);
      }
    }
    return caseSlugsBySuburb.get(key) ?? [];
  }

  for (const slug of WIRE_SUBURB_SLUGS) {
    const id = flatIdBySlug.get(slug);
    if (!id) {
      console.warn(`  ! suburb page not found: ${slug}`);
      continue;
    }
    const { body: page } = await api<AdminPage>(`/api/admin/pages/${id}`);
    const current = Array.isArray(page.data.caseStudySlugs) ? (page.data.caseStudySlugs as string[]) : [];
    // An empty list means the page auto-matches by suburb today; reproduce that
    // set first so hand-picking doesn't silently remove anything it shows.
    const base = current.length ? current : await autoMatchSlugs(String(page.data.suburb ?? ""));
    if (base.includes(CASE_STUDY_SLUG)) {
      console.log(`  = ${slug} already wired`);
      continue;
    }
    page.data.caseStudySlugs = [...base, CASE_STUDY_SLUG];
    await api(`/api/admin/pages/${id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ ${slug}: caseStudySlugs = [${(page.data.caseStudySlugs as string[]).join(", ")}]`);
  }

  /* 5. Revalidate the affected paths. */
  const revalidateSecret = await resolveRevalidateSecret();
  if (revalidateSecret) {
    const paths = [
      "/gallery",
      "/case-studies",
      `/case-studies/${CASE_STUDY_SLUG}`,
      ...WIRE_SUBURB_SLUGS.map((s) => `/${s}`),
    ];
    for (const p of paths) {
      const res = await fetch(`${SITE_URL}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-revalidate-secret": revalidateSecret },
        body: JSON.stringify({ path: p }),
      });
      console.log(`  revalidated ${p} → ${res.status}`);
    }
  } else {
    console.log("  REVALIDATE_SECRET unresolved — pages refresh on their next ISR cycle.");
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
