"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { track } from "@/lib/analytics";
import type { AssistantReply, ChatAction } from "./types";

/**
 * Shared conversation engine for the Smart Garage Assistant. Owns the message list, the typing
 * indicator, and the POST to the same-origin /api/chat proxy (DeepSeek + CMS RAG, server-side). Both
 * the floating widget (ai-chat-widget.tsx) and the in-calculator "Ask AI" mode consume this so there
 * is exactly one implementation of the request shape, session id, and error fallback.
 *
 * The DeepSeek key never leaves the CMS — this only ever talks to /api/chat.
 */

export type ChatRole = "bot" | "user";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  /** Model-generated follow-up questions (latest bot turn only). */
  suggestions?: string[];
  /** Model-generated typed CTAs (latest bot turn only). */
  actions?: ChatAction[];
}

// Shown only when the assistant backend is unreachable or errors — keeps the conversation graceful
// and points the user at the phone. The real replies come from /api/chat (DeepSeek + CMS RAG).
const FALLBACK_REPLY =
  "Sorry, I'm having trouble connecting right now. For a fast answer, tap Call us below and the team will help straight away.";
const ERROR_ACTIONS: ChatAction[] = [{ type: "call", label: "Call us" }];

/**
 * Fire an analytics event for chat CTA interactions.
 *
 * This used to push a plain object straight onto `dataLayer`, which only Google
 * Tag Manager reads — and no GTM container is installed, so every event it fired
 * was discarded (GA4 held zero custom events on 2026-08-02). It now delegates to
 * `track()`, which emits to GA4 directly as well as to the dataLayer.
 */
export function trackChatEvent(event: string, params: Record<string, unknown>) {
  track(event, params);
}

/** Stable per-tab conversation id so the backend can upsert one logged transcript per visit. */
const SESSION_KEY = "cgd_chat_session";
export function getChatSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto?.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function currentPath(): string | undefined {
  return typeof window === "undefined" ? undefined : window.location.pathname;
}

let messageIdCounter = 0;
export function nextMessageId() {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
}

export interface UseAssistantChat {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  typing: boolean;
  /** Send a user message; resolves to true on a successful assistant reply, false on error. */
  sendMessage: (text: string) => Promise<boolean>;
}

export function useAssistantChat(): UseAssistantChat {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);

  // Mirror messages in a ref so sendMessage can read the latest history without being re-created
  // on every turn (keeps the function identity stable for callers/effects).
  const messagesRef = useRef<ChatMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(async (text: string): Promise<boolean> => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    // Engagement signal: how many visitors actually converse with the assistant,
    // and on which pages. `turn` separates "opened it and typed once" from a
    // real back-and-forth.
    track("chat_message", { turn: messagesRef.current.filter((m) => m.role === "user").length + 1 });

    const userMessage: ChatMessage = { id: nextMessageId(), role: "user", text: trimmed };
    // Send the full conversation (incl. this turn) so the assistant has context.
    const history = [...messagesRef.current, userMessage];
    setMessages(history);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((msg) => ({
            role: msg.role === "bot" ? "assistant" : "user",
            content: msg.text,
          })),
          sessionId: getChatSessionId(),
          source: currentPath(),
        }),
      });
      const data = (await res.json().catch(() => null)) as (AssistantReply & { error?: string }) | null;
      const reply = res.ok && data && typeof data.reply === "string" ? data.reply : undefined;
      const ok = !!reply;
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId(),
          role: "bot",
          text: ok ? reply! : FALLBACK_REPLY,
          suggestions: ok ? data!.suggestions : undefined,
          actions: ok ? data!.actions : ERROR_ACTIONS,
        },
      ]);
      return ok;
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: "bot", text: FALLBACK_REPLY, actions: ERROR_ACTIONS },
      ]);
      return false;
    } finally {
      setTyping(false);
    }
  }, []);

  return { messages, setMessages, typing, sendMessage };
}
