import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { adminRequest } from "@/lib/cms/admin";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Turn {
  role?: string;
  content?: string;
}

interface ConversationDetail {
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
  transcript: string;
}

function fmt(value: string): string {
  return new Date(value).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await adminRequest<ConversationDetail>(`/api/admin/assistant/conversations/${id}`);
  if (res.status === 404) notFound();

  const c = res.data;
  if (!res.ok || !c) {
    return (
      <div className="text-sm text-destructive">
        Couldn&apos;t load this conversation (status {res.status}).
      </div>
    );
  }

  let turns: Turn[] = [];
  try {
    const parsed = JSON.parse(c.transcript);
    if (Array.isArray(parsed)) turns = parsed as Turn[];
  } catch {
    // leave empty — show nothing rather than crash
  }

  const hasLead = Boolean(c.leadCapturedAt);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/conversations"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back to conversations
      </Link>

      <div className="grid gap-4 sm:grid-cols-3">
        <dl className="rounded-xl border border-border bg-card p-4 text-sm sm:col-span-2">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
            <dt className="text-muted-foreground">Started</dt>
            <dd className="text-foreground">{fmt(c.startedAt)}</dd>
            <dt className="text-muted-foreground">Last message</dt>
            <dd className="text-foreground">{fmt(c.lastMessageAt)}</dd>
            <dt className="text-muted-foreground">Turns</dt>
            <dd className="text-foreground">{c.turnCount}</dd>
            {c.source ? (
              <>
                <dt className="text-muted-foreground">Opened from</dt>
                <dd className="text-foreground">{c.source}</dd>
              </>
            ) : null}
            <dt className="text-muted-foreground">Session</dt>
            <dd className="truncate font-mono text-xs text-muted-foreground">{c.sessionId}</dd>
          </div>
        </dl>

        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
            Lead {hasLead && c.leadType ? <Badge variant="secondary">{c.leadType}</Badge> : null}
          </p>
          {hasLead ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
              {c.leadName ? (<><dt className="text-muted-foreground">Name</dt><dd className="text-foreground">{c.leadName}</dd></>) : null}
              {c.leadPhone ? (<><dt className="text-muted-foreground">Phone</dt><dd className="text-foreground">{c.leadPhone}</dd></>) : null}
              {c.leadEmail ? (<><dt className="text-muted-foreground">Email</dt><dd className="text-foreground">{c.leadEmail}</dd></>) : null}
              {c.leadSuburb ? (<><dt className="text-muted-foreground">Suburb</dt><dd className="text-foreground">{c.leadSuburb}</dd></>) : null}
            </dl>
          ) : (
            <p className="text-muted-foreground">No contact details captured.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">Transcript</p>
        {turns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages recorded.</p>
        ) : (
          <div className="space-y-3">
            {turns.map((t, i) => {
              const isAssistant = (t.role ?? "").toLowerCase() === "assistant";
              return (
                <div key={i} className={cn("flex", isAssistant ? "justify-start" : "justify-end")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      isAssistant
                        ? "rounded-bl-sm bg-muted text-foreground"
                        : "rounded-br-sm bg-primary text-primary-foreground",
                    )}
                  >
                    <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide opacity-60">
                      {isAssistant ? "Assistant" : "Visitor"}
                    </span>
                    {t.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
