/**
 * Jobs batch 2026-08-19 (Downloads\jobs, 17 publishable jobs) → geotagged gallery
 * photos + DRAFT case-study pages + suburb "Recent work" wiring.
 *
 * Follows scripts/import-kardinya-job-page.ts (the job-folder → ranking-surface model),
 * generalised over scripts/job-pages-2026-08-manifest.ts. Research behind the
 * targeting (2026-08-19, GSC Domain property 90d + DataForSEO live SERPs, Perth):
 *  - suburb SERPs are thin location pages + "N jobs completed" proof pages (Eden Roc
 *    ranks #1 organic for aveley/spearwood on exactly that) → real-photo job pages
 *    compete on content, not authority;
 *  - related searches on every suburb query = "{suburb} cost / prices / residential"
 *    and PAA = "how much does it cost to fix a garage door" → every page carries a
 *    no-dollar cost FAQ pointing at the pinned cost guides;
 *  - the homepage currently ranks (pos 8–30) for most of these suburb terms with no
 *    suburb-specific page — these case studies are the first suburb-specific surface
 *    for East Cannington, Jane Brook, Mount Pleasant, Byford, Aveley, Spearwood,
 *    Bennett Springs, Caversham, Padbury, Forrestfield and Secret Harbour.
 *
 * What it does (idempotent, safe to re-run):
 *  1. Photos: sharp .rotate() (EXIF-true) → PII crop / pixelate (manifest) → max 1600px
 *     WebP q80 → **EXIF rewritten**: original camera/GPS EXIF is DROPPED (withExif
 *     replaces it — the job photos may carry the customer's real GPS) and replaced with
 *     a suburb-centroid GPS tag + ImageDescription/Copyright/Artist (image-SEO geo tag).
 *     Uploaded to Bunny under capital-garage-door/gallery/ (PUT overwrites by slug).
 *  2. Gallery: registers assets + creates the manifest's gallery items (skipped when the
 *     title already exists; sortOrder continues above the current max). Gallery is
 *     public immediately — that is intended ("upload the good images to the gallery").
 *  3. Case studies: created as **Draft** (status "Draft", noIndex false) — the user
 *     publishes manually from /admin. Existing slug → skipped, or updated in place with
 *     --update (keeps id + current status, so a published page stays published).
 *  4. Suburb wiring: appends each case-study slug to data.caseStudySlugs of the manifest's
 *     wireSuburbSlugs (Flat pages, any status — drafts included so batch-2/3 suburb pages
 *     are pre-wired), preserving hand-picks and reproducing today's auto-match first
 *     (the Kardinya append-preserving merge). A Draft case study in that list is harmless:
 *     getCaseStudiesForSuburbPage() only resolves published slugs.
 *  5. --finalize (run AFTER publishing, repeatable): for every case study that is now
 *     Published — revalidates the page, /case-studies, /gallery and the wired suburb
 *     pages, and marks the CRM job converted (PATCH /api/jobs/{id}/content-status with
 *     the live URL). Jobs 13–18 have no CRM row and are skipped there.
 *
 * Run (PRODUCTION is the default, same as the Kardinya script):
 *   npx tsx scripts/import-job-pages-2026-08.ts [--dry-run] [--only <slug-substring>]
 *   npx tsx scripts/import-job-pages-2026-08.ts --update      # re-push manifest copy
 *   npx tsx scripts/import-job-pages-2026-08.ts --finalize    # post-publish
 *   npx tsx scripts/import-job-pages-2026-08.ts --photos-only # just process+upload images
 * Credentials resolve without printing: CMS_ADMIN_PASSWORD env, else SeedAdmin.Password
 * from the CMS repo's appsettings.Production.json; BUNNY_STORAGE_KEY env, else
 * AssetStorage.Bunny.ApiKey from the CMS appsettings.json; REVALIDATE_SECRET env, else
 * .env.local (the DEV one — prod pings 401, harmless); CRM password from the CRM repo's
 * appsettings.json LoginSettings:Password (regex — the file has JS comments).
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp, { type OverlayOptions } from "sharp";
import { JOBS, type JobPage, type JobPhoto } from "./job-pages-2026-08-manifest";

const STORAGE_HOST = "https://storage.bunnycdn.com";
const STORAGE_ZONE = "jadara-hub";
const REMOTE_FOLDER = "capital-garage-door/gallery";
const PULL_ZONE = "https://jadara-hub.b-cdn.net";
const CDN = `${PULL_ZONE}/${REMOTE_FOLDER}`;

const CMS_REPO_DIR = "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api";
const CRM_APPSETTINGS = "C:\\Users\\Mohammad swedan\\source\\repos\\BookingService.API\\BookingService.API\\appsettings.json";
const JOBS_DIR = process.env.JOBS_DIR ?? "C:\\Users\\Mohammad swedan\\Downloads\\jobs";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const SITE_URL = (process.env.SITE_URL ?? "https://capitalgaragedoors.com.au").replace(/\/$/, "");
const CRM_API_URL = (process.env.CRM_API_URL ?? "https://crmservice.runasp.net/api").replace(/\/$/, "");

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

/* ------------------------------------------------------------------ *
 * Credentials (never printed)
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

async function resolveCrmPassword(): Promise<string> {
  if (process.env.CRM_PASSWORD) return process.env.CRM_PASSWORD;
  const raw = await readFile(CRM_APPSETTINGS, "utf8").catch(() => {
    throw new Error("CRM_PASSWORD not set and the CRM appsettings.json could not be read.");
  });
  const m = raw.match(/"LoginSettings"\s*:\s*\{\s*"Password"\s*:\s*"([^"]*)"/);
  if (!m) throw new Error("LoginSettings:Password not found in the CRM appsettings.json.");
  return m[1];
}

/* ------------------------------------------------------------------ *
 * CMS API plumbing (same shapes as the Kardinya script)
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

async function login(password: string): Promise<void> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password }),
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
    faqs: page.faqs.map((f) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder, faqItemId: f.faqItemId })),
    relatedLinks: page.relatedLinks.map((l) => ({
      targetPageId: l.targetPageId,
      staticHref: l.staticHref,
      labelOverride: l.labelOverride,
      linkGroup: l.linkGroup,
      sortOrder: l.sortOrder,
    })),
    pricingRows: page.pricingRows.map((r) => ({ pricingItemId: r.pricingItemId, sortOrder: r.sortOrder, noteOverride: r.noteOverride })),
    reviews: page.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder })),
    services: page.services.map((s) => ({ serviceId: s.serviceId, sortOrder: s.sortOrder })),
  };
}

/* ------------------------------------------------------------------ *
 * Image pipeline: rotate → PII crop/pixelate → resize → geotagged WebP
 * ------------------------------------------------------------------ */

/** Decimal degrees → EXIF rational DMS string ("31/1 48/1 2520/100"). */
function toDms(value: number): string {
  const abs = Math.abs(value);
  const d = Math.floor(abs);
  const mFloat = (abs - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60 * 100);
  return `${d}/1 ${m}/1 ${s}/100`;
}

async function processPhoto(job: JobPage, photo: JobPhoto, sourcePath: string): Promise<Buffer> {
  // 1. EXIF-true orientation, then flatten to pixel data (removes the orientation tag).
  let img = sharp(await readFile(sourcePath)).rotate();
  let { width = 0, height = 0 } = await img.metadata();
  // rotate() swaps dimensions for orientation 5–8; re-read after a buffer round-trip.
  const rotated = await img.toBuffer();
  img = sharp(rotated);
  ({ width = 0, height = 0 } = await img.metadata());

  // 2. PII crop (fractions of the rotated image).
  if (photo.crop) {
    const left = Math.round((photo.crop.left ?? 0) * width);
    const top = Math.round((photo.crop.top ?? 0) * height);
    const right = Math.round((photo.crop.right ?? 0) * width);
    const bottom = Math.round((photo.crop.bottom ?? 0) * height);
    img = sharp(await img.extract({ left, top, width: width - left - right, height: height - top - bottom }).toBuffer());
    ({ width = 0, height = 0 } = await img.metadata());
  }

  // 3. Pixelate boxes (plates, house numbers) — shrink to ~8px wide and scale back nearest-neighbour.
  if (photo.pixelate?.length) {
    const base = await img.toBuffer();
    const overlays: OverlayOptions[] = [];
    for (const box of photo.pixelate) {
      const left = Math.max(0, Math.round(box.x * width));
      const top = Math.max(0, Math.round(box.y * height));
      const w = Math.min(width - left, Math.round(box.w * width));
      const h = Math.min(height - top, Math.round(box.h * height));
      const region = await sharp(base).extract({ left, top, width: w, height: h }).toBuffer();
      const tiny = await sharp(region).resize({ width: 6, height: Math.max(2, Math.round((6 * h) / w)), fit: "fill" }).toBuffer();
      const blocky = await sharp(tiny).resize({ width: w, height: h, fit: "fill", kernel: "nearest" }).toBuffer();
      overlays.push({ input: blocky, left, top });
    }
    img = sharp(await sharp(base).composite(overlays).toBuffer());
  }

  // 4. Resize + geotagged WebP. withExif() REPLACES the input EXIF (camera + any real GPS dropped).
  const { lat, lng } = job.geo;
  return img
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .withExif({
      IFD0: {
        ImageDescription: `${photo.alt} (${job.suburb}, Perth WA)`,
        Copyright: "Capital Garage Doors",
        Artist: "Capital Garage Doors",
      },
      IFD3: {
        GPSLatitudeRef: lat < 0 ? "S" : "N",
        GPSLatitude: toDms(lat),
        GPSLongitudeRef: lng < 0 ? "W" : "E",
        GPSLongitude: toDms(lng),
      },
    })
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

/* ------------------------------------------------------------------ *
 * Case-study payload
 * ------------------------------------------------------------------ */

function caseStudyData(job: JobPage) {
  const bySlug = new Map(job.photos.map((p) => [p.slug, p]));
  const images = job.imageOrder.map((slug) => {
    const p = bySlug.get(slug);
    if (!p) throw new Error(`${job.slug}: imageOrder references unknown photo slug "${slug}"`);
    return { src: `${CDN}/${p.slug}.webp`, alt: p.alt, caption: p.caption };
  });
  return {
    title: job.title,
    subtitle: job.subtitle,
    service: job.service,
    suburb: job.suburb,
    doorType: job.doorType,
    jobType: job.jobType,
    result: job.result,
    summary: job.summary,
    problem: job.problem,
    diagnosis: job.diagnosis,
    solution: job.solution,
    // Real CDN srcs (not assetIds) so map-case-study-page.ts img.src resolves.
    images,
    partsUsed: job.partsUsed,
  };
}

function caseStudyCreatePayload(job: JobPage) {
  return {
    templateType: "CaseStudyPage",
    routeGroup: "CaseStudies",
    slug: job.slug,
    title: job.title,
    seoTitle: job.seo.title,
    seoDescription: job.seo.description,
    noIndex: false,
    status: "Draft" as const,
    heroImageAssetId: null,
    data: caseStudyData(job),
    faqs: job.faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
    relatedLinks: job.relatedServices.map((l, i) => ({
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

/* ------------------------------------------------------------------ *
 * Manifest validation (fail fast, before any upload)
 * ------------------------------------------------------------------ */

function validate(jobs: JobPage[]): void {
  const slugs = new Set<string>();
  for (const job of jobs) {
    if (slugs.has(job.slug)) throw new Error(`duplicate case-study slug ${job.slug}`);
    slugs.add(job.slug);
    if (job.seo.title.length > 60) throw new Error(`${job.slug}: seoTitle ${job.seo.title.length} chars (>60)`);
    if (job.seo.description.length > 160) throw new Error(`${job.slug}: seoDescription ${job.seo.description.length} chars (>160)`);
    const photoSlugs = new Set<string>();
    for (const p of job.photos) {
      if (photoSlugs.has(p.slug)) throw new Error(`${job.slug}: duplicate photo slug ${p.slug}`);
      photoSlugs.add(p.slug);
    }
    for (const s of job.imageOrder) if (!photoSlugs.has(s)) throw new Error(`${job.slug}: imageOrder unknown ${s}`);
    for (const g of job.gallery) {
      if (!photoSlugs.has(g.photo)) throw new Error(`${job.slug}: gallery unknown photo ${g.photo}`);
      if (g.before && !photoSlugs.has(g.before)) throw new Error(`${job.slug}: gallery unknown before ${g.before}`);
    }
    const text = JSON.stringify(job);
    if (/\$\s?\d/.test(text)) throw new Error(`${job.slug}: contains a dollar figure — prices live only in the CMS catalog`);
  }
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function revalidate(secret: string | undefined, paths: string[]): Promise<void> {
  if (!secret) {
    console.log("  REVALIDATE_SECRET unresolved — pages refresh on their next ISR cycle / the backend webhook.");
    return;
  }
  for (const p of paths) {
    const res = await fetch(`${SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ path: p }),
    }).catch(() => null);
    console.log(`  revalidate ${p} → ${res?.status ?? "ERR"}`);
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const update = process.argv.includes("--update");
  const finalize = process.argv.includes("--finalize");
  const photosOnly = process.argv.includes("--photos-only");
  const only = argValue("--only");
  const jobs = only ? JOBS.filter((j) => j.slug.includes(only)) : JOBS;
  if (!jobs.length) throw new Error(`--only ${only} matched nothing`);

  validate(JOBS);
  console.log(`Job pages 2026-08 → CMS ${CMS_API_URL}${dryRun ? " (DRY RUN)" : ""} — ${jobs.length} job(s)\n`);

  if (finalize) return finalizeRun(jobs);

  /* 1. Photos → geotagged WebP → Bunny. */
  const storageKey = dryRun ? "" : await resolveStorageKey();
  for (const job of jobs) {
    for (const p of job.photos) {
      const src = path.join(JOBS_DIR, job.dir, "photos", p.file);
      const buf = await processPhoto(job, p, src);
      const remote = `${p.slug}.webp`;
      if (dryRun) {
        if (process.env.PREVIEW_DIR) {
          await mkdir(process.env.PREVIEW_DIR, { recursive: true });
          await writeFile(path.join(process.env.PREVIEW_DIR, remote), buf);
        }
        console.log(`  would upload ${remote} (${(buf.length / 1024).toFixed(0)} KB)`);
        continue;
      }
      await uploadToBunny(storageKey, remote, buf);
      console.log(`  uploaded ${remote} (${(buf.length / 1024).toFixed(0)} KB)`);
    }
  }
  if (photosOnly) return;
  if (dryRun) {
    const g = jobs.reduce((n, j) => n + j.gallery.length, 0);
    console.log(`\nWould create ${g} gallery items + ${jobs.length} DRAFT case studies; wire ${[...new Set(jobs.flatMap((j) => j.wireSuburbSlugs))].join(", ")}`);
    return;
  }

  await login(await resolveAdminPassword());
  console.log("\n✓ logged in");

  /* 2. Gallery items. */
  const { body: existingGallery } = await api<Array<{ title?: string | null; sortOrder?: number }>>("/api/gallery");
  const existingTitles = new Set((existingGallery ?? []).map((g) => (g.title ?? "").trim()));
  let sortOrder = Math.max(0, ...(existingGallery ?? []).map((g) => g.sortOrder ?? 0)) + 1;

  for (const job of jobs) {
    const photoBySlug = new Map(job.photos.map((p) => [p.slug, p]));
    for (const g of job.gallery) {
      if (existingTitles.has(g.title)) {
        console.log(`  = gallery "${g.title}" exists (skipped)`);
        continue;
      }
      const main = photoBySlug.get(g.photo)!;
      const { body: mainAsset } = await api<{ id: number }>("/api/admin/assets", {
        method: "POST",
        body: JSON.stringify({ cdnUrl: `${CDN}/${main.slug}.webp`, altText: main.alt, category: g.category }),
      });
      let beforeAssetId: number | null = null;
      if (g.before) {
        const before = photoBySlug.get(g.before)!;
        const { body: beforeAsset } = await api<{ id: number }>("/api/admin/assets", {
          method: "POST",
          body: JSON.stringify({ cdnUrl: `${CDN}/${before.slug}.webp`, altText: before.alt, category: g.category }),
        });
        beforeAssetId = beforeAsset.id;
      }
      await api("/api/admin/gallery", {
        method: "POST",
        body: JSON.stringify({
          assetId: mainAsset.id,
          beforeAssetId,
          category: g.category,
          title: g.title,
          serviceType: g.serviceType,
          suburb: job.suburb,
          caption: g.caption,
          sortOrder: sortOrder++,
        }),
      });
      existingTitles.add(g.title);
      console.log(`  ✓ gallery "${g.title}"${beforeAssetId ? " (with before shot)" : ""}`);
    }
  }

  /* 3. Case studies (Draft). */
  const { body: pageList } = await api<{ items: { id: number; slug: string; routeGroup: string; status: string }[] }>(
    "/api/admin/pages?pageSize=500",
  );
  const csBySlug = new Map(pageList.items.filter((p) => p.routeGroup === "CaseStudies").map((p) => [p.slug, p]));
  const flatIdBySlug = new Map(pageList.items.filter((p) => p.routeGroup === "Flat").map((p) => [p.slug, p.id]));

  for (const job of jobs) {
    const existing = csBySlug.get(job.slug);
    if (!existing) {
      const { status } = await api<{ id: number }>("/api/admin/pages", { method: "POST", body: JSON.stringify(caseStudyCreatePayload(job)) });
      console.log(status === 409 ? `  = /case-studies/${job.slug} exists (409, skipped)` : `  ✓ DRAFT /case-studies/${job.slug}`);
      continue;
    }
    if (!update) {
      console.log(`  = /case-studies/${job.slug} exists [${existing.status}] (skipped — use --update to re-push copy)`);
      continue;
    }
    const { body: page } = await api<AdminPage>(`/api/admin/pages/${existing.id}`);
    const fresh = caseStudyCreatePayload(job);
    page.title = fresh.title;
    page.seoTitle = fresh.seoTitle;
    page.seoDescription = fresh.seoDescription;
    page.data = fresh.data;
    page.faqs = fresh.faqs.map((f, i) => ({ id: 0, ...f, faqItemId: null, sortOrder: i }));
    page.relatedLinks = fresh.relatedLinks.map((l) => ({ id: 0, ...l }));
    await api(`/api/admin/pages/${existing.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ updated /case-studies/${job.slug} [${existing.status} kept]`);
  }

  /* 4. Suburb wiring — append, preserving hand-picks AND today's auto-match. */
  const caseSlugsBySuburb = new Map<string, string[]>();
  let autoLoaded = false;
  async function autoMatchSlugs(suburb: string): Promise<string[]> {
    const key = suburb.trim().toLowerCase();
    if (!key) return [];
    if (!autoLoaded) {
      autoLoaded = true;
      for (const p of csBySlug.values()) {
        const { body: page } = await api<AdminPage>(`/api/admin/pages/${p.id}`);
        const s = String((page.data.suburb as string | undefined) ?? "").trim().toLowerCase();
        if (!s) continue;
        caseSlugsBySuburb.set(s, [...(caseSlugsBySuburb.get(s) ?? []), page.slug]);
      }
    }
    return caseSlugsBySuburb.get(key) ?? [];
  }

  const wires = new Map<string, string[]>(); // suburb slug → case-study slugs to add
  for (const job of jobs) for (const s of job.wireSuburbSlugs) wires.set(s, [...(wires.get(s) ?? []), job.slug]);

  for (const [suburbSlug, csSlugs] of wires) {
    const id = flatIdBySlug.get(suburbSlug);
    if (!id) {
      console.warn(`  ! suburb page not found: ${suburbSlug} (skipped)`);
      continue;
    }
    const { body: page } = await api<AdminPage>(`/api/admin/pages/${id}`);
    const current = Array.isArray(page.data.caseStudySlugs) ? (page.data.caseStudySlugs as string[]) : [];
    const base = current.length ? current : await autoMatchSlugs(String(page.data.suburb ?? ""));
    // Same-suburb case studies lead the list (the page's own local proof), then whatever the
    // page already showed, then the neighbouring-suburb additions.
    const pageSuburb = String(page.data.suburb ?? "").trim().toLowerCase();
    const own = csSlugs.filter((s) => JOBS.find((j) => j.slug === s)?.suburb.trim().toLowerCase() === pageSuburb);
    const desired = [...new Set([...own, ...base, ...csSlugs])];
    if (JSON.stringify(desired) === JSON.stringify(current)) {
      console.log(`  = ${suburbSlug} already wired`);
      continue;
    }
    page.data.caseStudySlugs = desired;
    await api(`/api/admin/pages/${id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ ${suburbSlug} [${page.status}]: caseStudySlugs = ${desired.join(", ")}`);
  }

  /* 5. Revalidate /gallery (gallery items are live now; drafts aren't public yet). */
  await revalidate(await resolveRevalidateSecret(), ["/gallery", "/image-sitemap.xml"]);

  console.log("\nDone. Case studies are DRAFTS — publish from /admin, then run with --finalize.");
}

/** Post-publish: revalidate + mark CRM jobs converted, for Published case studies only. */
async function finalizeRun(jobs: JobPage[]) {
  const res = await fetch(`${CMS_API_URL}/api/pages/sitemap`);
  if (!res.ok) throw new Error(`sitemap fetch failed (${res.status})`);
  const sitemap = (await res.json()) as { routeGroup: string; slug: string }[];
  const published = new Set(sitemap.filter((p) => p.routeGroup === "case-studies").map((p) => p.slug));
  const live = jobs.filter((j) => published.has(j.slug));
  const pending = jobs.filter((j) => !published.has(j.slug));
  console.log(`Published: ${live.length}, still draft: ${pending.length}${pending.length ? ` (${pending.map((j) => j.suburb).join(", ")})` : ""}\n`);
  if (!live.length) return;

  const secret = await resolveRevalidateSecret();
  const paths = new Set<string>(["/case-studies", "/gallery", "/"]);
  for (const j of live) {
    paths.add(`/case-studies/${j.slug}`);
    for (const s of j.wireSuburbSlugs) paths.add(`/${s}`);
  }
  await revalidate(secret, [...paths]);

  const crmJobs = live.filter((j) => j.crmJobId);
  if (!crmJobs.length) return;
  const password = await resolveCrmPassword();
  const loginRes = await fetch(`${CRM_API_URL}/Account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(password),
  });
  if (!loginRes.ok) throw new Error(`CRM login failed (${loginRes.status})`);
  const { token: crmToken } = (await loginRes.json()) as { token: string };
  for (const j of crmJobs) {
    const jobRes = await fetch(`${CRM_API_URL}/jobs/${j.crmJobId}`, { headers: { Authorization: `Bearer ${crmToken}` } });
    const jobDto = jobRes.ok ? ((await jobRes.json()) as { contentConverted?: boolean; contentUrl?: string | null }) : null;
    const url = `${SITE_URL}/case-studies/${j.slug}`;
    if (jobDto?.contentConverted && jobDto.contentUrl === url) {
      console.log(`  = CRM job ${j.crmJobId} (${j.suburb}) already converted`);
      continue;
    }
    const patch = await fetch(`${CRM_API_URL}/jobs/${j.crmJobId}/content-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${crmToken}` },
      body: JSON.stringify({ converted: true, contentUrl: url }),
    });
    console.log(`  ${patch.ok ? "✓" : "!"} CRM job ${j.crmJobId} (${j.suburb}) → converted (${patch.status})`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
