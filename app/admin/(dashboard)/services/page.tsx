import Link from "next/link";
import { Plus } from "lucide-react";
import { adminRequest } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminLoadError } from "@/components/admin/ui/admin-table";
import { ServicesTable, type AdminService } from "@/components/admin/services-table";

export const dynamic = "force-dynamic";

export default async function ServicesGrid() {
  const res = await adminRequest<AdminService[]>("/api/admin/services");
  const items = res.data ?? [];

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Services"
        description={`${items.length} service${items.length === 1 ? "" : "s"} · powers the homepage grid, /services & the footer`}
        actions={
          <Button render={<Link href="/admin/services/new" />}>
            <Plus className="size-4" />
            New service
          </Button>
        }
      />

      {!res.ok ? (
        <AdminLoadError label="services" status={res.status} />
      ) : (
        <ServicesTable items={items} />
      )}
    </div>
  );
}
