"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Validation popover for the editor toolbar (Agent 5).
 *
 * A dismissible panel that summarises the live `issues` list with friendly
 * labels and click-to-focus. Built as a self-contained popover (the codebase has
 * no Popover primitive) with outside-click + Escape to close and a focus-visible
 * trigger. When there are no issues it reads as a calm "Ready to publish" pill.
 */

export interface ValidationIssue {
  path: string;
  label: string;
  message: string;
}

export interface ValidationPanelProps {
  issues: ValidationIssue[];
  /** Focus/scroll to the offending field (on-canvas) or open settings (meta). */
  onJumpToIssue: (path: string) => void;
}

export function ValidationPanel({ issues, onJumpToIssue }: ValidationPanelProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const count = issues.length;
  const clean = count === 0;

  // Close on outside click / Escape while open.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={clean ? "No validation issues" : `${count} validation ${count === 1 ? "issue" : "issues"}`}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-[min(var(--radius-md),12px)] border px-2.5 text-[0.8rem] font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
          clean
            ? "border-transparent bg-[color-mix(in_oklab,oklch(0.62_0.17_150),transparent_88%)] text-[oklch(0.46_0.15_150)] hover:bg-[color-mix(in_oklab,oklch(0.62_0.17_150),transparent_80%)] dark:text-[oklch(0.8_0.16_150)]"
            : "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/15",
        )}
      >
        {clean ? <CheckCircle2 className="size-3.5" /> : <AlertTriangle className="size-3.5" />}
        <span className="hidden sm:inline">{clean ? "Ready" : `${count} ${count === 1 ? "issue" : "issues"}`}</span>
        <span className="sm:hidden">{clean ? "OK" : count}</span>
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Validation issues"
          className="elevate-float absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-150"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="cgd-small font-semibold text-foreground">
              {clean ? "Pre-publish checks" : `${count} ${count === 1 ? "thing" : "things"} to fix`}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="-mr-1 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <X className="size-4" />
            </button>
          </div>

          {clean ? (
            <div className="flex items-start gap-2.5 px-4 py-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[oklch(0.55_0.15_150)]" />
              <div>
                <p className="cgd-small font-medium text-foreground">Ready to publish</p>
                <p className="cgd-small text-muted-foreground">
                  Title, slug, SEO and on-page content all look good.
                </p>
              </div>
            </div>
          ) : (
            <ul className="max-h-[min(60vh,22rem)] divide-y divide-border overflow-y-auto">
              {issues.map((issue) => (
                <li key={issue.path}>
                  <button
                    type="button"
                    onClick={() => {
                      onJumpToIssue(issue.path);
                      setOpen(false);
                    }}
                    className="group flex w-full items-start gap-2.5 px-4 py-3 text-left outline-none transition-colors hover:bg-destructive/5 focus-visible:bg-destructive/5"
                  >
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <span className="min-w-0 flex-1">
                      <span className="cgd-small block font-medium text-foreground">{issue.label}</span>
                      <span className="cgd-small block text-muted-foreground">{issue.message}</span>
                    </span>
                    <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
