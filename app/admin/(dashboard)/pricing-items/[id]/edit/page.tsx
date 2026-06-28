import Link from "next/link";
import { notFound } from "next/navigation";
import { adminRequest } from "@/lib/cms/admin";
import { PricingItemForm, type InitialPricingItem } from "@/components/admin/pricing-item-form";

export const dynamic = "force-dynamic";

interface AdminPricingItem {
  id: number;
  scenario: string;
  priceMin: number | null;
  priceMax: number | null;
  priceLabel: string | null;
  note: string | null;
  internalNote: string | null;
  category: string | null;
  includes: string | null;
  costFactors: string | null;
  nextStep: string | null;
  updatedAt: string;
}

export default async function EditPricingItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await adminRequest<AdminPricingItem>(`/api/admin/pricing-items/${Number(id)}`);
  if (!res.ok || !res.data) notFound();

  const p = res.data;
  const initial: InitialPricingItem = {
    id: p.id,
    scenario: p.scenario,
    priceMin: p.priceMin ?? null,
    priceMax: p.priceMax ?? null,
    priceLabel: p.priceLabel ?? null,
    note: p.note ?? null,
    internalNote: p.internalNote ?? null,
    category: p.category ?? null,
    includes: p.includes ?? null,
    costFactors: p.costFactors ?? null,
    nextStep: p.nextStep ?? null,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/pricing-items" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to pricing items
        </Link>
        <h1 className="mt-1 text-xl font-semibold">Edit pricing item #{initial.id}</h1>
      </div>
      <PricingItemForm initial={initial} />
    </div>
  );
}
