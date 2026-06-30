"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * URL-driven, debounced search for the FAQ library (question / answer / category). Pushes `?q=` and
 * resets to page 1; the server component re-fetches. Mirrors `pages-toolbar.tsx` without the status filter.
 */
export function FaqsToolbar({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(initialSearch);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      const currentQ = searchParams.get("q") ?? "";
      const next = search.trim();
      if (next === currentQ) return;
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("q", next);
      else params.delete("q");
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="relative max-w-md">
      <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search questions, answers, categories…"
        className="pl-8"
        aria-label="Search FAQs"
      />
    </div>
  );
}
