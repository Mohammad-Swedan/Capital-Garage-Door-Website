"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOTOR_MODELS, MOTOR_PRICE, SHARED_SPECS, type MotorModel } from "./motor-data";

/** Visual gauge ceiling (N) — gives the 1500N bar headroom without inventing a spec. */
const GAUGE_MAX = 1600;

function ModelToggle({
  selected,
  onChange,
}: {
  selected: MotorModel;
  onChange: (model: MotorModel) => void;
}) {
  return (
    <div className="relative flex w-full max-w-md rounded-full bg-primary/8 p-1 ring-1 ring-primary/15">
      {/* Sliding indicator */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-primary shadow-md transition-all duration-300 ease-out",
          selected.id === "1100n" ? "left-1" : "left-1/2",
        )}
      />
      {MOTOR_MODELS.map((model) => {
        const active = selected.id === model.id;
        return (
          <button
            key={model.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(model)}
            className={cn(
              "relative z-10 min-h-11 flex-1 rounded-full px-3 py-2 text-sm font-bold transition-colors sm:text-base",
              active ? "text-primary-foreground" : "text-primary/75 hover:text-primary",
            )}
          >
            {model.name}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Interactive 1100N / 1500N picker: segmented control, animated force gauge and
 * per-model fit rows over a shared spec list. The only client island on the
 * motors page — everything else renders on the server.
 */
export function ForceSelector() {
  const [selected, setSelected] = useState<MotorModel>(MOTOR_MODELS[0]);
  const gaugePct = Math.round((selected.force / GAUGE_MAX) * 100);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_32px_rgba(13,31,69,0.08)] sm:p-8">
      <ModelToggle selected={selected} onChange={setSelected} />

      {/* Force gauge */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Rated lifting force
          </p>
          <p
            key={`force-${selected.id}`}
            className="cgd-motor-spec-in font-display text-4xl font-black tabular-nums tracking-tight text-foreground sm:text-5xl"
          >
            {selected.force.toLocaleString("en-AU")}
            <span className="ml-1 text-xl font-bold text-muted-foreground sm:text-2xl">N</span>
          </p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-primary/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-[#0f4e9b] to-cta transition-[width] duration-700 ease-out"
            style={{ width: `${gaugePct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          N = newtons, how hard the motor can pull. More newtons, heavier doors.
        </p>
      </div>

      {/* Per-model fit — swaps (and animates) with the selection. */}
      <div key={selected.id} className="cgd-motor-spec-in mt-6" aria-live="polite">
        <p className="text-sm font-semibold text-primary">{selected.tagline}</p>
        <dl className="mt-3 space-y-2.5 border-b border-border pb-5 text-sm">
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 font-semibold text-muted-foreground">Best for</dt>
            <dd className="text-foreground">{selected.bestFor}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 font-semibold text-muted-foreground">Door fit</dt>
            <dd className="text-foreground">{selected.doorFit}</dd>
          </div>
        </dl>
      </div>

      {/* Shared spec list — identical on both models. */}
      <ul className="mt-5 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
        {SHARED_SPECS.map((spec) => (
          <li key={spec.label} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{spec.label}:</span> {spec.value}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl bg-muted/50 p-4 sm:p-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">
            ${MOTOR_PRICE.min}–${MOTOR_PRICE.max} supplied &amp; installed
          </span>{" "}
          — either model, programmed with your remotes on the day. Not sure which one? Our
          technician confirms the right motor for your door before any work starts, or you can{" "}
          <Link href="/calculator" className="font-semibold text-primary hover:underline">
            price your job in the calculator
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
