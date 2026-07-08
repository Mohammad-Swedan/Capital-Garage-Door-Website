import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Testimonial } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * One vertically-scrolling marquee column. The CSS loop (`cgd-testimonial-scroll`)
 * translates the track 0 → -50%, so the track MUST be two identical halves; when a
 * column only has a few testimonials, `repeat` multiplies the slice inside EACH
 * half so the copy stays taller than the visible window (otherwise the same card
 * would sit twice on screen at once).
 *
 * Every card after the first pass is `aria-hidden` — only one copy of each
 * testimonial exists for the accessibility tree and text extractors. Give each
 * column a DISJOINT slice (not the full rotated list) so each quote appears once
 * per page, not once per column: duplicated testimonial text was bloating the
 * HTML payload and dominating boilerplate-stripping extractors (an audit
 * finding).
 */
export function TestimonialsColumn({
  className,
  testimonials,
  duration = 10,
  repeat = 1,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
  repeat?: number;
}) {
  const half = Array.from({ length: Math.max(1, repeat) }, (_, i) => i);

  return (
    <div className={className}>
      <div
        className="cgd-testimonial-track flex flex-col gap-2 pb-2 sm:gap-4 sm:pb-4 lg:gap-6 lg:pb-6"
        style={{ "--cgd-duration": `${duration}s` } as React.CSSProperties}
      >
        {[0, 1].map((halfIndex) => (
          <React.Fragment key={halfIndex}>
            {half.map((repeatIndex) => (
              <React.Fragment key={repeatIndex}>
                {testimonials.map((testimonial) => (
                  <div
                    key={`${halfIndex}-${repeatIndex}-${testimonial.id}`}
                    aria-hidden={halfIndex > 0 || repeatIndex > 0}
                    className="w-full rounded-xl border bg-card p-2.5 shadow-lg shadow-primary/10 sm:rounded-2xl sm:p-6 lg:rounded-3xl lg:p-8"
                  >
                    <p className="text-[9.5px] leading-snug text-foreground/90 sm:text-sm sm:leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 sm:mt-5 sm:gap-3">
                      <Avatar size="sm" className="sm:size-10">
                        <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <div className="truncate text-[9.5px] font-medium leading-4 tracking-tight sm:text-base sm:leading-5">
                          {testimonial.name}
                        </div>
                        {testimonial.service && (
                          <div className="truncate text-[8.5px] leading-4 tracking-tight text-muted-foreground sm:text-xs sm:leading-5">
                            {testimonial.service}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
