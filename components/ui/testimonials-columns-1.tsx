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

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 10,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) {
  return (
    <div className={className}>
      <div
        className="cgd-testimonial-track flex flex-col gap-2 pb-2 sm:gap-4 sm:pb-4 lg:gap-6 lg:pb-6"
        style={{ "--cgd-duration": `${duration}s` } as React.CSSProperties}
      >
        {[...new Array(2).fill(0)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map((testimonial) => (
              <div
                key={`${index}-${testimonial.id}`}
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
      </div>
    </div>
  );
}
