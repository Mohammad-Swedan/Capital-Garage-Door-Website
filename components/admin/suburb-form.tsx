"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextField } from "@/components/admin/fields";
import { saveSuburbAction } from "@/app/admin/service-areas-actions";

export interface SuburbInitial {
  id: number;
  regionId: number;
  name: string;
  slug: string | null;
  pageId: number | null;
  sortOrder: number;
}

export interface RegionOption {
  id: number;
  name: string;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function SuburbForm({
  regions,
  initial,
  defaultRegionId,
}: {
  regions: RegionOption[];
  initial?: SuburbInitial;
  defaultRegionId?: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const firstRegionId = regions[0]?.id ?? 0;
  const [regionId, setRegionId] = useState(String(initial?.regionId ?? defaultRegionId ?? firstRegionId));
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [pageId, setPageId] = useState(initial?.pageId != null ? String(initial.pageId) : "");

  function submit() {
    setErrors([]);
    startTransition(async () => {
      const result = await saveSuburbAction({
        ...(initial ? { id: initial.id } : {}),
        regionId: Number(regionId) || 0,
        name,
        slug: slug.trim() ? slug.trim() : null,
        pageId: pageId.trim() ? Number(pageId) : null,
        sortOrder: Number(sortOrder) || 0,
      });
      if (result.ok) {
        router.push("/admin/service-areas");
        router.refresh();
      } else {
        setErrors(result.errors ?? [{ code: "Error", description: "Save failed." }]);
      }
    });
  }

  return (
    <form
      className="space-y-6"
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

      {regions.length === 0 ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          Create a region first — a suburb must belong to one.
        </div>
      ) : (
        <SelectField
          label="Region"
          value={regionId}
          onChange={setRegionId}
          options={regions.map((r) => ({ value: String(r.id), label: r.name }))}
        />
      )}

      <TextField label="Suburb name" value={name} onChange={setName} hint='e.g. "Joondalup".' />
      <TextField
        label="Slug"
        value={slug}
        onChange={setSlug}
        hint="Optional URL slug (lower-cased on save). Leave blank to skip."
      />
      <Field
        label="Linked page ID"
        hint="Optional. Set to the ServiceSuburbPage id once it exists — turns the suburb chip into a link."
      >
        <input
          className={inputClass}
          type="number"
          value={pageId}
          placeholder="e.g. 42"
          onChange={(e) => setPageId(e.target.value)}
        />
      </Field>
      <TextField
        label="Sort order"
        value={sortOrder}
        onChange={setSortOrder}
        hint="Lower numbers appear first within the region."
      />

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={pending} onClick={() => router.push("/admin/service-areas")}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending || regions.length === 0}>
          {pending ? "Saving…" : "Save suburb"}
        </Button>
      </div>
    </form>
  );
}
