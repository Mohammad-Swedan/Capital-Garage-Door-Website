import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import type { BrandProductImage as BrandProductImageData } from "@/types/brand";

/**
 * Licensed product shot below the intro (manufacturer press/media asset or Wikimedia — the check
 * script enforces provenance). Renders nothing when the page has none, which is most pages.
 * Deliberately lazy with no `priority`: brand heroes stay text-LCP.
 */
export function BrandProductImage({ image }: { image?: BrandProductImageData }) {
  if (!image) return null;
  return (
    <section className="bg-background">
      <Container className="pb-4 sm:pb-6">
        <Reveal>
          <figure className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5">
            <div className="bg-white p-6">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1024px) 640px, 92vw"
                className="mx-auto h-auto w-full object-contain"
              />
            </div>
            {image.caption && (
              <figcaption className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
                {image.caption}
              </figcaption>
            )}
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
