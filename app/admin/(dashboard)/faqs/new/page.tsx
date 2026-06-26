import Link from "next/link";
import { FaqForm } from "@/components/admin/faq-form";

export default function NewFaqPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/faqs" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to FAQs
        </Link>
        <h1 className="mt-1 text-xl font-semibold">New FAQ</h1>
        <p className="text-sm text-muted-foreground">
          Add a reusable FAQ to the library. Authors can attach it to any page.
        </p>
      </div>
      <FaqForm />
    </div>
  );
}
