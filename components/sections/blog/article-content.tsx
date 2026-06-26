"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { AlertTriangle, CheckCircle2, Info, Lightbulb, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentBlock } from "@/types/article";
import { useEditable } from "@/components/admin/editor/editable-context";

// Lazy: only loaded in the in-place editor, never in the public article bundle.
const ArticleBlocksEditor = dynamic(() =>
  import("@/components/admin/editor/article-blocks-editor").then((m) => m.ArticleBlocksEditor),
);

interface ArticleContentProps {
  blocks: ContentBlock[];
}

const calloutStyles = {
  tip: {
    icon: Lightbulb,
    wrap: "border-primary/15 bg-primary/5",
    iconWrap: "bg-primary/10 text-primary",
    title: "text-primary",
  },
  info: {
    icon: Info,
    wrap: "border-[#0f4e9b]/15 bg-[#0f4e9b]/5",
    iconWrap: "bg-[#0f4e9b]/10 text-[#0f4e9b]",
    title: "text-[#0f4e9b]",
  },
  safety: {
    icon: CheckCircle2,
    wrap: "border-emerald-600/15 bg-emerald-600/5",
    iconWrap: "bg-emerald-600/10 text-emerald-700",
    title: "text-emerald-700",
  },
  warning: {
    icon: AlertTriangle,
    wrap: "border-cta/15 bg-cta/5",
    iconWrap: "bg-cta/10 text-cta",
    title: "text-cta",
  },
} as const;

/**
 * Renders an article's `ContentBlock[]` as real server HTML — semantic
 * headings/lists/paragraphs for SEO/AEO extraction, plus editorial callouts,
 * checklists, and image placeholders matching the homepage's design language.
 */
export function ArticleContent({ blocks }: ArticleContentProps) {
  const { editing } = useEditable();

  // In-place editor: per-block type switch / add / reorder / inline fields.
  if (editing) {
    return (
      <div className="max-w-none">
        <ArticleBlocksEditor blocks={blocks} path="contentBlocks" />
      </div>
    );
  }

  // Public / preview render — unchanged semantic HTML.
  return (
    <div className="max-w-none space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Tag = block.level === 2 ? "h2" : "h3";
            return (
              <Tag
                key={block.id}
                id={block.id}
                className={cn(
                  "scroll-mt-24 font-heading font-bold tracking-tight text-foreground",
                  block.level === 2 ? "pt-4 text-2xl sm:text-3xl" : "pt-2 text-xl sm:text-2xl",
                )}
              >
                {block.text}
              </Tag>
            );
          }

          case "paragraph":
            return (
              <p key={index} className="text-base leading-relaxed text-foreground sm:text-lg">
                {block.text}
              </p>
            );

          case "list":
            return block.ordered ? (
              <ol key={index} className="list-decimal space-y-2.5 pl-6 text-base leading-relaxed text-foreground sm:text-lg">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-base leading-relaxed text-foreground sm:text-lg">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "checklist":
            return (
              <div key={index} className="rounded-2xl border border-emerald-600/15 bg-emerald-600/5 p-5 sm:p-6">
                {block.title && (
                  <h3 className="font-heading text-base font-semibold text-emerald-700">{block.title}</h3>
                )}
                <ul className={cn("space-y-3", block.title && "mt-4")}>
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground sm:text-base">
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );

          case "callout": {
            const style = calloutStyles[block.variant];
            const Icon = style.icon;
            return (
              <div key={index} className={cn("rounded-2xl border p-5 sm:p-6", style.wrap)}>
                <div className="flex items-start gap-3">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", style.iconWrap)}>
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    {block.title && (
                      <h3 className={cn("font-heading text-base font-semibold", style.title)}>{block.title}</h3>
                    )}
                    <p className={cn("text-sm leading-relaxed text-foreground sm:text-base", block.title && "mt-1.5")}>
                      {block.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          case "image":
            return (
              <figure key={index} className="overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/9]">
                  <Image src={block.src} alt={block.alt} fill sizes="(max-width: 768px) 100vw, 42rem" className="object-cover" />
                </div>
                {block.caption && (
                  <figcaption className="mt-2 text-center text-sm text-muted-foreground">{block.caption}</figcaption>
                )}
              </figure>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="relative rounded-2xl border border-border bg-muted/40 p-6 pl-14 text-base leading-relaxed text-foreground italic sm:text-lg"
              >
                <Quote className="absolute top-5 left-5 h-6 w-6 text-primary/30" aria-hidden="true" />
                <p>{block.text}</p>
                {block.cite && <footer className="mt-3 text-sm font-semibold text-muted-foreground not-italic">— {block.cite}</footer>}
              </blockquote>
            );
        }
      })}
    </div>
  );
}
