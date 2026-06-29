import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
}

/** Single customer review card — star rating, quote, name/suburb/service, date, and source badge. */
export function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = new Date(review.date).toLocaleDateString("en-AU", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_rgba(13,31,69,0.05)]">
      <div className="flex items-center justify-between gap-2">
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
        <Badge variant="outline" className="text-muted-foreground">
          {review.source}
        </Badge>
      </div>

      <p className="text-sm leading-relaxed text-foreground">&ldquo;{review.text}&rdquo;</p>

      <div className="mt-auto flex items-center justify-between gap-2 text-xs">
        <p className="font-semibold text-muted-foreground">
          {review.customerName}
          {review.suburb ? ` — ${review.suburb}` : ""}
          {review.service ? <span className="text-muted-foreground/70"> · {review.service}</span> : null}
        </p>
        <time dateTime={review.date} className="shrink-0 text-muted-foreground/70">
          {formattedDate}
        </time>
      </div>
    </div>
  );
}
