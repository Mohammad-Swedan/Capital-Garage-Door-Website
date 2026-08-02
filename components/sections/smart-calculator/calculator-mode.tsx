"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Minus,
  Plus,
  Sparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { track } from "@/lib/analytics";
import { OptionCard } from "./option-card";
import { SuburbInput } from "./suburb-input";
import { PricePanel } from "./price-panel";
import { StickyPriceBar } from "./sticky-price-bar";
import { StepSection } from "./step-section";
import {
  calculateEstimate,
  buildQuotePrefill,
  EMPTY_FORM,
  NOT_SURE_ID,
  type CalculatorFormData,
  type ServiceType,
} from "./estimate-logic";
import type { QuoteEmbedPrefill } from "@/lib/booking-embed";
import {
  SERVICE_OPTIONS,
  ISSUE_OPTIONS,
  DOOR_TYPE_OPTIONS,
  DOOR_SIZE_OPTIONS,
  type ChoiceOption,
} from "./constants";
import { PRICING_BY_ID, clampQuantity, type PricingScenario } from "./pricing-data";
import { usePricingCatalog } from "./use-pricing-catalog";
import { cn } from "@/lib/utils";

/**
 * Calculator mode as a guided step wizard: the six questions stack vertically in one
 * scrolling column; answering a step reveals the next and auto-scrolls the calculator's
 * OWN scroll container to it (the page never moves). The live price is a sticky bar at
 * the bottom on every breakpoint, and finishing reveals a full estimate summary.
 */

const STEP_IDS = ["service", "issue", "doorType", "doorSize", "timing", "suburb"] as const;
type StepId = (typeof STEP_IDS)[number];
const TOTAL_STEPS = STEP_IDS.length;
/** Scroll anchor for the closing summary section (not a numbered step). */
const SUMMARY_ID = "summary";

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

/**
 * Quantity picker for scenarios priced per count (springs) or per unit (remotes/hinges).
 * Picking a count confirms immediately; the per-unit stepper confirms via Continue.
 */
function QuantityControl({
  scenario,
  value,
  onChange,
  onConfirm,
}: {
  scenario: PricingScenario;
  value: number;
  onChange: (n: number) => void;
  onConfirm: () => void;
}) {
  if (scenario.pricingModel === "perCount" && scenario.countVariants) {
    const counts = Object.keys(scenario.countVariants).map(Number).sort((a, b) => a - b);
    return (
      <div className="flex flex-wrap gap-2">
        {counts.map((n) => (
          <Chip
            key={n}
            label={String(n)}
            selected={value === n}
            onClick={() => {
              onChange(n);
              onConfirm();
            }}
          />
        ))}
      </div>
    );
  }

  if (scenario.pricingModel === "perUnit") {
    const min = 1;
    const max = scenario.maxQty ?? 6;
    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1">
          <button
            type="button"
            aria-label="Fewer"
            disabled={value <= min}
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-[1.5rem] text-center text-sm font-bold tabular-nums text-slate-900">{value}</span>
          <button
            type="button"
            aria-label="More"
            disabled={value >= max}
            onClick={() => onChange(Math.min(max, value + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:brightness-110 active:scale-95"
        >
          Continue
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return null;
}

/** Thin completion bar under the card header: "Step X of 6" + fill. */
function WizardProgress({ answered, activeStep }: { answered: number; activeStep: number }) {
  const done = answered >= TOTAL_STEPS;
  return (
    <div className="shrink-0 border-b border-slate-100 bg-white px-4 py-2.5 sm:px-6">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <p className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {done ? "Estimate ready" : `Step ${activeStep} of ${TOTAL_STEPS}`}
        </p>
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-primary to-[#0f4e9b] transition-all duration-500 ease-out",
              done && "from-emerald-500 to-emerald-400"
            )}
            style={{ width: `${(answered / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function CalculatorMode({
  onBook,
  onQuote,
}: {
  onBook: () => void;
  onQuote: (prefill: QuoteEmbedPrefill) => void;
}) {
  const catalog = usePricingCatalog();
  const [form, setForm] = useState<CalculatorFormData>(EMPTY_FORM);
  /** Highest step (1-based) revealed so far — monotonic, so editing an earlier answer never collapses later steps. */
  const [revealed, setRevealed] = useState(1);
  /** Emergency defaults to false, so "answered" needs an explicit flag (either timing card counts). */
  const [timingChosen, setTimingChosen] = useState(false);
  /** Suburb is optional — the step completes via "Show my estimate" / "Skip". */
  const [finished, setFinished] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  const estimate = useMemo(() => calculateEstimate(form, catalog), [form, catalog]);
  const hasSelection = form.serviceType !== "";

  // A completed estimate is the strongest on-site intent signal short of a call,
  // so it is worth knowing which pages produce them. Keyed on `finished`, which
  // only ever flips true once per session, so this fires once.
  const trackedComplete = useRef(false);
  useEffect(() => {
    if (!finished || trackedComplete.current) return;
    trackedComplete.current = true;
    track("calculator_complete", {
      service_type: form.serviceType || null,
      problem_id: form.problemId || null,
      emergency: form.emergency === true,
      // Whether the live CMS price list drove the headline range or the baked-in
      // fallback did — tells us if the catalog is actually being hit.
      price_source: estimate.priceSource,
      price_min: estimate.minPrice,
      price_max: estimate.maxPrice,
    });
  }, [finished, form, estimate]);
  const issues = form.serviceType ? ISSUE_OPTIONS[form.serviceType as ServiceType] : [];

  const scenario: PricingScenario | undefined =
    form.problemId && form.problemId !== NOT_SURE_ID ? PRICING_BY_ID.get(form.problemId) : undefined;
  const showQuantity =
    scenario && ((scenario.pricingModel === "perCount" && scenario.countVariants) || scenario.pricingModel === "perUnit");
  const quantityNoun = scenario?.pricingModel === "perCount" ? "springs" : `${scenario?.unitLabel ?? "item"}s`;

  const answered: Record<StepId, boolean> = {
    service: form.serviceType !== "",
    issue: form.problemId !== "",
    doorType: form.doorType !== "",
    doorSize: form.doorSize !== "",
    timing: timingChosen,
    suburb: finished,
  };
  const answeredCount = STEP_IDS.filter((id) => answered[id]).length;
  const firstUnanswered = STEP_IDS.findIndex((id) => !answered[id]);
  const activeStep = firstUnanswered === -1 ? TOTAL_STEPS : firstUnanswered + 1;

  /**
   * Scroll the wizard's own container so the section tagged `data-step-id={id}` sits near
   * the top. Double rAF: the target section may have mounted in this very commit, so wait
   * for it to be laid out first. Scrolls the internal column only — the page never moves.
   * (Sections are found by a container-scoped query, so two mounted calculators can't
   * cross-talk the way global element ids would.)
   */
  function scrollToStep(id: string) {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const container = scrollRef.current;
        const el = container?.querySelector<HTMLElement>(`[data-step-id="${id}"]`);
        if (!container || !el) return;
        const top =
          el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 12;
        container.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
      })
    );
  }

  const reveal = (step: number) => setRevealed((r) => Math.max(r, step));

  function selectService(value: ServiceType) {
    const changed = form.serviceType !== value;
    setForm((f) => (f.serviceType === value ? f : { ...f, serviceType: value, problemId: "", quantity: 1 }));
    reveal(2);
    // A (re)selection means the issue is (now) unanswered — take the user there.
    if (changed || form.problemId === "") scrollToStep("issue");
  }

  function selectIssue(id: string) {
    setForm((f) => ({ ...f, problemId: id, quantity: 1 }));
    reveal(3);
    const sc = id !== NOT_SURE_ID ? PRICING_BY_ID.get(id) : undefined;
    const needsQty = sc && ((sc.pricingModel === "perCount" && sc.countVariants) || sc.pricingModel === "perUnit");
    // Quantity scenarios pause here — the count picker appears inline and confirms the advance.
    if (!needsQty) scrollToStep("doorType");
  }

  function setQuantity(n: number) {
    setForm((f) => (scenario ? { ...f, quantity: clampQuantity(scenario, n) } : f));
  }

  function selectDoorType(value: string) {
    setForm((f) => ({ ...f, doorType: value }));
    reveal(4);
    scrollToStep("doorSize");
  }

  function selectDoorSize(value: string) {
    setForm((f) => ({ ...f, doorSize: value }));
    reveal(5);
    scrollToStep("timing");
  }

  function selectTiming(emergency: boolean) {
    setForm((f) => ({ ...f, emergency }));
    setTimingChosen(true);
    reveal(6);
    scrollToStep("suburb");
  }

  function finish() {
    setFinished(true);
    scrollToStep(SUMMARY_ID);
  }

  // Close the details sheet whenever we hand off to a conversion overlay.
  const handleBook = () => {
    setDetailsOpen(false);
    onBook();
  };
  const handleQuote = () => {
    setDetailsOpen(false);
    onQuote(buildQuotePrefill(form));
  };

  const stepAnimate = !reduceMotion;

  return (
    <div className="flex h-full flex-col">
      <WizardProgress answered={answeredCount} activeStep={activeStep} />

      {/* The wizard column — the only scroll area (overscroll-contained so the page stays put).
          data-lenis-prevent: Lenis captures desktop wheel input for the page; without it this
          nested container never scrolls. */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 md:py-7"
      >
        <div className="mx-auto max-w-2xl space-y-7 pb-4">
          <StepSection
            step={1}
            title="What do you need?"
            hint="Choose the service closest to your situation."
            answered={answered.service}
            animateIn={false}
            stepId="service"
          >
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
          </StepSection>

          {revealed >= 2 && (
            <StepSection
              step={2}
              title="What's the issue?"
              hint="Pick the main symptom or job."
              answered={answered.issue}
              animateIn={stepAnimate}
              stepId="issue"
            >
              <div className="space-y-3">
                <ChipGroup options={issues} value={form.problemId} onSelect={selectIssue} />
                {showQuantity && scenario && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                    <p className="mb-2 text-xs font-semibold text-slate-600">How many {quantityNoun}?</p>
                    <QuantityControl
                      scenario={scenario}
                      value={form.quantity}
                      onChange={setQuantity}
                      onConfirm={() => scrollToStep("doorType")}
                    />
                  </div>
                )}
              </div>
            </StepSection>
          )}

          {revealed >= 3 && (
            <StepSection
              step={3}
              title="Door type"
              answered={answered.doorType}
              animateIn={stepAnimate}
              stepId="doorType"
            >
              <ChipGroup options={DOOR_TYPE_OPTIONS} value={form.doorType} onSelect={selectDoorType} />
            </StepSection>
          )}

          {revealed >= 4 && (
            <StepSection
              step={4}
              title="Door size"
              answered={answered.doorSize}
              animateIn={stepAnimate}
              stepId="doorSize"
            >
              <ChipGroup options={DOOR_SIZE_OPTIONS} value={form.doorSize} onSelect={selectDoorSize} />
            </StepSection>
          )}

          {revealed >= 5 && (
            <StepSection
              step={5}
              title="How soon?"
              hint="Urgent after-hours call-outs include a $500 priority fee."
              answered={answered.timing}
              animateIn={stepAnimate}
              stepId="timing"
            >
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <OptionCard
                  title="Standard booking"
                  description="Next available business-hours visit"
                  icon={CalendarCheck}
                  selected={timingChosen && !form.emergency}
                  onClick={() => selectTiming(false)}
                  className="p-4"
                />
                <OptionCard
                  title="Emergency / after-hours"
                  description="Nights, weekends & urgent — adds $500"
                  icon={Zap}
                  selected={timingChosen && form.emergency}
                  onClick={() => selectTiming(true)}
                  className="p-4"
                />
              </div>
            </StepSection>
          )}

          {revealed >= 6 && (
            <StepSection
              step={6}
              title="Your suburb"
              hint="Optional — helps us confirm coverage."
              answered={answered.suburb}
              animateIn={stepAnimate}
              stepId="suburb"
            >
              <div className="space-y-4">
                <SuburbInput
                  value={form.suburb}
                  onChange={(suburb) => setForm((f) => ({ ...f, suburb }))}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={finish}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-[#0f4e9b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-105 active:scale-[0.99]"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Show my estimate
                  </button>
                  {!finished && (
                    <button
                      type="button"
                      onClick={finish}
                      className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700"
                    >
                      Skip for now
                    </button>
                  )}
                </div>
              </div>
            </StepSection>
          )}

          {finished && (
            <m.section
              data-step-id={SUMMARY_ID}
              initial={stepAnimate ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              aria-label="Your estimate"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Your estimate</p>
                  <p className="text-xs text-slate-500">Based on your answers — free &amp; no obligation.</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <PricePanel estimate={estimate} hasSelection={hasSelection} onBook={handleBook} onQuote={handleQuote} />
              </div>
            </m.section>
          )}
        </div>
      </div>

      {/* Sticky live price bar — every breakpoint. */}
      <div className="shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <StickyPriceBar
          estimate={estimate}
          hasSelection={hasSelection}
          onDetails={() => setDetailsOpen(true)}
          onQuote={handleQuote}
        />
      </div>

      {/* Details sheet (full PricePanel) — bottom sheet on all breakpoints. */}
      <AnimatePresence>
        {detailsOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex flex-col bg-black/40"
            onClick={() => setDetailsOpen(false)}
          >
            <m.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              data-lenis-prevent
              className="mt-auto max-h-[88%] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-white p-5 pb-7 sm:mx-auto sm:max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="mx-auto -mb-2 h-1 w-10 rounded-full bg-slate-200" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setDetailsOpen(false)}
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
