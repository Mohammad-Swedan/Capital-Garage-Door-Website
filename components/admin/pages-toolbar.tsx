"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * URL-driven search + status filter for the pages list. Pushes changes into the query string (the
 * server component re-fetches); any change resets back to page 1. Search is debounced so we don't
 * navigate on every keystroke. Type filtering lives in the category chips, not here.
 */
export function PagesToolbar({ initialSearch, status }: { initialSearch: string; status: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(initialSearch);

  const push = React.useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      params.delete("page"); // any filter change returns to the first page
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams]
  );

  // Debounced search → URL.
  React.useEffect(() => {
    const handle = setTimeout(() => {
      const currentQ = searchParams.get("q") ?? "";
      const next = search.trim();
      if (next !== currentQ) push({ q: next || undefined });
    }, 350);
    return () => clearTimeout(handle);
    // Only re-run when the typed value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative sm:max-w-xs sm:flex-1">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or URL…"
          className="pl-8"
          aria-label="Search pages"
        />
      </div>
      <Select
        value={status || "all"}
        onValueChange={(v) => push({ status: (v as string) === "all" ? undefined : (v as string) })}
      >
        <SelectTrigger className="w-36" aria-label="Filter by status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="Published">Published</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
