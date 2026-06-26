import Link from "next/link";
import { notFound } from "next/navigation";
import { adminRequest } from "@/lib/cms/admin";
import { ServiceForm, type InitialService } from "@/components/admin/service-form";

export const dynamic = "force-dynamic";

interface AdminService {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  iconName: string;
  assetId: number | null;
  canonicalPageId: number | null;
  sortOrder: number;
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await adminRequest<AdminService>(`/api/admin/services/${Number(id)}`);
  if (!res.ok || !res.data) notFound();

  const s = res.data;
  const initial: InitialService = {
    id: s.id,
    slug: s.slug,
    name: s.name,
    shortDescription: s.shortDescription,
    iconName: s.iconName,
    assetId: s.assetId ?? null,
    canonicalPageId: s.canonicalPageId ?? null,
    sortOrder: s.sortOrder ?? 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/services" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to services
        </Link>
        <h1 className="mt-1 text-xl font-semibold">Edit service #{initial.id}</h1>
      </div>
      <ServiceForm initial={initial} />
    </div>
  );
}
