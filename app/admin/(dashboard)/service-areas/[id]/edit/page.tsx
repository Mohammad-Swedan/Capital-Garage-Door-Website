import Link from "next/link";
import { notFound } from "next/navigation";
import { adminRequest } from "@/lib/cms/admin";
import { RegionForm } from "@/components/admin/region-form";

export const dynamic = "force-dynamic";

interface AdminRegion {
  id: number;
  name: string;
  sortOrder: number;
}

export default async function EditRegionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await adminRequest<AdminRegion>(`/api/admin/service-area-regions/${Number(id)}`);
  if (!res.ok || !res.data) notFound();

  const region = res.data;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/service-areas" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to service areas
        </Link>
        <h1 className="mt-1 text-xl font-semibold">Edit region: {region.name}</h1>
      </div>
      <RegionForm initial={{ id: region.id, name: region.name, sortOrder: region.sortOrder }} />
    </div>
  );
}
