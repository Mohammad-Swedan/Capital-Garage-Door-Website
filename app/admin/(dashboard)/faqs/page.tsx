import Link from "next/link";
import { Plus } from "lucide-react";
import { listFaqs, listFaqCategories } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { AdminPagination } from "@/components/admin/ui/admin-pagination";
import { FaqsTable } from "@/components/admin/faqs-table";
import { FaqsToolbar } from "@/components/admin/faqs-toolbar";
import { FaqsCategoryTabs } from "@/components/admin/faqs-category-tabs";
import { faqsHref, type FaqsFilters } from "@/components/admin/faqs-list";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type SearchParams = { [key: string]: string | string[] | undefined };

function one(value: string | string[] | undefined): string | undefined {
  return (Array.isArray(value) ? value[0] : value) ?? undefined;
}

export default async function FaqsLibrary({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const category = one(sp.category) || undefined;
  const q = one(sp.q)?.trim() || undefined;
  const pageRaw = Number.parseInt(one(sp.page) ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const [res, countsRes] = await Promise.all([
    listFaqs({ category, search: q, pageNumber: page, pageSize: PAGE_SIZE }),
    listFaqCategories({ search: q }),
  ]);

  const data = res.data;
  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? items.length;
  const totalPages = data?.totalPages ?? 1;
  const pageNumber = data?.pageNumber ?? page;

  const counts = countsRes.ok ? countsRes.data : undefined;
  const current: FaqsFilters = { category, q, page };
  const filtered = Boolean(category || q);

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="FAQs"
        description={`${totalCount} FAQ${totalCount === 1 ? "" : "s"}${filtered ? " in this view" : " in the library"}`}
        actions={
          <Button render={<Link href="/admin/faqs/new" />}>
            <Plus className="size-4" />
            New FAQ
          </Button>
        }
      />

      {!res.ok && (
        <Card className="border-destructive/30 bg-destructive/10 py-4 text-destructive ring-destructive/20">
          <p className="px-4 text-sm">
            Could not load FAQs (status {res.status}). Is the CMS API running?
          </p>
        </Card>
      )}

      <FaqsCategoryTabs current={current} counts={counts} />

      <FaqsToolbar initialSearch={q ?? ""} />

      <FaqsTable items={items} filtered={filtered} />

      <AdminPagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        makeHref={(p) => faqsHref(current, { page: p })}
      />
    </div>
  );
}
