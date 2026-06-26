import Link from "next/link";
import { Plus, DollarSign } from "lucide-react";
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

      {!res.ok ? (
        <AdminLoadError label="pricing items" status={res.status} />
      ) : items.length === 0 ? (
        <AdminTableEmpty
          icon={<DollarSign className="size-5" />}
          title="No pricing items yet"
          description="Add pricing scenarios to power cost guides and pricing tables."
        />
      ) : (
        <AdminTableCard
          head={
            <tr>
              <th className="px-4 py-3 font-medium">Scenario</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Note</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          }
        >
          {items.map((p) => (
            <tr key={p.id} className={adminRowClass}>
              <td className="px-4 py-3 font-medium text-foreground">{p.scenario}</td>
              <td className="px-4 py-3">
                {p.category ? (
                  <Badge variant="secondary">{p.category}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 font-medium tabular-nums text-foreground">
                {priceDisplay(p)}
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                {p.note ?? "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <PricingItemRowActions id={p.id} />
                </div>
              </td>
            </tr>
          ))}
        </AdminTableCard>
      )}
    </div>
  );
}
