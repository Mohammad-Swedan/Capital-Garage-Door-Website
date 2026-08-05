"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { HoverPrefetchLink } from "@/components/ui/hover-prefetch-link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          aria-label={siteConfig.name}
          onClick={() => setOpen(false)}
        >
          <Logo className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl" />
        </Link>

        {/* gap tightens at lg so all 9 items + Call Now fit a 1024px viewport.
            HoverPrefetchLink: these 9 links sit in the viewport on every page
            load — default prefetching fired ~968 KB of route payloads at load
            time, starving the LCP resource on mobile. Prefetch now waits for
            hover/touch intent. */}
        <nav className="hidden items-center gap-3 lg:flex xl:gap-6">
          {siteConfig.nav.map((item) => (
            <HoverPrefetchLink
              key={item.href}
              href={item.href}
              className="group relative whitespace-nowrap py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-cta transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </HoverPrefetchLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Quote CTA — xl-only so the 9 nav items + Call Now still fit a
              1024px viewport; below xl the mobile menu + sticky CTA carry it. */}
          <HoverPrefetchLink
            href="/quote"
            className="hidden min-h-11 items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-cta/60 hover:text-cta xl:flex"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Get a Quote
          </HoverPrefetchLink>

          {/* Always-visible call affordance. Below lg it collapses to an
              icon-only tel: button — an audit found mobile had NO way to call
              from the sticky header (hamburger only), a direct conversion leak
              for a 24/7 emergency business. */}
          <a
            href={`tel:${siteConfig.business.phone}`}
            aria-label={`Call Now ${siteConfig.business.phoneDisplay}`}
            className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full bg-cta px-3 py-2.5 text-sm font-bold text-cta-foreground shadow-[0_4px_20px_rgba(200,34,42,0.3)] transition-all hover:-translate-y-0.5 hover:bg-cta/90 hover:shadow-[0_6px_28px_rgba(200,34,42,0.45)] active:translate-y-0 active:scale-95 lg:px-4"
          >
            <Phone className="h-4 w-4 lg:h-3.5 lg:w-3.5" aria-hidden="true" />
            <span className="hidden lg:inline">Call Now</span>
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open ? "true" : "false"}
            onClick={() => setOpen((value) => !value)}
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={cn(
                "block h-0.5 w-5.5 rounded-full bg-foreground transition-transform duration-300",
                open && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5.5 rounded-full bg-foreground transition-opacity duration-300",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5.5 rounded-full bg-foreground transition-transform duration-300",
                open && "-translate-y-[7px] -rotate-45"
              )}
            />
          </button>
        </div>
      </Container>

      {open && (
        <div className="cgd-menu-fade fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col items-center justify-center gap-7 bg-background/98 backdrop-blur-xl lg:hidden">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl text-foreground transition-colors hover:text-cta"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-lg font-bold text-foreground"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            Get a Quote
          </Link>
          <a
            href={`tel:${siteConfig.business.phone}`}
            className="flex items-center gap-2 rounded-full bg-cta px-7 py-3.5 text-lg font-bold text-cta-foreground"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            {siteConfig.business.phoneDisplay}
          </a>
        </div>
      )}
    </header>
  );
}
