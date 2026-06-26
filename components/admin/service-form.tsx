"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveServiceAction } from "@/app/admin/services-actions";
import { TextField, TextAreaField, Field } from "@/components/admin/fields";

const numberInputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export interface InitialService {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  iconName: string;
  assetId: number | null;
  canonicalPageId: number | null;
  sortOrder: number;
}

export function ServiceForm({ initial }: { initial?: InitialService }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [iconName, setIconName] = useState(initial?.iconName ?? "");
  const [assetId, setAssetId] = useState(initial?.assetId != null ? String(initial.assetId) : "");
  const [canonicalPageId, setCanonicalPageId] = useState(
    initial?.canonicalPageId != null ? String(initial.canonicalPageId) : "",
  );
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));

  function submit() {
    setErrors([]);

    if (!initial && !slug.trim()) {
      setErrors([{ code: "Validation", description: "A slug is required." }]);
      return;
    }
    if (!name.trim()) {
      setErrors([{ code: "Validation", description: "A name is required." }]);
      return;
    }

    const assetIdValue = assetId.trim() ? Number(assetId) : null;
    const canonicalPageIdValue = canonicalPageId.trim() ? Number(canonicalPageId) : null;

    startTransition(async () => {
      const result = await saveServiceAction(
        initial
          ? {
              id: initial.id,
              name: name.trim(),
              shortDescription: shortDescription.trim(),
              iconName: iconName.trim(),
              assetId: assetIdValue,
              canonicalPageId: canonicalPageIdValue,
              sortOrder: Number(sortOrder) || 0,
            }
          : {
              slug: slug.trim(),
              name: name.trim(),
              shortDescription: shortDescription.trim(),
              iconName: iconName.trim(),
              assetId: assetIdValue,
              canonicalPageId: canonicalPageIdValue,
              sortOrder: Number(sortOrder) || 0,
            },
      );

      if (result.ok) {
        router.push("/admin/services");
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
        {initial ? (
          <Field label="Slug" hint="Slug is fixed after creation.">
            <input className={numberInputClass} value={slug} disabled readOnly />
          </Field>
        ) : (
          <TextField
            label="Slug"
            value={slug}
            onChange={setSlug}
            placeholder="garage-door-repair"
            hint="Unique, lowercase. Cannot be changed later."
          />
        )}
        <TextField label="Name" value={name} onChange={setName} placeholder="Garage Door Repair" />
        <TextAreaField
          label="Short description"
          value={shortDescription}
          onChange={setShortDescription}
          rows={3}
          hint="Shown on the homepage service tile."
        />
        <TextField
          label="Icon name"
          value={iconName}
          onChange={setIconName}
          placeholder="wrench"
          hint="Lucide icon name used by the service tile."
        />
        <Field label="Asset ID" hint="Optional. Existing media asset id.">
          <input
            type="number"
            min={0}
            className={numberInputClass}
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
          />
        </Field>
        <Field label="Canonical page ID" hint="Optional. Links this service to a dedicated page (by id).">
          <input
            type="number"
            min={0}
            className={numberInputClass}
            value={canonicalPageId}
            onChange={(e) => setCanonicalPageId(e.target.value)}
          />
        </Field>
        <Field label="Sort order" hint="Lower numbers appear first.">
          <input
            type="number"
            min={0}
            className={numberInputClass}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </Field>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3">
          <Button type="button" variant="outline" disabled={pending} onClick={() => router.push("/admin/services")}>
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
