"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { GalleryCard } from "@/components/sections/gallery/gallery-card";
import { cn } from "@/lib/utils";
import type { GalleryCategory, GalleryItem } from "@/types/gallery";

interface GalleryFilterGridProps {
  items: GalleryItem[];
  categories: readonly GalleryCategory[];
}

/**
 * Category filter pills + gallery grid. Default filter is "All", so every
 * item is present in the server-rendered HTML on first paint — the pill
 * buttons are progressive-enhancement only.
 */
export function GalleryFilterGrid({ items, categories }: GalleryFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<"All" | GalleryCategory>("All");

  const filteredItems = activeFilter === "All" ? items : items.filter((item) => item.category === activeFilter);

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Recent Work
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-6 flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setActiveFilter(option)}
              aria-pressed={activeFilter === option}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                activeFilter === option
                  ? "border-[#0f4e9b]/35 bg-[#0f4e9b]/10 text-[#0f4e9b]"
                  : "border-border bg-card text-muted-foreground hover:border-[#0f4e9b]/25 hover:text-[#0f4e9b]",
              )}
            >
              {option}
            </button>
          ))}
        </Reveal>

        {filteredItems.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05} className="h-full">
                <GalleryCard item={item} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">No jobs in this category yet — check back soon.</p>
        )}
      </Container>
    </section>
  );
}
