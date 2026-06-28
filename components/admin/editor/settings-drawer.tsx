"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
// Reused verbatim from the existing field library (imported, NOT edited).
import { RelatedLinksEditor, type RelatedLinkItem } from "@/components/admin/fields";
import { PinsEditor, type ReviewPin, type PricingPin, type ServicePin } from "./pins-editor";

/**
 * The editor's Settings drawer (plan §B.3g): a right `Sheet` holding the fields
 * that have no on-page representation, plus the canonical relational-link manager
 * and an Issues panel. Page-like editing happens on the canvas; metadata + FK
 * plumbing live here.
 */

export interface PageMeta {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
  status: string;
}

export interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meta: PageMeta;
  onMetaChange: (patch: Partial<PageMeta>) => void;
  relatedLinks: RelatedLinkItem[];
  onRelatedLinksChange: (links: RelatedLinkItem[]) => void;
  reviews: ReviewPin[];
  onReviewsChange: (v: ReviewPin[]) => void;
  pricingRows: PricingPin[];
  onPricingChange: (v: PricingPin[]) => void;
  services: ServicePin[];
  onServicesChange: (v: ServicePin[]) => void;
  /** Hide the drawer's pricing section for templates that edit cost rows inline (e.g. ServicePage). */
  showPricingPins?: boolean;
  issues: { path: string; label: string; message: string }[];
  /** Jump to / focus the offending field on the canvas. */
  onJumpToIssue?: (path: string) => void;
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

function LabeledField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function SettingsDrawer({
  open,
  onOpenChange,
  meta,
  onMetaChange,
  relatedLinks,
  onRelatedLinksChange,
  reviews,
  onReviewsChange,
  pricingRows,
  onPricingChange,
  services,
  onServicesChange,
  showPricingPins = true,
  issues,
  onJumpToIssue,
}: SettingsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Page settings</SheetTitle>
          <SheetDescription>
            Metadata, SEO, links and pins that don&apos;t live on the page.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="flex w-full flex-wrap">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="pins">Pins</TabsTrigger>
              <TabsTrigger value="issues">
                Issues
                {issues.length > 0 && (
                  <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-destructive/15 text-[10px] font-semibold text-destructive">
                    {issues.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* General */}
            <TabsContent value="general" className="mt-4 space-y-4">
              <LabeledField label="Title" hint="Used as the H1 fallback and breadcrumb label.">
                <input
                  className={inputClass}
                  value={meta.title}
                  onChange={(e) => onMetaChange({ title: e.target.value })}
                />
              </LabeledField>
              <LabeledField label="Slug" hint={`URL path under / — /${meta.slug || "your-slug"}`}>
                <input
                  className={inputClass}
                  value={meta.slug}
                  onChange={(e) => onMetaChange({ slug: e.target.value })}
                />
              </LabeledField>
              <div className="grid grid-cols-2 gap-3">
                <LabeledField label="Status">
                  <select
                    className={inputClass}
                    value={meta.status}
                    onChange={(e) => onMetaChange({ status: e.target.value })}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </LabeledField>
                <label className="flex items-end gap-2 pb-2">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border"
                    checked={meta.noIndex}
                    onChange={(e) => onMetaChange({ noIndex: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-foreground">No-index</span>
                </label>
              </div>
            </TabsContent>

            {/* SEO */}
            <TabsContent value="seo" className="mt-4 space-y-4">
              <LabeledField label="SEO title" hint={`${meta.seoTitle.length} chars · the <title> tag`}>
                <input
                  className={inputClass}
                  value={meta.seoTitle}
                  onChange={(e) => onMetaChange({ seoTitle: e.target.value })}
                />
              </LabeledField>
              <LabeledField
                label="SEO description"
                hint={`${meta.seoDescription.length} chars · aim for 120–160`}
              >
                <textarea
                  className={cn(inputClass, "resize-y")}
                  rows={4}
                  value={meta.seoDescription}
                  onChange={(e) => onMetaChange({ seoDescription: e.target.value })}
                />
              </LabeledField>
              {/* Google-snippet style preview */}
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="truncate text-sm text-[#1a0dab]">
                  {meta.seoTitle || meta.title || "Page title"}
                </p>
                <p className="truncate text-xs text-emerald-700">
                  example.com/{meta.slug}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {meta.seoDescription || "Meta description preview appears here."}
                </p>
              </div>
            </TabsContent>

            {/* Related links — canonical manager (reuses RelatedLinksEditor). */}
            <TabsContent value="links" className="mt-4">
              <RelatedLinksEditor values={relatedLinks} onChange={onRelatedLinksChange} />
            </TabsContent>

            {/* Pins — in-place pickers for the relational children. */}
            <TabsContent value="pins" className="mt-4">
              <PinsEditor
                reviews={reviews}
                onReviewsChange={onReviewsChange}
                pricingRows={pricingRows}
                onPricingChange={onPricingChange}
                services={services}
                onServicesChange={onServicesChange}
                showPricing={showPricingPins}
              />
            </TabsContent>

            {/* Issues — validation aggregation with jump-to links. */}
            <TabsContent value="issues" className="mt-4 space-y-2">
              {issues.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-emerald-50 p-3 text-sm text-emerald-700">
                  <CheckCircle2 className="size-4" /> No issues — ready to publish.
                </div>
              ) : (
                issues.map((issue) => (
                  <button
                    key={issue.path}
                    type="button"
                    onClick={() => onJumpToIssue?.(issue.path)}
                    className="flex w-full items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>
                      <span className="font-medium">{issue.label}</span>
                      <span className="block text-xs opacity-80">{issue.message}</span>
                    </span>
                  </button>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

