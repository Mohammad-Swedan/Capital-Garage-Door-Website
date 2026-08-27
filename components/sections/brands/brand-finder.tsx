"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUpRight, BadgeCheck, PhoneCall, Search, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { CallNowButton, GetQuoteButton } from "@/components/page/cta-buttons";
import { track } from "@/lib/analytics";
import { scrollToElement } from "@/lib/smooth-scroll";
import { BrandMark } from "./brand-mark";
import type { BrandKind, HubTile } from "@/types/brand";

interface BrandFinderProps {
  kind: BrandKind;
  tiles: HubTile[];
}

/** Custom event the directory listens for — the finder asks it to flash a tile. */
export const BRAND_HIGHLIGHT_EVENT = "cgd:brand-highlight";

const MAX_SUGGESTIONS = 8;
const SETTLE_MS = 800;

/** Lowercase, strip punctuation, collapse whitespace — so "B & D" matches "b and d" and "bnd". */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function BrandFinder({ kind, tiles }: BrandFinderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  /**
   * The last query the visitor stopped typing on — gates the no-match card so it can't flash
   * mid-word. Never cleared: `settled === q` is the only test, and an empty box hides the card
   * anyway, so there is nothing to reset (and no cascading setState inside the effect).
   */
  const [settled, setSettled] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const noun = kind === "motor" ? "motor" : "door";

  const focusFinder = useCallback(() => {
    scrollToElement(sectionRef.current);
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // The hero's "Find your brand" CTA is a plain `#find-your-brand` anchor so it works with JS off,
  // but a native hash jump is cancelled by Lenis on desktop (see lib/smooth-scroll.ts). Intercept
  // it here and route the scroll through Lenis, then put the caret in the input.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest?.('a[href="#find-your-brand"]')) return;
      e.preventDefault();
      focusFinder();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [focusFinder]);

  /** Pre-normalised haystack: the brand name plus every alternative spelling we know. */
  const searchable = useMemo(
    () =>
      tiles.map((tile) => ({
        tile,
        terms: [tile.entity.name, ...(tile.entity.aliases ?? [])].map(normalize),
      })),
    [tiles],
  );

  const q = normalize(query);
  const matches = useMemo(() => {
    if (!q) return [];
    const starts: HubTile[] = [];
    const contains: HubTile[] = [];
    for (const { tile, terms } of searchable) {
      if (terms.some((t) => t.startsWith(q))) starts.push(tile);
      else if (terms.some((t) => t.includes(q))) contains.push(tile);
    }
    return [...starts, ...contains];
  }, [q, searchable]);

  // Demand signal: which brands do visitors look for, and which do we not list? One event per
  // settled query (same 800 ms debounce as the suburb finder) so half-typed words don't flood GA4.
  useEffect(() => {
    if (!q) return;
    const timer = window.setTimeout(() => {
      setSettled(q);
      track("brand_search", { query: q, results: matches.length, kind });
    }, SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [q, matches.length, kind]);

  /** A brand with a guide opens it; one without scrolls to its tile on the wall and flashes it. */
  const choose = useCallback(
    (tile: HubTile) => {
      if (tile.href) {
        router.push(tile.href);
        return;
      }
      window.dispatchEvent(
        new CustomEvent(BRAND_HIGHLIGHT_EVENT, { detail: tile.entity.slug }),
      );
      // The directory clears its filter on the same event, so the tile is on screen by the time
      // this runs on the next frame. Move focus onto the tile itself (its link/button) in the
      // same frame as the scroll — otherwise focus is silently left behind on the finder input.
      requestAnimationFrame(() => {
        scrollToElement(document.getElementById(`brand-${tile.entity.slug}`));
        document
          .getElementById(`brand-${tile.entity.slug}`)
          ?.querySelector<HTMLElement>("a,button")
          ?.focus({ preventScroll: true });
      });
    },
    [router],
  );

  const shown = matches.slice(0, MAX_SUGGESTIONS);
  const overflow = matches.length - shown.length;
  const noMatch = q.length > 0 && matches.length === 0 && settled === q;

  return (
    <section
      ref={sectionRef}
      id="find-your-brand"
      className="scroll-mt-24 bg-background py-10 sm:py-14"
    >
      <Container>
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-8">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Which brand is on my garage {noun}?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {`Start typing the name on the label — we list ${tiles.length} ${noun} brands seen across Perth. `}
              <strong className="font-semibold text-foreground">We service every one of them</strong>, and
              plenty that aren&apos;t on this page.
            </p>

            <div className="relative mt-5 max-w-xl">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="search"
                inputMode="search"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && shown.length > 0) {
                    e.preventDefault();
                    choose(shown[0]);
                  }
                }}
                placeholder={
                  kind === "motor"
                    ? "Type the brand on the motor — e.g. Merlin, B&D, ATA…"
                    : "Type the brand on the door — e.g. Steel-Line, B&D, Gliderol…"
                }
                aria-label="Search brands"
                className="h-13 w-full rounded-2xl border border-border bg-background pr-12 pl-12 text-base text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#0f4e9b]/40 focus:ring-2 focus:ring-[#0f4e9b]/20 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div aria-live="polite">
              {q && matches.length > 0 && (
                <>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {matches.length === 1 ? "1 brand matches" : `${matches.length} brands match`} — press
                    Enter for the first one.
                  </p>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {shown.map((tile) => {
                      const inner = (
                        <>
                          <BrandMark entity={tile.entity} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-foreground">
                              {tile.entity.name}
                            </span>
                            <span className="block truncate text-xs font-normal text-muted-foreground">
                              {tile.href
                                ? `Open the ${tile.entity.name} guide`
                                : `We service it — show it on the wall`}
                            </span>
                          </span>
                        </>
                      );
                      const shell =
                        "group flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none";
                      return (
                        <li key={tile.entity.slug}>
                          {tile.href ? (
                            <Link
                              href={tile.href}
                              prefetch={false}
                              className={`${shell} border-[#0f4e9b]/30 bg-[#0f4e9b]/6 hover:border-[#0f4e9b]/55 hover:bg-[#0f4e9b]/10`}
                            >
                              {inner}
                              <ArrowUpRight
                                className="h-4 w-4 shrink-0 text-[#0f4e9b] transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
                                aria-hidden="true"
                              />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => choose(tile)}
                              className={`${shell} border-border bg-background hover:border-border`}
                            >
                              {inner}
                              <ArrowDown
                                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-y-px"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {overflow > 0 && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      + {overflow} more {overflow === 1 ? "match" : "matches"} — keep typing to narrow it
                      down.
                    </p>
                  )}
                </>
              )}

              {noMatch && (
                <div className="mt-5 rounded-2xl border border-cta/25 bg-cta/5 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <PhoneCall className="mt-0.5 h-6 w-6 shrink-0 text-cta" aria-hidden="true" />
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        Every brand in Perth, one number
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        &ldquo;{query.trim()}&rdquo; isn&apos;t on this page yet, and it changes nothing —
                        our technicians repair and service every {noun} brand that lands in a Perth garage,
                        including imports and brands that stopped trading years ago. Call and describe what
                        you have, or send a photo of the label.
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <CallNowButton />
                        <GetQuoteButton variant="secondary" />
                      </div>
                      <a
                        href="#badge-guide"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToElement(document.getElementById("badge-guide"));
                        }}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        How to find the badge
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {!q && (
                <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <BadgeCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span>
                    {`No label on your ${noun}? `}
                    <a
                      href="#badge-guide"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToElement(document.getElementById("badge-guide"));
                      }}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      Here&apos;s where to look
                    </a>
                  </span>
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
