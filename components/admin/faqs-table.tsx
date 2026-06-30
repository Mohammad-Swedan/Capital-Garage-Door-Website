import { HelpCircle } from "lucide-react";
import type { AdminFaqItem } from "@/lib/cms/admin";
import { Badge } from "@/components/ui/badge";
import { FaqRowActions } from "@/components/admin/faq-row-actions";
import {
  AdminTableCard,
  AdminTableEmpty,
  adminRowClass,
} from "@/components/admin/ui/admin-table";

/** Presentational table over the server-fetched (filtered + paginated) FAQ slice. */
export function FaqsTable({ items, filtered }: { items: AdminFaqItem[]; filtered: boolean }) {
  if (items.length === 0) {
    return (
      <AdminTableEmpty
        icon={<HelpCircle className="size-5" />}
        title={filtered ? "No matching FAQs" : "No FAQs yet"}
        description={
          filtered
            ? "Try adjusting your search or category."
            : "Create your first FAQ to build the library."
        }
      />
    );
  }

  return (
    <AdminTableCard
      head={
        <tr>
          <th className="px-4 py-3 font-medium">Question</th>
          <th className="px-4 py-3 font-medium">Category</th>
          <th className="px-4 py-3 font-medium">Updated</th>
          <th className="px-4 py-3 text-right font-medium">Actions</th>
        </tr>
      }
    >
      {items.map((f) => (
        <tr key={f.id} className={adminRowClass}>
          <td className="max-w-md px-4 py-3">
            <span className="block truncate font-medium text-foreground">{f.question}</span>
            <span className="block truncate text-xs text-muted-foreground">{f.answer}</span>
          </td>
          <td className="px-4 py-3">
            {f.category ? (
              <Badge variant="secondary">{f.category}</Badge>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </td>
          <td className="px-4 py-3 text-muted-foreground">
            {f.updatedAt ? new Date(f.updatedAt).toLocaleDateString() : "—"}
          </td>
          <td className="px-4 py-3">
            <div className="flex justify-end">
              <FaqRowActions id={f.id} />
            </div>
          </td>
        </tr>
      ))}
    </AdminTableCard>
  );
}
