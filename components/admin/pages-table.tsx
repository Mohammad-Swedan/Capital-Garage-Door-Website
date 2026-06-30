import { FileText } from "lucide-react";

import type { AdminPageListItem } from "@/lib/cms/admin";
import { Badge } from "@/components/ui/badge";
import { PageRowActions } from "@/components/admin/page-row-actions";
import {
  AdminTableCard,
  AdminTableEmpty,
  adminRowClass,
} from "@/components/admin/ui/admin-table";
import { TYPE_LABELS } from "./pages-list";

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
 * Presentational table over the server-fetched (already filtered + paginated) page list. Filtering,
 * search and pagination are driven by the surrounding server component via the URL — this just renders
 * the current slice.
 */
export function PagesTable({ items, filtered }: { items: AdminPageListItem[]; filtered: boolean }) {
  if (items.length === 0) {
    return (
      <AdminTableEmpty
        icon={<FileText className="size-5" />}
        title={filtered ? "No matching pages" : "No pages yet"}
        description={
          filtered
            ? "Try adjusting your search or filters."
            : "Create your first page to start publishing content."
        }
      />
    );
  }

  return (
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
      {items.map((p) => (
        <tr key={p.id} className={adminRowClass}>
          <td className="px-4 py-3 font-medium text-foreground">{p.title}</td>
          <td className="px-4 py-3 text-muted-foreground">{TYPE_LABELS[p.templateType] ?? p.templateType}</td>
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
  );
}
