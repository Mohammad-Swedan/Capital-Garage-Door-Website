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

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

/**
 * The admin navigation model. Kept here (not in the shell) so both the desktop
 * sidebar and the mobile Sheet drawer render the exact same items.
 */
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

/**
 * Grouped navigation list used inside the admin shell. The active item is
 * matched by path prefix and styled with an elevated accent surface + a
 * navy→red left bar, using the sidebar theme tokens from globals.css.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

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
                {/* Active accent bar */}
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

/** Brand mark + navy wordmark + small red "CMS" pill, shared by sidebar + drawer. */
export function AdminBrandLockup({ className }: { className?: string }) {
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
      <span className="font-heading text-sm leading-tight font-semibold text-sidebar-foreground">
        Capital Garage Door
      </span>
      <span className="rounded-md bg-cta px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-cta-foreground uppercase">
        CMS
      </span>
    </Link>
  );
}
