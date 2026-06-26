import Link from "next/link";
import { PricingItemForm } from "@/components/admin/pricing-item-form";

export default function NewPricingItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/pricing-items" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to pricing items
        </Link>
        <h1 className="mt-1 text-xl font-semibold">New pricing item</h1>
        <p className="text-sm text-muted-foreground">Add a centralized pricing row.</p>
      </div>
      <PricingItemForm />
    </div>
  );
}
