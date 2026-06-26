"use client";

import { AlertTriangle, Check, CloudOff, Loader2, PauseCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSavedTime } from "./editor-helpers";
import type { AutosaveStatus } from "./use-autosave";

/**
 * The autosave status chip (Agent 5). A compact, glanceable indicator that
 * mirrors the autosave state machine: Saving… / Saved HH:MM / Unsaved changes /
 * Autosave paused (invalid) / Save failed. Purely presentational.
 */

export interface SaveStatusProps {
  status: AutosaveStatus;
  lastSavedAt: Date | null;
}

export function SaveStatus({ status, lastSavedAt }: SaveStatusProps) {
  let icon: React.ReactNode;
  let label: string;
  let tone: string;
  let title: string;

  switch (status) {
    case "saving":
      icon = <Loader2 className="size-3.5 motion-safe:animate-spin" />;
      label = "Saving…";
      tone = "text-muted-foreground";
      title = "Saving your draft";
      break;
    case "saved":
      icon = <Check className="size-3.5" />;
      label = lastSavedAt ? `Saved ${formatSavedTime(lastSavedAt)}` : "Saved";
      tone = "text-[oklch(0.46_0.15_150)] dark:text-[oklch(0.8_0.16_150)]";
      title = lastSavedAt ? `Draft saved at ${formatSavedTime(lastSavedAt)}` : "Draft saved";
      break;
    case "dirty":
      icon = <RefreshCw className="size-3.5" />;
      label = "Unsaved changes";
      tone = "text-amber-600 dark:text-amber-400";
      title = "Unsaved changes — autosaving shortly";
      break;
    case "blocked":
      icon = <PauseCircle className="size-3.5" />;
      label = "Autosave paused";
      tone = "text-amber-600 dark:text-amber-400";
      title = "Autosave is paused until the validation issues are fixed";
      break;
    case "error":
      icon = <AlertTriangle className="size-3.5" />;
      label = "Save failed";
      tone = "text-destructive";
      title = "The last save failed — try Save again";
      break;
    case "idle":
    default:
      if (lastSavedAt) {
        icon = <Check className="size-3.5" />;
        label = `Saved ${formatSavedTime(lastSavedAt)}`;
        tone = "text-[oklch(0.46_0.15_150)] dark:text-[oklch(0.8_0.16_150)]";
        title = `Draft saved at ${formatSavedTime(lastSavedAt)}`;
      } else {
        icon = <CloudOff className="size-3.5" />;
        label = "Not saved yet";
        tone = "text-muted-foreground";
        title = "This page has not been saved yet";
      }
      break;
  }

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-xs font-medium", tone)}
      title={title}
      aria-live="polite"
      role="status"
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </span>
  );
}
