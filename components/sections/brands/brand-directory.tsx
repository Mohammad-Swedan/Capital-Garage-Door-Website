"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, BadgeCheck, Wrench } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { HoverPrefetchLink } from "@/components/ui/hover-prefetch-link";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";
import { BRAND_HIGHLIGHT_EVENT } from "./brand-finder";
import type { BrandKind, BrandTag, HubTile } from "@/types/brand";

// One dialog for the whole wall. Rendered unconditionally, so its chunk still loads on
// hydration (a `next/dynamic` import isn't deferred by being unopened) — the same house pattern
// as the QuoteDialog in components/page/cta-buttons.tsx. The win here is code-splitting the
// dialog out of the main directory bundle, not deferring the request.
const QuoteDialog = dynamic(
  () => import("@/components/sections/quote-dialog").then((m) => m.QuoteDialog),
  { ssr: false },
);

interface BrandDirectoryProps {
  kind: BrandKind;
  tiles: HubTile[];
}

/** "all" and "dealer" are computed filters; the rest are literal `BrandTag`s. */
type Filter = "all" | "dealer" | BrandTag;

const TAG_FILTERS: Record<BrandKind, { value: Filter; label: string }[]> = {
  motor: [
    { value: "smart-app", label: "Smart app" },
    { value: "australian-made", label: "Australian-made" },
    { value: "wa-made", label: "WA-made" },
  ],
  door: [
    { value: "roller", label: "Roller" },
    { value: "sectional", label: "Sectional" },
    { value: "tilt", label: "Tilt" },
    { value: "commercial", label: "Commercial" },
    { value: "australian-made", label: "Australian-made" },
    { value: "wa-made", label: "WA-made" },
  ],
};

function matchesFilter(tile: HubTile, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "dealer") return tile.entity.dealer;
  return tile.entity.tags.includes(filter);
}

const HIGHLIGHT_MS = 2000;

/**
 * The brand wall — every brand of this kind as a tile, in one grid.
 *
 * Two rules make this both the page's centrepiece and its main crawlable link surface:
 * every tile is in the server-rendered HTML (filtering only toggles a `hidden` class after
 * hydration, so a crawler always sees the full set of links), and a brand without a guide page
 * is still a live target — its tile is a button that opens the quote sheet rather than a dead end.
 *
 * The finder talks to this component with a `cgd:brand-highlight` window event: the wall clears
 * its filter so the tile can't be hidden, then rings it for two seconds.
 */
export function BrandDirectory({ kind, tiles }: BrandDirectoryProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [highlight, setHighlight] = useState<string | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const noun = kind === "motor" ? "motor" : "door";

  // Only offer a chip that actually narrows to something — an empty "Tilt" filter is a dead click.
  const chips = useMemo(() => {
    const candidates: { value: Filter; label: string }[] = [
      { value: "all", label: "All brands" },
      { value: "dealer", label: "Authorised dealer" },
      ...TAG_FILTERS[kind],
    ];
    return candidates
      .map((chip) => ({ ...chip, count: tiles.filter((t) => matchesFilter(t, chip.value)).length }))
      .filter((chip) => chip.count > 0);
  }, [kind, tiles]);

  useEffect(() => {
    const onHighlight = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      if (typeof slug !== "string") return;
      setFilter("all");
      setHighlight(slug);
    };
    window.addEventListener(BRAND_HIGHLIGHT_EVENT, onHighlight);
    return () => window.removeEventListener(BRAND_HIGHLIGHT_EVENT, onHighlight);
  }, []);

  useEffect(() => {
    if (!highlight) return;
    const timer = window.setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
    return () => window.clearTimeout(timer);
  }, [highlight]);

  const shownCount = tiles.filter((t) => matchesFilter(t, filter)).length;

  return (
    <section id="all-brands" className="scroll-mt-24 bg-muted/30 py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="The brand wall"
          title={`Every garage ${noun} brand we work on in Perth`}
          description={`${tiles.length} manufacturers, one crew. Tap a brand for its guide, or filter to the ones that match your ${noun}.`}
        />

        <Reveal delay={0.05}>
          <div
            role="group"
            aria-label="Filter brands"
            className="mt-6 flex flex-wrap gap-2"
          >
            {chips.map((chip) => {
              const active = filter === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(chip.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-muted-foreground hover:border-[#0f4e9b]/40 hover:text-[#0f4e9b]",
                  )}
                >
                  {chip.label}
                  <span className={cn("text-xs font-bold", active ? "opacity-70" : "opacity-60")}>
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <p className="sr-only" aria-live="polite">
          {shownCount} of {tiles.length} brands shown
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {tiles.map((tile) => {
            const { entity } = tile;
            const hidden = !matchesFilter(tile, filter);
            const ringed = highlight === entity.slug;

            const body = (
              <>
                <span className="flex items-start justify-between gap-2">
                  <BrandMark entity={entity} size="lg" />
                  {tile.href && (
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-cta"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="mt-3.5 block font-heading text-base leading-snug font-bold text-foreground">
                  {entity.name}
                </span>
                <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {entity.summary}
                </span>
                <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
                      entity.dealer
                        ? "bg-emerald-600/10 text-emerald-700"
                        : "bg-[#0f4e9b]/10 text-[#0f4e9b]",
                    )}
                  >
                    {entity.dealer ? (
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <Wrench className="h-3 w-3" aria-hidden="true" />
                    )}
                    {entity.dealer ? "Dealer" : "Serviced"}
                  </span>
                  {tile.href && (
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Brand guide
                    </span>
                  )}
                </span>
              </>
            );

            const shell = cn(
              "group flex h-full w-full flex-col rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all duration-200",
              "hover:-translate-y-1 hover:border-[#0f4e9b]/40 hover:shadow-lg",
              "focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none",
              ringed && "ring-2 ring-cta ring-offset-2 ring-offset-background",
            );

            return (
              <li
                key={entity.slug}
                id={`brand-${entity.slug}`}
                className={cn("scroll-mt-28", hidden && "hidden")}
              >
                {tile.href ? (
                  <HoverPrefetchLink href={tile.href} className={shell}>
                    {body}
                  </HoverPrefetchLink>
                ) : (
                  <button
                    type="button"
                    onClick={() => setQuoteOpen(true)}
                    aria-label={`${entity.name} — request a quote for your ${entity.name} garage ${noun}`}
                    className={shell}
                  >
                    {body}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
      </Container>
    </section>
  );
}
