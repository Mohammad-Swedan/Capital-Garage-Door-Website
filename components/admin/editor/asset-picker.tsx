"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
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
            Upload a new image or pick one from the library.
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

function UploadTab({ onSettle }: { onSettle: (v: AssetSelection | null) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("altText", file.name);
        const res = await fetch("/admin/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error(`Upload failed (${res.status})`);
        const data = (await res.json()) as { id: number; cdnUrl: string };
        onSettle({ assetId: data.id, url: data.cdnUrl });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onSettle],
  );

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
          if (f) void upload(f);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground transition-colors hover:border-primary/40",
          dragOver && "border-primary/60 bg-primary/5",
        )}
      >
        {uploading ? (
          <Loader2 className="size-6 animate-spin text-primary" />
        ) : (
          <UploadCloud className="size-6 text-primary" />
        )}
        <span className="font-medium text-foreground">
          {uploading ? "Uploading…" : "Drop an image or click to browse"}
        </span>
        <span className="text-xs">PNG, JPG or WebP</span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
      </label>
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function LibraryTab({ onSettle }: { onSettle: (v: AssetSelection | null) => void }) {
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="mt-3 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto">
      {assets.map((asset) => (
        <button
          key={asset.id}
          type="button"
          onClick={() => onSettle({ assetId: asset.id, url: asset.cdnUrl })}
          className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted transition-colors hover:border-primary/60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.cdnUrl}
            alt={asset.altText ?? ""}
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}
