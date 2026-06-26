"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteRegionAction, deleteSuburbAction } from "@/app/admin/service-areas-actions";

export function RegionRowActions({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Link href={`/admin/service-areas/${id}/edit`}>
        <Button size="sm" variant="outline">
          Edit region
        </Button>
      </Link>
      <Link href={`/admin/service-areas/suburbs/new?regionId=${id}`}>
        <Button size="sm" variant="secondary">
          + Add suburb
        </Button>
      </Link>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this region? It must have no suburbs.")) return;
          setError(null);
          startTransition(async () => {
            const res = await deleteRegionAction(id);
            if (!res.ok) {
              setError(res.errors?.[0]?.description ?? "Delete failed.");
            } else {
              router.refresh();
            }
          });
        }}
      >
        Delete
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

export function SuburbRowActions({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1.5">
      <Link href={`/admin/service-areas/suburbs/${id}/edit`}>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </Link>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this suburb?")) return;
          startTransition(async () => {
            await deleteSuburbAction(id);
            router.refresh();
          });
        }}
      >
        Delete
      </Button>
    </div>
  );
}
