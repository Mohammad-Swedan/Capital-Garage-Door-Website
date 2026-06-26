import Link from "next/link";
import { Plus, MapPin } from "lucide-react";
import { adminRequest } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import {
  AdminTableEmpty,
  AdminLoadError,
  adminRowClass,
} from "@/components/admin/ui/admin-table";
import { RegionRowActions, SuburbRowActions } from "@/components/admin/service-area-row-actions";

export const dynamic = "force-dynamic";

interface AdminSuburb {
  id: number;
  regionId: number;
  regionName: string | null;
  name: string;
  slug: string | null;
  pageId: number | null;
  sortOrder: number;
}

interface AdminRegion {
  id: number;
  name: string;
  sortOrder: number;
  suburbs: AdminSuburb[];
}

export default async function ServiceAreasPage() {
  const res = await adminRequest<AdminRegion[]>("/api/admin/service-area-regions");
  const regions = res.data ?? [];
  const suburbCount = regions.reduce((n, r) => n + r.suburbs.length, 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Service areas"
        description={`${regions.length} region${regions.length === 1 ? "" : "s"} · ${suburbCount} suburb${suburbCount === 1 ? "" : "s"}`}
        actions={
          <>
            <Button variant="secondary" render={<Link href="/admin/service-areas/suburbs/new" />}>
              <Plus className="size-4" />
              New suburb
            </Button>
            <Button render={<Link href="/admin/service-areas/new" />}>
              <Plus className="size-4" />
              New region
            </Button>
          </>
        }
      />

      {!res.ok && <AdminLoadError label="service areas" status={res.status} />}

      {res.ok && regions.length === 0 && (
        <AdminTableEmpty
          icon={<MapPin className="size-5" />}
          title="No regions yet"
          description="Create your first region to start grouping the suburbs you service."
        />
      )}

      <div className="space-y-4">
        {regions.map((region) => (
          <Card key={region.id} variant="elevated" className="overflow-hidden p-0">
            <header className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand ring-1 ring-inset ring-foreground/5">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <h2 className="font-heading font-semibold text-foreground">{region.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    Sort {region.sortOrder} · {region.suburbs.length} suburb
                    {region.suburbs.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <RegionRowActions id={region.id} />
            </header>

            {region.suburbs.length === 0 ? (
              <p className="px-4 py-5 text-sm text-muted-foreground">
                No suburbs in this region yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="border-b border-border bg-muted/30 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Suburb</th>
                      <th className="px-4 py-2.5 font-medium">Slug</th>
                      <th className="px-4 py-2.5 font-medium">Linked page</th>
                      <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {region.suburbs.map((s) => (
                      <tr key={s.id} className={adminRowClass}>
                        <td className="px-4 py-2.5 font-medium text-foreground">{s.name}</td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {s.slug ?? "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          {s.pageId != null ? (
                            <Badge variant="success">Page #{s.pageId}</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">No page</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex justify-end">
                            <SuburbRowActions id={s.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
