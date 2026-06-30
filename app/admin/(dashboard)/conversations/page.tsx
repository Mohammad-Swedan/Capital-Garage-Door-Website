import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { adminRequest } from "@/lib/cms/admin";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import {
  AdminTableCard,
  AdminTableEmpty,
  AdminLoadError,
  adminRowClass,
} from "@/components/admin/ui/admin-table";

export const dynamic = "force-dynamic";

interface AdminConversation {
  id: number;
  sessionId: string;
  source: string | null;
  startedAt: string;
  lastMessageAt: string;
  turnCount: number;
  leadName: string | null;
  leadPhone: string | null;
  leadEmail: string | null;
  leadSuburb: string | null;
  leadType: string | null;
  leadCapturedAt: string | null;
  preview: string;
}

function fmt(value: string): string {
  return new Date(value).toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ConversationsPage() {
  const res = await adminRequest<AdminConversation[]>("/api/admin/assistant/conversations");
  const items = res.data ?? [];
  const leadCount = items.filter((c) => c.leadCapturedAt).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Assistant conversations"
        description={`${items.length} recent · ${leadCount} with a captured lead`}
      />

      {!res.ok ? (
        <AdminLoadError label="conversations" status={res.status} />
      ) : items.length === 0 ? (
        <AdminTableEmpty
          icon={<MessagesSquare className="size-5" />}
          title="No conversations yet"
          description="Chats with the Smart Garage Assistant will be logged here as visitors use it."
        />
      ) : (
        <AdminTableCard
          head={
            <tr>
              <th className="px-4 py-3 font-medium">Last message</th>
              <th className="px-4 py-3 font-medium">First question</th>
              <th className="px-4 py-3 text-center font-medium">Turns</th>
              <th className="px-4 py-3 font-medium">Lead</th>
            </tr>
          }
        >
          {items.map((c) => (
            <tr key={c.id} className={adminRowClass}>
              <td className="whitespace-nowrap px-4 py-3">
                <Link
                  href={`/admin/conversations/${c.id}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {fmt(c.lastMessageAt)}
                </Link>
              </td>
              <td className="max-w-md truncate px-4 py-3 text-muted-foreground">{c.preview || "—"}</td>
              <td className="px-4 py-3 text-center tabular-nums text-foreground">{c.turnCount}</td>
              <td className="px-4 py-3">
                {c.leadCapturedAt ? (
                  <span className="flex flex-wrap items-center gap-1.5 text-foreground">
                    {c.leadName || "Lead"}
                    {c.leadPhone ? <span className="text-muted-foreground">· {c.leadPhone}</span> : null}
                    {c.leadType ? <Badge variant="secondary">{c.leadType}</Badge> : null}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </AdminTableCard>
      )}
    </div>
  );
}
