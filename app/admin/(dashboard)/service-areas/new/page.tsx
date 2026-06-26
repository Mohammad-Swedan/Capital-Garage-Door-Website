import Link from "next/link";
import { RegionForm } from "@/components/admin/region-form";

export default function NewRegionPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/service-areas" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to service areas
        </Link>
        <h1 className="mt-1 text-xl font-semibold">New region</h1>
        <p className="text-sm text-muted-foreground">A named grouping of suburbs (e.g. &quot;Northern Suburbs&quot;).</p>
      </div>
      <RegionForm />
    </div>
  );
}
