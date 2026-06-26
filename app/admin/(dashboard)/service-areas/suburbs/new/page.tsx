import Link from "next/link";
import { adminRequest } from "@/lib/cms/admin";
import { SuburbForm, type RegionOption } from "@/components/admin/suburb-form";

export const dynamic = "force-dynamic";

interface AdminRegion {
  id: number;
  name: string;
}

export default async function NewSuburbPage({
  searchParams,
}: {
  searchParams: Promise<{ regionId?: string }>;
}) {
  const { regionId } = await searchParams;
  const res = await adminRequest<AdminRegion[]>("/api/admin/service-area-regions");
  const regions: RegionOption[] = (res.data ?? []).map((r) => ({ id: r.id, name: r.name }));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/service-areas" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to service areas
        </Link>
        <h1 className="mt-1 text-xl font-semibold">New suburb</h1>
        <p className="text-sm text-muted-foreground">A suburb belongs to a region and may link to a service-suburb page.</p>
      </div>
      <SuburbForm regions={regions} defaultRegionId={regionId ? Number(regionId) : undefined} />
    </div>
  );
}
