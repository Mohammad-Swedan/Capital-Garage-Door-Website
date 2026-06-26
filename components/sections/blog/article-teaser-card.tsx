import { PenLine } from "lucide-react";

export interface ArticleTeaser {
  category: string;
  title: string;
  description: string;
}

interface ArticleTeaserCardProps {
  teaser: ArticleTeaser;
}

/** "Coming soon" placeholder for a topic that doesn't have a published article yet. */
export function ArticleTeaserCard({ teaser }: ArticleTeaserCardProps) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-dashed border-border bg-surface-muted p-5">
      <div className="flex items-center justify-between">
        <span className="cgd-eyebrow inline-flex items-center rounded-full bg-brand-soft px-2.5 py-1 text-[11px] text-brand">
          {teaser.category}
        </span>
        <span className="cgd-eyebrow flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
          Coming Soon
        </span>
      </div>
      <h3 className="cgd-h3 text-base text-foreground sm:text-lg">{teaser.title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{teaser.description}</p>
    </div>
  );
}
