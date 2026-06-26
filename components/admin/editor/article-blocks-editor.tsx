"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListField } from "@/components/admin/fields";
import type { ContentBlock } from "@/types/article";
import { useEditable } from "./editable-context";
import { EditableText } from "./editable";

/**
 * In-place editor for an Article's heterogeneous `contentBlocks` (the richest repeater): per-block
 * type switch, move/delete, an "+ Add block" menu, and inline field editing. Only mounted in edit
 * mode (article-content.tsx renders the real blocks otherwise), and lazy-loaded so the public
 * article bundle never pulls it in.
 */

const inputClass =
  "rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

const BLOCK_TYPES: { value: ContentBlock["type"]; label: string }[] = [
  { value: "heading", label: "Heading" },
  { value: "paragraph", label: "Paragraph" },
  { value: "list", label: "List" },
  { value: "checklist", label: "Checklist" },
  { value: "callout", label: "Callout" },
  { value: "image", label: "Image" },
  { value: "quote", label: "Quote" },
];

function blankBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "heading":
      return { type: "heading", level: 2, text: "", id: `h-${Math.random().toString(36).slice(2, 8)}` };
    case "list":
      return { type: "list", ordered: false, items: [""] };
    case "checklist":
      return { type: "checklist", title: "", items: [""] };
    case "callout":
      return { type: "callout", variant: "tip", title: "", body: "" };
    case "image":
      return { type: "image", src: "", alt: "", caption: "" };
    case "quote":
      return { type: "quote", text: "", cite: "" };
    case "paragraph":
    default:
      return { type: "paragraph", text: "" };
  }
}

export function ArticleBlocksEditor({ blocks, path }: { blocks: ContentBlock[]; path: string }) {
  const { set, listOps } = useEditable();
  const ops = listOps(path);
  const [toAdd, setToAdd] = useState<ContentBlock["type"]>("paragraph");

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const bp = `${path}[${i}]`;
        return (
          <div key={i} className="space-y-2 rounded-xl border border-dashed border-border bg-card/50 p-3">
            <div className="flex items-center gap-2">
              <select
                className={inputClass}
                value={block.type}
                onChange={(e) => set(bp, blankBlock(e.target.value as ContentBlock["type"]))}
                title="Block type (switching resets the block)"
              >
                {BLOCK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="ml-auto flex items-center gap-1">
                <Button type="button" size="icon-xs" variant="ghost" disabled={i === 0} onClick={() => ops.move(i, i - 1)} aria-label="Move up">
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button type="button" size="icon-xs" variant="ghost" disabled={i === blocks.length - 1} onClick={() => ops.move(i, i + 1)} aria-label="Move down">
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button type="button" size="icon-xs" variant="destructive" onClick={() => ops.removeAt(i)} aria-label="Delete block">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
            <BlockFields block={block} bp={bp} />
          </div>
        );
      })}

      <div className="flex items-center gap-2">
        <select className={inputClass} value={toAdd} onChange={(e) => setToAdd(e.target.value as ContentBlock["type"])}>
          {BLOCK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <Button type="button" size="sm" variant="outline" onClick={() => ops.add(blankBlock(toAdd))}>
          <Plus className="size-4" /> Add block
        </Button>
      </div>
    </div>
  );
}

function BlockFields({ block, bp }: { block: ContentBlock; bp: string }) {
  const { set, selectAsset } = useEditable();

  switch (block.type) {
    case "heading":
      return (
        <div className="flex items-start gap-2">
          <select
            className={inputClass}
            value={String(block.level)}
            onChange={(e) => set(`${bp}.level`, Number(e.target.value))}
            aria-label="Heading level"
          >
            <option value="2">H2</option>
            <option value="3">H3</option>
          </select>
          <div className="flex-1 text-lg font-semibold">
            <EditableText path={`${bp}.text`} placeholder="Heading text…">
              {block.text}
            </EditableText>
          </div>
        </div>
      );
    case "paragraph":
      return (
        <div className="text-base leading-relaxed">
          <EditableText path={`${bp}.text`} placeholder="Paragraph text…">
            {block.text}
          </EditableText>
        </div>
      );
    case "list":
      return (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 rounded border-border" checked={!!block.ordered} onChange={(e) => set(`${bp}.ordered`, e.target.checked)} />
            Ordered (numbered)
          </label>
          <ListField label="Items" values={block.items} onChange={(v) => set(`${bp}.items`, v)} />
        </div>
      );
    case "checklist":
      return (
        <div className="space-y-2">
          <div className="font-medium">
            <EditableText path={`${bp}.title`} placeholder="Checklist title (optional)…">
              {block.title ?? ""}
            </EditableText>
          </div>
          <ListField label="Items" values={block.items} onChange={(v) => set(`${bp}.items`, v)} />
        </div>
      );
    case "callout":
      return (
        <div className="space-y-2">
          <select className={inputClass} value={block.variant} onChange={(e) => set(`${bp}.variant`, e.target.value)} aria-label="Callout variant">
            <option value="tip">Tip</option>
            <option value="info">Info</option>
            <option value="safety">Safety</option>
            <option value="warning">Warning</option>
          </select>
          <div className="font-medium">
            <EditableText path={`${bp}.title`} placeholder="Callout title (optional)…">
              {block.title ?? ""}
            </EditableText>
          </div>
          <div className="text-sm leading-relaxed">
            <EditableText path={`${bp}.body`} placeholder="Callout body…">
              {block.body}
            </EditableText>
          </div>
        </div>
      );
    case "image":
      return (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-lg border border-border">
            {block.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={block.src} alt={block.alt} className="aspect-[16/9] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/9] w-full items-center justify-center bg-muted text-sm text-muted-foreground">
                No image selected
              </div>
            )}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="absolute right-2 bottom-2"
              onClick={() => void selectAsset(`${bp}.src`)}
            >
              <ImageIcon className="size-4" /> {block.src ? "Change image" : "Upload image"}
            </Button>
          </div>
          <EditableText path={`${bp}.alt`} placeholder="Alt text (accessibility/SEO)…">
            {block.alt}
          </EditableText>
          <div className="text-sm text-muted-foreground">
            <EditableText path={`${bp}.caption`} placeholder="Caption (optional)…">
              {block.caption ?? ""}
            </EditableText>
          </div>
        </div>
      );
    case "quote":
      return (
        <div className="space-y-2">
          <div className="text-base italic">
            <EditableText path={`${bp}.text`} placeholder="Quote text…">
              {block.text}
            </EditableText>
          </div>
          <EditableText path={`${bp}.cite`} placeholder="Attribution (optional)…">
            {block.cite ?? ""}
          </EditableText>
        </div>
      );
    default:
      return null;
  }
}
