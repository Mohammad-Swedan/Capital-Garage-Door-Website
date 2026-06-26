"use client";

import Link from "next/link";
import { ArrowLeft, Eye, Monitor, Pencil, Save, Settings, Smartphone, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Sticky editor toolbar (plan §B.3h). Presentational: page-editor owns the state
 * and passes handlers in. Sits below the admin shell's top bar (which is z-20).
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
  onToggleDevice: () => void;
  onToggleEditing: () => void;
  onToggleAdvanced: () => void;
  onOpenSettings: () => void;
  onSaveDraft: () => void;
  onSavePublish: () => void;
  onDiscard: () => void;
}

export function EditorToolbar({
  title,
  status,
  editing,
  saving,
  dirty,
  advanced,
  device,
  onToggleDevice,
  onToggleEditing,
  onToggleAdvanced,
  onOpenSettings,
  onSaveDraft,
  onSavePublish,
  onDiscard,
}: EditorToolbarProps) {
  const published = status === "Published";
  return (
    <div className="sticky top-14 z-30 -mx-4 mb-4 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <Link
        href="/admin/pages"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        <span className="hidden sm:inline">Pages</span>
      </Link>

      <div className="ml-1 flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-medium text-foreground" title={title}>
          {title || "Untitled page"}
        </span>
        <Badge variant={published ? "default" : "outline"} className={cn(published && "bg-emerald-600")}>
          {status}
        </Badge>
        {dirty && (
          <span className="text-xs text-amber-600" title="Unsaved changes">
            • Unsaved
          </span>
        )}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
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
          {advanced ? "In-place view" : "Advanced view"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onOpenSettings}>
          <Settings className="size-4" /> Settings
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={saving || !dirty}
          onClick={onDiscard}
          className="text-muted-foreground"
        >
          <Trash2 className="size-4" /> Discard
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={onSaveDraft}>
          <Save className="size-4" />
          {saving ? "Saving…" : "Save draft"}
        </Button>
        <Button type="button" size="sm" disabled={saving} onClick={onSavePublish}>
          {saving ? "Saving…" : "Save & publish"}
        </Button>
      </div>
    </div>
  );
}
