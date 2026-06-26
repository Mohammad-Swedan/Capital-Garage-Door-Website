import Link from "next/link";
import { notFound } from "next/navigation";
import { adminRequest } from "@/lib/cms/admin";
import { SuburbForm, type RegionOption, type SuburbInitial } from "@/components/admin/suburb-form";

export const dynamic = "force-dynamic";

interface AdminRegion {
  id: number;
  name: string;
}

interface AdminSuburb {
  id: number;
  regionId: number;
  name: string;
  slug: string | null;
  pageId: number | null;
  sortOrder: number;
}

export default async function EditSuburbPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [suburbRes, regionsRes] = await Promise.all([
    adminRequest<AdminSuburb>(`/api/admin/suburbs/${Number(id)}`),
    adminRequest<AdminRegion[]>("/api/admin/service-area-regions"),
  ]);

  if (!suburbRes.ok || !suburbRes.data) notFound();

  const s = suburbRes.data;
  const regions: RegionOption[] = (regionsRes.data ?? []).map((r) => ({ id: r.id, name: r.name }));

  const initial: SuburbInitial = {
    id: s.id,
    regionId: s.regionId,
    name: s.name,
    slug: s.slug,
    pageId: s.pageId,
    sortOrder: s.sortOrder,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/service-areas" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to service areas
        </Link>
        <h1 className="mt-1 text-xl font-semibold">Edit suburb: {s.name}</h1>
      </div>
      <SuburbForm regions={regions} initial={initial} />
    </div>
  );
}
