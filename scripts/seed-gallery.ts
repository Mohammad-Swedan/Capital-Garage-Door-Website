/**
 * Rebuild the public gallery from real job photos → Bunny CDN + CMS.
 *
 * Pipeline: compress each source photo (sharp → max 1600px WebP q80) → upload to
 * the `jadara-hub` storage zone under `capital-garage-door/gallery/<seo-slug>.webp`
 * → log into the CMS admin API → delete EVERY existing gallery item (they were
 * placeholders/test rows) → best-effort delete orphaned localhost assets →
 * register each new image as an Asset (by CDN URL, with real alt text) → create
 * the gallery items (incl. before/after pairs) → ping the site's revalidate
 * webhook so /gallery updates immediately.
 *
 * Re-runnable: deletes-then-recreates the gallery each run (Bunny PUT overwrites;
 * re-runs leave previously registered Asset rows behind, which is harmless).
 *
 * Run it:
 *   npx tsx scripts/seed-gallery.ts [--dir "C:\path\to\photos"] [--dry-run]
 *
 * Config via env:
 *   CMS_API_URL          CMS base (default https://cgd.runasp.net — PRODUCTION).
 *   CMS_ADMIN_EMAIL/PASSWORD  admin login (prod password: CMS appsettings.Production.json).
 *   BUNNY_STORAGE_KEY    Bunny storage-zone password. Falls back to reading
 *                        AssetStorage.Bunny.ApiKey from the CMS repo's appsettings.json.
 *   SITE_URL             public site for the revalidate ping (default the live domain).
 *   REVALIDATE_SECRET    the site's webhook secret; revalidate step is skipped if unset.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const STORAGE_HOST = "https://storage.bunnycdn.com";
const STORAGE_ZONE = "jadara-hub";
const REMOTE_FOLDER = "capital-garage-door/gallery";
const PULL_ZONE = "https://jadara-hub.b-cdn.net";

const CMS_APPSETTINGS =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.json";

const DEFAULT_SOURCE_DIR = "C:\\Users\\Mohammad swedan\\Downloads\\Garage Door Images";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";
const SITE_URL = (process.env.SITE_URL ?? "https://capitalgaragedoors.com.au").replace(/\/$/, "");
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

/** CMS GalleryCategory enum names (PascalCase, as the admin API expects). */
type CategoryEnum = "Repairs" | "Installations" | "Motors" | "RollerDoors" | "Commercial" | "BeforeAfter";

interface ManifestEntry {
  file: string;
  slug: string;
  title: string;
  alt: string;
  caption: string;
  category: CategoryEnum;
  serviceType: string;
  sortOrder: number;
  /** Source file of the "before" shot for BeforeAfter pairs. */
  beforeFile?: string;
  /** Alt text for the before shot (pairs only). */
  beforeAlt?: string;
}

/** Curated from viewing every photo — titles/alts/captions describe the actual images. */
export const MANIFEST: ManifestEntry[] = [
  {
    file: "Doors installed.jfif",
    slug: "new-garage-doors-installed-perth",
    title: "New Timber-Look Garage Doors Installed",
    alt: "Row of new timber-look garage doors installed along a basement parking corridor with polished concrete floors",
    caption:
      "A complete multi-door installation for a Perth development — matching timber-look doors fitted along the full basement corridor, all aligned and operating smoothly.",
    category: "Installations",
    serviceType: "New Door Installation",
    sortOrder: 0,
  },
  {
    file: "Spring After Replacement.jfif",
    slug: "garage-door-torsion-spring-replacement-perth",
    title: "Broken Torsion Spring Replaced",
    alt: "New black torsion spring and cable drum fitted above a grey sectional garage door after replacement",
    caption:
      "Snapped torsion spring swapped for a new high-tension spring, with the drum and shaft re-set — the door was rebalanced and back in service the same visit.",
    category: "BeforeAfter",
    serviceType: "Spring Replacement",
    sortOrder: 1,
    beforeFile: "Broken Spring.jfif",
    beforeAlt: "Snapped torsion spring hanging loose above a garage door before replacement",
  },
  {
    file: "Spring After Repair.jfif",
    slug: "broken-garage-door-spring-repaired-perth",
    title: "New Torsion Springs Installed",
    alt: "Freshly installed torsion springs mounted above an insulated sectional garage door inside a garage",
    caption:
      "A dangerously snapped spring replaced with a new torsion spring set — correctly tensioned, balanced and safety-checked before handover.",
    category: "BeforeAfter",
    serviceType: "Spring Replacement",
    sortOrder: 2,
    beforeFile: "broken spring 24.jfif",
    beforeAlt: "Broken garage door torsion spring with separated coils before repair",
  },
  {
    file: "Door repair.jfif",
    slug: "sectional-garage-door-cable-repair-perth",
    title: "Sectional Door Repaired After Cable Failure",
    alt: "Repaired grey sectional garage door panels with new hinges fitted along the panel joins",
    caption:
      "This door was stuck with a snapped lift cable — new cables and hinge hardware were fitted and the panels realigned so it runs true again.",
    category: "BeforeAfter",
    serviceType: "Cable Replacement",
    sortOrder: 3,
    beforeFile: "Door before repair.jfif",
    beforeAlt: "Sectional garage door sagging out of alignment before cable and hinge repair",
  },
  {
    file: "motor installation.jfif",
    slug: "garage-door-motor-installation-perth",
    title: "Chain-Drive Garage Door Motor Installation",
    alt: "Chain-drive garage door opener being mounted to the ceiling rail during a motor installation",
    caption: "New chain-drive garage door motor installed and tuned for smooth, quiet automatic operation.",
    category: "Motors",
    serviceType: "Motor Installation",
    sortOrder: 4,
  },
  {
    file: "replacement part.jfif",
    slug: "garage-door-motor-gear-replacement-perth",
    title: "Opener Drive Gear Replacement",
    alt: "Technician holding a new nylon drive gear beside the stripped gear inside a garage door motor",
    caption:
      "Stripped drive gear diagnosed inside the opener and replaced on the spot — a cost-effective repair that saved a full motor replacement.",
    category: "Motors",
    serviceType: "Motor Repair",
    sortOrder: 5,
  },
  {
    file: "safe roller door.jfif",
    slug: "industrial-roller-door-service-perth",
    title: "Industrial Roller Door Service",
    alt: "Large red industrial roller shutter door serviced and secured inside a Perth warehouse",
    caption: "Heavy-duty warehouse roller shutter serviced and made safe for reliable daily operation.",
    category: "RollerDoors",
    serviceType: "Roller Door Service",
    sortOrder: 6,
  },
  {
    file: "door broken.jfif",
    slug: "commercial-roller-door-repair-perth",
    title: "Commercial Roller Door Failure",
    alt: "Commercial roller door with a crumpled curtain sagging over the entry to business premises",
    caption:
      "A collapsed roller door curtain at a commercial site — damage like this is secured fast to keep the business trading safely.",
    category: "Commercial",
    serviceType: "Roller Door Repair",
    sortOrder: 7,
  },
  {
    file: "Spring repair.jfif",
    slug: "garage-door-spring-repair-perth",
    title: "Garage Door Spring Repair",
    alt: "Torsion spring and chain-drive opener hardware during a spring repair on an older garage door",
    caption: "Ageing spring and opener hardware inspected and repaired to bring this garage door back to safe working order.",
    category: "Repairs",
    serviceType: "Spring Repair",
    sortOrder: 8,
  },
  {
    file: "Broken Door.jfif",
    slug: "garage-door-off-track-repair-perth",
    title: "Off-Track Garage Door Repair",
    alt: "Sectional garage door jammed off its tracks with the top panel dislodged and tilted inside the garage",
    caption:
      "This sectional door jumped its tracks and jammed mid-travel — panels were realigned and the tracking repaired so it runs safely again.",
    category: "Repairs",
    serviceType: "Off-Track Repair",
    sortOrder: 9,
  },
  {
    file: "Broken part.jfif",
    slug: "garage-door-cable-drum-replacement-perth",
    title: "Frayed Cable and Drum Replacement",
    alt: "Frayed lift cable tangled around the cable drum on a rusted garage door torsion shaft",
    caption: "A frayed lift cable caught on the drum — replaced before complete failure could drop the door.",
    category: "Repairs",
    serviceType: "Cable Replacement",
    sortOrder: 10,
  },
  {
    file: "repare door.jfif",
    slug: "garage-door-cable-track-repair-perth",
    title: "Cable and Track Repair",
    alt: "Snapped lift cable hanging beside the curved track of an open sectional garage door",
    caption: "Broken cable and worn track hardware replaced so this sectional door lifts evenly across both sides again.",
    category: "Repairs",
    serviceType: "Cable Replacement",
    sortOrder: 11,
  },
  {
    file: "door broken (hard damege).jfif",
    slug: "car-accident-garage-door-collapse-perth",
    title: "Car Accident Door Collapse Response",
    alt: "Double garage door collapsed over two cars after a vehicle accident at a Perth home",
    caption:
      "Severe vehicle-impact damage with the door collapsed over the cars inside — attended urgently to make the site safe and recover access.",
    category: "Repairs",
    serviceType: "Emergency Repair",
    sortOrder: 12,
  },
  {
    file: "emergicny car accedent (broken door).jfif",
    slug: "emergency-garage-door-repair-car-impact-perth",
    title: "Emergency Repair After Car Impact",
    alt: "White sectional garage door with its bottom panel crushed inward after a car impact",
    caption: "Car-impact damage to the lower panels — handled as an emergency call-out to secure the home and restore access.",
    category: "Repairs",
    serviceType: "Emergency Repair",
    sortOrder: 13,
  },
  {
    file: "emergincy fix door car acedent.jfif",
    slug: "emergency-garage-door-make-safe-perth",
    title: "Emergency Make-Safe After Car Impact",
    alt: "Inside view of a sectional garage door with a badly bent bottom section letting daylight through",
    caption: "Emergency make-safe on a car-damaged door — the buckled bottom section was secured ahead of panel replacement.",
    category: "Repairs",
    serviceType: "Emergency Repair",
    sortOrder: 14,
  },
  {
    file: "door car acedent.jfif",
    slug: "dented-garage-door-panels-perth",
    title: "Dented Garage Door Panels",
    alt: "Flat-panel double garage door with dents across its lower panels after a minor car accident",
    caption: "A low-speed car bump left these lower panels dented — assessed for panel replacement to bring the door back to new.",
    category: "Repairs",
    serviceType: "Panel Replacement",
    sortOrder: 15,
  },
  {
    file: "door broken 3.jfif",
    slug: "buckled-garage-door-panel-replacement-perth",
    title: "Buckled Double Door Panel Replacement",
    alt: "Beige double garage door buckled across its middle panels from impact damage",
    caption: "Buckled panels across this double sectional door — repaired with replacement sections to restore strength and appearance.",
    category: "Repairs",
    serviceType: "Panel Replacement",
    sortOrder: 16,
  },
  {
    file: "door broken 2.jfif",
    slug: "bent-garage-door-struts-repair-perth",
    title: "Bent Door Struts and Panels",
    alt: "Inside of a double garage door showing bent panels and reinforcement struts",
    caption: "Bent reinforcement struts and panels on a double sectional door — straightened and reinforced to get it operating safely again.",
    category: "Repairs",
    serviceType: "Door Repair",
    sortOrder: 17,
  },
];

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

/** Resolve the storage key without ever printing it. */
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
    /* fall through */
  }
  const match = raw.match(/"Bunny"\s*:\s*\{[^}]*?"ApiKey"\s*:\s*"([^"]+)"/);
  if (match?.[1]) return match[1];
  throw new Error("Could not resolve the Bunny storage key.");
}

async function compress(sourcePath: string): Promise<Buffer> {
  return sharp(await readFile(sourcePath))
    .rotate() // respect EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

async function uploadToBunny(key: string, remoteName: string, body: Buffer): Promise<string> {
  const url = `${STORAGE_HOST}/${STORAGE_ZONE}/${REMOTE_FOLDER}/${remoteName}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { AccessKey: key, "Content-Type": "image/webp" },
    body: new Uint8Array(body),
  });
  if (!res.ok) throw new Error(`Bunny upload of ${remoteName} failed (${res.status} ${res.statusText}).`);
  return `${PULL_ZONE}/${REMOTE_FOLDER}/${remoteName}`;
}

async function login(): Promise<string> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status}). Check CMS_ADMIN_EMAIL/PASSWORD for ${CMS_API_URL}.`);
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Login succeeded but no token was returned.");
  return data.token;
}

async function api<T>(token: string, method: string, urlPath: string, body?: unknown): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${method} ${urlPath} failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

interface AdminGalleryItem {
  id: number;
  assetId?: number;
  beforeAssetId?: number | null;
  caption?: string;
}

async function main() {
  const sourceDir = argValue("--dir") ?? DEFAULT_SOURCE_DIR;
  const dryRun = process.argv.includes("--dry-run");
  console.log(`Gallery seed → CMS ${CMS_API_URL}${dryRun ? " (DRY RUN)" : ""}\n`);

  const key = await resolveStorageKey();

  // 1. Compress + upload every image (mains and before-shots).
  const cdnUrlByFile = new Map<string, string>();
  const uploads: Array<{ file: string; remoteName: string }> = [];
  for (const entry of MANIFEST) {
    uploads.push({ file: entry.file, remoteName: `${entry.slug}.webp` });
    if (entry.beforeFile) uploads.push({ file: entry.beforeFile, remoteName: `${entry.slug}-before.webp` });
  }
  for (const { file, remoteName } of uploads) {
    const buf = await compress(path.join(sourceDir, file));
    if (dryRun) {
      console.log(`  would upload ${file} → ${remoteName} (${(buf.length / 1024).toFixed(0)} KB)`);
      cdnUrlByFile.set(file, `${PULL_ZONE}/${REMOTE_FOLDER}/${remoteName}`);
      continue;
    }
    const url = await uploadToBunny(key, remoteName, buf);
    cdnUrlByFile.set(file, url);
    console.log(`  uploaded ${remoteName} (${(buf.length / 1024).toFixed(0)} KB)`);
  }
  if (dryRun) {
    console.log("\nDry run complete — no CMS changes made.");
    return;
  }

  // 2. CMS: wipe the old placeholder gallery.
  const token = await login();
  const existing = await api<AdminGalleryItem[] | { items: AdminGalleryItem[] }>(token, "GET", "/api/admin/gallery");
  const rows = Array.isArray(existing) ? existing : (existing.items ?? []);
  const oldAssetIds = new Set<number>();
  for (const row of rows) {
    if (row.assetId) oldAssetIds.add(row.assetId);
    if (row.beforeAssetId) oldAssetIds.add(row.beforeAssetId);
    await api(token, "DELETE", `/api/admin/gallery/${row.id}`);
    console.log(`  deleted gallery item #${row.id} (${(row.caption ?? "").slice(0, 40)})`);
  }
  // Best-effort purge of the now-orphaned old assets (in-use ones are refused by the API — fine).
  for (const id of oldAssetIds) {
    try {
      await api(token, "DELETE", `/api/admin/assets/${id}`);
      console.log(`  deleted orphaned asset #${id}`);
    } catch {
      console.log(`  kept asset #${id} (still in use elsewhere)`);
    }
  }

  // 3. Register assets + create the new gallery items.
  const assetIdByFile = new Map<string, number>();
  async function registerAsset(file: string, altText: string): Promise<number> {
    const cached = assetIdByFile.get(file);
    if (cached) return cached;
    const cdnUrl = cdnUrlByFile.get(file);
    if (!cdnUrl) throw new Error(`No CDN URL recorded for ${file}`);
    const created = await api<{ id: number }>(token, "POST", "/api/admin/assets", { cdnUrl, altText });
    assetIdByFile.set(file, created.id);
    return created.id;
  }

  for (const entry of MANIFEST) {
    const assetId = await registerAsset(entry.file, entry.alt);
    const beforeAssetId = entry.beforeFile
      ? await registerAsset(entry.beforeFile, entry.beforeAlt ?? `${entry.title} — before`)
      : null;
    await api(token, "POST", "/api/admin/gallery", {
      assetId,
      beforeAssetId,
      category: entry.category,
      // title/serviceType/suburb are ignored by CMS deployments that predate the
      // AddGalleryItemMetadata migration and picked up automatically once it ships.
      title: entry.title,
      serviceType: entry.serviceType,
      suburb: "",
      caption: entry.caption,
      sortOrder: entry.sortOrder,
    });
    console.log(`  created "${entry.title}"${beforeAssetId ? " (with before shot)" : ""}`);
  }

  // 4. Refresh the live page.
  if (REVALIDATE_SECRET) {
    const res = await fetch(`${SITE_URL}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": REVALIDATE_SECRET },
      body: JSON.stringify({ path: "/gallery" }),
    });
    console.log(`\nRevalidated /gallery → ${res.status}`);
  } else {
    console.log("\nREVALIDATE_SECRET not set — /gallery will refresh on its next ISR cycle (≤1h).");
  }

  console.log(`\nDone: ${MANIFEST.length} gallery items created.`);
}

/** The public CDN URL for a manifest entry's main image. */
export function cdnUrlFor(entry: ManifestEntry): string {
  return `${PULL_ZONE}/${REMOTE_FOLDER}/${entry.slug}.webp`;
}

// Only run the destructive seed when executed directly (not when imported by the
// content generator, which reuses MANIFEST + cdnUrlFor).
const invokedDirectly = process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/seed-gallery.ts");
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
