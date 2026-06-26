"use client";

import * as React from "react";
import { FileText, Search } from "lucide-react";

import type { AdminPageListItem } from "@/lib/cms/admin";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageRowActions } from "@/components/admin/page-row-actions";
import {
  AdminTableCard,
  AdminTableEmpty,
  adminRowClass,
} from "@/components/admin/ui/admin-table";

const TEMPLATE_TYPES: { value: string; label: string }[] = [
  { value: "ServicePage", label: "Service page" },
  { value: "ComparisonPage", label: "Comparison page" },
  { value: "CostGuidePage", label: "Cost guide" },
  { value: "ServiceSuburbPage", label: "Service + suburb" },
  { value: "ProblemPage", label: "Problem page" },
  { value: "Article", label: "Blog article" },
  { value: "CaseStudyPage", label: "Case study" },
  { value: "LandingPage", label: "Landing page" },
];

const TYPE_LABELS = Object.fromEntries(TEMPLATE_TYPES.map((t) => [t.value, t.label]));

/** Status pill: published = success, draft = warning, with a muted noindex tag. */
function StatusBadge({ status, noIndex }: { status: string; noIndex: boolean }) {
  const published = status === "Published";
  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge variant={published ? "success" : "warning"}>{status}</Badge>
      {noIndex && (
        <Badge variant="outline" className="text-muted-foreground">
          noindex
        </Badge>
      )}
    </span>
  );
}

/**
 * Client-side toolbar + table over the server-fetched page list. Filtering and
 * search happen in the browser over the already-loaded items — no extra fetch,
 * no change to the data flow (the list still comes from `listPages()`).
 */
export function PagesTable({ items }: { items: AdminPageListItem[] }) {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("all");
  const [status, setStatus] = React.useState("all");

  const filtered = items.filter((p) => {
    if (type !== "all" && p.templateType !== type) return false;
    if (status !== "all" && p.status !== status) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.href.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-4">
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
        <div className="flex items-center gap-2">
          <Select value={type} onValueChange={(v) => setType((v as string) ?? "all")}>
            <SelectTrigger className="w-40" aria-label="Filter by type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {TEMPLATE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus((v as string) ?? "all")}>
            <SelectTrigger className="w-32" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <AdminTableEmpty
          icon={<FileText className="size-5" />}
          title={items.length === 0 ? "No pages yet" : "No matching pages"}
          description={
            items.length === 0
              ? "Create your first page to start publishing content."
              : "Try adjusting your search or filters."
          }
        />
      ) : (
        <AdminTableCard
          head={
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">URL</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          }
        >
          {filtered.map((p) => (
            <tr key={p.id} className={adminRowClass}>
              <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {TYPE_LABELS[p.templateType] ?? p.templateType}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.href}</td>
              <td className="px-4 py-3">
                <StatusBadge status={p.status} noIndex={p.noIndex} />
              </td>
              <td className="px-4 py-3">
                <PageRowActions id={p.id} status={p.status} href={p.href} />
              </td>
            </tr>
          ))}
        </AdminTableCard>
      )}
    </div>
  );
}
