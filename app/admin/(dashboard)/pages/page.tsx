import Link from "next/link";
import { Plus } from "lucide-react";
import { listPages, listPageCounts } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminPagination } from "@/components/admin/ui/admin-pagination";
import { PagesTable } from "@/components/admin/pages-table";
import { PagesToolbar } from "@/components/admin/pages-toolbar";
import { PagesCategoryTabs } from "@/components/admin/pages-category-tabs";
import { TEMPLATE_TYPES, pagesHref, type PagesFilters } from "@/components/admin/pages-list";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type SearchParams = { [key: string]: string | string[] | undefined };

function one(value: string | string[] | undefined): string | undefined {
  return (Array.isArray(value) ? value[0] : value) ?? undefined;
}

export default async function PagesGrid({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;

  // Parse + validate the URL state (only forward known enum values to the backend).
  const typeRaw = one(sp.type);
  const type = TEMPLATE_TYPES.some((t) => t.value === typeRaw) ? typeRaw : undefined;
  const statusRaw = one(sp.status);
  const status = statusRaw === "Published" || statusRaw === "Draft" ? statusRaw : undefined;
  const q = one(sp.q)?.trim() || undefined;
  const pageRaw = Number.parseInt(one(sp.page) ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const [res, countsRes] = await Promise.all([
    listPages({ templateType: type, status, search: q, pageNumber: page, pageSize: PAGE_SIZE }),
    listPageCounts({ status, search: q }),
  ]);

  const data = res.data;
  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? items.length;
  const totalPages = data?.totalPages ?? 1;
  const pageNumber = data?.pageNumber ?? page;

  const counts = countsRes.data;
  const showCounts = countsRes.ok && !!counts;

  const current: PagesFilters = { type, status, q, page };
  const filtered = Boolean(type || status || q);

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Pages"
        description={`${totalCount} ${totalCount === 1 ? "page" : "pages"}${filtered ? " in this view" : ""}`}
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

      <PagesCategoryTabs
        current={current}
        total={counts?.total ?? totalCount}
        byType={counts?.byType ?? []}
        showCounts={showCounts}
      />

      <PagesToolbar initialSearch={q ?? ""} status={status ?? ""} />

      <PagesTable items={items} filtered={filtered} />

      <AdminPagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        makeHref={(p) => pagesHref(current, { page: p })}
      />
    </div>
  );
}
