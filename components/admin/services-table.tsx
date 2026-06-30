"use client";

import * as React from "react";
import Image from "next/image";
import { Wrench, Search, ImageOff, ExternalLink } from "lucide-react";
import { resolveIcon } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ServiceRowActions } from "@/components/admin/service-row-actions";
import {
  AdminTableCard,
  AdminTableEmpty,
  adminRowClass,
} from "@/components/admin/ui/admin-table";

export interface AdminService {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  iconName: string;
  assetId: number | null;
  imageUrl: string | null;
  canonicalPageId: number | null;
  canonicalHref: string | null;
  sortOrder: number;
}

/**
 * Services catalog table — the visual identity (rendered icon + image), the linked canonical page, and
 * completeness at a glance, with a client-side name/slug search (the catalog is small). Replaces the old
 * text-only grid.
 */
export function ServicesTable({ items }: { items: AdminService[] }) {
  const [search, setSearch] = React.useState("");
  const q = search.trim().toLowerCase();
  const filtered = q
    ? items.filter((s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q))
    : items;

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services…"
          className="pl-8"
          aria-label="Search services"
        />
      </div>

      {filtered.length === 0 ? (
        <AdminTableEmpty
          icon={<Wrench className="size-5" />}
          title={items.length === 0 ? "No services yet" : "No matching services"}
          description={
            items.length === 0
              ? "Add the services you offer — they power the homepage grid, /services and the footer."
              : "Try a different search."
          }
        />
      ) : (
        <AdminTableCard
          head={
            <tr>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Icon</th>
              <th className="px-4 py-3 font-medium">Linked page</th>
              <th className="px-4 py-3 text-center font-medium">Sort</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          }
        >
          {filtered.map((s) => {
            const Icon = resolveIcon(s.iconName);
            return (
              <tr key={s.id} className={adminRowClass}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative block size-10 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border">
                      {s.imageUrl ? (
                        <Image src={s.imageUrl} alt="" fill sizes="40px" className="object-cover" />
                      ) : (
                        <span className="flex size-full items-center justify-center text-muted-foreground">
                          <ImageOff className="size-4" />
                        </span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate font-medium text-foreground">{s.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{s.shortDescription}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="font-mono text-xs">{s.iconName}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.canonicalHref ? (
                    <a
                      href={s.canonicalHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                    >
                      {s.canonicalHref}
                      <ExternalLink className="size-3.5 shrink-0" />
                    </a>
                  ) : (
                    <Badge variant="warning">No page</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">{s.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <ServiceRowActions id={s.id} />
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTableCard>
      )}
    </div>
  );
}
