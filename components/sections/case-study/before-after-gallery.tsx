import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { CaseStudyImageFrame } from "@/components/page/case-study-image";
import type { CaseStudyImage } from "@/types/case-study";

interface BeforeAfterGalleryProps {
  heading?: string;
  images: CaseStudyImage[];
}

/**
 * Before/after job photo grid. Renders the real job photo (`next/image`) when
 * the CaseStudyImage carries a remote `src`, and falls back to the branded
 * gradient placeholder panel otherwise — both handled by CaseStudyImageFrame.
 */
export function BeforeAfterGallery({ heading = "Before & After", images }: BeforeAfterGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section className="bg-muted/30 py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <Reveal key={`${image.caption}-${index}`} delay={index * 0.05}>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5">
                <CaseStudyImageFrame
                  image={image}
                  className="aspect-[4/3]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <p className="px-4 py-3 text-center text-sm font-semibold text-foreground">{image.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
