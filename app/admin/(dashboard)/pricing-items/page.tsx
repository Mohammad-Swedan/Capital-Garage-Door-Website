import Link from "next/link";
import { Plus } from "lucide-react";
import { adminRequest } from "@/lib/cms/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { PricingItemRowActions } from "@/components/admin/pricing-item-row-actions";

export const dynamic = "force-dynamic";

interface AdminPricingItem {
  id: number;
  scenario: string;
  priceMin: number | null;
  priceMax: number | null;
  priceLabel: string | null;
  note: string | null;
  category: string | null;
  includes: string | null;
  costFactors: string | null;
  nextStep: string | null;
  updatedAt: string;
}

function priceDisplay(p: AdminPricingItem): string {
  if (p.priceLabel) return p.priceLabel;
  if (p.priceMin != null && p.priceMax != null) return `$${p.priceMin} – $${p.priceMax}`;
  if (p.priceMin != null) return `From $${p.priceMin}`;
  if (p.priceMax != null) return `Up to $${p.priceMax}`;
  return "—";
}

export default async function PricingItemsGrid() {
  const res = await adminRequest<AdminPricingItem[]>("/api/admin/pricing-items");
  const items = res.data ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pricing items"
        description={`${items.length} item${items.length === 1 ? "" : "s"}`}
        actions={
          <Button render={<Link href="/admin/pricing-items/new" />}>
            <Plus className="size-4" />
            New pricing item
          </Button>
        }
      />

      {!res.ok && (
        <Card className="border-destructive/30 bg-destructive/10 py-4 text-destructive ring-destructive/20">
          <p className="px-4 text-sm">
            Could not load pricing items (status {res.status}). Is the CMS API running?
          </p>
        </Card>
      )}

      {res.ok && items.length === 0 ? (
        <Card className="items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No pricing items yet. Create your first one.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Scenario</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Price</th>
                  <th className="px-4 py-2.5 font-medium">Note</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium text-foreground">{p.scenario}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{priceDisplay(p)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.note ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <PricingItemRowActions id={p.id} />
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
