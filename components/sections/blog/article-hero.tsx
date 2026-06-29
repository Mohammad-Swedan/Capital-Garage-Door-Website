import Image from "next/image";
import { CalendarDays, Clock3, UserRound } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableText } from "@/components/admin/editor/editable";
import type { Article } from "@/types/article";

interface ArticleHeroProps {
  article: Article;
}

function formatDate(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Premium editorial hero for blog/guide articles — category chip, large
 * readable headline, byline meta row, and a featured image. Mirrors the
 * homepage's gradient/typography language without touching the homepage hero.
 */
export function ArticleHero({ article }: ArticleHeroProps) {
  const updated = formatDate(article.updatedAt);

  return (
    <header className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.06)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_90%_70%_at_50%_0%,black_30%,transparent_85%)]" />
        <div className="absolute -top-24 left-1/2 h-90 w-200 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <Container className="relative z-10 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-bold tracking-wide text-primary uppercase">
              <EditableText path="category" singleLine placeholder="Category…" aria-label="Category">
                {article.category}
              </EditableText>
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-4 text-balance font-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.1] font-black tracking-tight text-foreground">
              <EditableText path="title" placeholder="Article title…" aria-label="Article title">
                {article.title}
              </EditableText>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              <EditableText path="excerpt" placeholder="Excerpt…" aria-label="Excerpt">
                {article.excerpt}
              </EditableText>
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <dl className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
                <dt className="sr-only">Author</dt>
                <dd className="font-semibold text-foreground">
                  <EditableText path="author" singleLine placeholder="Author…" aria-label="Author">
                    {article.author}
                  </EditableText>
                </dd>
              </div>
              {updated && (
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                  <dt className="sr-only">Last updated</dt>
                  <dd>
                    Updated <time dateTime={article.updatedAt}>{updated}</time>
                  </dd>
                </div>
              )}
              {article.readingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                  <dt className="sr-only">Reading time</dt>
                  <dd>{article.readingTime}</dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.16} className="mx-auto mt-8 max-w-4xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-[0_30px_60px_rgba(13,31,69,0.18)] ring-1 ring-foreground/10">
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 56rem"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>
      </Container>
    </header>
  );
}
