import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { getTestimonials } from "@/lib/data/testimonials";
import type { Testimonial } from "@/types";

/**
 * Splits the list into three DISJOINT column slices so each testimonial's
 * visible copy appears exactly once on the page (the old rotate-the-full-list
 * approach rendered every quote in all three columns — 6 DOM copies each, which
 * bloated the HTML payload and dominated text extraction). Track height for the
 * seamless loop is maintained by `repeat`ing short slices inside the column
 * (extra passes are aria-hidden).
 */
function splitColumns(items: Testimonial[], columns: number): Testimonial[][] {
  const out: Testimonial[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => out[i % columns].push(item));
  return out;
}

export async function Testimonials() {
  const testimonials = await getTestimonials();
  const [firstColumn, secondColumn, thirdColumn] = splitColumns(testimonials, 3);
  // Short slices get an extra in-half pass so the loop copy stays taller than
  // the visible window (see TestimonialsColumn).
  const repeat = firstColumn.length >= 5 ? 1 : 2;

  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real reviews from homeowners we&apos;ve helped.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid h-105 max-w-sm grid-cols-3 gap-2 overflow-hidden sm:h-150 sm:max-w-2xl sm:gap-4 lg:h-185 lg:max-w-5xl lg:gap-6 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <Reveal delay={0}>
            <TestimonialsColumn testimonials={firstColumn} duration={26} repeat={repeat} />
          </Reveal>
          <Reveal delay={0.15}>
            <TestimonialsColumn testimonials={secondColumn} duration={32} repeat={repeat} />
          </Reveal>
          <Reveal delay={0.3}>
            <TestimonialsColumn testimonials={thirdColumn} duration={29} repeat={repeat} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
