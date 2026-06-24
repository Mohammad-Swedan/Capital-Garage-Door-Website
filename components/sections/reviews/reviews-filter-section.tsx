"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { ReviewCard } from "@/components/sections/reviews/review-card";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/review";

interface ReviewsFilterSectionProps {
  heading: string;
  reviews: Review[];
  options: readonly string[];
  filterBy: "service" | "suburb";
}

/**
 * Shared filter block for "Reviews by Service" and "Reviews by Suburb". Default
 * filter is "All", so every review is present in the server-rendered HTML on
 * first paint — the pill buttons are progressive-enhancement only.
 */
export function ReviewsFilterSection({ heading, reviews, options, filterBy }: ReviewsFilterSectionProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredReviews =
    activeFilter === "All" ? reviews : reviews.filter((review) => review[filterBy] === activeFilter);

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <SectionHeading title={heading} />

        <div className="mt-6 flex flex-wrap gap-2">
          {["All", ...options].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setActiveFilter(option)}
              aria-pressed={activeFilter === option}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                activeFilter === option
                  ? "border-[#0f4e9b]/35 bg-[#0f4e9b]/10 text-[#0f4e9b]"
                  : "border-border bg-card text-muted-foreground hover:border-[#0f4e9b]/25 hover:text-[#0f4e9b]",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {filteredReviews.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 0.05}>
                <ReviewCard review={review} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">No reviews for this filter yet.</p>
        )}
      </Container>
    </section>
  );
}
