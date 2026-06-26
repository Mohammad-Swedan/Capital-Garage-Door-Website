import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { ReviewCard } from "@/components/sections/reviews/review-card";
import type { Review } from "@/types/review";

interface LandingReviewsProps {
  heading: string;
  reviews: Review[];
}

/** Short social-proof strip — three customer reviews for the landing page. */
export function LandingReviews({ heading, reviews }: LandingReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-surface-muted">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow="Reviews" title={heading} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={0.04 * i} className="h-full">
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
