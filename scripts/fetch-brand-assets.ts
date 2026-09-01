/**
 * Fetch brand logos / product images from their official sources, process them for the site
 * (logos: flatten-to-white → trim → ≤800px → webp; products: ≤1600px → webp) and upload to the
 * Bunny CDN under capital-garage-door/brands/. Entries + provenance live in
 * scripts/brand-assets-manifest.ts.
 *
 *   npx tsx scripts/fetch-brand-assets.ts --preview <dir>   # process + write to dir (webp + png
 *                                                           # eyeball copy), NO upload
 *   npx tsx scripts/fetch-brand-assets.ts --upload          # process + PUT + print CDN URLs
 *   … --only <brand-slug>     # limit to one brand
 *   … --kind logo|product     # limit to one kind
 *
 * Quality gates per logo: mean luminance > 250 fails the entry (white-on-white would be invisible
 * on BrandMark's white card); width < 200px or aspect > 6:1 warns (soft at the 128px plate /
 * illegible at the 36px nav mark). A failed entry doesn't stop the run; the process exits 1.
 *
 * Re-running --upload PUT-overwrites, but Bunny's pull zone caches — to REPLACE an already-live
 * asset use a NEW filename (e.g. "<slug>-2.webp") or purge the file in the Bunny panel.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp, { type Sharp } from "sharp";
import { BRAND_ASSETS, type BrandAssetEntry } from "./brand-assets-manifest";
import { BRAND_ENTITIES } from "../content/brands/entities";

const STORAGE_HOST = "https://storage.bunnycdn.com";
const STORAGE_ZONE = "jadara-hub";
const REMOTE_FOLDER = "capital-garage-door/brands";
const PULL_ZONE = "https://jadara-hub.b-cdn.net";

const CMS_APPSETTINGS =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.json";

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
    const parsed = JSON.parse(raw) as { AssetStorage?: { Bunny?: { ApiKey?: string } } };
    const key = parsed.AssetStorage?.Bunny?.ApiKey;
    if (key) return key;
  } catch {
    /* fall through to regex */
  }
  const match = raw.match(/"Bunny"\s*:\s*\{[^}]*?"ApiKey"\s*:\s*"([^"]+)"/);
  if (match?.[1]) return match[1];
  throw new Error("Could not resolve the Bunny storage key (env BUNNY_STORAGE_KEY or CMS appsettings.json).");
}

async function upload(key: string, remoteName: string, body: Buffer): Promise<string> {
  const url = `${STORAGE_HOST}/${STORAGE_ZONE}/${REMOTE_FOLDER}/${remoteName}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { AccessKey: key, "Content-Type": "image/webp" },
    body: new Uint8Array(body),
  });
  if (!res.ok) throw new Error(`Upload of ${remoteName} failed (${res.status} ${res.statusText}).`);
  return `${PULL_ZONE}/${REMOTE_FOLDER}/${remoteName}`;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

async function fetchSource(entry: BrandAssetEntry): Promise<Buffer> {
  if (entry.localFile) return Buffer.from(await readFile(entry.localFile));
  const res = await fetch(entry.sourceUrl, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*;q=0.8" },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(
      `fetch ${entry.sourceUrl} → HTTP ${res.status}. If the site blocks scripts, download manually and set localFile.`,
    );
  }
  return Buffer.from(await res.arrayBuffer());
}

const isSvg = (buf: Buffer) => {
  const head = buf.subarray(0, 500).toString("utf8").trimStart().toLowerCase();
  return head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"));
};

/** SVGs rasterise at 72 DPI by default — re-instantiate with a density that lands the target width sharp. */
async function inputFor(buf: Buffer, targetWidth: number): Promise<Sharp> {
  // failOn "none": some official/Commons files are slightly malformed (e.g. odd JPEG SOS
  // markers) and libvips aborts on them by default; decode best-effort — the preview eyeball
  // and quality gates still guard the output.
  if (!isSvg(buf)) return sharp(buf, { failOn: "none" });
  const meta = await sharp(buf).metadata();
  const intrinsic = meta.width ?? targetWidth;
  const density = Math.min(2400, Math.max(72, Math.ceil((72 * targetWidth) / intrinsic)));
  return sharp(buf, { density, failOn: "none" });
};

interface Processed {
  webp: Buffer;
  width: number;
  height: number;
  warnings: string[];
}

async function processEntry(entry: BrandAssetEntry, source: Buffer): Promise<Processed> {
  const maxWidth = entry.maxWidth ?? (entry.kind === "logo" ? 800 : 1600);

  // Pass 1: rasterise (SVG at a sharp density) and flatten onto white — sharp doesn't honour
  // call order between flatten/trim/resize, so trimming happens in a second, separate pipeline
  // where the borders are guaranteed to already be white.
  const flattened = await (await inputFor(source, maxWidth))
    .flatten({ background: "#ffffff" })
    .png()
    .toBuffer();

  // Pass 2: trim the white borders (logos) and bound the size.
  let img = sharp(flattened);
  const wantTrim = entry.trim ?? entry.kind === "logo";
  if (wantTrim) img = img.trim({ background: "#ffffff", threshold: 20 });
  img =
    entry.kind === "logo"
      ? img.resize({ width: maxWidth, height: maxWidth, fit: "inside", withoutEnlargement: true })
      : img.resize({ width: maxWidth, withoutEnlargement: true });

  const webp = await img.webp({ quality: 80 }).toBuffer();
  const out = sharp(webp);
  const [outMeta, stats] = await Promise.all([out.metadata(), out.stats()]);
  const width = outMeta.width ?? 0;
  const height = outMeta.height ?? 0;

  const warnings: string[] = [];
  if (entry.kind === "logo") {
    const luminance =
      stats.channels.slice(0, 3).reduce((sum, c) => sum + c.mean, 0) / Math.min(3, stats.channels.length);
    if (luminance > 250) throw new Error(`mean luminance ${luminance.toFixed(1)} — white-on-white, invisible on the card`);
    if (width < 200) warnings.push(`only ${width}px wide — soft at the 128px plate on 2x screens`);
    if (width / Math.max(1, height) > 6) warnings.push(`aspect ${(width / height).toFixed(1)}:1 — illegible at the 36px nav mark`);
  }
  return { webp, width, height, warnings };
}

const argValue = (flag: string): string | undefined => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

(async () => {
  const previewDir = argValue("--preview");
  const doUpload = process.argv.includes("--upload");
  const only = argValue("--only");
  const kindFilter = argValue("--kind");
  if (!previewDir && !doUpload) {
    console.error("Pass --preview <dir> or --upload.");
    process.exit(1);
  }

  const knownSlugs = new Set(BRAND_ENTITIES.map((e) => e.slug));
  const entries = BRAND_ASSETS.filter(
    (e) => (!only || e.brand === only) && (!kindFilter || e.kind === kindFilter),
  );
  if (entries.length === 0) {
    console.error("No manifest entries match. Fill scripts/brand-assets-manifest.ts first.");
    process.exit(1);
  }

  const key = doUpload ? await resolveStorageKey() : "";
  if (previewDir) await mkdir(previewDir, { recursive: true });

  let failed = 0;
  for (const entry of entries) {
    const label = `${entry.brand} ${entry.kind} (${entry.out})`;
    try {
      if (!knownSlugs.has(entry.brand)) throw new Error(`unknown entity slug "${entry.brand}"`);
      if (!/^[a-z0-9-]+(\.webp)$/.test(entry.out)) throw new Error(`out "${entry.out}" must be kebab-case .webp`);
      if (!entry.localFile && !/^https:\/\//.test(entry.sourceUrl)) throw new Error("sourceUrl must be https");

      const source = await fetchSource(entry);
      const { webp, width, height, warnings } = await processEntry(entry, source);
      for (const w of warnings) console.warn(`  ⚠ ${label}: ${w}`);

      if (previewDir) {
        await writeFile(join(previewDir, entry.out), webp);
        await writeFile(join(previewDir, entry.out.replace(/\.webp$/, ".png")), await sharp(webp).png().toBuffer());
        console.log(`✓ ${label} → preview ${width}×${height}, ${(webp.length / 1024).toFixed(1)} KB`);
      }
      if (doUpload) {
        const url = await upload(key, entry.out, webp);
        console.log(`✓ ${label} → ${url} (${width}×${height}, ${(webp.length / 1024).toFixed(1)} KB)`);
        if (entry.kind === "logo") {
          console.log(`    logo: \`\${BRAND_LOGO_CDN}/${entry.out}\`,`);
        } else {
          console.log(
            `    productImage: { src: "${url}", width: ${width}, height: ${height}, alt: ${JSON.stringify(entry.alt ?? "")},${entry.caption ? ` caption: ${JSON.stringify(entry.caption)},` : ""} source: ${JSON.stringify(`${entry.sourcePage} — ${entry.licence}`)} },`,
          );
        }
      }
    } catch (err) {
      failed++;
      console.error(`✗ ${label}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`\n${entries.length - failed}/${entries.length} processed${doUpload ? " + uploaded" : ""}.`);
  if (failed) process.exit(1);
})();
