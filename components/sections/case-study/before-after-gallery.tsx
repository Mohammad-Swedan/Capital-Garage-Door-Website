import { ImageIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { CaseStudyImage } from "@/types/case-study";

interface BeforeAfterGalleryProps {
  heading?: string;
  images: CaseStudyImage[];
}

/**
 * Before/after job photo grid. Renders a placeholder gradient panel (matching
 * the hero/ServiceHero image-panel treatment) with a caption chip until real
 * job photos are wired in — swap the panel for a next/image without changing
 * the CaseStudyImage shape.
 */
export function BeforeAfterGallery({ heading = "Before & After", images }: BeforeAfterGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section className="bg-surface-muted py-16 sm:py-24">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">The Results</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            {heading}
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <Reveal key={image.caption} delay={index * 0.05}>
              <div className="group overflow-hidden rounded-2xl border border-border/70 bg-surface-elevated elevate-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
                <div
                  role="img"
                  aria-label={image.alt}
                  className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-[#0d1f60] to-[#0a1733]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(125,211,252,0.18),transparent_60%)]"
                  />
                  <ImageIcon className="relative z-10 h-8 w-8 text-white/40" aria-hidden="true" />
                </div>
                <p className="px-4 py-3 text-center text-sm font-semibold text-foreground">{image.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
