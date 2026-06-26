import Link from "next/link";
import { Plus, Wrench } from "lucide-react";
import { adminRequest } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import {
  AdminTableCard,
  AdminTableEmpty,
  AdminLoadError,
  adminRowClass,
} from "@/components/admin/ui/admin-table";
import { ServiceRowActions } from "@/components/admin/service-row-actions";

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

export default async function ServicesGrid() {
  const res = await adminRequest<AdminService[]>("/api/admin/services");
  const items = res.data ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Services"
        description={`${items.length} service${items.length === 1 ? "" : "s"}`}
        actions={
          <Button render={<Link href="/admin/services/new" />}>
            <Plus className="size-4" />
            New service
          </Button>
        }
      />

      {!res.ok ? (
        <AdminLoadError label="services" status={res.status} />
      ) : items.length === 0 ? (
        <AdminTableEmpty
          icon={<Wrench className="size-5" />}
          title="No services yet"
          description="Add the services you offer — they power the homepage grid and service pages."
        />
      ) : (
        <AdminTableCard
          head={
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Icon</th>
              <th className="px-4 py-3 font-medium">Canonical page</th>
              <th className="px-4 py-3 font-medium">Sort</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          }
        >
          {items.map((s) => (
            <tr key={s.id} className={adminRowClass}>
              <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.slug}</td>
              <td className="px-4 py-3 text-muted-foreground">{s.iconName}</td>
              <td className="px-4 py-3">
                {s.canonicalPageId != null ? (
                  <Badge variant="info">#{s.canonicalPageId}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 tabular-nums text-muted-foreground">{s.sortOrder}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <ServiceRowActions id={s.id} />
                </div>
              </td>
            </tr>
          ))}
        </AdminTableCard>
      )}
    </div>
  );
}
