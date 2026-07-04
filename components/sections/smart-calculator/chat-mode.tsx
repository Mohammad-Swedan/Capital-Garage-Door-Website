"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { m, AnimatePresence, type Variants } from "framer-motion";
import { DoorOpen, MapPin, ReceiptText, Send, Siren, Sparkles, Wrench, Zap, type LucideIcon } from "lucide-react";
import { ChatActions } from "@/components/sections/chat/chat-actions";
import { ChatSuggestions } from "@/components/sections/chat/chat-suggestions";
import {
  useAssistantChat,
  trackChatEvent,
  type ChatMessage,
} from "@/components/sections/chat/use-assistant-chat";
import { buildChatQuoteNotes } from "@/components/sections/chat/quote-prefill";
import type { ChatAction } from "@/components/sections/chat/types";
import { cn } from "@/lib/utils";

const quickReplies: { label: string; icon: LucideIcon }[] = [
  { label: "How much for a broken spring?", icon: Wrench },
  { label: "New double door cost?", icon: DoorOpen },
  { label: "My opener won't work", icon: Zap },
  { label: "Do you service my suburb?", icon: MapPin },
  { label: "I need help today", icon: Siren },
];

function BotAvatar() {
  return (
    <Image
      src="/images/chatbot-bot-icon.png"
      alt="Smart Assistant"
      width={40}
      height={40}
      className="h-full w-full object-contain p-1"
    />
  );
}

function TypingIndicator() {
  return (
    <m.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
        <BotAvatar />
      </span>
      <span className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </span>
    </m.div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isBot = message.role === "bot";
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex items-end gap-2", isBot ? "justify-start" : "justify-end")}
    >
      {isBot && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100">
          <BotAvatar />
        </span>
      )}
      <span
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
          isBot
            ? "rounded-bl-md border border-slate-200 bg-white text-slate-800"
            : "rounded-br-md bg-gradient-to-br from-primary to-[#0f4e9b] text-white"
        )}
      >
        {message.text}
      </span>
    </m.div>
  );
}

export function ChatMode({
  onBook,
  onQuote,
  onShowCalculator,
}: {
  onBook: () => void;
  onQuote: (ctx: { service?: string; suburb?: string; notes?: string }) => void;
  onShowCalculator: () => void;
}) {
  const { messages, typing, sendMessage } = useAssistantChat();
  const [input, setInput] = useState("");
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function handleAction(action: ChatAction) {
    trackChatEvent("calc_chat_cta_click", { type: action.type, label: action.label });
    switch (action.type) {
      case "call":
        return; // the rendered tel: anchor dials
      case "book":
        return onBook();
      case "quote":
        return onQuote({ notes: buildChatQuoteNotes(messages) });
      case "calculator":
        return onShowCalculator();
      case "suburb":
        if (action.value) void sendMessage(`Do you service ${action.value}?`);
        return;
      case "link":
        if (action.href) router.push(action.href);
        return;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    void sendMessage(text);
  }

  const lastMessage = messages[messages.length - 1];
  const showNextSteps = !typing && lastMessage?.role === "bot";

  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
  const chip: Variants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
      >
        {messages.length === 0 && (
          <>
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-sky-50 p-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-primary/10">
                  <BotAvatar />
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                    Ask the Smart Assistant <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                  </p>
                  <p className="text-[11px] font-medium text-primary/70">Real answers from our pricing & service info</p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                Describe your problem in your own words and I&apos;ll give you a price guide, check your suburb, or
                book you in.
              </p>
            </m.div>

            <m.div variants={container} initial="hidden" animate="show">
              <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((q) => (
                  <m.button
                    key={q.label}
                    type="button"
                    variants={chip}
                    onClick={() => void sendMessage(q.label)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3.5 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <q.icon className="h-3.5 w-3.5 shrink-0 text-cta" aria-hidden="true" />
                    {q.label}
                  </m.button>
                ))}
              </div>
            </m.div>
          </>
        )}

        {messages.map((msg) => (
          <Bubble key={msg.id} message={msg} />
        ))}

        <AnimatePresence>{typing && <TypingIndicator />}</AnimatePresence>

        {showNextSteps && lastMessage && (
          <div className="flex flex-col gap-3">
            {lastMessage.actions && lastMessage.actions.length > 0 && (
              <ChatActions actions={lastMessage.actions} onAction={handleAction} />
            )}
            {lastMessage.suggestions && lastMessage.suggestions.length > 0 && (
              <ChatSuggestions suggestions={lastMessage.suggestions} onPick={(t) => void sendMessage(t)} />
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your garage door problem…"
            aria-label="Message"
            className="h-11 min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary/40 focus:bg-white focus:ring-3 focus:ring-primary/15"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e0443a] via-cta to-[#a81c23] text-white shadow-[0_5px_16px_rgba(200,34,42,0.4)] transition-all hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:shadow-none"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10.5px] text-slate-400">
          <ReceiptText className="h-3 w-3 shrink-0 text-primary/50" aria-hidden="true" />
          Powered by Capital Garage Doors pricing &amp; knowledge base
        </p>
      </div>
    </div>
  );
}
