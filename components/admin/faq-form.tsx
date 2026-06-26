"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveFaqAction } from "@/app/admin/faqs-actions";
import { TextField, TextAreaField } from "@/components/admin/fields";

export interface InitialFaq {
  id: number;
  question: string;
  answer: string;
  category: string | null;
}

export function FaqForm({ initial }: { initial?: InitialFaq }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");

  function submit() {
    setErrors([]);

    if (!question.trim()) {
      setErrors([{ code: "Validation", description: "A question is required." }]);
      return;
    }
    if (!answer.trim()) {
      setErrors([{ code: "Validation", description: "An answer is required." }]);
      return;
    }

    startTransition(async () => {
      const result = await saveFaqAction({
        id: initial?.id,
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim() ? category.trim() : null,
      });

      if (result.ok) {
        router.push("/admin/faqs");
        router.refresh();
      } else {
        setErrors(result.errors ?? [{ code: "Error", description: "Save failed." }]);
      }
    });
  }

  return (
    <form
      className="max-w-2xl space-y-8 pb-24"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {errors.length > 0 && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-medium">Could not save:</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((e, i) => (
              <li key={i}>
                <span className="font-mono text-xs">{e.code}</span> — {e.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="space-y-4">
        <TextField
          label="Question"
          value={question}
          onChange={setQuestion}
          placeholder="How long does a garage door repair take?"
        />
        <TextAreaField
          label="Answer"
          value={answer}
          onChange={setAnswer}
          rows={5}
          hint="Plain text. Shown verbatim on pages that attach this FAQ."
        />
        <TextField
          label="Category"
          value={category}
          onChange={setCategory}
          placeholder="Repairs"
          hint="Optional. Used to group/filter the library."
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3">
          <Button type="button" variant="outline" disabled={pending} onClick={() => router.push("/admin/faqs")}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
