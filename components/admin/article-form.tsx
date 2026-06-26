"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { savePageAction } from "@/app/admin/actions";
import {
  AssetUploadField,
  CheckboxField,
  FaqEditor,
  RelatedLinksEditor,
  SelectField,
  TextAreaField,
  TextField,
  type FaqItem,
  type RelatedLinkItem,
} from "@/components/admin/fields";

interface InitialPage {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
  status: string;
  heroImageAssetId: number | null;
  data: Record<string, any>;
  faqs: { question: string; answer: string }[];
  relatedLinks: { targetPageId: number | null; staticHref: string | null; labelOverride: string | null; linkGroup: string }[];
}

function arr<T = any>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/**
 * A single content block in the editor's working state. Loose by design — `type` selects which
 * fields matter (mirrors the loose ArticleContentBlock backend model + the §6 shape). Stored on the
 * page's Data blob; build/clean happens in buildBlocks().
 */
interface BlockDraft {
  type: string;
  level?: number;
  id?: string;
  text?: string;
  ordered?: boolean;
  title?: string;
  items?: string[];
  variant?: string;
  body?: string;
  assetId?: number | null;
  caption?: string;
  cite?: string;
}

const BLOCK_TYPES = [
  { value: "paragraph", label: "Paragraph" },
  { value: "heading", label: "Heading" },
  { value: "list", label: "List" },
  { value: "checklist", label: "Checklist" },
  { value: "callout", label: "Callout" },
  { value: "image", label: "Image" },
  { value: "quote", label: "Quote" },
];

const CALLOUT_VARIANTS = [
  { value: "tip", label: "Tip" },
  { value: "info", label: "Info" },
  { value: "safety", label: "Safety" },
  { value: "warning", label: "Warning" },
];

/**
 * Local helper (not in fields.tsx): a repeater for the polymorphic Article content blocks. Each row
 * picks a block `type` then shows only that variant's inputs. List/checklist items use a simple
 * newline-separated textarea to keep the editor usable without nested repeaters.
 */
function ContentBlocksEditor({ values, onChange }: { values: BlockDraft[]; onChange: (v: BlockDraft[]) => void }) {
  const patch = (i: number, p: Partial<BlockDraft>) => onChange(values.map((b, idx) => (idx === i ? { ...b, ...p } : b)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () => onChange([...values, { type: "paragraph", text: "" }]);

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 resize-y";
  const itemsText = (b: BlockDraft) => (b.items ?? []).join("\n");
  const setItems = (i: number, text: string) =>
    patch(i, { items: text.split("\n").map((s) => s.trimEnd()).filter((s) => s.length > 0) });

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3">
      <legend className="px-1 text-sm font-medium text-foreground">Content blocks</legend>
      {values.map((b, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SelectField label="Block type" value={b.type} onChange={(v) => patch(i, { type: v })} options={BLOCK_TYPES} />
            </div>
            <div className="flex gap-1 pt-5">
              <Button type="button" variant="outline" size="sm" onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => move(i, 1)} disabled={i === values.length - 1}>
                ↓
              </Button>
            </div>
          </div>

          {b.type === "heading" && (
            <>
              <SelectField
                label="Level"
                value={String(b.level ?? 2)}
                onChange={(v) => patch(i, { level: Number(v) })}
                options={[
                  { value: "2", label: "H2" },
                  { value: "3", label: "H3" },
                ]}
              />
              <TextField label="Text" value={b.text ?? ""} onChange={(v) => patch(i, { text: v })} />
              <TextField label="Anchor id" value={b.id ?? ""} onChange={(v) => patch(i, { id: v })} hint="Slug used by the table of contents." />
            </>
          )}

          {b.type === "paragraph" && (
            <TextAreaField label="Text" value={b.text ?? ""} onChange={(v) => patch(i, { text: v })} />
          )}

          {b.type === "list" && (
            <>
              <CheckboxField label="Ordered" checked={Boolean(b.ordered)} onChange={(v) => patch(i, { ordered: v })} />
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-foreground">Items (one per line)</span>
                <textarea className={inputClass} rows={4} value={itemsText(b)} onChange={(e) => setItems(i, e.target.value)} />
              </label>
            </>
          )}

          {b.type === "checklist" && (
            <>
              <TextField label="Title" value={b.title ?? ""} onChange={(v) => patch(i, { title: v })} />
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-foreground">Items (one per line)</span>
                <textarea className={inputClass} rows={4} value={itemsText(b)} onChange={(e) => setItems(i, e.target.value)} />
              </label>
            </>
          )}

          {b.type === "callout" && (
            <>
              <SelectField label="Variant" value={b.variant ?? "info"} onChange={(v) => patch(i, { variant: v })} options={CALLOUT_VARIANTS} />
              <TextField label="Title" value={b.title ?? ""} onChange={(v) => patch(i, { title: v })} />
              <TextAreaField label="Body" value={b.body ?? ""} onChange={(v) => patch(i, { body: v })} />
            </>
          )}

          {b.type === "image" && (
            <>
              <TextField
                label="Asset ID"
                value={b.assetId != null ? String(b.assetId) : ""}
                onChange={(v) => patch(i, { assetId: v ? Number(v) : null })}
                hint="ID of an uploaded media asset."
              />
              <TextField label="Caption" value={b.caption ?? ""} onChange={(v) => patch(i, { caption: v })} />
            </>
          )}

          {b.type === "quote" && (
            <>
              <TextAreaField label="Text" value={b.text ?? ""} onChange={(v) => patch(i, { text: v })} />
              <TextField label="Cite" value={b.cite ?? ""} onChange={(v) => patch(i, { cite: v })} />
            </>
          )}

          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove block
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add block
      </Button>
    </fieldset>
  );
}

/** Cleans the working block drafts into the §6 content-block shape stored in Data. */
function buildBlocks(blocks: BlockDraft[]): Record<string, any>[] {
  return blocks.map((b) => {
    switch (b.type) {
      case "heading":
        return { type: "heading", level: b.level ?? 2, text: b.text ?? "", id: b.id ?? "" };
      case "paragraph":
        return { type: "paragraph", text: b.text ?? "" };
      case "list":
        return { type: "list", ordered: Boolean(b.ordered), items: b.items ?? [] };
      case "checklist":
        return { type: "checklist", title: b.title ?? "", items: b.items ?? [] };
      case "callout":
        return { type: "callout", variant: b.variant ?? "info", title: b.title ?? "", body: b.body ?? "" };
      case "image":
        return { type: "image", assetId: b.assetId ?? 0, caption: b.caption ?? "" };
      case "quote":
        return { type: "quote", text: b.text ?? "", cite: b.cite ?? "" };
      default:
        return { type: b.type };
    }
  });
}

/** Hydrates stored §6 content blocks back into the editor's working drafts (for edit round-trip). */
function toDrafts(raw: unknown): BlockDraft[] {
  return arr<any>(raw).map((b) => ({
    type: typeof b.type === "string" ? b.type : "paragraph",
    level: b.level,
    id: b.id,
    text: b.text,
    ordered: b.ordered,
    title: b.title,
    items: Array.isArray(b.items) ? b.items : undefined,
    variant: b.variant,
    body: b.body,
    assetId: typeof b.assetId === "number" ? b.assetId : null,
    caption: b.caption,
    cite: b.cite,
  }));
}

export function ArticleForm({ initial }: { initial?: InitialPage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const d = initial?.data ?? {};

  // Page meta
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [noIndex, setNoIndex] = useState(initial?.noIndex ?? false);
  const [status, setStatus] = useState(initial?.status ?? "Draft");
  const [heroImageAssetId, setHeroImageAssetId] = useState<number | null>(initial?.heroImageAssetId ?? null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  // Body (Data)
  const [category, setCategory] = useState<string>(d.category ?? "");
  const [excerpt, setExcerpt] = useState<string>(d.excerpt ?? "");
  const [author, setAuthor] = useState<string>(d.author ?? "");
  const [shortAnswer, setShortAnswer] = useState<string>(d.shortAnswer ?? "");
  const [readingTimeOverride, setReadingTimeOverride] = useState<string>(d.readingTimeOverride ?? "");
  const [blocks, setBlocks] = useState<BlockDraft[]>(toDrafts(d.contentBlocks));
  const [expertTips, setExpertTips] = useState<Record<string, string>[]>(arr(d.expertTips));

  // Relational
  const [faqs, setFaqs] = useState<FaqItem[]>(arr<FaqItem>(initial?.faqs));
  const [relatedLinks, setRelatedLinks] = useState<RelatedLinkItem[]>(
    arr(initial?.relatedLinks).map((l) => ({
      targetPageId: l.targetPageId ?? null,
      staticHref: l.staticHref ?? "",
      labelOverride: l.labelOverride ?? "",
      linkGroup: l.linkGroup ?? "RelatedServices",
    })),
  );

  function buildPayload() {
    return {
      ...(initial ? { id: initial.id } : {}),
      templateType: "Article",
      routeGroup: "Blog",
      slug,
      title,
      seoTitle,
      seoDescription,
      noIndex,
      status,
      heroImageAssetId,
      data: {
        category,
        excerpt,
        author,
        shortAnswer,
        readingTimeOverride: readingTimeOverride || null,
        tableOfContentsOverride: null,
        contentBlocks: buildBlocks(blocks),
        expertTips: expertTips.map((t) => ({ kind: t.kind ?? "", title: t.title ?? "", body: t.body ?? "" })),
      },
      faqs: faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
      relatedLinks: relatedLinks.map((l, i) => {
        const hasTarget = l.targetPageId != null && l.targetPageId > 0;
        return {
          targetPageId: hasTarget ? l.targetPageId : null,
          staticHref: hasTarget ? null : l.staticHref || null,
          labelOverride: l.labelOverride || null,
          linkGroup: l.linkGroup,
          sortOrder: i,
        };
      }),
      pricingRows: [],
      reviews: [],
      services: [],
    };
  }

  function submit(publish: boolean) {
    setErrors([]);
    startTransition(async () => {
      const result = await savePageAction(buildPayload(), publish);
      if (result.ok) {
        router.push("/admin/pages");
        router.refresh();
      } else {
        setErrors(result.errors ?? [{ code: "Error", description: "Save failed." }]);
      }
    });
  }

  return (
    <form
      className="space-y-8 pb-24"
      onSubmit={(e) => {
        e.preventDefault();
        submit(false);
      }}
    >
      {errors.length > 0 && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-medium">Could not save:</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((e, i) => (
              <li key={i}>
                <span className="font-mono text-xs">{e.code}</span> — {e.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Page &amp; SEO</h2>
        <TextField label="Title" value={title} onChange={setTitle} hint="Used as the H1 and breadcrumb label." />
        <TextField label="Slug" value={slug} onChange={setSlug} hint="URL path under /blog/ (e.g. how-often-to-service-a-garage-door)." />
        <TextField label="SEO title" value={seoTitle} onChange={setSeoTitle} hint="The <title> tag." />
        <TextAreaField label="SEO description" value={seoDescription} onChange={setSeoDescription} hint="The meta description." />
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "Draft", label: "Draft" },
              { value: "Published", label: "Published" },
            ]}
          />
          <div className="flex items-end">
            <CheckboxField label="No-index" checked={noIndex} onChange={setNoIndex} hint="Exclude from search engines" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Featured image</h2>
        <AssetUploadField
          label="Featured image"
          assetId={heroImageAssetId}
          previewUrl={heroPreview}
          onUploaded={(id, url) => {
            setHeroImageAssetId(id);
            setHeroPreview(url);
          }}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Article meta</h2>
        <TextField label="Category" value={category} onChange={setCategory} hint="e.g. Maintenance, Safety, Buying Guide." />
        <TextAreaField label="Excerpt" value={excerpt} onChange={setExcerpt} hint="Short summary shown in listings." />
        <TextField label="Author" value={author} onChange={setAuthor} />
        <TextField
          label="Reading time override"
          value={readingTimeOverride}
          onChange={setReadingTimeOverride}
          hint="Optional — leave blank to derive from content (e.g. 5 min read)."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Content</h2>
        <TextAreaField
          label="Short answer"
          value={shortAnswer}
          onChange={setShortAnswer}
          rows={3}
          hint="The concise answer block (powers AEO / answer-engine surfacing)."
        />
        <ContentBlocksEditor values={blocks} onChange={setBlocks} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Expert tips</h2>
        {/* RepeaterField is reused for expert tips (kind/title/body); kind is free text matching maintenance|safety|technician|cost. */}
        <ExpertTipsEditor values={expertTips} onChange={setExpertTips} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">FAQs &amp; links</h2>
        <FaqEditor values={faqs} onChange={setFaqs} />
        <RelatedLinksEditor values={relatedLinks} onChange={setRelatedLinks} />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3">
          <Button type="button" variant="outline" disabled={pending} onClick={() => router.push("/admin/pages")}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" disabled={pending}>
            {pending ? "Saving…" : "Save draft"}
          </Button>
          <Button type="button" disabled={pending} onClick={() => submit(true)}>
            {pending ? "Saving…" : "Save & publish"}
          </Button>
        </div>
      </div>
    </form>
  );
}

/**
 * Local helper (not in fields.tsx): expert-tips repeater. `kind` is a constrained select
 * (maintenance|safety|technician|cost); title/body are free text.
 */
function ExpertTipsEditor({ values, onChange }: { values: Record<string, string>[]; onChange: (v: Record<string, string>[]) => void }) {
  const patch = (i: number, key: string, v: string) => onChange(values.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { kind: "maintenance", title: "", body: "" }]);

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3">
      <legend className="px-1 text-sm font-medium text-foreground">Expert tips</legend>
      {values.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-2">
          <SelectField
            label="Kind"
            value={row.kind ?? "maintenance"}
            onChange={(v) => patch(i, "kind", v)}
            options={[
              { value: "maintenance", label: "Maintenance" },
              { value: "safety", label: "Safety" },
              { value: "technician", label: "Technician" },
              { value: "cost", label: "Cost" },
            ]}
          />
          <TextField label="Title" value={row.title ?? ""} onChange={(v) => patch(i, "title", v)} />
          <TextAreaField label="Body" value={row.body ?? ""} onChange={(v) => patch(i, "body", v)} />
          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove tip
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add tip
      </Button>
    </fieldset>
  );
}
