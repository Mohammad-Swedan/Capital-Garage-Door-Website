import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { listFaqs } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { FaqRowActions } from "@/components/admin/faq-row-actions";

export const dynamic = "force-dynamic";

const searchInputClass =
  "w-full rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground";

export default async function FaqsLibrary({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const res = await listFaqs({ search });
  const items = res.data?.items ?? [];
  const total = res.data?.totalCount ?? items.length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="FAQs"
        description={`${total} FAQ${total === 1 ? "" : "s"} in the library`}
        actions={
          <Button render={<Link href="/admin/faqs/new" />}>
            <Plus className="size-4" />
            New FAQ
          </Button>
        }
      />

      {/* Search (GET form → server re-render). */}
      <form method="GET" className="max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search questions…"
            className={searchInputClass}
          />
        </div>
      </form>

      {!res.ok && (
        <Card className="border-destructive/30 bg-destructive/10 py-4 text-destructive ring-destructive/20">
          <p className="px-4 text-sm">
            Could not load FAQs (status {res.status}). Is the CMS API running?
          </p>
        </Card>
      )}

      {res.ok && items.length === 0 ? (
        <Card className="items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {search ? `No FAQs match “${search}”.` : "No FAQs yet. Create your first one."}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Question</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Updated</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((f) => (
                  <tr key={f.id} className="transition-colors hover:bg-muted/40">
                    <td className="max-w-md px-4 py-3">
                      <span className="block truncate font-medium text-foreground">{f.question}</span>
                      <span className="block truncate text-xs text-muted-foreground">{f.answer}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{f.category || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {f.updatedAt ? new Date(f.updatedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <FaqRowActions id={f.id} />
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
