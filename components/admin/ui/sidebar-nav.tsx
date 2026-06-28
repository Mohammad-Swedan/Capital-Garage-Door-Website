"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Wrench,
  DollarSign,
  MapPin,
  Images,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { TooltipPrimitive, TooltipPopup } from "@/components/ui/tooltip";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Content",
    items: [{ label: "Pages", href: "/admin/pages", icon: FileText }],
  },
  {
    label: "Catalogs",
    items: [
      { label: "Services", href: "/admin/services", icon: Wrench },
      { label: "Pricing", href: "/admin/pricing-items", icon: DollarSign },
      { label: "Service areas", href: "/admin/service-areas", icon: MapPin },
      { label: "Gallery", href: "/admin/gallery", icon: Images },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
];

export function SidebarNav({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  if (collapsed) {
    return (
      <nav className="flex flex-col gap-1 px-2 py-4">
        {ADMIN_NAV.map((group, groupIdx) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            {groupIdx > 0 && (
              <hr className="mx-1 my-2 border-sidebar-border/40" />
            )}
            {group.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <TooltipPrimitive.Root key={item.href}>
                  <TooltipPrimitive.Trigger
                    render={
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "mx-auto flex h-9 w-9 items-center justify-center rounded-lg outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                          active
                            ? "bg-sidebar-accent text-primary shadow-card ring-1 ring-primary/20"
                            : "text-sidebar-foreground/55 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                        )}
                      />
                    }
                  >
                    <Icon className="size-4 shrink-0" />
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Positioner side="right" sideOffset={10} className="z-50">
                      <TooltipPopup>{item.label}</TooltipPopup>
                    </TooltipPrimitive.Positioner>
                  </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
              );
            })}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-7 px-3 py-5">
      {ADMIN_NAV.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 pb-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] text-sidebar-foreground/45 uppercase">
            {group.label}
          </p>
          {group.items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-[color,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-card"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-1.5 left-0 w-1 rounded-full bg-gradient-to-b from-primary to-cta transition-opacity duration-200",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    active
                      ? "text-primary"
                      : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AdminBrandLockup({
  className,
  collapsed,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  return (
    <Link
      href="/admin/pages"
      className={cn(
        "group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className,
      )}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-[0.8125rem] font-bold text-brand-foreground shadow-card ring-1 ring-inset ring-white/15">
        C
      </span>
      {!collapsed && (
        <>
          <span className="font-heading text-sm font-semibold leading-tight text-sidebar-foreground">
            Capital Garage Door
          </span>
          <span className="rounded-md bg-cta px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-cta-foreground uppercase">
            CMS
          </span>
        </>
      )}
    </Link>
  );
}
