"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, LogOut, Menu } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AdminBrandLockup, SidebarNav } from "@/components/admin/ui/sidebar-nav";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  pages: "Pages",
  services: "Services",
  "pricing-items": "Pricing",
  "service-areas": "Service areas",
  gallery: "Gallery",
  conversations: "Conversations",
  new: "New",
  edit: "Edit",
  suburbs: "Suburbs",
};

function labelFor(segment: string): string {
  return (
    SEGMENT_LABELS[segment] ??
    segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const adminIdx = segments.indexOf("admin");
  const trail = adminIdx >= 0 ? segments.slice(adminIdx + 1) : segments;

  const crumbs = trail.map((segment, i) => {
    const href = `/admin/${trail.slice(0, i + 1).join("/")}`;
    return { label: labelFor(segment), href, last: i === trail.length - 1 };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {crumbs.length === 0 ? (
            <BreadcrumbPage>Admin</BreadcrumbPage>
          ) : (
            <BreadcrumbLink render={<Link href="/admin/pages">Admin</Link>} />
          )}
        </BreadcrumbItem>
        {crumbs.map((c) => (
          <React.Fragment key={c.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {c.last ? (
                <BreadcrumbPage>{c.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={c.href}>{c.label}</Link>} />
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function AdminShell({
  logoutAction,
  children,
}: {
  logoutAction: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    setCollapsed(localStorage.getItem("cgd-sidebar-collapsed") === "true");
  }, []);

  const toggleCollapsed = () =>
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("cgd-sidebar-collapsed", String(next));
      return next;
    });

  const signOut = (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </form>
  );

  const viewSite = (
    <a
      href={siteConfig.url}
      target="_blank"
      rel="noreferrer"
      className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 sm:inline-flex"
    >
      <ExternalLink className="size-4" />
      View site
    </a>
  );

  return (
    <TooltipProvider delay={250} closeDelay={0}>
      <div className="flex min-h-screen bg-surface-muted">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar shadow-elevated lg:flex",
            "transition-[width] duration-200 ease-in-out",
            collapsed ? "w-16" : "w-64",
          )}
        >
          {/* Brand header */}
          <div
            className={cn(
              "flex h-16 shrink-0 items-center border-b border-sidebar-border",
              collapsed ? "justify-center" : "px-5",
            )}
          >
            <AdminBrandLockup collapsed={collapsed} />
          </div>

          {/* Nav — overflow-x-hidden prevents labels leaking during width transition */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <SidebarNav collapsed={collapsed} />
          </div>

          {/* Collapse toggle */}
          <div
            className={cn(
              "flex shrink-0 border-t border-sidebar-border py-2",
              collapsed ? "justify-center px-2" : "px-3",
            )}
          >
            <button
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "flex items-center gap-2 rounded-lg py-2 text-xs font-medium text-sidebar-foreground/45 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                collapsed ? "w-9 justify-center px-0" : "w-full px-2.5",
              )}
            >
              {collapsed ? (
                <ChevronRight className="size-4 shrink-0" />
              ) : (
                <>
                  <ChevronLeft className="size-4 shrink-0" />
                  <span className="whitespace-nowrap">Collapse</span>
                </>
              )}
            </button>
          </div>

          {/* Status footer */}
          <div
            className={cn(
              "shrink-0 border-t border-sidebar-border py-3.5",
              collapsed ? "flex justify-center px-2" : "px-5",
            )}
          >
            {collapsed ? (
              <span
                className="block size-1.5 rounded-full bg-emerald-400/80"
                aria-hidden
              />
            ) : (
              <p className="flex items-center gap-2 text-xs text-sidebar-foreground/45">
                <span
                  className="size-1.5 rounded-full bg-emerald-400/80"
                  aria-hidden
                />
                Internal tool · noindex
              </p>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-md sm:px-6">
            {/* Mobile menu trigger + drawer */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="outline" size="icon-sm" className="lg:hidden" />
                }
              >
                <Menu className="size-4" />
                <span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
                <SheetHeader className="h-16 justify-center border-b border-sidebar-border">
                  <SheetTitle className="p-0">
                    <AdminBrandLockup />
                  </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto bg-sidebar">
                  <SidebarNav onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <AdminBreadcrumb />

            <div className="ml-auto flex items-center gap-1.5">
              {viewSite}
              <Separator orientation="vertical" className="hidden h-5 sm:block" />
              {signOut}
            </div>
          </header>

          <main className="flex-1 px-4 py-7 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
