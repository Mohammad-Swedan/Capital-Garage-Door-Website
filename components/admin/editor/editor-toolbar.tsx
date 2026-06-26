"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Keyboard,
  Monitor,
  Pencil,
  Rocket,
  Save,
  Settings,
  Smartphone,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SaveStatus } from "./save-status";
import { ValidationPanel, type ValidationIssue } from "./validation-panel";
import type { AutosaveStatus } from "./use-autosave";

/**
 * Sticky editor toolbar (plan §B.3h). Presentational: page-editor owns the state
 * and passes handlers in. Sits below the admin shell's top bar (which is z-20).
 *
 * Agent 5 additions: an autosave status chip, a dismissible validation popover
 * with click-to-focus, and a keyboard-shortcuts hint (Ctrl/⌘+S to save,
 * Ctrl/⌘+⇧+P to publish).
 */

export interface EditorToolbarProps {
  title: string;
  status: string;
  editing: boolean;
  saving: boolean;
  dirty: boolean;
  /** When true, the canvas is the field form, not the in-place editor. */
  advanced: boolean;
  /** Canvas preview width. */
  device: "desktop" | "mobile";
  /** Autosave state machine, for the status chip. */
  saveStatus: AutosaveStatus;
  lastSavedAt: Date | null;
  /** Live validation issues + a jump-to-focus handler, for the validation popover. */
  issues: ValidationIssue[];
  onJumpToIssue: (path: string) => void;
  onToggleDevice: () => void;
  onToggleEditing: () => void;
  onToggleAdvanced: () => void;
  onOpenSettings: () => void;
  onSaveDraft: () => void;
  onSavePublish: () => void;
  onDiscard: () => void;
}

const NOOP_SUBSCRIBE = () => () => {};

/**
 * Platform-aware modifier label: ⌘ on Apple, Ctrl elsewhere. Uses
 * `useSyncExternalStore` so the server/first-client render agree on "Ctrl"
 * (no hydration mismatch) and it resolves to the real value after mount —
 * without a setState-in-effect.
 */
function useModKey(): string {
  return useSyncExternalStore(
    NOOP_SUBSCRIBE,
    () => (/mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );
}

export function EditorToolbar({
  title,
  status,
  editing,
  saving,
  dirty,
  advanced,
  device,
  saveStatus,
  lastSavedAt,
  issues,
  onJumpToIssue,
  onToggleDevice,
  onToggleEditing,
  onToggleAdvanced,
  onOpenSettings,
  onSaveDraft,
  onSavePublish,
  onDiscard,
}: EditorToolbarProps) {
  const published = status === "Published";
  const mod = useModKey();
  const [hintOpen, setHintOpen] = useState(false);
  const hasBlockingIssues = issues.length > 0;

  return (
    <div className="sticky top-14 z-30 -mx-4 mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-background/90 px-4 py-2.5 backdrop-blur supports-backdrop-filter:bg-background/75 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <Link
        href="/admin/pages"
        className="inline-flex items-center gap-1 rounded-md text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" />
        <span className="hidden sm:inline">Pages</span>
      </Link>

      <div className="ml-1 flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-semibold text-foreground" title={title}>
          {title || "Untitled page"}
        </span>
        <Badge variant={published ? "success" : "outline"}>{status}</Badge>
      </div>

      {/* Autosave status — pushed to its own slot so it doesn't crowd the title. */}
      <div className="hidden items-center sm:flex">
        <SaveStatus status={saveStatus} lastSavedAt={lastSavedAt} />
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        {!advanced && (
          <ValidationPanel issues={issues} onJumpToIssue={onJumpToIssue} />
        )}

        {!advanced && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleDevice}
            title={device === "mobile" ? "Switch to desktop width" : "Preview at mobile width"}
            aria-label={device === "mobile" ? "Desktop preview" : "Mobile preview"}
          >
            {device === "mobile" ? <Monitor className="size-4" /> : <Smartphone className="size-4" />}
            <span className="hidden lg:inline">{device === "mobile" ? "Desktop" : "Mobile"}</span>
          </Button>
        )}
        {!advanced && (
          <Button type="button" variant="ghost" size="sm" onClick={onToggleEditing}>
            {editing ? (
              <>
                <Eye className="size-4" /> Preview
              </>
            ) : (
              <>
                <Pencil className="size-4" /> Edit
              </>
            )}
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" onClick={onToggleAdvanced}>
          <Upload className="size-4 rotate-90" />
          <span className="hidden lg:inline">{advanced ? "In-place view" : "Advanced view"}</span>
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onOpenSettings}>
          <Settings className="size-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={saving || !dirty}
          onClick={onDiscard}
          className="text-muted-foreground"
          title="Discard all unsaved changes"
        >
          <Trash2 className="size-4" />
          <span className="hidden lg:inline">Discard</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={saving}
          onClick={onSaveDraft}
          title={`Save draft (${mod}+S)`}
        >
          <Save className="size-4" />
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="cta"
          size="sm"
          disabled={saving || hasBlockingIssues}
          onClick={onSavePublish}
          title={
            hasBlockingIssues
              ? "Resolve the validation issues before publishing"
              : `Publish (${mod}+Shift+P)`
          }
        >
          <Rocket className="size-4" />
          {published ? "Update & publish" : "Publish"}
        </Button>

        {/* Keyboard-shortcuts hint */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Keyboard shortcuts"
            aria-expanded={hintOpen}
            onClick={() => setHintOpen((v) => !v)}
            onBlur={() => setHintOpen(false)}
          >
            <Keyboard className="size-4" />
          </Button>
          {hintOpen && (
            <div
              role="dialog"
              aria-label="Keyboard shortcuts"
              className="elevate-float absolute right-0 z-50 mt-2 w-56 rounded-xl border border-border bg-popover p-3 text-popover-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-150"
            >
              <p className="cgd-eyebrow mb-2 text-muted-foreground">Shortcuts</p>
              <Shortcut keys={[mod, "S"]} label="Save draft" />
              <Shortcut keys={[mod, "Shift", "P"]} label="Publish" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="cgd-small text-foreground">{label}</span>
      <span className="flex items-center gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className={cn(
              "inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-border bg-muted px-1.5",
              "text-[0.7rem] font-medium text-muted-foreground",
            )}
          >
            {k}
          </kbd>
        ))}
      </span>
    </div>
  );
}
