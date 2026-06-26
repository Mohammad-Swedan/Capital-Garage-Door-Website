import Link from "next/link";
import { Plus } from "lucide-react";
import { adminRequest } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { GalleryRowActions } from "@/components/admin/gallery-row-actions";
import { GALLERY_CATEGORIES } from "@/components/admin/gallery-categories";

export const dynamic = "force-dynamic";

interface AdminGalleryItem {
  id: number;
  assetId: number;
  assetCdnUrl: string | null;
  assetAltText: string | null;
  beforeAssetId: number | null;
  beforeAssetCdnUrl: string | null;
  beforeAssetAltText: string | null;
  category: string;
  caption: string | null;
  sortOrder: number;
}

const CATEGORY_LABELS = Object.fromEntries(GALLERY_CATEGORIES.map((c) => [c.value, c.label]));

export default async function GalleryGrid() {
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

      {!res.ok && (
        <Card className="border-destructive/30 bg-destructive/10 py-4 text-destructive ring-destructive/20">
          <p className="px-4 text-sm">
            Could not load gallery (status {res.status}). Is the CMS API running?
          </p>
        </Card>
      )}

      {res.ok && items.length === 0 ? (
        <Card className="items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No gallery items yet. Create your first one.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Image</th>
                  <th className="px-4 py-2.5 font-medium">Before</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Caption</th>
                  <th className="px-4 py-2.5 font-medium">Sort</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((g) => (
                  <tr key={g.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3">
                      {g.assetCdnUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={g.assetCdnUrl}
                          alt={g.assetAltText ?? ""}
                          className="h-14 w-20 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">#{g.assetId}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {g.beforeAssetCdnUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={g.beforeAssetCdnUrl}
                          alt={g.beforeAssetAltText ?? ""}
                          className="h-14 w-20 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {CATEGORY_LABELS[g.category] ?? g.category}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{g.caption ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{g.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <GalleryRowActions id={g.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
