"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePageAction, publishPageAction, unpublishPageAction } from "@/app/admin/actions";

export function PageRowActions({ id, status, href }: { id: number; status: string; href: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="flex items-center justify-end gap-1">
      <Button size="icon-sm" variant="ghost" render={<Link href={`/admin/pages/${id}/edit`} />} aria-label="Edit page">
        <Pencil className="size-4" />
      </Button>
      {status === "Published" ? (
        <Button
          size="icon-sm"
          variant="ghost"
          disabled={pending}
          onClick={() => run(() => unpublishPageAction(id))}
          aria-label="Unpublish page"
        >
          <EyeOff className="size-4" />
        </Button>
      ) : (
        <Button
          size="icon-sm"
          variant="ghost"
          disabled={pending}
          onClick={() => run(() => publishPageAction(id))}
          aria-label="Publish page"
        >
          <Eye className="size-4" />
        </Button>
      )}
      <Button size="icon-sm" variant="ghost" render={<a href={href} target="_blank" rel="noreferrer" />} aria-label="View page">
        <ExternalLink className="size-4" />
      </Button>
      <Button
        size="icon-sm"
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this page? This cannot be undone.")) run(() => deletePageAction(id));
        }}
        aria-label="Delete page"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
