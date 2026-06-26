import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { getTestimonials } from "@/lib/data/testimonials";
import type { Testimonial } from "@/types";

/**
 * Rotates the full list rather than splitting it, so every column's scrolling
 * track stays taller than the visible window even when there are only a
 * handful of testimonials — otherwise the loop runs out of content partway
 * through and the next card has to snap into view instead of scrolling in.
 */
function rotate(items: Testimonial[], offset: number): Testimonial[] {
  if (items.length === 0) return items;
  const shift = offset % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

export async function Testimonials() {
  const testimonials = await getTestimonials();
  const firstColumn = testimonials;
  const secondColumn = rotate(testimonials, 1);
  const thirdColumn = rotate(testimonials, 2);

  return (
    <section className="bg-surface-muted py-20 sm:py-24">
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="mb-3 cgd-eyebrow text-cta">Reviews</span>
          <h2 className="cgd-h2 text-balance text-foreground">
            What Our Customers Say
          </h2>
          <p className="mt-4 cgd-lead text-muted-foreground">
            Real reviews from homeowners we&apos;ve helped.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid h-105 max-w-sm grid-cols-3 gap-2 overflow-hidden sm:h-150 sm:max-w-2xl sm:gap-4 lg:h-185 lg:max-w-5xl lg:gap-6 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <Reveal delay={0}>
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
          </Reveal>
          <Reveal delay={0.15}>
            <TestimonialsColumn testimonials={secondColumn} duration={19} />
          </Reveal>
          <Reveal delay={0.3}>
            <TestimonialsColumn testimonials={thirdColumn} duration={17} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
