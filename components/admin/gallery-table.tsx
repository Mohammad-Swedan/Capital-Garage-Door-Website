import { Images } from "lucide-react";

import { GalleryRowActions } from "@/components/admin/gallery-row-actions";
import { GALLERY_CATEGORIES } from "@/components/admin/gallery-categories";
import { Badge } from "@/components/ui/badge";
import {
  AdminTableCard,
  AdminTableEmpty,
  adminRowClass,
} from "@/components/admin/ui/admin-table";

/**
 * Presentational gallery table. It is intentionally a *pure* component: it takes
 * the already-fetched rows as a prop and renders them. The single fetch lives in
 * the page server component (`app/admin/(dashboard)/gallery/page.tsx`) — keeping
 * the data load there (instead of letting each cell/section fetch on its own) is
 * what guarantees one `GetGalleryItems` round-trip per page load.
 */
export interface AdminGalleryItem {
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

const CATEGORY_LABELS = Object.fromEntries(
  GALLERY_CATEGORIES.map((c) => [c.value, c.label]),
);

function Thumb({ src, alt }: { src: string | null; alt: string | null }) {
  if (!src) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      className="h-14 w-20 rounded-md border border-border/70 object-cover shadow-card"
    />
  );
}

export function GalleryTable({ items }: { items: AdminGalleryItem[] }) {
  if (items.length === 0) {
    return (
      <AdminTableEmpty
        icon={<Images className="size-5" />}
        title="No gallery items yet"
        description="Add your first before/after photo to start building the public gallery."
      />
    );
  }

  return (
    <AdminTableCard
      head={
        <tr>
          <th className="px-4 py-3 font-medium">Image</th>
          <th className="px-4 py-3 font-medium">Before</th>
          <th className="px-4 py-3 font-medium">Category</th>
          <th className="px-4 py-3 font-medium">Caption</th>
          <th className="px-4 py-3 font-medium">Sort</th>
          <th className="px-4 py-3 text-right font-medium">Actions</th>
        </tr>
      }
    >
      {items.map((g) => (
        <tr key={g.id} className={adminRowClass}>
          <td className="px-4 py-3">
            <Thumb src={g.assetCdnUrl} alt={g.assetAltText} />
          </td>
          <td className="px-4 py-3">
            <Thumb src={g.beforeAssetCdnUrl} alt={g.beforeAssetAltText} />
          </td>
          <td className="px-4 py-3">
            <Badge variant="brand">{CATEGORY_LABELS[g.category] ?? g.category}</Badge>
          </td>
          <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
            {g.caption ?? "—"}
          </td>
          <td className="px-4 py-3 tabular-nums text-muted-foreground">{g.sortOrder}</td>
          <td className="px-4 py-3">
            <div className="flex justify-end">
              <GalleryRowActions id={g.id} />
            </div>
          </td>
        </tr>
      ))}
    </AdminTableCard>
  );
}
