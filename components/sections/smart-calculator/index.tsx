"use client";

import { useState } from "react";
import Image from "next/image";
import { Calculator, MessageCircle, Phone, Sparkles } from "lucide-react";
import { CalculatorMode } from "./calculator-mode";
import { ChatMode } from "./chat-mode";
import { InChatBooking } from "@/components/sections/chat/in-chat-booking";
import { InChatQuote, type QuoteLead } from "@/components/sections/chat/in-chat-quote";
import { getChatSessionId, currentPath, trackChatEvent } from "@/components/sections/chat/use-assistant-chat";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Mode = "calculator" | "chat";
type Overlay = "booking" | "quote" | null;
/** Pre-fill passed into the quote overlay (from the calculator selection or the chat transcript). */
type QuoteContext = { service?: string; suburb?: string; notes?: string };

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

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  const items: { id: Mode; label: string; icon: typeof Calculator }[] = [
    { id: "calculator", label: "Calculator", icon: Calculator },
    { id: "chat", label: "Ask AI", icon: MessageCircle },
  ];
  return (
    <div className="relative mx-auto mt-4 flex w-full max-w-sm rounded-full bg-white/15 p-1 ring-1 ring-white/20">
      {/* Sliding indicator */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-all duration-300 ease-out",
          mode === "calculator" ? "left-1" : "left-1/2"
        )}
      />
      {items.map((it) => {
        const active = mode === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange(it.id)}
            className="relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
          >
            <it.icon className={cn("h-4 w-4", active ? "text-primary" : "text-white/85")} aria-hidden="true" />
            <span className={active ? "text-primary" : "text-white/85"}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Smart Price Calculator — a real estimator (live DB-driven pricing) with an optional natural-language
 * AI mode (DeepSeek + CMS RAG). Mounted on /calculator, in the calculator dialog, and as the in-chat
 * overlay (which passes showChatMode={false} since it already lives inside the AI chat).
 */
export function SmartPriceCalculator({ showChatMode = true }: { showChatMode?: boolean }) {
  const [mode, setMode] = useState<Mode>("calculator");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [quoteCtx, setQuoteCtx] = useState<QuoteContext | null>(null);

  const activeMode: Mode = showChatMode ? mode : "calculator";

  const openQuote = (ctx: QuoteContext) => {
    setQuoteCtx(ctx);
    setOverlay("quote");
  };

  function handleQuoteSubmitted(lead: QuoteLead) {
    trackChatEvent("calc_quote_submitted", {});
    const sessionId = getChatSessionId();
    if (!sessionId) return;
    // Best-effort lead capture, mirroring the chat widget's quote flow.
    void fetch("/api/chat/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        name: lead.name,
        phone: lead.phone,
        type: "quote",
        source: currentPath(),
      }),
    }).catch(() => {});
  }

  return (
    <div className="relative mx-auto flex h-full min-h-[34rem] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
      {/* Header */}
      <header className="relative z-10 shrink-0 overflow-hidden bg-gradient-to-br from-primary to-[#0f4e9b] px-5 py-4 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        />
        {/* Cap the header content to the wizard column's width so it lines up with the
            steps below when the calculator is full-bleed (the /calculator page). */}
        <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-white/30">
              <BotAvatar />
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-primary"
              />
            </span>
            <div className="min-w-0">
              <h2 className="flex items-center gap-1.5 text-base font-bold leading-tight">
                Smart Price Calculator
                <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Live Perth pricing · instant estimate
              </p>
            </div>
          </div>
          <a
            href={`tel:${siteConfig.business.phone}`}
            aria-label="Call us"
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold text-cta shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Call</span>
          </a>
        </div>

        {showChatMode && <ModeToggle mode={mode} onChange={setMode} />}
        </div>
      </header>

      {/* Body */}
      <div className="relative min-h-0 flex-1">
        {activeMode === "calculator" ? (
          <CalculatorMode onBook={() => setOverlay("booking")} onQuote={openQuote} />
        ) : (
          <ChatMode
            onBook={() => setOverlay("booking")}
            onQuote={openQuote}
            onShowCalculator={() => setMode("calculator")}
          />
        )}
      </div>

      {/* Conversion overlays (cover the card; the user keeps their place underneath). */}
      {overlay === "booking" && (
        <InChatBooking onClose={() => setOverlay(null)} onComplete={() => setOverlay(null)} />
      )}
      {overlay === "quote" && (
        <InChatQuote
          service={quoteCtx?.service}
          defaultSuburb={quoteCtx?.suburb}
          defaultNotes={quoteCtx?.notes}
          onClose={() => setOverlay(null)}
          onSubmitted={handleQuoteSubmitted}
        />
      )}
    </div>
  );
}

export default SmartPriceCalculator;
