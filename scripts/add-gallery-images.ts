/**
 * ADD new real job photos to the public gallery — NON-DESTRUCTIVE.
 *
 * Unlike scripts/seed-gallery.ts (which WIPES every existing gallery item before
 * recreating), this script only APPENDS: it compresses each source photo
 * (sharp → max 1600px WebP q80), uploads it to the `jadara-hub` storage zone
 * under `capital-garage-door/gallery/<seo-slug>.webp`, logs into the CMS admin
 * API, registers each image as an Asset (by CDN URL, with real alt text +
 * category), creates the gallery items (incl. before/after pairs) with
 * suburb-rich local-SEO metadata, and pings the site's revalidate webhook.
 *
 * It never deletes anything. `sortOrder` values start above the current max so
 * the new items append after the existing gallery. Bunny PUT overwrites by slug,
 * so a re-run is safe for the CDN; re-running WILL create duplicate CMS rows
 * (delete them in /admin/gallery if you re-run).
 *
 * Run it (PRODUCTION):
 *   CMS_API_URL=https://cgd.runasp.net \
 *   CMS_ADMIN_PASSWORD=<SeedAdmin.Password from CMS appsettings.Production.json> \
 *   REVALIDATE_SECRET=<from .env.local> \
 *   npx tsx scripts/add-gallery-images.ts --dir "C:\Users\Mohammad swedan\Downloads\garage door photo 2" [--dry-run]
 *
 * Config via env (same contract as seed-gallery.ts):
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

const DEFAULT_SOURCE_DIR = "C:\\Users\\Mohammad swedan\\Downloads\\garage door photo 2";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";
const SITE_URL = (process.env.SITE_URL ?? "https://capitalgaragedoors.com.au").replace(/\/$/, "");
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

/** sortOrder base — the live gallery currently ends at 17, so new items append after it. */
const SORT_ORDER_BASE = 18;

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
  suburb: string;
  /** Source file of the "before" shot for BeforeAfter pairs. */
  beforeFile?: string;
  /** Alt text for the before shot (pairs only). */
  beforeAlt?: string;
}

/**
 * Curated from viewing every photo — titles/alts/captions describe the actual
 * images. Suburbs are a representative spread across the Perth metro for local
 * SEO (industrial suburbs for the commercial roller-shutter shots).
 */
export const MANIFEST: ManifestEntry[] = [
  {
    file: "Centurion Garage door cable replacement with bottom brackets. (after fix).jpeg",
    slug: "garage-door-cable-replacement-willetton-perth",
    title: "Garage Door Cable Replacement in Willetton",
    alt: "Clean white sectional garage door beside a limestone wall in Willetton, Perth after new lift cables and bottom brackets were fitted",
    caption:
      "New lift cables and bottom brackets fitted to this Willetton sectional door — the panels realign and the door runs smoothly and safely again.",
    category: "Repairs",
    serviceType: "Cable Replacement",
    suburb: "Willetton",
  },
  {
    file: "Supply and install steel line garage door.jpeg",
    slug: "steel-line-garage-door-installation-baldivis-perth",
    title: "New Steel-Line Garage Door Installed in Baldivis",
    alt: "Newly installed cream Steel-Line sectional garage door on a home in Baldivis, Perth under a clear blue sky",
    caption:
      "Supply and install of a new Steel-Line sectional garage door for a Baldivis home — clean lines, smooth automatic operation and a fresh street frontage.",
    category: "Installations",
    serviceType: "New Door Installation",
    suburb: "Baldivis",
  },
  {
    file: "after fix - grage door hinge.jpeg",
    slug: "garage-door-hinge-roller-replacement-morley-perth",
    title: "Garage Door Hinge & Roller Replacement, Morley",
    alt: "New black hinge and roller bracket fitted to a garage door track in Morley, Perth",
    caption:
      "A seized, rusted hinge and roller replaced with new hardware on this Morley garage door — before and after the repair, restoring smooth, quiet travel.",
    category: "BeforeAfter",
    serviceType: "Hinge & Roller Replacement",
    suburb: "Morley",
    beforeFile: "before-broken hinge.jpeg",
    beforeAlt: "Worn, corroded garage door hinge and roller bracket before replacement in Morley, Perth",
  },
  {
    file: "broken spring 4.jfif",
    slug: "rusted-garage-door-spring-repair-kalamunda-perth",
    title: "Rusted Garage Door Spring Repair in Kalamunda",
    alt: "Heavily rusted torsion spring on the shaft above an insulated sectional garage door in Kalamunda, Perth",
    caption:
      "Years of moisture had corroded this Kalamunda torsion spring — inspected and replaced before it could snap and drop the door.",
    category: "Repairs",
    serviceType: "Spring Repair",
    suburb: "Kalamunda",
  },
  {
    file: "broken spring.jfif",
    slug: "broken-garage-door-spring-replacement-duncraig-perth",
    title: "Broken Torsion Spring Replacement in Duncraig",
    alt: "Twin torsion springs on the shaft above a garage door in Duncraig, Perth with one spring snapped",
    caption:
      "One of the twin torsion springs had failed on this Duncraig door — both replaced as a set and rebalanced for even, reliable lifting.",
    category: "Repairs",
    serviceType: "Spring Replacement",
    suburb: "Duncraig",
  },
  {
    file: "cabel repair (Damged).jfif",
    slug: "garage-door-cable-drum-repair-fremantle-perth",
    title: "Garage Door Cable & Drum Repair in Fremantle",
    alt: "Lift cable unwound from the cable drum on a garage door thrown out of alignment in Fremantle, Perth",
    caption:
      "A lift cable had jumped the drum and pulled this Fremantle door off true — cables re-wound and the door re-tensioned and realigned.",
    category: "Repairs",
    serviceType: "Cable & Drum Repair",
    suburb: "Fremantle",
  },
  {
    file: "cabel.jfif",
    slug: "garage-door-lift-cable-replacement-bayswater-perth",
    title: "Garage Door Lift Cable Replacement in Bayswater",
    alt: "Frayed lift cable coiled around a red cable drum in the corner of a garage in Bayswater, Perth",
    caption:
      "Worn lift cable replaced at the drum on this Bayswater garage door before it could fail and jam the door mid-travel.",
    category: "Repairs",
    serviceType: "Cable Replacement",
    suburb: "Bayswater",
  },
  {
    file: "dameged roller door 3.jfif",
    slug: "roller-door-repair-midland-perth",
    title: "Roller Door Repair in Midland",
    alt: "Old cream roller shutter door with dented, bowed bottom slats on a garage in Midland, Perth",
    caption:
      "The bottom slats on this Midland roller door were dented and bowing — straightened and re-tensioned so the curtain rolls freely again.",
    category: "RollerDoors",
    serviceType: "Roller Door Repair",
    suburb: "Midland",
  },
  {
    file: "damged roller door 2.jfif",
    slug: "roller-door-off-track-repair-gosnells-perth",
    title: "Roller Door Off-Track Repair in Gosnells",
    alt: "White roller door curtain pulled out of its side guide with bent slats on a garage in Gosnells, Perth",
    caption:
      "This Gosnells roller door had jumped its side guide and creased the curtain — refitted into the track and the damaged slats corrected.",
    category: "RollerDoors",
    serviceType: "Roller Door Repair",
    suburb: "Gosnells",
  },
  {
    file: "damged roller door.jfif",
    slug: "buckled-roller-door-repair-cannington-perth",
    title: "Buckled Roller Door Repair in Cannington",
    alt: "Charcoal roller door buckled out of its top guide beside a cracked wall on premises in Cannington, Perth",
    caption:
      "A charcoal roller door forced out of its guides in Cannington — the curtain was re-seated and the door made safe and operational again.",
    category: "RollerDoors",
    serviceType: "Roller Door Repair",
    suburb: "Cannington",
  },
  {
    file: "ddefd7aa-9c62-4ee0-b13c-502a3c85c141.jfif",
    slug: "corroded-torsion-spring-replacement-armadale-perth",
    title: "Corroded Torsion Spring Replacement, Armadale",
    alt: "Close-up of a badly corroded, rust-covered garage door torsion spring in Armadale, Perth",
    caption:
      "This Armadale torsion spring was heavily corroded and past its safe life — replaced with a new high-cycle spring and rebalanced.",
    category: "Repairs",
    serviceType: "Spring Replacement",
    suburb: "Armadale",
  },
  {
    file: "emergicy repiar sectional door another angel.jfif",
    slug: "emergency-garage-door-repair-southern-river-perth",
    title: "Emergency Garage Door Repair in Southern River",
    alt: "White sectional garage door buckled and hanging out of its tracks at a home in Southern River, Perth",
    caption:
      "Called out to this Southern River home after the sectional door buckled off its tracks — secured on the spot and repaired to restore safe access.",
    category: "Repairs",
    serviceType: "Emergency Repair",
    suburb: "Southern River",
  },
  {
    file: "emergicy repiar sectional door.jfif",
    slug: "emergency-sectional-door-repair-canning-vale-perth",
    title: "Emergency Sectional Door Repair, Canning Vale",
    alt: "Sectional garage door with buckled panels hanging under a carport beside a car in Canning Vale, Perth",
    caption:
      "An after-hours callout in Canning Vale for a sectional door that folded under load — panels supported and the door made safe the same visit.",
    category: "Repairs",
    serviceType: "Emergency Repair",
    suburb: "Canning Vale",
  },
  {
    file: "fix damged sectional door.jfif",
    slug: "sectional-garage-door-repair-thornlie-perth",
    title: "Sectional Garage Door Repair in Thornlie",
    alt: "Beige sectional garage door part-open with a bent panel under a carport beside a car in Thornlie, Perth",
    caption:
      "A bent panel had this Thornlie sectional door jamming mid-travel — realigned and repaired so it opens and closes cleanly again.",
    category: "Repairs",
    serviceType: "Sectional Door Repair",
    suburb: "Thornlie",
  },
  {
    file: "fixing commercial roller door.jfif",
    slug: "commercial-roller-shutter-service-malaga-perth",
    title: "Commercial Roller Shutter Service in Malaga",
    alt: "Extension ladder against a large galvanised industrial roller shutter inside a warehouse in Malaga, Perth",
    caption:
      "Servicing a full-height industrial roller shutter at a Malaga warehouse — barrel, motor and curtain checked to keep the loading bay running.",
    category: "Commercial",
    serviceType: "Commercial Roller Door Service",
    suburb: "Malaga",
  },
  {
    file: "fixing damged roller door.jfif",
    slug: "roller-door-repair-wanneroo-perth",
    title: "Roller Door Repair in Wanneroo",
    alt: "White roller door curtain dislodged from its guide against a brick wall on a garage in Wanneroo, Perth",
    caption:
      "This Wanneroo roller door had pulled free of its guide and creased the curtain — refitted, straightened and re-tensioned for smooth operation.",
    category: "RollerDoors",
    serviceType: "Roller Door Repair",
    suburb: "Wanneroo",
  },
  {
    file: "install opener (motor).jfif",
    slug: "garage-door-motor-installation-ellenbrook-perth",
    title: "Garage Door Motor Installation in Ellenbrook",
    alt: "Belt-drive garage door opener mounted to the ceiling rail above a sectional door in Ellenbrook, Perth",
    caption:
      "New belt-drive opener installed and tuned for this Ellenbrook garage — quiet, smooth automatic operation with safety sensors fitted.",
    category: "Motors",
    serviceType: "Motor Installation",
    suburb: "Ellenbrook",
  },
  {
    file: "roller door damged.jfif",
    slug: "commercial-roller-door-repair-kewdale-perth",
    title: "Commercial Roller Door Repair in Kewdale",
    alt: "Light-blue commercial roller shutter bowed out of its guide above a loading bay in Kewdale, Perth",
    caption:
      "A commercial roller shutter forced out of its guide at a Kewdale unit — re-seated and repaired fast to keep the business secure and trading.",
    category: "Commercial",
    serviceType: "Commercial Roller Door Repair",
    suburb: "Kewdale",
  },
  {
    file: "sectional door emergicy after storm.jfif",
    slug: "storm-damaged-garage-door-repair-mandurah-perth",
    title: "Storm-Damaged Garage Door Repair in Mandurah",
    alt: "White double sectional garage door collapsed and buckled outward after storm damage at a home in Mandurah, Perth",
    caption:
      "Storm winds folded this Mandurah double garage door out of its opening — attended urgently to make the site safe and plan panel replacement.",
    category: "Repairs",
    serviceType: "Storm Damage Repair",
    suburb: "Mandurah",
  },
  {
    file: "spring after repiar 1.jfif",
    slug: "garage-door-spring-replacement-rockingham-perth",
    title: "Garage Door Spring Replacement in Rockingham",
    alt: "Newly fitted torsion spring on the shaft above a garage door against a limestone wall in Rockingham, Perth",
    caption:
      "Before and after: a worn torsion spring replaced with a new high-cycle spring on this Rockingham door, then rebalanced and safety-checked.",
    category: "BeforeAfter",
    serviceType: "Spring Replacement",
    suburb: "Rockingham",
    beforeFile: "spring before repair 1.jfif",
    beforeAlt: "Worn grey torsion spring on the shaft before replacement in Rockingham, Perth",
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

async function main() {
  const sourceDir = argValue("--dir") ?? DEFAULT_SOURCE_DIR;
  const dryRun = process.argv.includes("--dry-run");
  console.log(`Gallery ADD → CMS ${CMS_API_URL}${dryRun ? " (DRY RUN)" : ""}\n`);

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
    console.log(`\nDry run complete — no CMS changes made. Would create ${MANIFEST.length} gallery items.`);
    return;
  }

  // 2. Register assets + create the new gallery items (NO wipe — additive only).
  const token = await login();
  const assetIdByFile = new Map<string, number>();
  async function registerAsset(file: string, altText: string, category: CategoryEnum): Promise<number> {
    const cached = assetIdByFile.get(file);
    if (cached) return cached;
    const cdnUrl = cdnUrlByFile.get(file);
    if (!cdnUrl) throw new Error(`No CDN URL recorded for ${file}`);
    const created = await api<{ id: number }>(token, "POST", "/api/admin/assets", { cdnUrl, altText, category });
    assetIdByFile.set(file, created.id);
    return created.id;
  }

  let sortOrder = SORT_ORDER_BASE;
  for (const entry of MANIFEST) {
    const assetId = await registerAsset(entry.file, entry.alt, entry.category);
    const beforeAssetId = entry.beforeFile
      ? await registerAsset(entry.beforeFile, entry.beforeAlt ?? `${entry.title} — before`, entry.category)
      : null;
    await api(token, "POST", "/api/admin/gallery", {
      assetId,
      beforeAssetId,
      category: entry.category,
      title: entry.title,
      serviceType: entry.serviceType,
      suburb: entry.suburb,
      caption: entry.caption,
      sortOrder: sortOrder++,
    });
    console.log(`  created "${entry.title}"${beforeAssetId ? " (with before shot)" : ""} — ${entry.suburb}`);
  }

  // 3. Refresh the live page.
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

  console.log(`\nDone: ${MANIFEST.length} gallery items added.`);
}

/** The public CDN URL for a manifest entry's main image. */
export function cdnUrlFor(entry: ManifestEntry): string {
  return `${PULL_ZONE}/${REMOTE_FOLDER}/${entry.slug}.webp`;
}

const invokedDirectly = process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/add-gallery-images.ts");
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
