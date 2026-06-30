"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ASSET_CATEGORIES } from "@/components/admin/asset-categories";
import { updateAssetAction } from "@/app/admin/asset-actions";
import type { MediaAsset } from "./media-asset-card";

/** Edit a library asset's alt text + category. Mounts a fresh form per asset (keyed by id). */
export function AssetEditDialog({
  asset,
  onClose,
  onSaved,
}: {
  asset: MediaAsset | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  return (
    <Dialog
      open={asset !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit image</DialogTitle>
          <DialogDescription>Update the alt text and category for this image.</DialogDescription>
        </DialogHeader>
        {asset && <EditForm key={asset.id} asset={asset} onClose={onClose} onSaved={onSaved} />}
      </DialogContent>
    </Dialog>
  );
}

function EditForm({
  asset,
  onClose,
  onSaved,
}: {
  asset: MediaAsset;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [altText, setAltText] = useState(asset.altText ?? "");
  const [category, setCategory] = useState(asset.category || "Uncategorized");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await updateAssetAction({ id: asset.id, altText: altText.trim(), category });
      if (res.ok) {
        onSaved();
        onClose();
      } else {
        setError(res.errors?.[0]?.description ?? "Could not save.");
      }
    });
  }

  return (
    <form
      className="mt-2 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="overflow-hidden rounded-lg border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.cdnUrl} alt={asset.altText ?? ""} className="max-h-40 w-full object-contain bg-muted/30" />
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-foreground">Alt text</span>
        <input
          autoFocus
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image for screen readers & SEO"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>

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

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={pending || !altText.trim()}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          Save
        </Button>
      </div>
    </form>
  );
}
