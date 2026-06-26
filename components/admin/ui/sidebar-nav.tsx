"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Wrench,
  DollarSign,
  MapPin,
  Images,
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
    ],
  },
];

/**
 * Grouped navigation list used inside the admin shell. The active item is
 * matched by path prefix and styled with a navy left-border + faint primary
 * wash, using the sidebar theme tokens from globals.css.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 px-3 py-4">
      {ADMIN_NAV.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-sidebar-foreground/55 uppercase">
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
                  "flex items-center gap-2.5 rounded-lg border-l-2 border-transparent px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary/8 text-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/** Navy wordmark + small red "CMS" pill, shared by the sidebar and the drawer. */
export function AdminBrandLockup({ className }: { className?: string }) {
  return (
    <Link
      href="/admin/pages"
      className={cn("flex items-center gap-2.5", className)}
    >
      <span className="font-heading text-sm leading-tight font-semibold text-primary">
        Capital Garage Door
      </span>
      <span className="rounded-md bg-cta px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-cta-foreground uppercase">
        CMS
      </span>
    </Link>
  );
}
