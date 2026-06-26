"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mirrors components/ui/input + textarea styling so the field forms read like
// the rest of the admin theme. Kept as a shared string (not the Input
// component) so existing <input>/<textarea>/<select> markup and logic are
// untouched — only the look changes.
const inputClass =
  "w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground hover:border-ring/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && !error && <span className="block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      <input className={inputClass} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
  error?: string;
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea className={cn(inputClass, "resize-y")} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-center gap-2 py-1">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 rounded border-border accent-primary" />
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint && <span className="text-xs text-muted-foreground">— {hint}</span>}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label}>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Editor for a list of plain strings (e.g. paragraphs, includedItems, serviceAreas). */
export function ListField({
  label,
  values,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const update = (i: number, v: string) => onChange(values.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, ""]);

  return (
    <fieldset className="space-y-2 rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
      <legend className="px-1 text-sm font-medium text-foreground">{label}</legend>
      {values.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          {textarea ? (
            <textarea className={cn(inputClass, "resize-y")} rows={2} value={v} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          ) : (
            <input className={inputClass} value={v} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
          )}
          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add
      </Button>
    </fieldset>
  );
}

export interface RepeaterFieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea";
}

/** Editor for a list of objects with a fixed set of fields (e.g. badges, processSteps, whyChoose). */
export function RepeaterField({
  label,
  values,
  onChange,
  fields,
}: {
  label: string;
  values: Record<string, string>[];
  onChange: (v: Record<string, string>[]) => void;
  fields: RepeaterFieldDef[];
}) {
  const update = (i: number, key: string, v: string) =>
    onChange(values.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, Object.fromEntries(fields.map((f) => [f.key, ""]))]);

  return (
    <fieldset className="space-y-3 rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
      <legend className="px-1 text-sm font-medium text-foreground">{label}</legend>
      {values.map((row, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-border/60 bg-muted/40 p-2.5">
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === "textarea" ? (
                <textarea className={cn(inputClass, "resize-y")} rows={2} value={row[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} />
              ) : (
                <input className={inputClass} value={row[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} />
              )}
            </Field>
          ))}
          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove item
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add item
      </Button>
    </fieldset>
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Dedicated FAQ editor (drives FAQPage JSON-LD on the public page → AEO). */
export function FaqEditor({ values, onChange }: { values: FaqItem[]; onChange: (v: FaqItem[]) => void }) {
  const update = (i: number, key: keyof FaqItem, v: string) =>
    onChange(values.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { question: "", answer: "" }]);

  return (
    <fieldset className="space-y-3 rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
      <legend className="px-1 text-sm font-medium text-foreground">FAQs</legend>
      {values.map((row, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-border/60 bg-muted/40 p-2.5">
          <Field label="Question">
            <input className={inputClass} value={row.question} onChange={(e) => update(i, "question", e.target.value)} />
          </Field>
          <Field label="Answer">
            <textarea className={cn(inputClass, "resize-y")} rows={3} value={row.answer} onChange={(e) => update(i, "answer", e.target.value)} />
          </Field>
          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove FAQ
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add FAQ
      </Button>
    </fieldset>
  );
}

export interface RelatedLinkItem {
  targetPageId: number | null;
  staticHref: string;
  labelOverride: string;
  linkGroup: string;
}

const LINK_GROUPS = [
  { value: "RelatedServices", label: "Related services" },
  { value: "NearbySuburbs", label: "Nearby suburbs" },
  { value: "RelatedPages", label: "Related pages" },
  { value: "RelatedArticles", label: "Related articles" },
];

/**
 * Internal-link editor. Each link points to either a target page (by id — survives slug changes)
 * or a static href (escape hatch). Stored as real FKs server-side (§5.3).
 */
export function RelatedLinksEditor({
  values,
  onChange,
}: {
  values: RelatedLinkItem[];
  onChange: (v: RelatedLinkItem[]) => void;
}) {
  const update = (i: number, patch: Partial<RelatedLinkItem>) =>
    onChange(values.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([...values, { targetPageId: null, staticHref: "", labelOverride: "", linkGroup: "RelatedServices" }]);

  return (
    <fieldset className="space-y-3 rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/5">
      <legend className="px-1 text-sm font-medium text-foreground">Related links</legend>
      {values.map((row, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-border/60 bg-muted/40 p-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Group">
              <select className={inputClass} value={row.linkGroup} onChange={(e) => update(i, { linkGroup: e.target.value })}>
                {LINK_GROUPS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Label override">
              <input className={inputClass} value={row.labelOverride} onChange={(e) => update(i, { labelOverride: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Target page ID" hint="Real FK — preferred">
              <input
                className={inputClass}
                type="number"
                value={row.targetPageId ?? ""}
                onChange={(e) => update(i, { targetPageId: e.target.value ? Number(e.target.value) : null, staticHref: "" })}
              />
            </Field>
            <Field label="Static href" hint="e.g. /contact (use if no target page)">
              <input
                className={inputClass}
                value={row.staticHref}
                onChange={(e) => update(i, { staticHref: e.target.value, targetPageId: null })}
              />
            </Field>
          </div>
          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove link
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add link
      </Button>
    </fieldset>
  );
}

/** Upload a hero image to the CMS and capture its asset id. */
export function AssetUploadField({
  label,
  assetId,
  previewUrl,
  onUploaded,
}: {
  label: string;
  assetId: number | null;
  previewUrl: string | null;
  onUploaded: (id: number, url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("altText", file.name);
      const res = await fetch("/admin/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = (await res.json()) as { id: number; cdnUrl: string };
      setPreview(data.cdnUrl);
      onUploaded(data.id, data.cdnUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field label={label} error={error ?? undefined} hint={assetId ? `Asset #${assetId}` : "No image yet"}>
      <div className="space-y-2">
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-32 w-auto rounded-lg border border-border object-cover" />
        )}
        <input
          type="file"
          accept="image/*"
          className="text-sm"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
      </div>
    </Field>
  );
}
