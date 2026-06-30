"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { UploadCloud, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSET_CATEGORIES } from "@/components/admin/asset-categories";

/**
 * Shared upload form: dropzone → alt text → category → `POST /admin/api/upload`.
 * Every upload lands in the categorised media library, so this is reused by both the editor's
 * Asset Picker (Upload tab) and the standalone Media library upload dialog.
 */
export interface UploadedAsset {
  id: number;
  cdnUrl: string;
  altText: string;
  category: string;
}

/** "hero-image_v2.JPG" → "Hero image v2" — a friendlier alt-text seed than the raw filename. */
function altFromFilename(name: string): string {
  const base = name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();
  if (!base) return "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function AssetUploadForm({
  onUploaded,
  defaultCategory = "Uncategorized",
  submitLabel = "Use this image",
}: {
  onUploaded: (asset: UploadedAsset) => void;
  defaultCategory?: string;
  submitLabel?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [category, setCategory] = useState(defaultCategory);

  // Object-URL preview derived from `file` (no extra state). Revoked on change/unmount.
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const stage = useCallback((f: File) => {
    setError(null);
    setFile(f);
    setAltText((prev) => (prev.trim() ? prev : altFromFilename(f.name)));
  }, []);

  const upload = useCallback(async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("altText", altText.trim() || altFromFilename(file.name) || file.name);
      form.append("category", category);
      const res = await fetch("/admin/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = (await res.json()) as { id: number; cdnUrl: string; altText?: string; category?: string };
      onUploaded({
        id: data.id,
        cdnUrl: data.cdnUrl,
        altText: data.altText ?? altText,
        category: data.category ?? category,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [file, altText, category, onUploaded]);

  const altMissing = !altText.trim();

  return (
    <div className="space-y-3">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) stage(f);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary/40",
          dragOver && "border-primary/60 bg-primary/5",
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="max-h-32 w-auto rounded-lg object-contain shadow-card" />
        ) : (
          <UploadCloud className="size-6 text-primary" />
        )}
        <span className="font-medium text-foreground">
          {file ? file.name : "Drop an image or click to browse"}
        </span>
        <span className="text-xs">{file ? "Click to choose a different image" : "PNG, JPG or WebP"}</span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) stage(f);
          }}
        />
      </label>

      {file && (
        <>
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              Alt text
              <span className="text-xs font-normal text-muted-foreground">· describes the image for screen readers &amp; SEO</span>
            </span>
            <input
              autoFocus
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Technician installing a sectional garage door"
              aria-invalid={altMissing}
              className={cn(
                "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                altMissing ? "border-amber-400/70" : "border-border",
              )}
            />
          </label>
          {altMissing && (
            <p className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
              No alt text yet — recommended for accessibility and SEO. You can still upload without it.
            </p>
          )}

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-foreground">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {ASSET_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

      {file && (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => {
              setFile(null);
              setAltText("");
            }}
            className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => void upload()}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-card outline-none transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            {uploading ? "Uploading…" : submitLabel}
          </button>
        </div>
      )}
    </div>
  );
}
