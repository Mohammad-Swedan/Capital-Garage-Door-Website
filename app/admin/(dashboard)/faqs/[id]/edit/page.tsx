import Link from "next/link";
import { notFound } from "next/navigation";
import { getFaq } from "@/lib/cms/admin";
import { FaqForm, type InitialFaq } from "@/components/admin/faq-form";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getFaq(Number(id));
  if (!res.ok || !res.data) notFound();

  const f = res.data;
  const initial: InitialFaq = {
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category ?? null,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/faqs" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to FAQs
        </Link>
        <h1 className="mt-1 text-xl font-semibold">Edit FAQ #{initial.id}</h1>
      </div>
      <FaqForm initial={initial} />
    </div>
  );
}
