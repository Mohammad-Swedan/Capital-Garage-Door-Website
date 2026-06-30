"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Loader2, Search, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { ASSET_CATEGORY_FILTERS } from "@/components/admin/asset-categories";
import { deleteAssetAction } from "@/app/admin/asset-actions";
import { cn } from "@/lib/utils";
import { MediaAssetCard, type MediaAsset } from "./media-asset-card";
import { AssetEditDialog } from "./asset-edit-dialog";
import { MediaUploadDialog } from "./media-upload-dialog";

interface AssetPage {
  items?: MediaAsset[];
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
}

const PAGE_SIZE = 24;

/**
 * The media library manager: a category-filtered, searchable, paginated grid of every uploaded
 * asset, with upload / edit (alt + category) / delete. Fully client-side — it reads the library
 * through the `/admin/api/assets` proxy and mutates via server actions, refetching after each change.
 */
export function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchPage = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ pageNumber: String(pageNumber), pageSize: String(PAGE_SIZE) });
        if (category) qs.set("category", category);
        if (search) qs.set("search", search);
        const res = await fetch(`/admin/api/assets?${qs.toString()}`);
        if (!res.ok) throw new Error(`Could not load the library (${res.status})`);
        const data = (await res.json()) as AssetPage;
        setAssets((data.items ?? []).filter((a) => a && a.cdnUrl));
        setTotalPages(data.totalPages ?? 1);
        setTotalCount(data.totalCount ?? 0);
        setPage(data.pageNumber ?? pageNumber);
      } catch (e) {
        setAssets([]);
        setError(e instanceof Error ? e.message : "Could not load the library");
      } finally {
        setLoading(false);
      }
    },
    [category, search],
  );

  // Reload from page 1 whenever the filter or search changes (and on mount).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch when category/search deps change
    void fetchPage(1);
  }, [fetchPage]);

  async function handleDelete(asset: MediaAsset) {
    if (!window.confirm(`Delete "${asset.altText?.trim() || `image #${asset.id}`}"? This can't be undone.`)) return;
    setActionError(null);
    const res = await deleteAssetAction(asset.id);
    if (res.ok) {
      // If we just removed the only item on a page past the first, step back a page.
      void fetchPage(assets.length === 1 && page > 1 ? page - 1 : page);
    } else {
      setActionError(res.errors?.[0]?.description ?? "Could not delete this image.");
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media"
        description={`${totalCount} image${totalCount === 1 ? "" : "s"} in the library`}
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Plus className="size-4" />
            Upload
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by alt text…"
            className="w-full rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ASSET_CATEGORY_FILTERS.map((c) => (
            <button
              key={c.value || "all"}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
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

      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {error ? (
        <div className="rounded-xl border border-border bg-muted/20 p-10 text-center text-sm text-muted-foreground">
          {error} — is the CMS API running?
        </div>
      ) : loading && assets.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading library…
        </div>
      ) : assets.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/10 p-12 text-center">
          <ImageOff className="size-7 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {search || category ? "No images match this filter" : "No images yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {search || category ? "Try a different category or search." : "Upload your first image to start the library."}
            </p>
          </div>
          <Button size="sm" onClick={() => setUploadOpen(true)}>
            <Plus className="size-4" />
            Upload an image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {assets.map((a) => (
            <MediaAssetCard key={a.id} asset={a} onEdit={setEditing} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-1">
          <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => void fetchPage(page - 1)}>
            <ChevronLeft className="size-4" />
            Prev
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => void fetchPage(page + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      <MediaUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        defaultCategory={category || "Uncategorized"}
        onUploaded={() => {
          setUploadOpen(false);
          void fetchPage(1);
        }}
      />
      <AssetEditDialog asset={editing} onClose={() => setEditing(null)} onSaved={() => void fetchPage(page)} />
    </div>
  );
}
