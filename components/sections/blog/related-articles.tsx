import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { ArticleLink } from "@/types/article";

interface RelatedArticlesProps {
  heading?: string;
  articles: ArticleLink[];
}

/** Cards linking to other educational articles — builds topical authority and keeps readers on-site. */
export function RelatedArticles({ heading = "Related Articles", articles }: RelatedArticlesProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{heading}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.slug} delay={index * 0.05} className="h-full">
              <Link
                href={`/blog/${article.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-cta/30 hover:shadow-[0_8px_32px_rgba(13,31,69,0.08)]"
              >
                {article.category && (
                  <span className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary uppercase">
                    {article.category}
                  </span>
                )}
                <h3 className="mt-3 font-heading text-base font-semibold text-foreground group-hover:text-cta sm:text-lg">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
                )}
                <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
