import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudyImage } from "@/types/case-study";

interface CaseStudyImageFrameProps {
  image?: CaseStudyImage;
  /** Optional corner chip, e.g. "Before" / "After". */
  label?: string;
  className?: string;
  sizes?: string;
}

/** True when the image carries a real (remote) source we can render. */
export function hasRealImage(image?: CaseStudyImage): boolean {
  return !!image?.src && /^https?:\/\//.test(image.src);
}

/**
 * Renders a case-study job photo. Shows the real `next/image` when the image has
 * a remote `src` (CMS/CDN), otherwise falls back to the branded gradient panel +
 * ImageIcon used across the site — so pages without photos degrade gracefully.
 */
export function CaseStudyImageFrame({ image, label, className, sizes }: CaseStudyImageFrameProps) {
  const real = hasRealImage(image);
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d1f60] to-[#0a1733]",
        className,
      )}
      {...(real ? {} : { role: "img", "aria-label": image?.alt || label || "Job photo" })}
    >
      {real ? (
        <Image
          src={image!.src}
          alt={image!.alt || label || ""}
          title={image!.alt || undefined}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
          className="object-cover"
        />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(125,211,252,0.18),transparent_60%)]"
          />
          <ImageIcon className="relative z-10 h-8 w-8 text-white/40" aria-hidden="true" />
        </>
      )}
      {label ? (
        <span className="absolute bottom-2 left-2 z-10 rounded-md bg-foreground/70 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Splits a case study's flat `images[]` into a before/after view, matching on the
 * caption. Anything captioned "before" is the before shot; "after"/"finished"/
 * "installed"/"complete"/"repaired"/"new" is the after shot. Falls back to the
 * first image as a single showcase when neither keyword matches.
 */
export function pickBeforeAfter(images: CaseStudyImage[]): {
  before?: CaseStudyImage;
  after?: CaseStudyImage;
  single?: CaseStudyImage;
} {
  const before = images.find((i) => /\bbefore\b/i.test(i.caption));
  const after = images.find((i) =>
    /\b(after|finished|installed|complete|completed|repaired|replaced|new)\b/i.test(i.caption),
  );
  if (before && after) return { before, after };
  if (before) return { before };
  if (after) return { after };
  const single = images.find(hasRealImage) ?? images[0];
  return single ? { single } : {};
}
