"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { HoverPrefetchLink } from "@/components/ui/hover-prefetch-link";
import { BrandMark } from "@/components/sections/brands/brand-mark";
import { BRAND_ENTITIES } from "@/content/brands/entities";
import { MOTOR_IMAGES, MOTOR_PRICE } from "@/components/sections/motors/motor-data";
import type { NavMenu, NavMenuKey } from "@/config/nav-menus";
import type { BrandEntity } from "@/types/brand";
import { cn } from "@/lib/utils";

const BRAND_BY_SLUG = new Map(BRAND_ENTITIES.map((entity) => [entity.slug, entity]));

/** Resolve a NAV_MENUS brand entry to its entity. Shared with the mobile accordion. */
export function navBrandEntity(slug: string): BrandEntity | undefined {
  return BRAND_BY_SLUG.get(slug);
}

/**
 * Panel column tracks. Tailwind only compiles class names it can read as
 * literals, so these are written out per menu rather than built from
 * `columns.length` — keyed by `menu.key` (data), never by the label.
 */
const PANEL_GRID: Record<NavMenuKey, string> = {
  services: "sm:grid-cols-3",
  doors: "sm:grid-cols-[minmax(0,17rem)_minmax(18rem,1fr)]",
  motors: "sm:grid-cols-[minmax(0,15rem)_minmax(0,14rem)_minmax(18rem,1fr)]",
};

/** The header's underline motif, reused for every link inside the panel. */
const LINK_CLASS =
  "group/link relative w-fit gap-0 rounded-none p-0 py-1 text-sm text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus:bg-transparent focus-visible:rounded-sm focus-visible:ring-2! focus-visible:ring-cta/70!";

function PanelLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <NavigationMenuLink
      closeOnClick
      render={<HoverPrefetchLink href={href} />}
      onClick={onNavigate}
      className={cn(LINK_CLASS, className)}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-cta transition-transform duration-300 ease-out group-hover/link:scale-x-100"
      />
    </NavigationMenuLink>
  );
}

/**
 * A `<p>`, not a heading — the panel is portalled outside `<main>`, so an `<h3>`
 * here would break the page's heading order for assistive tech. The list it
 * labels points back at it with `aria-labelledby`.
 */
function ColumnTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p
      id={id}
      className="mb-3 font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
    >
      {children}
      {/* Same cta rule as the nav underline — it marks a column the way the
          underline marks the active nav item, rather than decorating it. */}
      <span aria-hidden="true" className="mt-1.5 block h-0.5 w-6 rounded-full bg-cta/70" />
    </p>
  );
}

interface MegaMenuProps {
  menu: NavMenu;
  onNavigate?: () => void;
}

/**
 * The desktop mega-menu panel. Base UI mounts NavigationMenuContent only once a
 * trigger opens, so the brand logos below (next/image) never load on a page that
 * nobody hovers the nav on — the same "intent first" rule the header's
 * HoverPrefetchLink follows for route payloads.
 */
export function MegaMenu({ menu, onNavigate }: MegaMenuProps) {
  const brands = menu.brands;

  return (
    <div className="w-[min(60rem,calc(100vw-2rem))] p-6">
      <div className={cn("grid gap-8", PANEL_GRID[menu.key])}>
        {menu.featured === "capital-motors" && (
          <NavigationMenuLink
            closeOnClick
            render={<HoverPrefetchLink href="/garage-door-motors-perth" />}
            onClick={onNavigate}
            className="group/featured flex-col items-stretch gap-0 self-start overflow-hidden rounded-2xl border border-border/70 bg-muted/40 p-0 transition-all hover:-translate-y-0.5 hover:border-cta/40 hover:bg-muted/60 hover:shadow-md focus-visible:ring-2! focus-visible:ring-cta/70!"
          >
            <Image
              src={MOTOR_IMAGES.studio.src}
              alt={MOTOR_IMAGES.studio.alt}
              width={320}
              height={240}
              quality={60}
              sizes="320px"
              className="h-auto w-full bg-white object-cover"
            />
            <span className="flex flex-col gap-1 p-3.5">
              <span className="font-heading text-sm font-bold text-foreground">
                Capital 1100N &amp; 1500N
              </span>
              <span className="font-heading text-lg font-black leading-none text-primary">
                from ${MOTOR_PRICE.min}
                <span className="ml-1.5 text-xs font-semibold text-muted-foreground">installed</span>
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <ShieldCheck className="size-3.5 text-cta" aria-hidden="true" />
                5-year warranty
              </span>
            </span>
          </NavigationMenuLink>
        )}

        {menu.columns.map((column, index) => (
          <div key={column.title}>
            <ColumnTitle id={`nav-${menu.key}-col-${index}`}>{column.title}</ColumnTitle>
            <ul aria-labelledby={`nav-${menu.key}-col-${index}`} className="flex flex-col gap-0.5">
              {column.links.map((link) => (
                <li key={link.href} className="flex">
                  <PanelLink href={link.href} onNavigate={onNavigate}>
                    {link.label}
                  </PanelLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {brands && (
          <div className="min-w-[18rem]">
            <ColumnTitle id={`nav-${menu.key}-brands`}>{brands.title}</ColumnTitle>
            <ul aria-labelledby={`nav-${menu.key}-brands`} className="grid grid-cols-3 gap-2">
              {brands.items.map((item) => {
                const entity = navBrandEntity(item.entity);
                if (!entity) return null;
                return (
                  <li key={item.href} className="flex">
                    <NavigationMenuLink
                      closeOnClick
                      render={<HoverPrefetchLink href={item.href} />}
                      onClick={onNavigate}
                      className="w-full items-center gap-2.5 rounded-xl border border-border/60 bg-background p-2 transition-all hover:-translate-y-0.5 hover:border-cta/40 hover:bg-muted/50 hover:shadow-sm focus-visible:ring-2! focus-visible:ring-cta/70!"
                    >
                      <BrandMark entity={entity} size="sm" />
                      <span className="text-xs font-semibold leading-tight text-foreground">
                        {entity.name}
                      </span>
                    </NavigationMenuLink>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex">
              <PanelLink
                href={brands.allHref}
                onNavigate={onNavigate}
                className="font-semibold text-foreground"
              >
                {brands.allLabel}
                <ArrowRight className="ml-1 size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" aria-hidden="true" />
              </PanelLink>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end border-t border-border/60 pt-4">
        <PanelLink
          href={menu.footer.href}
          onNavigate={onNavigate}
          className="text-sm font-bold text-primary hover:text-cta"
        >
          {menu.footer.label}
          <ArrowRight className="ml-1 size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" aria-hidden="true" />
        </PanelLink>
      </div>
    </div>
  );
}
