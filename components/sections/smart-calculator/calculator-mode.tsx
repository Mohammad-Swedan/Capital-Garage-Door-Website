"use client";

import { useMemo, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { X, type LucideIcon } from "lucide-react";
import { OptionCard } from "./option-card";
import { SuburbInput } from "./suburb-input";
import { PricePanel, MobilePriceBar } from "./price-panel";
import {
  calculateEstimate,
  EMPTY_FORM,
  type CalculatorFormData,
  type ServiceType,
} from "./estimate-logic";
import {
  SERVICE_OPTIONS,
  ISSUE_OPTIONS,
  DOOR_TYPE_OPTIONS,
  DOOR_SIZE_OPTIONS,
  URGENCY_OPTIONS,
  type ChoiceOption,
} from "./constants";
import { usePricingCatalog } from "./use-pricing-catalog";
import { cn } from "@/lib/utils";

function Chip({
  label,
  icon: Icon,
  selected,
  onClick,
}: {
  label: string;
  icon?: LucideIcon;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all active:scale-95",
        selected
          ? "border-primary bg-primary text-white shadow-sm shadow-primary/25"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      )}
    >
      {Icon && <Icon className={cn("h-4 w-4 shrink-0", selected ? "text-white" : "text-sky-600")} aria-hidden="true" />}
      {label}
    </button>
  );
}

function ChipGroup({
  options,
  value,
  onSelect,
}: {
  options: ChoiceOption[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Chip key={o.value} label={o.label} icon={o.icon} selected={value === o.value} onClick={() => onSelect(o.value)} />
      ))}
    </div>
  );
}

function Field({ step, label, hint, children }: { step: number; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
          {step}
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">{label}</p>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
      </div>
      <div className="pl-7.5">{children}</div>
    </div>
  );
}

export function CalculatorMode({ onBook, onQuote }: { onBook: () => void; onQuote: () => void }) {
  const catalog = usePricingCatalog();
  const [form, setForm] = useState<CalculatorFormData>(EMPTY_FORM);
  const [mobileDetails, setMobileDetails] = useState(false);

  const estimate = useMemo(() => calculateEstimate(form, catalog), [form, catalog]);
  const hasSelection = form.serviceType !== "";
  const issues = form.serviceType ? ISSUE_OPTIONS[form.serviceType as ServiceType] : [];

  function selectService(value: ServiceType) {
    setForm((f) => (f.serviceType === value ? f : { ...f, serviceType: value, problem: "" }));
  }
  const setField = (key: keyof CalculatorFormData) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Close the mobile details sheet whenever we hand off to a conversion overlay.
  const handleBook = () => {
    setMobileDetails(false);
    onBook();
  };
  const handleQuote = () => {
    setMobileDetails(false);
    onQuote();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1">
        {/* Inputs (scrollable) */}
        <div className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:py-7">
          <div className="mx-auto max-w-xl space-y-7">
            <Field step={1} label="What do you need?" hint="Choose the service closest to your situation.">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SERVICE_OPTIONS.map((s) => (
                  <OptionCard
                    key={s.value}
                    title={s.label}
                    description={s.description}
                    icon={s.icon}
                    selected={form.serviceType === s.value}
                    onClick={() => selectService(s.value)}
                    className="p-4"
                  />
                ))}
              </div>
            </Field>

            <AnimatePresence initial={false}>
              {hasSelection && (
                <m.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-7 overflow-hidden"
                >
                  <Field step={2} label="What's the issue?" hint="Pick the main symptom or job.">
                    <ChipGroup options={issues} value={form.problem} onSelect={setField("problem")} />
                  </Field>

                  <Field step={3} label="Door type">
                    <ChipGroup options={DOOR_TYPE_OPTIONS} value={form.doorType} onSelect={setField("doorType")} />
                  </Field>

                  <Field step={4} label="Door size">
                    <ChipGroup options={DOOR_SIZE_OPTIONS} value={form.doorSize} onSelect={setField("doorSize")} />
                  </Field>

                  <Field step={5} label="How soon?" hint="Same-day emergencies include a priority fee.">
                    <ChipGroup options={URGENCY_OPTIONS} value={form.urgency} onSelect={setField("urgency")} />
                  </Field>

                  <Field step={6} label="Your suburb" hint="Optional — helps us confirm coverage.">
                    <SuburbInput value={form.suburb} onChange={setField("suburb")} />
                  </Field>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop live price panel */}
        <aside className="hidden w-[350px] shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50/60 p-5 md:block">
          <PricePanel estimate={estimate} hasSelection={hasSelection} onBook={handleBook} onQuote={handleQuote} />
        </aside>
      </div>

      {/* Mobile sticky price bar */}
      <div className="shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <MobilePriceBar
          estimate={estimate}
          hasSelection={hasSelection}
          onExpand={() => setMobileDetails(true)}
          onBook={handleBook}
        />
      </div>

      {/* Mobile details sheet */}
      <AnimatePresence>
        {mobileDetails && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex flex-col bg-black/40 md:hidden"
            onClick={() => setMobileDetails(false)}
          >
            <m.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="mt-auto max-h-[88%] overflow-y-auto rounded-t-3xl bg-white p-5 pb-7"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="mx-auto -mb-2 h-1 w-10 rounded-full bg-slate-200" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setMobileDetails(false)}
                  aria-label="Close details"
                  className="absolute right-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <PricePanel estimate={estimate} hasSelection={hasSelection} onBook={handleBook} onQuote={handleQuote} />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
