"use client";

import { m } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepSectionProps {
  step: number;
  title: string;
  hint?: string;
  /** Answered steps show a green check badge and a slightly muted title (still editable). */
  answered: boolean;
  /** Fade/slide the section in when first revealed. Off for step 1 and under reduced motion. */
  animateIn?: boolean;
  /** Scroll anchor — the wizard finds this section via `[data-step-id]` inside its own container. */
  stepId?: string;
  children: React.ReactNode;
}

/**
 * One wizard step: numbered badge (→ checkmark once answered), title + hint, and the
 * step's controls. Animates with opacity/translate only — never height — so the
 * section's offset is stable the moment it mounts and auto-scroll lands correctly.
 */
export function StepSection({
  step,
  title,
  hint,
  answered,
  animateIn = true,
  stepId,
  children,
}: StepSectionProps) {
  return (
    <m.section
      data-step-id={stepId}
      initial={animateIn ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      aria-label={`Step ${step}: ${title}`}
      className="space-y-3"
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300",
            answered ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary"
          )}
        >
          {answered ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : step}
        </span>
        <div className="min-w-0">
          <p className={cn("text-sm font-bold transition-colors duration-300", answered ? "text-slate-600" : "text-slate-900")}>
            {title}
          </p>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
      </div>
      <div className="pl-7.5">{children}</div>
    </m.section>
  );
}
