"use client";

import { useState } from "react";
import { Pencil, Trash2, TriangleAlert, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { assetCategoryLabel } from "@/components/admin/asset-categories";

export interface MediaAsset {
  id: number;
  cdnUrl: string;
  altText: string;
  category: string;
  width?: number | null;
  height?: number | null;
  uploadedAt?: string;
}

/** A single media-library tile: thumbnail, category badge, alt text, and edit/delete actions. */
export function MediaAssetCard({
  asset,
  onEdit,
  onDelete,
}: {
  asset: MediaAsset;
  onEdit: (a: MediaAsset) => void;
  onDelete: (a: MediaAsset) => void;
}) {
  const missingAlt = !asset.altText?.trim();
  const [broken, setBroken] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition-shadow hover:shadow-elevated">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {broken ? (
          <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-[10px]">Image unavailable</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.cdnUrl}
            alt={asset.altText ?? ""}
            loading="lazy"
            onError={() => setBroken(true)}
            className="absolute inset-0 size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute left-2 top-2">
          <Badge variant="brand">{assetCategoryLabel(asset.category)}</Badge>
        </span>
        {missingAlt && (
          <span
            className="absolute right-2 top-2 inline-flex size-5 items-center justify-center rounded-full bg-amber-500/90 text-white shadow-card group-hover:hidden"
            title="No alt text"
            aria-hidden
          >
            <TriangleAlert className="size-3" />
          </span>
        )}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(asset)}
            title="Edit image"
            aria-label="Edit image"
            className="inline-flex size-7 items-center justify-center rounded-md bg-background/90 text-foreground shadow-card backdrop-blur outline-none transition-colors hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(asset)}
            title="Delete image"
            aria-label="Delete image"
            className="inline-flex size-7 items-center justify-center rounded-md bg-background/90 text-foreground shadow-card backdrop-blur outline-none transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="space-y-1 p-2.5">
        <p
          className={cn("truncate text-xs", missingAlt ? "italic text-amber-600 dark:text-amber-400" : "text-foreground")}
          title={asset.altText ?? ""}
        >
          {asset.altText?.trim() ? asset.altText : "No alt text"}
        </p>
        <p className="text-[11px] text-muted-foreground tabular-nums">
          #{asset.id}
          {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}
        </p>
      </div>
    </div>
  );
}
