import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { ReviewCard } from "@/components/sections/reviews/review-card";
import type { Review } from "@/types/review";

interface FeaturedReviewsProps {
  heading?: string;
  reviews: Review[];
}

/** Curated grid of standout customer reviews — top trust signal near the top of the page. */
export function FeaturedReviews({ heading = "Featured Reviews", reviews }: FeaturedReviewsProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Real Customers, Real Results" title={heading} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 0.06}>
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
