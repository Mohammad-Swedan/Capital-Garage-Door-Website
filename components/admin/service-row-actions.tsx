"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteServiceAction } from "@/app/admin/services-actions";

export function ServiceRowActions({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <Link href={`/admin/services/${id}/edit`}>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </Link>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this service? This cannot be undone.")) run(() => deleteServiceAction(id));
        }}
      >
        Delete
      </Button>
    </div>
  );
}
