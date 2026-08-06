/**
 * Service-page hero image fixes (2026-08-06, user-requested):
 *
 *  - /garage-door-spring-repair-perth had an AI-generated spring hero with
 *    visibly wrong coil geometry. Replaced with the user's REAL job photo of a
 *    freshly fitted torsion spring (cropped to landscape, WebP'd, uploaded to
 *    the Bunny zone under capital-garage-door/heroes/).
 *  - Three duplicate hero pairs on /services (each image was the hero of TWO
 *    service pages). One page of each pair gets a distinct real image:
 *      · roller-door-repairs-perth  → gallery "Roller Door Repair in Midland"
 *        (was sharing the branded-van hero with garage-door-repairs-perth)
 *      · commercial-garage-doors-perth → gallery "Commercial Roller Shutter
 *        Service in Malaga" (was sharing the residential install hero with
 *        garage-door-installation-perth, which keeps it — it fits install)
 *      · roller-door-installation-perth → the unused door-types render
 *        roller-garage-door-open-perth-home.webp (was sharing the industrial
 *        service photo with industrial-roller-doors-perth, which keeps it)
 *
 * Idempotent: the Bunny upload overwrites the same remote path; assets are
 * found by exact cdnUrl before being created; pages are only PUT when the
 * heroImageAssetId (or hero.imageAlt) actually changes.
 *
 * Needs BUNNY_STORAGE_KEY (or the CMS appsettings.json on disk) for the spring
 * photo upload — the other three images are already on the CDN.
 *
 * Production: CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/fix-service-hero-images.ts
 */

import { readFile } from "node:fs/promises";
import sharp from "sharp";

const STORAGE_HOST = "https://storage.bunnycdn.com";
const STORAGE_ZONE = "jadara-hub";
const PULL_ZONE = "https://jadara-hub.b-cdn.net";
const CMS_APPSETTINGS =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.json";

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";

/** The user's real spring photo (portrait) → landscape hero crop. */
const SPRING_SOURCE = "C:\\Users\\Mohammad swedan\\Downloads\\Gemini_Generated_Image_qydcfvqydcfvqydc.png";
const SPRING_REMOTE = "capital-garage-door/heroes/garage-door-torsion-spring-replacement-perth.webp";
const SPRING_CDN_URL = `${PULL_ZONE}/${SPRING_REMOTE}`;
const SPRING_ALT =
  "New torsion spring installed above a sectional garage door during a spring replacement in Perth";

const ROLLER_OPEN_CDN_URL = `${PULL_ZONE}/capital-garage-door/door-types/roller-garage-door-open-perth-home.webp`;
const ROLLER_OPEN_ALT = "Open roller garage door on a modern Perth home showing the curtain rolled above the opening";

/** slug → desired hero. `cdnUrl` is looked up/created as an Asset; alt goes into data.hero.imageAlt. */
const HERO_FIXES: { slug: string; cdnUrl: string; alt: string; category: string }[] = [
  { slug: "garage-door-spring-repair-perth", cdnUrl: SPRING_CDN_URL, alt: SPRING_ALT, category: "Repairs" },
  {
    slug: "roller-door-repairs-perth",
    cdnUrl: `${PULL_ZONE}/capital-garage-door/gallery/roller-door-repair-midland-perth.webp`,
    alt: "Cream roller door with a damaged bottom curtain awaiting repair at a Perth home in Midland",
    category: "RollerDoors",
  },
  {
    slug: "commercial-garage-doors-perth",
    cdnUrl: `${PULL_ZONE}/capital-garage-door/gallery/commercial-roller-shutter-service-malaga-perth.webp`,
    alt: "Tall commercial roller shutter door being serviced inside a Malaga warehouse in Perth",
    category: "Commercial",
  },
  {
    slug: "roller-door-installation-perth",
    cdnUrl: ROLLER_OPEN_CDN_URL,
    alt: ROLLER_OPEN_ALT,
    category: "RollerDoors",
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

/** Resolve the Bunny storage key without ever printing it. */
async function resolveStorageKey(): Promise<string> {
  const fromEnv = process.env.BUNNY_STORAGE_KEY;
  if (fromEnv) return fromEnv.trim();
  const raw = await readFile(CMS_APPSETTINGS, "utf8").catch(() => {
    throw new Error("BUNNY_STORAGE_KEY is not set and the CMS appsettings.json could not be read.");
  });
  try {
    const parsed = JSON.parse(raw) as { AssetStorage?: { Bunny?: { ApiKey?: string } } };
    const key = parsed.AssetStorage?.Bunny?.ApiKey;
    if (key) return key;
  } catch {
    /* fall through to regex */
  }
  const match = raw.match(/"Bunny"\s*:\s*\{[^}]*?"ApiKey"\s*:\s*"([^"]+)"/);
  if (match?.[1]) return match[1];
  throw new Error("Could not resolve the Bunny storage key.");
}

/** Crop the portrait spring photo to a 16:10 landscape band centred on the spring, then WebP. */
async function buildSpringHero(): Promise<Buffer> {
  const src = sharp(await readFile(SPRING_SOURCE)).rotate();
  const meta = await src.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width === 0 || height === 0) throw new Error("Could not read spring photo dimensions.");
  // The spring runs horizontally at ~44–54% of the frame height; crop a 16:10
  // window centred just below the spring so the bracket + track detail shows.
  const cropHeight = Math.min(height, Math.round((width * 10) / 16));
  const centerY = Math.round(height * 0.49);
  const top = Math.max(0, Math.min(height - cropHeight, centerY - Math.round(cropHeight / 2)));
  return src
    .extract({ left: 0, top, width, height: cropHeight })
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

async function uploadToBunny(key: string, remotePath: string, body: Buffer): Promise<void> {
  const res = await fetch(`${STORAGE_HOST}/${STORAGE_ZONE}/${remotePath}`, {
    method: "PUT",
    headers: { AccessKey: key, "Content-Type": "application/octet-stream" },
    body: new Uint8Array(body),
  });
  if (!res.ok) throw new Error(`Bunny upload failed (${res.status} ${res.statusText}).`);
}

/** Find an Asset by exact cdnUrl (paging the whole library — the backend's
 * `search` filter matches alt text, not URL, so it can miss and cause
 * duplicate registrations on re-runs), else create it. */
async function ensureAsset(cdnUrl: string, altText: string, category: string): Promise<number> {
  const filename = cdnUrl.split("/").pop() ?? cdnUrl;
  for (let pageNumber = 1; pageNumber <= 50; pageNumber++) {
    const found = await api<{ items: { id: number; cdnUrl: string }[] }>(
      `/api/admin/assets?pageNumber=${pageNumber}&pageSize=100`,
    );
    const hit = found.items.find((a) => a.cdnUrl === cdnUrl);
    if (hit) return hit.id;
    if (found.items.length < 100) break; // last page
  }
  const created = await api<{ id: number }>("/api/admin/assets", {
    method: "POST",
    body: JSON.stringify({ cdnUrl, altText, category }),
  });
  console.log(`  + registered asset #${created.id} for ${filename}`);
  return created.id;
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
  console.log(`Service hero image fixes → ${CMS_API_URL}`);

  // 1. Build + upload the real spring hero (idempotent overwrite of the same path).
  const springKey = await resolveStorageKey();
  const springBuf = await buildSpringHero();
  await uploadToBunny(springKey, SPRING_REMOTE, springBuf);
  console.log(`✓ spring hero uploaded (${(springBuf.length / 1024).toFixed(0)} KB) → ${SPRING_CDN_URL}`);

  await login();
  console.log("✓ logged in");

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>(
    "/api/admin/pages?pageSize=200",
  );

  for (const fix of HERO_FIXES) {
    const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === fix.slug);
    if (!ref) {
      console.warn(`  ! ${fix.slug} (Flat) not found — skipped`);
      continue;
    }
    const assetId = await ensureAsset(fix.cdnUrl, fix.alt, fix.category);
    const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
    const notes: string[] = [];

    if (page.heroImageAssetId !== assetId) {
      page.heroImageAssetId = assetId;
      notes.push(`heroImageAssetId → #${assetId} (${fix.cdnUrl.split("/").pop()})`);
    }
    const hero = (page.data.hero ?? {}) as { imageAlt?: string };
    if (hero.imageAlt !== fix.alt) {
      hero.imageAlt = fix.alt;
      page.data.hero = { ...(page.data.hero as object), imageAlt: fix.alt };
      notes.push("hero.imageAlt updated");
    }

    if (notes.length === 0) {
      console.log(`  = ${fix.slug}: nothing to change`);
      continue;
    }
    await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ ${fix.slug} updated:`);
    for (const n of notes) console.log(`      - ${n}`);
  }

  console.log("\nDone. The CMS revalidation webhook refreshes the pages + /services immediately.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
