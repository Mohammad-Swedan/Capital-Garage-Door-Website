import { Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableGroup } from "@/components/admin/editor/editable";
import type { ServiceReview } from "@/types/service-page";

interface ReviewCardsProps {
  heading?: string;
  reviews: ServiceReview[];
}

/**
 * Customer review cards — star rating, quote, and suburb/service context for local
 * trust signals.
 *
 * Reviews are a relational pin sourced from the global Reviews catalog (PageReviews),
 * not from `data`. They are pinned/reordered in the Settings drawer (Phase 4/5 picker)
 * rather than free-text edited here; the `EditableGroup` labels the section while
 * editing. The pins are always round-tripped untouched on save.
 */
export function ReviewCards({ heading = "What Perth Homeowners Say", reviews }: ReviewCardsProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <EditableGroup label="Review pins · managed in Settings → Pins">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {heading}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <Reveal key={review.name} delay={index * 0.06}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_rgba(13,31,69,0.05)]">
                  <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={
                          starIndex < review.rating
                            ? "h-4 w-4 fill-amber-400 text-amber-400"
                            : "h-4 w-4 text-muted-foreground/30"
                        }
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">&ldquo;{review.text}&rdquo;</p>
                  <p className="mt-auto text-xs font-semibold text-muted-foreground">
                    {review.name}
                    {review.suburb && ` — ${review.suburb}`}
                    {review.service && ` · ${review.service}`}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </EditableGroup>
      </Container>
    </section>
  );
}
