import Link from "next/link";
import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/services" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to services
        </Link>
        <h1 className="mt-1 text-xl font-semibold">New service</h1>
        <p className="text-sm text-muted-foreground">Add a service tile for the homepage catalog.</p>
      </div>
      <ServiceForm />
    </div>
  );
}
