import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3 } from "lucide-react";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

/** Blog index card — featured image, category badge, title, excerpt, reading time. */
export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface-elevated elevate-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <Image
          src={article.featuredImage}
          alt={article.featuredImageAlt}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="cgd-eyebrow absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] text-brand backdrop-blur-sm">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3
          className={`cgd-h3 text-foreground transition-colors group-hover:text-cta ${
            featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readingTime}
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-primary">
            Read more
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
