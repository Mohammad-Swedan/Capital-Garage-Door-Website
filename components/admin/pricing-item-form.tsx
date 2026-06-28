"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { savePricingItemAction } from "@/app/admin/pricing-items-actions";
import { TextField, TextAreaField, Field } from "@/components/admin/fields";

const numberInputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export interface InitialPricingItem {
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
}

export function PricingItemForm({ initial }: { initial?: InitialPricingItem }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const [scenario, setScenario] = useState(initial?.scenario ?? "");
  const [priceMin, setPriceMin] = useState(initial?.priceMin != null ? String(initial.priceMin) : "");
  const [priceMax, setPriceMax] = useState(initial?.priceMax != null ? String(initial.priceMax) : "");
  const [priceLabel, setPriceLabel] = useState(initial?.priceLabel ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [internalNote, setInternalNote] = useState(initial?.internalNote ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [includes, setIncludes] = useState(initial?.includes ?? "");
  const [costFactors, setCostFactors] = useState(initial?.costFactors ?? "");
  const [nextStep, setNextStep] = useState(initial?.nextStep ?? "");

  function submit() {
    setErrors([]);

    if (!scenario.trim()) {
      setErrors([{ code: "Validation", description: "A scenario is required." }]);
      return;
    }

    const text = (v: string) => (v.trim() ? v.trim() : null);
    const num = (v: string) => (v.trim() ? Number(v) : null);

    startTransition(async () => {
      const result = await savePricingItemAction({
        ...(initial ? { id: initial.id } : {}),
        scenario: scenario.trim(),
        priceMin: num(priceMin),
        priceMax: num(priceMax),
        priceLabel: text(priceLabel),
        note: text(note),
        internalNote: text(internalNote),
        category: text(category),
        includes: text(includes),
        costFactors: text(costFactors),
        nextStep: text(nextStep),
      });

      if (result.ok) {
        router.push("/admin/pricing-items");
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
          label="Scenario"
          value={scenario}
          onChange={setScenario}
          placeholder="Spring replacement"
          hint="The pricing row label, e.g. the job or service scenario."
        />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price min" hint="Optional. Lower bound in dollars.">
            <input
              type="number"
              min={0}
              step="0.01"
              className={numberInputClass}
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
          </Field>
          <Field label="Price max" hint="Optional. Upper bound in dollars.">
            <input
              type="number"
              min={0}
              step="0.01"
              className={numberInputClass}
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </Field>
        </div>
        <TextField
          label="Price label"
          value={priceLabel}
          onChange={setPriceLabel}
          placeholder="From $180"
          hint="Optional. Overrides the min/max display."
        />
        <TextField
          label="Category"
          value={category}
          onChange={setCategory}
          placeholder="Repairs"
          hint="Optional. Groups pricing rows."
        />
        <TextAreaField label="Note" value={note} onChange={setNote} rows={2} hint="Optional. Short caveat or detail. Shown publicly in the cost table." />
        <TextAreaField
          label="Internal note (AI · not shown publicly)"
          value={internalNote}
          onChange={setInternalNote}
          rows={3}
          hint="Optional. Private context for the AI assistant — never rendered on the public site."
        />
        <TextAreaField
          label="Includes"
          value={includes}
          onChange={setIncludes}
          rows={3}
          hint="Optional. What the price covers (cost-guide rows)."
        />
        <TextAreaField
          label="Cost factors"
          value={costFactors}
          onChange={setCostFactors}
          rows={3}
          hint="Optional. What drives the cost up or down (cost-guide rows)."
        />
        <TextAreaField
          label="Next step"
          value={nextStep}
          onChange={setNextStep}
          rows={2}
          hint="Optional. Recommended action (cost-guide rows)."
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3">
          <Button type="button" variant="outline" disabled={pending} onClick={() => router.push("/admin/pricing-items")}>
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
