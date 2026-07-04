/**
 * One-shot uploader for the Capital motor product renders → Bunny CDN.
 *
 * Takes the five raw renders (default: the local Downloads folder they were delivered to),
 * renames them to SEO-friendly kebab filenames, uploads them to the shared `jadara-hub`
 * storage zone under `capital-garage-door/motors/`, and generates + uploads a 1200×630
 * OG crop of the dark hero shot for social cards. Re-runnable: Bunny PUT overwrites.
 *
 * Run it:
 *   npx tsx scripts/upload-motor-images.ts [--dir "C:\path\to\renders"]
 *
 * Config via env:
 *   BUNNY_STORAGE_KEY   Bunny storage-zone password. Falls back to reading
 *                       AssetStorage.Bunny.ApiKey from the CMS repo's appsettings.json
 *                       (dev machine only). Never logged, never written anywhere.
 *   MOTOR_IMAGES_DIR    Source folder (same as --dir).
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const STORAGE_HOST = "https://storage.bunnycdn.com";
const STORAGE_ZONE = "jadara-hub";
const REMOTE_FOLDER = "capital-garage-door/motors";
const PULL_ZONE = "https://jadara-hub.b-cdn.net";

const CMS_APPSETTINGS =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.json";

const DEFAULT_SOURCE_DIR = "C:\\Users\\Mohammad swedan\\Downloads\\motor imagges";

/**
 * Raw render → SEO filename. Matching is on a stable substring of the delivered
 * filename so trailing punctuation/spacing differences don't break the run.
 */
const RENAMES: Array<{ match: string; out: string }> = [
  { match: "Dark premium hero shot", out: "capital-garage-door-motor-hero-dark.png" },
  { match: "Motor-Installed", out: "capital-garage-door-motor-how-it-works.png" },
  { match: "Installed-Modern", out: "capital-garage-door-motor-installed-garage.png" },
  { match: "Studio white studio shot", out: "capital-garage-door-motor-studio.png" },
  { match: "motor with accessories", out: "capital-garage-door-motor-accessories-kit.png" },
];

const OG_SOURCE = "capital-garage-door-motor-hero-dark.png";
const OG_OUT = "capital-garage-door-motors-og-1200x630.jpg";

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
  // Prefer real JSON, but fall back to a scoped regex in case the file ever
  // carries comment-style keys that break strict parsing.
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
  const sourceDir = argValue("--dir") ?? process.env.MOTOR_IMAGES_DIR ?? DEFAULT_SOURCE_DIR;
  const key = await resolveStorageKey();

  const files = await readdir(sourceDir);
  console.log(`Uploading motor renders from ${sourceDir}\n`);

  let heroBuffer: Buffer | null = null;

  for (const { match, out } of RENAMES) {
    const source = files.find((f) => f.toLowerCase().includes(match.toLowerCase()));
    if (!source) {
      console.log(`  ! no file matching "${match}" — skipped ${out}`);
      continue;
    }
    const buffer = await readFile(path.join(sourceDir, source));
    if (out === OG_SOURCE) heroBuffer = buffer;

    const meta = await sharp(buffer).metadata();
    const url = await upload(key, out, buffer, "image/png");
    console.log(`  + ${url}  (${meta.width}x${meta.height}, ${Math.round(buffer.length / 1024)}KB)`);
  }

  if (heroBuffer) {
    // 1200×630 OG card from the dark hero render; "attention" keeps the lit
    // motor centred in the crop.
    const og = await sharp(heroBuffer)
      .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    const url = await upload(key, OG_OUT, og, "image/jpeg");
    console.log(`  + ${url}  (1200x630 OG card, ${Math.round(og.length / 1024)}KB)`);
  } else {
    console.log(`  ! hero render missing — OG card not generated`);
  }

  console.log("\n✓ Done.");
}

main().catch((err) => {
  console.error(`✗ Motor image upload failed: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
