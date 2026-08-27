import type { CSSProperties } from "react";
import { BrandMark } from "./brand-mark";
import type { BrandEntity } from "@/types/brand";

interface BrandTickerProps {
  entities: BrandEntity[];
  /** Seconds for one full loop. Longer lists need a slower belt to read at the same speed. */
  durationSeconds?: number;
}

/** One badge — the mark plus the name, sized to read at a glance while it moves. */
function BrandPill({ entity }: { entity: BrandEntity }) {
  return (
    <span className="mx-1.5 inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border/70 bg-card py-2 pr-5 pl-2 shadow-sm sm:mx-2">
      <BrandMark entity={entity} size="sm" />
      <span className="text-sm font-semibold whitespace-nowrap text-foreground">{entity.name}</span>
    </span>
  );
}

/**
 * The badge belt: every brand of this kind sliding past, once as a set of real marks.
 *
 * Same pure-CSS dual-track marquee as the homepage logo strip (`.cgd-brand-marquee` /
 * `.cgd-brand-track` / `.cgd-brand-track-2`, keyframes in app/globals.css) — two identical rows
 * chase each other so the loop has no seam. It pauses on hover and goes completely static under
 * `prefers-reduced-motion`. The second track is `aria-hidden`, so screen readers and the
 * accessibility tree see each brand exactly once.
 */
export function BrandTicker({ entities, durationSeconds = 60 }: BrandTickerProps) {
  if (entities.length === 0) return null;
  const style = { "--cgd-duration": `${durationSeconds}s` } as CSSProperties;

  return (
    <section
      aria-label="Brands we service"
      className="overflow-hidden border-y border-border/60 bg-muted/30 py-6 sm:py-8"
    >
      <div
        style={style}
        className="cgd-brand-marquee relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        <div className="cgd-brand-track flex shrink-0 items-center">
          {entities.map((entity) => (
            <BrandPill key={entity.slug} entity={entity} />
          ))}
        </div>
        <div
          className="cgd-brand-track-2 absolute top-0 flex shrink-0 items-center"
          aria-hidden="true"
        >
          {entities.map((entity) => (
            <BrandPill key={entity.slug} entity={entity} />
          ))}
        </div>
      </div>
    </section>
  );
}
