"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/admin/fields";
import { saveRegionAction } from "@/app/admin/service-areas-actions";

export interface RegionInitial {
  id: number;
  name: string;
  sortOrder: number;
}

export function RegionForm({ initial }: { initial?: RegionInitial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const [name, setName] = useState(initial?.name ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));

  function submit() {
    setErrors([]);
    startTransition(async () => {
      const result = await saveRegionAction({
        ...(initial ? { id: initial.id } : {}),
        name,
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

      <TextField label="Region name" value={name} onChange={setName} hint='e.g. "Northern Suburbs".' />
      <TextField
        label="Sort order"
        value={sortOrder}
        onChange={setSortOrder}
        hint="Lower numbers appear first in the /service-areas directory."
      />

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" disabled={pending} onClick={() => router.push("/admin/service-areas")}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save region"}
        </Button>
      </div>
    </form>
  );
}
