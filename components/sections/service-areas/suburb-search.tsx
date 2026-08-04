"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MapPin, MapPinCheck, Search, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { CallNowButton, GetQuoteButton } from "@/components/page/cta-buttons";
import { track } from "@/lib/analytics";
import { scrollToElement } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";
import type { CoverageRegion } from "@/types/coverage-area";

interface SuburbSearchProps {
  regions: CoverageRegion[];
}

interface FlatSuburb {
  name: string;
  slug: string;
  region: string;
  href?: string;
}

/** Lowercase, trim, collapse whitespace — so "  South  Perth " matches "South Perth". */
function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

const MAX_RESULTS = 24;

/**
 * Suburb finder at the top of /service-areas: instant client-side search over the full
 * CMS suburb directory. Suburbs with a dedicated local page render as links; the rest
 * confirm coverage inline. A query that matches nothing is a conversion moment, not a
 * dead end — coverage is Perth-wide, so the empty state says so and offers call/quote.
 *
 * Purely progressive enhancement: the complete crawlable directory stays server-rendered
 * below in `CoverageRegions`; this component adds zero SEO surface and duplicates no links
 * outside the popular-suburbs strip.
 */
export function SuburbSearch({ regions }: SuburbSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Any `#find-your-suburb` anchor on the page (the hero CTA) must scroll THROUGH
  // Lenis — a native hash jump gets cancelled on desktop (see lib/smooth-scroll.ts).
  // Delegated here so PageHero stays a dumb link renderer; focusing the input after
  // the jump turns the CTA into "start typing".
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest?.('a[href="#find-your-suburb"]')) return;
      e.preventDefault();
      scrollToElement(sectionRef.current);
      inputRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const suburbs = useMemo<FlatSuburb[]>(
    () =>
      regions.flatMap((region) =>
        region.suburbs.map((suburb) => ({
          name: suburb.name,
          slug: suburb.slug,
          region: region.name,
          ...(suburb.href ? { href: suburb.href } : {}),
        })),
      ),
    [regions],
  );

  // A handful of linked suburbs as one-tap suggestions before the visitor types.
  const popular = useMemo(() => suburbs.filter((s) => s.href).slice(0, 8), [suburbs]);

  const q = normalize(query);
  const matches = useMemo(() => {
    if (!q) return [];
    const starts: FlatSuburb[] = [];
    const contains: FlatSuburb[] = [];
    for (const suburb of suburbs) {
      const name = normalize(suburb.name);
      if (name.startsWith(q)) starts.push(suburb);
      else if (name.includes(q)) contains.push(suburb);
    }
    return [...starts, ...contains];
  }, [q, suburbs]);

  // Demand signal: which suburbs do visitors look for (and not find)? Debounced so
  // half-typed queries don't flood GA4 — one event per settled query.
  useEffect(() => {
    if (!q) return;
    const timer = window.setTimeout(() => {
      track("suburb_search", { query: q, results: matches.length });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [q, matches.length]);

  const shown = matches.slice(0, MAX_RESULTS);
  const overflow = matches.length - shown.length;

  return (
    <section ref={sectionRef} id="find-your-suburb" className="scroll-mt-24 bg-background py-10 sm:py-14">
      <Container>
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Find Your Suburb
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {/* Template literal on purpose: Turbopack's JSX whitespace normalization ate the
                  space between the expression and "Perth" (rendered "8Perth regions"). */}
              {`Search ${suburbs.length} suburbs across ${regions.length} Perth regions — and if yours isn't listed, don't worry: `}
              <strong className="font-semibold text-foreground">we cover all of Perth</strong>, so we almost
              certainly still service it.
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
                placeholder="Type your suburb — e.g. Joondalup, Baldivis, Morley…"
                aria-label="Search for your suburb"
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

            {/* Results live-region: announces match counts to screen readers as the user types. */}
            <div aria-live="polite">
              {q && matches.length > 0 && (
                <>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {matches.length === 1 ? "1 suburb matches" : `${matches.length} suburbs match`} — yes,
                    we service {matches.length === 1 ? "it" : "them all"}.
                  </p>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map((suburb) =>
                      suburb.href ? (
                        <li key={`${suburb.region}-${suburb.slug}`}>
                          <Link
                            href={suburb.href}
                            className="group flex items-center gap-2.5 rounded-xl border border-[#0f4e9b]/25 bg-[#0f4e9b]/5 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-cta/40 hover:text-cta focus-visible:ring-2 focus-visible:ring-cta focus-visible:outline-none"
                          >
                            <MapPin className="h-4 w-4 shrink-0 text-primary transition-colors group-hover:text-cta" aria-hidden="true" />
                            <span className="flex-1">
                              {suburb.name}
                              <span className="block text-xs font-normal text-muted-foreground">
                                Local page · {suburb.region}
                              </span>
                            </span>
                            <ArrowUpRight
                              className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-cta"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      ) : (
                        <li
                          key={`${suburb.region}-${suburb.slug}`}
                          className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"
                        >
                          <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                          <span className="flex-1">
                            {suburb.name}
                            <span className="block text-xs font-normal text-muted-foreground">
                              Covered · {suburb.region}
                            </span>
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                  {overflow > 0 && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      + {overflow} more {overflow === 1 ? "match" : "matches"} — keep typing to narrow it down.
                    </p>
                  )}
                </>
              )}

              {q && matches.length === 0 && (
                <div className="mt-5 rounded-2xl border border-emerald-600/25 bg-emerald-600/5 p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <MapPinCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        Good news — we cover all of Perth
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        &ldquo;{query.trim()}&rdquo; isn&apos;t in our directory yet, but our mobile technicians
                        service the entire Perth metro area — anywhere from Two Rocks to Mandurah, the coast to
                        the hills. Call now and we&apos;ll confirm your address and book a time on the spot.
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <CallNowButton />
                        <GetQuoteButton variant="secondary" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!q && popular.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Popular
                </span>
                {popular.map((suburb) => (
                  <Link
                    key={`${suburb.region}-${suburb.slug}`}
                    href={suburb.href!}
                    className={cn(
                      "rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-muted-foreground",
                      "transition-colors hover:border-[#0f4e9b]/30 hover:text-[#0f4e9b]",
                    )}
                  >
                    {suburb.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
