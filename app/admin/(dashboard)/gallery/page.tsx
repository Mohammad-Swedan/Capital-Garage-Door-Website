import Link from "next/link";
import { Plus } from "lucide-react";

import { adminRequest } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminLoadError } from "@/components/admin/ui/admin-table";
import { GalleryTable, type AdminGalleryItem } from "@/components/admin/gallery-table";

export const dynamic = "force-dynamic";

/**
 * Gallery list. The gallery rows are fetched exactly **once** here (the page
 * server component) and passed down to <GalleryTable />. Earlier this screen
 * fanned the same `GetGalleryItems` query out across several independently
 * fetching pieces; consolidating the read into this single boundary collapses
 * that to one backend round-trip per load.
 */
export default async function GalleryPage() {
  const res = await adminRequest<AdminGalleryItem[]>("/api/admin/gallery");
  const items = res.data ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery"
        description={`${items.length} item${items.length === 1 ? "" : "s"}`}
        actions={
          <Button render={<Link href="/admin/gallery/new" />}>
            <Plus className="size-4" />
            New gallery item
          </Button>
        }
      />

      {!res.ok ? (
        <AdminLoadError label="gallery" status={res.status} />
      ) : (
        <GalleryTable items={items} />
      )}
    </div>
  );
}
