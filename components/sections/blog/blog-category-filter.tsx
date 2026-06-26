"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ArticleCard } from "@/components/sections/blog/article-card";
import { ArticleTeaserCard, type ArticleTeaser } from "@/components/sections/blog/article-teaser-card";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/article";

interface BlogCategoryFilterProps {
  articles: Article[];
  teasers: ArticleTeaser[];
  categories: readonly string[];
}

/**
 * Category filter pills + article grid. Default filter is "All", so every
 * article/teaser is present in the server-rendered HTML on first paint — the
 * pill buttons are progressive-enhancement only.
 */
export function BlogCategoryFilter({ articles, teasers, categories }: BlogCategoryFilterProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredArticles = activeFilter === "All" ? articles : articles.filter((a) => a.category === activeFilter);
  const filteredTeasers = activeFilter === "All" ? teasers : teasers.filter((t) => t.category === activeFilter);

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">The Blog</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            All Articles
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-7 flex flex-wrap gap-2">
          {["All", ...categories].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setActiveFilter(option)}
              aria-pressed={activeFilter === option}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-all",
                activeFilter === option
                  ? "border-transparent bg-brand text-white shadow-card"
                  : "border-border bg-surface-elevated text-muted-foreground shadow-card hover:-translate-y-px hover:border-brand/25 hover:text-brand",
              )}
            >
              {option}
            </button>
          ))}
        </Reveal>

        {filteredArticles.length > 0 || filteredTeasers.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <Reveal key={article.slug} delay={index * 0.05} className="h-full">
                <ArticleCard article={article} />
              </Reveal>
            ))}
            {filteredTeasers.map((teaser, index) => (
              <Reveal key={teaser.title} delay={(filteredArticles.length + index) * 0.05} className="h-full">
                <ArticleTeaserCard teaser={teaser} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">No articles in this category yet — check back soon.</p>
        )}
      </Container>
    </section>
  );
}
