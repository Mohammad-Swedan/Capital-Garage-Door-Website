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
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6 text-center shadow-sm ring-1 ring-foreground/5 sm:flex-row sm:justify-between sm:gap-6 sm:p-8 sm:text-left">
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <span className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
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
                className="h-12 w-full gap-2 rounded-xl border-[#0f4e9b]/35 bg-[#0f4e9b]/5 px-8 text-base text-[#0f4e9b] transition-transform hover:scale-[1.03] hover:bg-[#0f4e9b]/10 hover:text-[#0f4e9b] sm:w-auto"
                render={<a href={summary.googleProfileUrl}>View on Google</a>}
              />
              <Button
                size="lg"
                nativeButton={false}
                className="h-12 w-full gap-2 rounded-xl bg-cta px-8 text-base text-cta-foreground shadow-[0_3px_10px_rgba(200,34,42,0.25)] transition-transform hover:scale-[1.03] hover:bg-cta/90 sm:w-auto"
                render={<a href={summary.googleWriteReviewUrl}>Leave a Review</a>}
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
