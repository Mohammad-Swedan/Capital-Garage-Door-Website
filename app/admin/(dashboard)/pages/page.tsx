import Link from "next/link";
import { Plus } from "lucide-react";
import { listPages } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { PagesTable } from "@/components/admin/pages-table";

export const dynamic = "force-dynamic";

export default async function PagesGrid() {
  const res = await listPages();
  const items = res.data?.items ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pages"
        description={`${items.length} page${items.length === 1 ? "" : "s"}`}
        actions={
          <Button render={<Link href="/admin/pages/new" />}>
            <Plus className="size-4" />
            New page
          </Button>
        }
      />

      {!res.ok && (
        <Card className="border-destructive/30 bg-destructive/10 py-4 text-destructive ring-destructive/20">
          <p className="px-4 text-sm">
            Could not load pages (status {res.status}). Is the CMS API running?
          </p>
        </Card>
      )}

      <PagesTable items={items} />
    </div>
  );
}
