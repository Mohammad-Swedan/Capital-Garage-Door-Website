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
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary uppercase">
          {teaser.category}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
          Coming Soon
        </span>
      </div>
      <h3 className="cgd-h3 text-base text-foreground sm:text-lg">{teaser.title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{teaser.description}</p>
    </div>
  );
}
