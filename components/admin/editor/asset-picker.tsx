"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, TriangleAlert, ImageIcon, ImageOff, Search, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ASSET_CATEGORY_FILTERS, assetCategoryLabel } from "@/components/admin/asset-categories";
import { AssetUploadForm } from "@/components/admin/media/asset-upload-form";
import type { AssetSelection } from "./editable-context";

/**
 * The Asset Picker dialog. Two tabs:
 * - Upload: shared `AssetUploadForm` → `POST /admin/api/upload` (lands in the categorised library).
 * - Library: `GET /admin/api/assets` with category filter, alt-text search, and pagination.
 *
 * It is *imperatively* driven: `useAssetPicker()` returns an `open()` that resolves with the chosen
 * asset (or null if cancelled). `<AssetPickerHost>` renders the dialog and must be mounted once.
 * The resolve shape (`AssetSelection { assetId, url }`) is unchanged, so no template/serializer is
 * affected by this redesign.
 */

interface PendingResolver {
  resolve: (value: AssetSelection | null) => void;
}

interface LibraryAsset {
  id: number;
  cdnUrl: string;
  altText?: string | null;
  category?: string | null;
}

interface AssetPage {
  items?: LibraryAsset[];
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
}

const PAGE_SIZE = 24;

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
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose an image</DialogTitle>
          <DialogDescription>
            Pick one from the library or upload a new image. Add alt text so it&apos;s accessible.
          </DialogDescription>
        </DialogHeader>
        {open && <PickerBody onSettle={onSettle} />}
      </DialogContent>
    </Dialog>
  );
}

function PickerBody({ onSettle }: { onSettle: (v: AssetSelection | null) => void }) {
  return (
    <Tabs defaultValue="library" className="mt-2">
      <TabsList>
        <TabsTrigger value="library">Library</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
      </TabsList>
      <TabsContent value="library">
        <LibraryTab onSettle={onSettle} />
      </TabsContent>
      <TabsContent value="upload">
        <div className="mt-3">
          <AssetUploadForm onUploaded={(a) => onSettle({ assetId: a.id, url: a.cdnUrl })} />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function LibraryTab({ onSettle }: { onSettle: (v: AssetSelection | null) => void }) {
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  // A staged pick so we can warn before settling when the library image lacks alt text.
  const [pending, setPending] = useState<LibraryAsset | null>(null);
  // Ids whose thumbnail failed to load (e.g. an asset pointing at a removed file).
  const [broken, setBroken] = useState<Set<number>>(new Set());

  // Debounce the search box so we don't refetch on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchPage = useCallback(
    async (pageNumber: number, append: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ pageNumber: String(pageNumber), pageSize: String(PAGE_SIZE) });
        if (category) qs.set("category", category);
        if (search) qs.set("search", search);
        const res = await fetch(`/admin/api/assets?${qs.toString()}`);
        if (!res.ok) throw new Error(`Library unavailable (${res.status})`);
        const data = (await res.json()) as AssetPage | LibraryAsset[];
        const items = Array.isArray(data) ? data : (data.items ?? []);
        const clean = items.filter((a) => a && a.cdnUrl);
        setAssets((prev) => (append ? [...prev, ...clean] : clean));
        setTotalPages(Array.isArray(data) ? 1 : (data.totalPages ?? 1));
        setPage(pageNumber);
      } catch (e) {
        if (!append) setAssets([]);
        setError(e instanceof Error ? e.message : "Could not load the library");
      } finally {
        setLoading(false);
      }
    },
    [category, search],
  );

  // (Re)load from page 1 whenever the filter or search changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch when category/search deps change
    void fetchPage(1, false);
  }, [fetchPage]);

  const choose = useCallback(
    (asset: LibraryAsset) => {
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
    <div className="mt-3 space-y-3">
      <div className="flex flex-col gap-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by alt text…"
            className="w-full rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {ASSET_CATEGORY_FILTERS.map((c) => (
            <button
              key={c.value || "all"}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === c.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          {error}
        </div>
      ) : assets.length === 0 && !loading ? (
        <div className="rounded-lg border border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          No images here yet — try another category or upload one from the Upload tab.
        </div>
      ) : (
        <>
          <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
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
                  {broken.has(asset.id) ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-muted text-muted-foreground">
                      <ImageOff className="size-5" />
                      <span className="text-[9px]">Unavailable</span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.cdnUrl}
                      alt={asset.altText ?? ""}
                      onError={() =>
                        setBroken((s) => {
                          const n = new Set(s);
                          n.add(asset.id);
                          return n;
                        })
                      }
                      className="absolute inset-0 size-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/65 to-transparent px-1.5 pt-4 pb-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {assetCategoryLabel(asset.category)}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-opacity group-hover:bg-primary/10 group-hover:opacity-100">
                    <Check className="size-6 text-primary drop-shadow" />
                  </span>
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

          <div className="flex items-center justify-center pt-1">
            {loading ? (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading…
              </span>
            ) : page < totalPages ? (
              <button
                type="button"
                onClick={() => void fetchPage(page + 1, true)}
                className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Load more
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
