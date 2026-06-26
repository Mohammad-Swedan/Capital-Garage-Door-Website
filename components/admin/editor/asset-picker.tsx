"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UploadCloud, Loader2, TriangleAlert, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { AssetSelection } from "./editable-context";

/**
 * The Asset Picker dialog (plan §B.3e). Two tabs:
 * - Upload: file → `POST /admin/api/upload` → `{ id, cdnUrl }`.
 * - Library: `GET /admin/api/assets` (proxy → `adminRequest`). Degrades gracefully
 *   to "no assets" if the endpoint is unavailable.
 *
 * It is *imperatively* driven: `useAssetPicker()` returns an `open()` that resolves
 * with the chosen asset (or null if cancelled). `<AssetPickerHost>` renders the
 * actual dialog and must be mounted once inside the editor.
 *
 * Alt-text enforcement (Agent 5): screen readers and search engines rely on image
 * alt text, so the picker now nudges authors to provide it — an editable alt field
 * on upload (seeded from a tidied filename) and a gentle warning when a chosen
 * library image has none. It warns, it never hard-blocks.
 */

interface PendingResolver {
  resolve: (value: AssetSelection | null) => void;
}

interface LibraryAsset {
  id: number;
  cdnUrl: string;
  altText?: string | null;
}

export interface AssetPickerController {
  open: () => Promise<AssetSelection | null>;
}

export function useAssetPicker(): {
  controller: AssetPickerController;
  hostProps: AssetPickerHostProps;
} {
  const [openState, setOpenState] = useState(false);
  const resolverRef = useRef<PendingResolver | null>(null);

  const open = useCallback(() => {
    return new Promise<AssetSelection | null>((resolve) => {
      resolverRef.current = { resolve };
      setOpenState(true);
    });
  }, []);

  const settle = useCallback((value: AssetSelection | null) => {
    resolverRef.current?.resolve(value);
    resolverRef.current = null;
    setOpenState(false);
  }, []);

  return {
    controller: { open },
    hostProps: { open: openState, onSettle: settle },
  };
}

export interface AssetPickerHostProps {
  open: boolean;
  onSettle: (value: AssetSelection | null) => void;
}

export function AssetPickerHost({ open, onSettle }: AssetPickerHostProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onSettle(null);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose an image</DialogTitle>
          <DialogDescription>
            Upload a new image or pick one from the library. Add alt text so it&apos;s accessible.
          </DialogDescription>
        </DialogHeader>
        {open && <PickerBody onSettle={onSettle} />}
      </DialogContent>
    </Dialog>
  );
}

function PickerBody({ onSettle }: { onSettle: (v: AssetSelection | null) => void }) {
  return (
    <Tabs defaultValue="upload" className="mt-2">
      <TabsList>
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="library">Library</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <UploadTab onSettle={onSettle} />
      </TabsContent>
      <TabsContent value="library">
        <LibraryTab onSettle={onSettle} />
      </TabsContent>
    </Tabs>
  );
}

/** "hero-image_v2.JPG" → "Hero image v2" — a friendlier alt-text seed than the raw filename. */
function altFromFilename(name: string): string {
  const base = name.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]+/g, " ").trim();
  if (!base) return "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function UploadTab({ onSettle }: { onSettle: (v: AssetSelection | null) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");

  // Object-URL preview for the staged file, derived from `file` (no state →
  // no cascading renders). The cleanup effect revokes the previous URL when the
  // file changes or on unmount, so we never leak blob: handles.
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
      // Author-provided alt text (falls back to the filename so it's never blank
      // server-side, but the UI nudges them to write something meaningful).
      form.append("altText", altText.trim() || altFromFilename(file.name) || file.name);
      const res = await fetch("/admin/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = (await res.json()) as { id: number; cdnUrl: string };
      onSettle({ assetId: data.id, url: data.cdnUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [file, altText, onSettle]);

  const altMissing = !altText.trim();

  return (
    <div className="mt-3 space-y-3">
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
        <div className="space-y-1.5">
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
        </div>
      )}

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
      )}

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
            {uploading ? "Uploading…" : "Use this image"}
          </button>
        </div>
      )}
    </div>
  );
}

function LibraryTab({ onSettle }: { onSettle: (v: AssetSelection | null) => void }) {
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // A staged pick so we can warn before settling when the library image lacks alt text.
  const [pending, setPending] = useState<LibraryAsset | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/admin/api/assets")
      .then(async (res) => {
        if (!res.ok) throw new Error(`Library unavailable (${res.status})`);
        return res.json();
      })
      .then((data: { items?: LibraryAsset[] } | LibraryAsset[]) => {
        if (cancelled) return;
        const items = Array.isArray(data) ? data : (data.items ?? []);
        setAssets(items.filter((a) => a && a.cdnUrl));
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Could not load the library");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const choose = useCallback(
    (asset: LibraryAsset) => {
      // Warn (don't block) when the chosen image has no alt text on record.
      if (!asset.altText || !asset.altText.trim()) {
        setPending(asset);
        return;
      }
      onSettle({ assetId: asset.id, url: asset.cdnUrl });
    },
    [onSettle],
  );

  const pendingPreview = useMemo(
    () => assets.find((a) => a.id === pending?.id) ?? pending,
    [assets, pending],
  );

  if (loading) {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading library…
      </div>
    );
  }

  if (error || assets.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        {error ?? "No images in the library yet — upload one from the Upload tab."}
      </div>
    );
  }

  // Confirmation step for an alt-less library image.
  if (pending && pendingPreview) {
    return (
      <div className="mt-3 space-y-3">
        <div className="flex items-start gap-3 rounded-xl border border-amber-400/60 bg-amber-50 p-3 dark:bg-amber-500/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pendingPreview.cdnUrl}
            alt=""
            className="size-16 shrink-0 rounded-lg border border-border object-cover"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-medium text-amber-800 dark:text-amber-300">
              <TriangleAlert className="size-4 shrink-0" /> This image has no alt text
            </p>
            <p className="mt-0.5 text-xs text-amber-700/90 dark:text-amber-300/80">
              Alt text helps screen readers and SEO. You can use it anyway, or pick another image
              that already has a description.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setPending(null)}
            className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Pick another
          </button>
          <button
            type="button"
            onClick={() => onSettle({ assetId: pending.id, url: pending.cdnUrl })}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-card outline-none transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ImageIcon className="size-4" /> Use anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto">
      {assets.map((asset) => {
        const missingAlt = !asset.altText || !asset.altText.trim();
        return (
          <button
            key={asset.id}
            type="button"
            onClick={() => choose(asset)}
            title={missingAlt ? "No alt text on this image" : (asset.altText ?? undefined)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted outline-none transition-colors hover:border-primary/60 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.cdnUrl}
              alt={asset.altText ?? ""}
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
            {missingAlt && (
              <span
                className="absolute right-1 top-1 inline-flex size-5 items-center justify-center rounded-full bg-amber-500/90 text-white shadow-card"
                aria-hidden
              >
                <TriangleAlert className="size-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
