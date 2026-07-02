import Link from "next/link";
import { UserRound } from "lucide-react";
import { Container } from "@/components/layout/container";
import type { Article } from "@/types/article";

/**
 * Author / E-E-A-T box shown at the end of an article when the entry supplies a
 * bio. Surfaces who wrote it and their credentials, with a link to the team's
 * About page where the full credentials live (on-page-seo.md Category 10).
 * Renders nothing when no bio is set, so existing content is unaffected.
 */
export function AuthorBio({ article }: { article: Article }) {
  if (!article.authorBio) return null;

  return (
    <section className="bg-background py-8 sm:py-10">
      <Container>
        <div className="mx-auto flex max-w-[42rem] items-start gap-4 rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-base font-bold text-foreground">{article.author}</p>
            {article.authorTitle && (
              <p className="text-sm font-medium text-muted-foreground">{article.authorTitle}</p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.authorBio}</p>
            <Link
              href="/about"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
            >
              More about our team
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
