import Link from "next/link";
import { Plus } from "lucide-react";
import { adminRequest } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
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

      {!res.ok && (
        <Card className="border-destructive/30 bg-destructive/10 py-4 text-destructive ring-destructive/20">
          <p className="px-4 text-sm">
            Could not load services (status {res.status}). Is the CMS API running?
          </p>
        </Card>
      )}

      {res.ok && items.length === 0 ? (
        <Card className="items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No services yet. Create your first one.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Slug</th>
                  <th className="px-4 py-2.5 font-medium">Icon</th>
                  <th className="px-4 py-2.5 font-medium">Canonical page</th>
                  <th className="px-4 py-2.5 font-medium">Sort</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.iconName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.canonicalPageId != null ? `#${s.canonicalPageId}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <ServiceRowActions id={s.id} />
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
