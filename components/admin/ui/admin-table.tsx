import * as React from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * Shared chrome for admin list screens so every catalog table reads the same:
 * an elevated card wrapper, a muted sticky-feeling header row, zebra body rows
 * and a friendly empty state. Presentational + server-safe (no client hooks),
 * so it can be used from server-component list pages and client tables alike.
 */

/** Elevated card that wraps a `<table>`; renders the header row + striped body. */
export function AdminTableCard({
  head,
  children,
  className,
}: {
  /** The `<tr>` (with `<th>` cells) for the table head. */
  head: React.ReactNode;
  /** The body `<tr>` rows. */
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      variant="elevated"
      className={cn("overflow-hidden p-0", className)}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-border bg-muted/60 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase backdrop-blur supports-[backdrop-filter]:bg-muted/40">
            {head}
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </Card>
  );
}

/** Consistent empty state for list screens. */
export function AdminTableEmpty({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card
      variant="elevated"
      className="items-center justify-center gap-3 px-6 py-16 text-center"
    >
      {icon && (
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand ring-1 ring-inset ring-foreground/5">
          {icon}
        </span>
      )}
      <div className="space-y-1">
        <p className="font-heading text-base font-medium text-foreground">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </Card>
  );
}

/** Inline error card used when a catalog fetch fails. */
export function AdminLoadError({ label, status }: { label: string; status: number }) {
  return (
    <Card className="border-destructive/30 bg-destructive/10 py-4 text-destructive ring-1 ring-destructive/20">
      <p className="px-4 text-sm">
        Could not load {label} (status {status}). Is the CMS API running?
      </p>
    </Card>
  );
}

/** Shared row className: zebra striping + a brand-tinted hover, dark-mode aware. */
export const adminRowClass =
  "transition-colors even:bg-muted/30 hover:bg-brand-soft/40 dark:hover:bg-sidebar-accent/60";
