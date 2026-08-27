"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Phone, FileText, CalendarCheck, ChevronDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MegaMenu, navBrandEntity } from "@/components/layout/mega-menu";
import { BrandMark } from "@/components/sections/brands/brand-mark";
import { HoverPrefetchLink } from "@/components/ui/hover-prefetch-link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NAV_MENUS, navMenuHrefs, type NavMenuKey } from "@/config/nav-menus";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// Heavy iframe dialogs — loaded only when a menu CTA is tapped.
const BookingDialog = dynamic(
  () => import("@/components/sections/booking-dialog").then((m) => m.BookingDialog),
  { ssr: false }
);
const QuoteDialog = dynamic(
  () => import("@/components/sections/quote-dialog").then((m) => m.QuoteDialog),
  { ssr: false }
);

// Computed once at module load — every href reachable through NAV_MENUS
// (columns, brand tiles, "all brands" links, per-menu footer links),
// deduplicated. See navMenuHrefs() for why this exists.
const SITE_SECTION_LINKS = navMenuHrefs();

export function Header() {
  const [open, setOpen] = useState(false);
  // Mobile only — one accordion group expanded at a time. Reset whenever the
  // overlay closes so reopening the menu always starts from the flat list.
  const [openMenu, setOpenMenu] = useState<NavMenuKey | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  // The header renders on EVERY page — never mount (= fetch) the dialog chunks
  // until a CTA is actually tapped; keep them mounted afterwards so the iframe
  // survives close/reopen.
  const [bookingMounted, setBookingMounted] = useState(false);
  const [quoteMounted, setQuoteMounted] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95">
      {/* Crawlable, always server-rendered regardless of breakpoint. Base UI
          mounts a mega-menu panel's content only once its trigger opens, and
          the mobile accordion only once expanded, so without this list every
          NAV_MENUS link (all 12 brand pages, both brand hubs, /garage-doors-perth…)
          would have no sitewide inlink except the footer. Visually hidden, but
          real anchors — tabbable, and crawlable by search engines. */}
      <nav aria-label="Site sections" className="sr-only">
        <ul>
          {SITE_SECTION_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} prefetch={false}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          aria-label={siteConfig.name}
          onClick={() => {
            setOpen(false);
            setOpenMenu(null);
          }}
        >
          <Logo className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl" />
        </Link>

        {/* gap tightens at lg so all 10 items + Call Now fit a 1024px viewport
            (`Home` is xl-only — the logo already links home).
            HoverPrefetchLink: these links sit in the viewport on every page
            load — default prefetching fired ~968 KB of route payloads at load
            time, starving the LCP resource on mobile. Prefetch now waits for
            hover/touch intent, and the three mega-menu panels stay unmounted
            (so their brand logos never load) until a trigger opens. */}
        {/* flex-none: the Base UI root ships `flex-1`, which makes the nav
            absorb every spare pixel and pushes the CTA cluster past the
            container edge at 1280. Natural width + the container's
            justify-between spaces the three groups instead. */}
        <NavigationMenu align="center" className="hidden max-w-none flex-none lg:flex" aria-label="Main">
          <NavigationMenuList className="gap-0.5 xl:gap-1">
            {siteConfig.nav.map((item) =>
              "menu" in item ? (
                <NavigationMenuItem key={item.href} value={item.menu}>
                  <NavigationMenuTrigger className="whitespace-nowrap px-1 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent data-open:bg-transparent data-open:text-foreground data-open:hover:bg-transparent data-open:focus:bg-transparent data-popup-open:bg-transparent data-popup-open:text-foreground data-popup-open:hover:bg-transparent">
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-cta transition-transform duration-300 ease-out group-hover/navigation-menu-trigger:scale-x-100 group-data-popup-open/navigation-menu-trigger:scale-x-100"
                      />
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <MegaMenu menu={NAV_MENUS[item.menu]} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem
                  key={item.href}
                  className={cn(item.href === "/" && "hidden xl:flex")}
                >
                  <NavigationMenuLink
                    render={<HoverPrefetchLink href={item.href} />}
                    className="group/navlink relative whitespace-nowrap rounded-lg px-1 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus:bg-transparent"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-1 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-cta transition-transform duration-300 ease-out group-hover/navlink:scale-x-100"
                    />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* shrink-0: at 1280 the 10-item nav + both CTAs fill the row exactly
            — without this the two buttons get squeezed and wrap to two lines. */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Quote CTA — xl-only so the nav items + Call Now still fit a
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
            onClick={() => {
              setOpen((value) => !value);
              setOpenMenu(null);
            }}
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
        <div className="cgd-menu-fade fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-background/98 backdrop-blur-xl lg:hidden">
          {/* Nav links — scrollable middle so short phones never clip the list.
              `m-auto` on the inner column centres the list when it fits and lets
              it scroll from the top when an accordion is expanded (flex
              `justify-center` would clip the first rows instead). */}
          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col overflow-y-auto px-6 py-8"
          >
            <div className="m-auto flex w-full max-w-xs flex-col gap-4">
              {siteConfig.nav.map((item) => {
                if (!("menu" in item)) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="py-0.5 font-display text-xl text-foreground transition-colors hover:text-cta sm:text-2xl"
                    >
                      {item.label}
                    </Link>
                  );
                }

                const menu = NAV_MENUS[item.menu];
                const expanded = openMenu === item.menu;
                const panelId = `mobile-nav-${item.menu}`;

                return (
                  <div key={item.href}>
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="py-0.5 font-display text-xl text-foreground transition-colors hover:text-cta sm:text-2xl"
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={expanded ? "true" : "false"}
                        aria-controls={panelId}
                        aria-label={`${expanded ? "Hide" : "Show"} ${item.label} links`}
                        onClick={() =>
                          setOpenMenu((value) => (value === item.menu ? null : item.menu))
                        }
                        className="-mr-2 flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform duration-300",
                            expanded && "rotate-180"
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    {/* Always rendered (never conditionally mounted) and toggled
                        via `hidden` so `aria-controls={panelId}` above always
                        resolves to a real element, collapsed or not. */}
                    <div
                      id={panelId}
                      className={cn(
                        "mt-3 flex flex-col gap-4 border-l-2 border-cta/40 pl-4",
                        !expanded && "hidden"
                      )}
                    >
                      {menu.columns.map((column) => (
                        <div key={column.title}>
                          <p className="mb-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            {column.title}
                          </p>
                          <ul className="flex flex-col">
                            {column.links.map((link) => (
                              <li key={link.href}>
                                <HoverPrefetchLink
                                  href={link.href}
                                  onClick={() => setOpen(false)}
                                  className="flex min-h-11 items-center text-base text-muted-foreground transition-colors hover:text-cta"
                                >
                                  {link.label}
                                </HoverPrefetchLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {menu.brands && (
                        <div>
                          <p className="mb-2 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            {menu.brands.title}
                          </p>
                          <ul className="grid grid-cols-2 gap-2">
                            {menu.brands.items.map((brand) => {
                              const entity = navBrandEntity(brand.entity);
                              if (!entity) return null;
                              return (
                                <li key={brand.href}>
                                  <HoverPrefetchLink
                                    href={brand.href}
                                    onClick={() => setOpen(false)}
                                    className="flex min-h-11 items-center gap-2 rounded-xl border border-border/60 bg-background/60 p-1.5 transition-colors hover:border-cta/40"
                                  >
                                    <BrandMark entity={entity} size="sm" />
                                    <span className="text-xs font-semibold leading-tight text-foreground">
                                      {entity.name}
                                    </span>
                                  </HoverPrefetchLink>
                                </li>
                              );
                            })}
                          </ul>
                          <HoverPrefetchLink
                            href={menu.brands.allHref}
                            onClick={() => setOpen(false)}
                            className="mt-2 flex min-h-11 items-center gap-1 text-base font-semibold text-primary transition-colors hover:text-cta"
                          >
                            {menu.brands.allLabel}
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </HoverPrefetchLink>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Conversion pair pinned to the bottom, thumb-reach zone. Calling is
              already covered by the always-visible header phone button and the
              sticky mobile CTA bar — the menu's job is quote + booking. */}
          <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-3 px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setQuoteMounted(true);
                setQuoteOpen(true);
              }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-3.5 text-base font-bold text-primary transition-all active:scale-95"
            >
              <FileText className="h-4.5 w-4.5" aria-hidden="true" />
              Get a Quote
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setBookingMounted(true);
                setBookingOpen(true);
              }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-cta px-4 py-3.5 text-base font-bold text-cta-foreground shadow-[0_4px_20px_rgba(200,34,42,0.3)] transition-all active:scale-95"
            >
              <CalendarCheck className="h-4.5 w-4.5" aria-hidden="true" />
              Book Now
            </button>
          </div>
        </div>
      )}

      {/* Outside the menu conditional so they survive the menu closing. */}
      {quoteMounted && <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />}
      {bookingMounted && <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />}
    </header>
  );
}
