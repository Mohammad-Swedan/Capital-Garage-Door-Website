import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";

export interface WarrantyShowcaseItem {
  /** Heading shown under the image. */
  title: string;
  /** Short supporting line. */
  caption: string;
  /** Alt text — also used as the placeholder label until a photo is supplied. */
  alt: string;
  /**
   * CDN image URL. Leave undefined to render the styled placeholder. When you
   * have the real photo, just add `src` here and add the CDN host to
   * `images.remotePatterns` in next.config.ts — the component swaps to an
   * optimised <Image> automatically.
   */
  src?: string;
}

interface WarrantyShowcaseProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: WarrantyShowcaseItem[];
}

/** A photo slot: optimised <Image> once `src` is set, a clean placeholder until then. */
function WarrantyImage({ item }: { item: WarrantyShowcaseItem }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-muted">
      {item.src ? (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          quality={75}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/70">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/70 ring-1 ring-foreground/5">
            <ImageIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="px-4 text-center text-xs font-medium">{item.alt}</span>
        </div>
      )}
    </div>
  );
}

/**
 * "Our motors" image band. Each slot renders a styled placeholder until a CDN
 * `src` is added to its item — see WarrantyShowcaseItem.src.
 */
export function WarrantyShowcase({ eyebrow, title, description, items }: WarrantyShowcaseProps) {
  return (
    <section className="bg-background">
      <Container className="py-14 sm:py-20">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={0.05 * i} className="h-full">
              <figure className="flex h-full flex-col">
                <WarrantyImage item={item} />
                <figcaption className="mt-4">
                  <h3 className="font-heading text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.caption}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
