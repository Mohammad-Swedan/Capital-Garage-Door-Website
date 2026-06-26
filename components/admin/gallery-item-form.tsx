"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveGalleryItemAction } from "@/app/admin/gallery-actions";
import { AssetUploadField, SelectField, TextField, Field } from "@/components/admin/fields";
import { GALLERY_CATEGORIES } from "@/components/admin/gallery-categories";

export interface InitialGalleryItem {
  id: number;
  assetId: number;
  assetCdnUrl: string | null;
  beforeAssetId: number | null;
  beforeAssetCdnUrl: string | null;
  category: string;
  caption: string | null;
  sortOrder: number;
}

export function GalleryItemForm({ initial }: { initial?: InitialGalleryItem }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const [assetId, setAssetId] = useState<number | null>(initial?.assetId ?? null);
  const [assetPreview, setAssetPreview] = useState<string | null>(initial?.assetCdnUrl ?? null);
  const [beforeAssetId, setBeforeAssetId] = useState<number | null>(initial?.beforeAssetId ?? null);
  const [beforePreview, setBeforePreview] = useState<string | null>(initial?.beforeAssetCdnUrl ?? null);
  const [category, setCategory] = useState(initial?.category ?? "Repairs");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));

  function submit() {
    setErrors([]);

    if (!assetId) {
      setErrors([{ code: "Validation", description: "A main image is required." }]);
      return;
    }

    startTransition(async () => {
      const result = await saveGalleryItemAction({
        ...(initial ? { id: initial.id } : {}),
        assetId,
        beforeAssetId,
        category,
        caption: caption.trim() ? caption.trim() : null,
        sortOrder: Number(sortOrder) || 0,
      });

      if (result.ok) {
        router.push("/admin/gallery");
        router.refresh();
      } else {
        setErrors(result.errors ?? [{ code: "Error", description: "Save failed." }]);
      }
    });
  }

  return (
    <form
      className="max-w-2xl space-y-8 pb-24"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {errors.length > 0 && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-medium">Could not save:</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((e, i) => (
              <li key={i}>
                <span className="font-mono text-xs">{e.code}</span> — {e.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="space-y-4">
        <AssetUploadField
          label="Main image"
          assetId={assetId}
          previewUrl={assetPreview}
          onUploaded={(id, url) => {
            setAssetId(id);
            setAssetPreview(url);
          }}
        />
        <AssetUploadField
          label="Before image (optional)"
          assetId={beforeAssetId}
          previewUrl={beforePreview}
          onUploaded={(id, url) => {
            setBeforeAssetId(id);
            setBeforePreview(url);
          }}
        />
        <SelectField label="Category" value={category} onChange={setCategory} options={GALLERY_CATEGORIES} />
        <TextField
          label="Caption"
          value={caption}
          onChange={setCaption}
          hint="Optional short description shown on the gallery."
        />
        <Field label="Sort order" hint="Lower numbers appear first.">
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </Field>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3">
          <Button type="button" variant="outline" disabled={pending} onClick={() => router.push("/admin/gallery")}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
