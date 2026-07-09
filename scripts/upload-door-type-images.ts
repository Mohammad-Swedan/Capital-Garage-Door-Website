/**
 * One-shot uploader for the door-type page imagery → Bunny CDN.
 *
 * Takes the door-type renders/photos delivered to the local Downloads folder
 * (sectional / roller / tilt / custom subfolders), compresses each to a
 * max-1920px WebP with an SEO-friendly kebab filename, and uploads them to the
 * shared `jadara-hub` storage zone under `capital-garage-door/door-types/`.
 * Re-runnable: Bunny PUT overwrites.
 *
 * Deliberately skipped: "roller door 1-clean.png" — the technician's shirt in
 * that render reads "Perth Garage Doors" (not our brand), so it must never be
 * published.
 *
 * Run it:
 *   npx tsx scripts/upload-door-type-images.ts [--dir "C:\path\to\doors types"]
 *
 * Config via env:
 *   BUNNY_STORAGE_KEY   Bunny storage-zone password. Falls back to reading
 *                       AssetStorage.Bunny.ApiKey from the CMS repo's appsettings.json
 *                       (dev machine only). Never logged, never written anywhere.
 *   DOOR_IMAGES_DIR     Source folder (same as --dir).
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const STORAGE_HOST = "https://storage.bunnycdn.com";
const STORAGE_ZONE = "jadara-hub";
const REMOTE_FOLDER = "capital-garage-door/door-types";
const PULL_ZONE = "https://jadara-hub.b-cdn.net";

const CMS_APPSETTINGS =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.json";

const DEFAULT_SOURCE_DIR = "C:\\Users\\Mohammad swedan\\Downloads\\doors types";

/** Source file (relative to the source dir) → SEO output name. */
const FILES: Array<{ source: string; out: string }> = [
  { source: "Sectional doors/1-clean.png", out: "sectional-garage-door-perth-modern-home.webp" },
  { source: "Sectional doors/2-clean.png", out: "sectional-garage-door-installation-perth.webp" },
  { source: "roller doors/roller door 2-clean.png", out: "roller-doors-perth-colorbond-double.webp" },
  { source: "roller doors/roller door 3-clean.png", out: "roller-garage-door-open-perth-home.webp" },
  {
    source: "roller doors/safe roller door indestrial door-clean.png",
    out: "commercial-roller-shutter-door-perth-warehouse.webp",
  },
  { source: "tilt door/1-clean.png", out: "tilt-garage-door-perth-modern-home.webp" },
  { source: "tilt door/2-clean.png", out: "tilt-door-counterweight-arms-perth-home.webp" },
  { source: "Custom door/1-clean.png", out: "custom-garage-door-perth-timber-batten-coastal.webp" },
  { source: "Custom door/2-clean.png", out: "custom-glass-garage-door-installation-perth.webp" },
  { source: "Custom door/3-clean.png", out: "custom-timber-look-garage-door-perth-home.webp" },
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
    throw new Error(
      "BUNNY_STORAGE_KEY is not set and the CMS appsettings.json could not be read. Set the env var and re-run.",
    );
  });
  try {
    const parsed = JSON.parse(raw) as {
      AssetStorage?: { Bunny?: { ApiKey?: string } };
    };
    const key = parsed.AssetStorage?.Bunny?.ApiKey;
    if (key) return key;
  } catch {
    /* fall through to regex */
  }
  const match = raw.match(/"Bunny"\s*:\s*\{[^}]*?"ApiKey"\s*:\s*"([^"]+)"/);
  if (match?.[1]) return match[1];
  throw new Error("Could not resolve the Bunny storage key (env BUNNY_STORAGE_KEY or CMS appsettings.json).");
}

async function upload(key: string, remoteName: string, body: Buffer, contentType: string): Promise<string> {
  const url = `${STORAGE_HOST}/${STORAGE_ZONE}/${REMOTE_FOLDER}/${remoteName}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { AccessKey: key, "Content-Type": contentType },
    body: new Uint8Array(body),
  });
  if (!res.ok) {
    throw new Error(`Upload of ${remoteName} failed (${res.status} ${res.statusText}).`);
  }
  return `${PULL_ZONE}/${REMOTE_FOLDER}/${remoteName}`;
}

async function main() {
  const sourceDir = argValue("--dir") ?? process.env.DOOR_IMAGES_DIR ?? DEFAULT_SOURCE_DIR;
  const key = await resolveStorageKey();

  console.log(`Uploading door-type images from ${sourceDir}\n`);

  for (const { source, out } of FILES) {
    const buffer = await readFile(path.join(sourceDir, source)).catch(() => null);
    if (!buffer) {
      console.log(`  ! missing source "${source}" — skipped ${out}`);
      continue;
    }
    const webp = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    const url = await upload(key, out, webp, "image/webp");
    console.log(`  + ${url}  (${Math.round(webp.length / 1024)}KB from ${Math.round(buffer.length / 1024 / 1024)}MB)`);
  }

  console.log("\n✓ Done.");
}

main().catch((err) => {
  console.error(`✗ Door image upload failed: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
