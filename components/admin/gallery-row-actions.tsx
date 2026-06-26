"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteGalleryItemAction } from "@/app/admin/gallery-actions";

export function GalleryRowActions({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <Link href={`/admin/gallery/${id}/edit`}>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </Link>
      <Button
        size="sm"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this gallery item? This cannot be undone.")) run(() => deleteGalleryItemAction(id));
        }}
      >
        Delete
      </Button>
    </div>
  );
}
