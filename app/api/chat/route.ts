import { NextResponse, type NextRequest } from "next/server";

/**
 * Smart Garage Assistant proxy. The browser only ever talks to this same-origin route — it never
 * sees the CMS or the DeepSeek key. This forwards the conversation to the ASP.NET CMS assistant
 * endpoint (which does the RAG retrieval + LLM call), attaching the shared secret so only this
 * server can invoke the paid endpoint. Mirrors the auth/fetch shape of app/api/revalidate.
 *
 * The CMS returns a structured envelope ({ reply, suggestions, actions }); we revalidate + bound it
 * here (the browser is untrusted on the way out) before handing it to the widget.
 */

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:5179";

// Keep these in step with the backend ChatQueryValidator (max 30 messages, 2000 chars each).
const MAX_MESSAGES = 30;
const MAX_CONTENT_LENGTH = 2000;

// Mirror the backend's output bounds so a compromised/old backend can't bloat the client payload.
const MAX_SUGGESTIONS = 3;
const MAX_ACTIONS = 4;
const ACTION_TYPES = new Set(["call", "book", "calculator", "quote", "suburb", "link"]);

// Best-effort per-IP, per-instance throttle (the CMS endpoint is the real rate-limit authority;
// this just trims obvious abuse at the edge). Resets on a fixed 1-minute window.
const RATE_LIMIT = 15;
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

interface IncomingMessage {
  role?: unknown;
  content?: unknown;
}

interface AssistantAction {
  type: string;
  label: string;
  value?: string;
  href?: string;
}

interface AssistantReply {
  reply: string;
  suggestions: string[];
  actions: AssistantAction[];
}

/** Defensively normalise the CMS envelope into the exact shape the widget renders. */
function sanitizeReply(data: unknown): AssistantReply | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const reply = typeof obj.reply === "string" ? obj.reply : "";
  if (!reply.trim()) return null;

  const suggestions = Array.isArray(obj.suggestions)
    ? obj.suggestions
        .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .map((s) => s.trim())
        .slice(0, MAX_SUGGESTIONS)
    : [];

  const actions: AssistantAction[] = Array.isArray(obj.actions)
    ? obj.actions
        .map((a) => (a && typeof a === "object" ? (a as Record<string, unknown>) : null))
        .filter((a): a is Record<string, unknown> => a !== null)
        .map((a) => ({
          type: typeof a.type === "string" ? a.type.toLowerCase() : "",
          label: typeof a.label === "string" ? a.label.trim() : "",
          value: typeof a.value === "string" ? a.value : undefined,
          href: typeof a.href === "string" ? a.href : undefined,
        }))
        .filter((a) => ACTION_TYPES.has(a.type) && a.label.length > 0)
        .slice(0, MAX_ACTIONS)
    : [];

  return { reply, suggestions, actions };
}

export async function POST(request: NextRequest) {
  const secret = process.env.ASSISTANT_PROXY_SECRET;
  if (!secret) {
    // Missing config is a server problem, not the caller's — fail safe with a generic message.
    return NextResponse.json(
      { error: "The assistant isn't configured right now." },
      { status: 503 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment." },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { messages?: IncomingMessage[]; sessionId?: unknown; source?: unknown }
    | null;
  const rawMessages = Array.isArray(body?.messages) ? body!.messages : null;
  if (!rawMessages || rawMessages.length === 0) {
    return NextResponse.json({ error: "A non-empty 'messages' array is required." }, { status: 400 });
  }

  // Normalise + bound the payload before forwarding (last N turns, capped length, valid roles).
  const messages = rawMessages
    .filter((m): m is IncomingMessage => typeof m?.content === "string" && m.content.trim().length > 0)
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: (m.content as string).slice(0, MAX_CONTENT_LENGTH),
    }));

  if (messages.length === 0) {
    return NextResponse.json({ error: "A non-empty 'messages' array is required." }, { status: 400 });
  }

  // Optional conversation-logging metadata (best-effort on the backend).
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.slice(0, 64) : undefined;
  const source = typeof body?.source === "string" ? body.source.slice(0, 300) : undefined;

  try {
    const res = await fetch(`${CMS_API_URL}/api/assistant/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-assistant-secret": secret,
      },
      body: JSON.stringify({ messages, sessionId, source }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    const sanitized = res.ok ? sanitizeReply(data) : null;
    if (!sanitized) {
      return NextResponse.json(
        { error: "The assistant is unavailable right now. Please call us for help." },
        { status: res.status === 429 ? 429 : 502 }
      );
    }
    return NextResponse.json(sanitized);
  } catch {
    // fetch throws when the CMS is unreachable (mirrors loginAction's try/catch).
    return NextResponse.json(
      { error: "The assistant is unavailable right now. Please call us for help." },
      { status: 502 }
    );
  }
}
