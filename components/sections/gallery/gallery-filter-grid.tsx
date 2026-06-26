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
    <section className="bg-background py-16 sm:py-24">
      <Container>
        <Reveal>
          <span className="cgd-eyebrow text-cta">Our Portfolio</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            Recent Work
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-7 flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setActiveFilter(option)}
              aria-pressed={activeFilter === option}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-all",
                activeFilter === option
                  ? "border-transparent bg-brand text-white shadow-card"
                  : "border-border bg-surface-elevated text-muted-foreground shadow-card hover:-translate-y-px hover:border-brand/25 hover:text-brand",
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
