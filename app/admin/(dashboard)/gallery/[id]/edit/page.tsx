import Link from "next/link";
import { notFound } from "next/navigation";
import { adminRequest } from "@/lib/cms/admin";
import { GalleryItemForm, type InitialGalleryItem } from "@/components/admin/gallery-item-form";

export const dynamic = "force-dynamic";

interface AdminGalleryItem {
  id: number;
  assetId: number;
  assetCdnUrl: string | null;
  beforeAssetId: number | null;
  beforeAssetCdnUrl: string | null;
  category: string;
  caption: string | null;
  sortOrder: number;
}

export default async function EditGalleryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await adminRequest<AdminGalleryItem>(`/api/admin/gallery/${Number(id)}`);
  if (!res.ok || !res.data) notFound();

  const g = res.data;
  const initial: InitialGalleryItem = {
    id: g.id,
    assetId: g.assetId,
    assetCdnUrl: g.assetCdnUrl ?? null,
    beforeAssetId: g.beforeAssetId ?? null,
    beforeAssetCdnUrl: g.beforeAssetCdnUrl ?? null,
    category: g.category ?? "Repairs",
    caption: g.caption ?? null,
    sortOrder: g.sortOrder ?? 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/gallery" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to gallery
        </Link>
        <h1 className="mt-1 text-xl font-semibold">Edit gallery item #{initial.id}</h1>
      </div>
      <GalleryItemForm initial={initial} />
    </div>
  );
}
