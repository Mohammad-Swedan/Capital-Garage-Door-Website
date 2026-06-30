"use client";

import { useState } from "react";
import { Images, ImageIcon } from "lucide-react";

import { GalleryRowActions } from "@/components/admin/gallery-row-actions";
import { GALLERY_CATEGORIES } from "@/components/admin/gallery-categories";
import { Badge } from "@/components/ui/badge";
import { AdminTableEmpty } from "@/components/admin/ui/admin-table";
import { cn } from "@/lib/utils";

/**
 * Presentational gallery grid. It takes the already-fetched rows as a prop (the single fetch lives
 * in the page server component, `app/admin/(dashboard)/gallery/page.tsx`) and renders them as image
 * cards, with a client-side category filter. Each card shows the main image, an optional "before"
 * thumbnail, category, caption, sort order, and edit/delete actions.
 */
export interface AdminGalleryItem {
  id: number;
  assetId: number;
  assetCdnUrl: string | null;
  assetAltText: string | null;
  beforeAssetId: number | null;
  beforeAssetCdnUrl: string | null;
  beforeAssetAltText: string | null;
  category: string;
  caption: string | null;
  sortOrder: number;
}

const CATEGORY_LABELS = Object.fromEntries(GALLERY_CATEGORIES.map((c) => [c.value, c.label]));
const FILTERS = [{ value: "", label: "All" }, ...GALLERY_CATEGORIES];

export function GalleryTable({ items }: { items: AdminGalleryItem[] }) {
  const [filter, setFilter] = useState("");

  if (items.length === 0) {
    return (
      <AdminTableEmpty
        icon={<Images className="size-5" />}
        title="No gallery items yet"
        description="Add your first before/after photo to start building the public gallery."
      />
    );
  }

  const shown = filter ? items.filter((g) => g.category === filter) : items;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((c) => {
          const count = c.value ? items.filter((g) => g.category === c.value).length : items.length;
          return (
            <button
              key={c.value || "all"}
              type="button"
              onClick={() => setFilter(c.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === c.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {c.label}
              <span className="ml-1.5 tabular-nums opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center text-sm text-muted-foreground">
          No items in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((g) => (
            <div
              key={g.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="relative aspect-[4/3] bg-muted">
                {g.assetCdnUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.assetCdnUrl}
                    alt={g.assetAltText ?? ""}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-6" />
                  </div>
                )}
                <span className="absolute left-2 top-2">
                  <Badge variant="brand">{CATEGORY_LABELS[g.category] ?? g.category}</Badge>
                </span>
                {g.beforeAssetCdnUrl && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-background/85 p-1 pr-2 shadow-card backdrop-blur">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.beforeAssetCdnUrl}
                      alt={g.beforeAssetAltText ?? ""}
                      loading="lazy"
                      className="size-9 rounded-md object-cover"
                    />
                    <span className="text-[11px] font-medium text-muted-foreground">Before</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 p-3">
                <p className="line-clamp-2 min-h-[2.5rem] text-sm text-foreground">
                  {g.caption ?? <span className="text-muted-foreground">No caption</span>}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">Sort {g.sortOrder}</span>
                  <GalleryRowActions id={g.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
