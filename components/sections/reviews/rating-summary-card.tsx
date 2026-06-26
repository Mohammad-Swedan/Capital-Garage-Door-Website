import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { ReviewsSummary } from "@/types/review";

interface RatingSummaryCardProps {
  summary: ReviewsSummary;
}

/** Premium "social proof" card — average rating, total review count, and Google review CTAs. */
export function RatingSummaryCard({ summary }: RatingSummaryCardProps) {
  return (
    <section className="bg-background pb-2 sm:pb-4">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-border/70 bg-gradient-to-br from-surface-elevated to-surface-muted p-6 text-center elevate-card sm:flex-row sm:justify-between sm:gap-6 sm:p-8 sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <span className="font-display text-4xl font-black tracking-tight text-gradient-brand sm:text-5xl">
                {summary.averageRating.toFixed(1)}
              </span>
              <div className="flex items-center gap-0.5" aria-label={`${summary.averageRating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={
                      starIndex < Math.round(summary.averageRating)
                        ? "h-5 w-5 fill-amber-400 text-amber-400"
                        : "h-5 w-5 text-muted-foreground/30"
                    }
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Based on {summary.totalReviews}+ Perth customer reviews
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                size="lg"
                nativeButton={false}
                variant="outline"
                className="h-12 w-full gap-2 rounded-xl border-brand/35 bg-brand-soft px-8 text-base text-brand hover:bg-[color-mix(in_oklab,var(--brand),transparent_82%)] hover:text-brand sm:w-auto"
                render={<a href={summary.googleProfileUrl}>View on Google</a>}
              />
              <Button
                size="lg"
                nativeButton={false}
                variant="cta"
                className="h-12 w-full gap-2 rounded-xl px-8 text-base sm:w-auto"
                render={<a href={summary.googleWriteReviewUrl}>Leave a Review</a>}
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
