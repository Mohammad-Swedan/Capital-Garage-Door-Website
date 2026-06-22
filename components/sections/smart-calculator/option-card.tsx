"use client";

import { m } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function OptionCard({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
  className,
}: OptionCardProps) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative flex w-full cursor-pointer items-start gap-4 rounded-2xl border text-left p-5 transition-all duration-300",
        "bg-white shadow-sm",
        selected
          ? "border-sky-600 bg-sky-50 shadow-[0_4px_20px_rgba(3,105,161,0.08)] ring-1 ring-sky-600"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md hover:bg-slate-50",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300",
            selected
              ? "border-sky-200 bg-sky-100 text-sky-700"
              : "border-slate-100 bg-slate-50 text-slate-500 group-hover:text-slate-700"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      )}

      <div className="flex-1">
        <h4
          className={cn(
            "font-semibold text-base transition-colors duration-300",
            selected ? "text-sky-900" : "text-slate-900"
          )}
        >
          {title}
        </h4>
        {description && (
          <p className="mt-1 text-sm text-slate-500 leading-relaxed font-normal">
            {description}
          </p>
        )}
      </div>

      {/* Selected Indicator Checkmark / Radio Dot */}
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 mt-0.5",
          selected
            ? "border-sky-600 bg-sky-600"
            : "border-slate-300 bg-white"
        )}
      >
        {selected && (
          <span className="block h-2 w-2 rounded-full bg-white animate-scale-in" />
        )}
      </div>
    </m.button>
  );
}
