import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BrandEntity } from "@/types/brand";

const SIZE = {
  sm: { box: "h-9 w-9 rounded-lg", text: "text-sm", sizes: "36px" },
  md: { box: "h-14 w-14 rounded-xl", text: "text-xl", sizes: "56px" },
  lg: { box: "h-24 w-24 rounded-2xl", text: "text-4xl", sizes: "96px" },
  xl: { box: "h-32 w-32 rounded-3xl", text: "text-5xl", sizes: "128px" },
} as const;

/** "Steel-Line" → "SL", "B&D" → "BD", "Perth Windsor Doors" → "PW", "Merlin" → "M". */
export function monogramFor(name: string): string {
  const words = name.replace(/&/g, " ").split(/[\s-]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.charAt(0).toUpperCase();
}

interface BrandMarkProps {
  entity: BrandEntity;
  size?: keyof typeof SIZE;
  className?: string;
  priority?: boolean;
}

/**
 * The one visual for a brand everywhere (nav grid, hub wall, plate, chips). Real logos sit on a
 * white card so dark-on-white source files stay crisp; brands without a logo get a designed
 * monogram — display-font initials on the brand accent, with a soft top-left light and a hairline
 * rim so it reads as a struck emblem rather than a placeholder. Pure CSS, no request.
 */
export function BrandMark({ entity, size = "md", className, priority }: BrandMarkProps) {
  const s = SIZE[size];
  if (entity.logo) {
    return (
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden border border-border/60 bg-white shadow-sm",
          s.box,
          className,
        )}
      >
        <Image
          src={entity.logo}
          alt={`${entity.name} logo`}
          fill
          sizes={s.sizes}
          priority={priority}
          className="object-contain p-[14%]"
        />
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={`${entity.name} monogram`}
      className={cn(
        "relative flex shrink-0 select-none items-center justify-center overflow-hidden font-display font-black tracking-tight text-white shadow-sm",
        s.box,
        s.text,
        className,
      )}
      style={{
        background: `radial-gradient(120% 120% at 20% 15%, rgba(255,255,255,0.28), transparent 55%), linear-gradient(135deg, ${entity.accent} 0%, color-mix(in oklab, ${entity.accent} 62%, #0d1f45) 100%)`,
      }}
    >
      {/* Hairline rim — catches the top-left light and gives the tile a milled, minted edge. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/25"
      />
      {monogramFor(entity.name)}
    </span>
  );
}
