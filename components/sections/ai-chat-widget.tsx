"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { m, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import {
  ChevronLeft,
  DoorOpen,
  Loader2,
  MapPin,
  Paperclip,
  Phone,
  ReceiptText,
  Send,
  Siren,
  Sparkles,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { ChatActions } from "@/components/sections/chat/chat-actions";
import { ChatSuggestions } from "@/components/sections/chat/chat-suggestions";
import type { ChatAction, ChatOverlay } from "@/components/sections/chat/types";
import {
  useAssistantChat,
  trackChatEvent,
  nextMessageId,
  type ChatMessage,
} from "@/components/sections/chat/use-assistant-chat";
import type { BookingCompleteDetail } from "@/components/sections/chat/in-chat-booking";

// Heavy / on-demand panels — only loaded once the user raises that overlay.
const SmartPriceCalculator = dynamic(
  () => import("@/components/sections/smart-calculator").then((mod) => mod.SmartPriceCalculator),
  { ssr: false, loading: () => <PanelSpinner /> }
);
const InChatBooking = dynamic(
  () => import("@/components/sections/chat/in-chat-booking").then((mod) => mod.InChatBooking),
  { ssr: false }
);
const InChatQuote = dynamic(
  () => import("@/components/sections/chat/in-chat-quote").then((mod) => mod.InChatQuote),
  { ssr: false }
);

// Drives the send-button animation in order: the paper plane first launches
// out of the (still pill-shaped) button, THEN the pill shrinks into a circle
// with a checkmark to confirm, before resetting to idle.
type SendState = "idle" | "launch" | "success";

const quickReplies: { label: string; icon: LucideIcon }[] = [
  { label: "Get a quick quote", icon: ReceiptText },
  { label: "Garage door repair", icon: Wrench },
  { label: "New door installation", icon: DoorOpen },
  { label: "Do you service my suburb?", icon: MapPin },
  { label: "Emergency help", icon: Siren },
  { label: "Opener not working", icon: Zap },
];

function BotAvatar({ className }: { className?: string }) {
  return (
    <Image
      src="/images/chatbot-bot-icon.png"
      alt="Smart Garage Assistant"
      width={40}
      height={40}
      className={cn("h-full w-full object-contain p-1", className)}
    />
  );
}

export function AiChatWidget({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { messages, setMessages, typing, sendMessage } = useAssistantChat();
  const [input, setInput] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [overlay, setOverlay] = useState<ChatOverlay>(null);
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendTimersRef = useRef<number[]>([]);

  // Fire once per open, from here rather than from each trigger — the sheet is
  // opened by the sticky mobile bar, the desktop bubble and the hero, all of
  // which share this single instance.
  useEffect(() => {
    if (open) track("chat_open", {});
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const sendTimers = sendTimersRef.current;
    return () => {
      sendTimers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Run the send-button morph: sending (plane flies + shrink) → success
  // (checkmark + glow) → idle. Independent of the chat send logic, so the
  // message still goes out exactly as before. A real backend can call
  // setSendState("idle") on failure to skip the success state.
  function playSendAnimation() {
    sendTimersRef.current.forEach((t) => window.clearTimeout(t));
    sendTimersRef.current = [];
    setSendState("launch");
    // Let the plane finish its (slow, clearly visible) swipe across and out
    // of the pill before it morphs.
    const launchMs = reduceMotion ? 140 : 900;
    const successMs = reduceMotion ? 650 : 1000;
    sendTimersRef.current.push(window.setTimeout(() => setSendState("success"), launchMs));
    sendTimersRef.current.push(window.setTimeout(() => setSendState("idle"), launchMs + successMs));
  }

  // The conversation logic (history, fetch, fallback) lives in useAssistantChat; here we just drive
  // the send-button animation and skip its success checkmark when the request fails.
  async function handleSend(text: string) {
    const ok = await sendMessage(text);
    if (!ok) setSendState("idle");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    playSendAnimation();
    void handleSend(text);
  }

  function handleAction(action: ChatAction) {
    trackChatEvent("chat_cta_click", { type: action.type, label: action.label });
    switch (action.type) {
      case "call":
        return; // the rendered <a href="tel:"> handles dialling
      case "book":
        setOverlay("booking");
        return;
      case "calculator":
        setOverlay("calculator");
        return;
      case "quote":
        setOverlay("quote");
        return;
      case "suburb":
        if (action.value) sendMessage(`Do you service ${action.value}?`);
        return;
      case "link":
        if (action.href) {
          onOpenChange(false);
          router.push(action.href);
        }
        return;
    }
  }

  function handleBookingComplete(detail: BookingCompleteDetail) {
    setOverlay(null);
    trackChatEvent("chat_booking_complete", { ref: detail.ref });
    const refLine = detail.ref ? ` Your reference is ${detail.ref}.` : "";
    setMessages((prev) => [
      ...prev,
      {
        id: nextMessageId(),
        role: "bot",
        text: `Thanks${detail.name ? `, ${detail.name}` : ""}! Your booking request is in and our team will confirm it shortly.${refLine} Anything else I can help with?`,
        actions: [{ type: "call", label: "Call us" }],
      },
    ]);
  }

  const lastMessage = messages[messages.length - 1];
  const showNextSteps = !typing && !overlay && lastMessage?.role === "bot";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn(
          "flex flex-col gap-0 overflow-hidden rounded-t-[32px] border border-border bg-background/95 p-0 text-foreground shadow-[0_-25px_70px_-15px_rgba(13,31,69,0.3)] backdrop-blur-2xl",
          "data-[side=bottom]:h-[90dvh] sm:mx-auto sm:max-w-md sm:data-[side=bottom]:h-[640px] sm:data-[side=bottom]:max-h-[85dvh]"
        )}
      >
        {/* Ambient brand glow accents */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-12 h-56 w-56 rounded-full bg-primary/12 blur-[80px]" />
          <div className="absolute top-1/3 -right-16 h-48 w-48 rounded-full bg-cta/10 blur-[90px]" />
        </div>

        {/* Header */}
        <div className="relative z-10 shrink-0 overflow-hidden bg-gradient-to-br from-primary to-[#0f4e9b] px-5 pt-3.5 pb-4 text-white">
          {/* Drag handle */}
          <span
            aria-hidden="true"
            className="mx-auto mb-3.5 block h-1 w-10 rounded-full bg-white/30"
          />
          {/* Decorative blobs + subtle grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[28px_28px] mask-[radial-gradient(ellipse_70%_120%_at_20%_0%,black_20%,transparent_75%)]"
          />

          <div className="relative z-10 flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-full bg-white/20 [animation-duration:2.5s]"
                />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] ring-1 ring-white/30">
                  <BotAvatar />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-primary"
                />
              </span>
              <div className="min-w-0">
                <SheetTitle className="flex items-center gap-1.5 text-[15px] font-bold leading-tight text-white">
                  Smart Garage Assistant
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                </SheetTitle>
                <SheetDescription className="mt-0.5 text-[11px] leading-snug text-white/75">
                  Instant help with repairs, quotes &amp; service areas
                </SheetDescription>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Online now
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label="Request a quote"
                onClick={() => {
                  trackChatEvent("chat_quote_open", { source: "header" });
                  setOverlay("quote");
                }}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-white/15 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/25 active:scale-95 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
              >
                <ReceiptText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Quote</span>
              </button>
              <a
                href={`tel:${siteConfig.business.phone}`}
                aria-label="Call us"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-white text-xs font-semibold text-cta shadow-sm transition-transform hover:scale-105 active:scale-95 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Call</span>
              </a>
              <SheetClose
                aria-label="Close chat"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-4.5 w-4.5" aria-hidden="true" />
              </SheetClose>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="relative z-10 min-h-0 flex-1">
          {/* Soft texture behind the conversation */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-muted/30 bg-[radial-gradient(rgba(13,31,69,0.045)_1px,transparent_1px)] bg-size-[20px_20px]"
          />
          {/* Top + bottom scroll fades */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-muted/60 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-5 bg-gradient-to-t from-background/70 to-transparent"
          />

          <div
            ref={scrollRef}
            className="relative h-full space-y-4 overflow-y-auto px-4 py-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/15 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {messages.length === 0 && (
              <>
                <WelcomeCard />
                <QuickChips onPick={(t) => sendMessage(t)} />
              </>
            )}

            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            <AnimatePresence>{typing && <TypingIndicator />}</AnimatePresence>

            {showNextSteps && lastMessage && (
              <div className="flex flex-col gap-3">
                {lastMessage.actions && lastMessage.actions.length > 0 && (
                  <ChatActions actions={lastMessage.actions} onAction={handleAction} />
                )}
                {lastMessage.suggestions && lastMessage.suggestions.length > 0 && (
                  <ChatSuggestions suggestions={lastMessage.suggestions} onPick={(t) => sendMessage(t)} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Composer — note: no backdrop-filter here. A backdrop-filtered
            element clips overflowing descendants in Chromium, which would cut
            off the send button's paper plane as it flies up out of the bar. */}
        <div className="relative z-10 shrink-0 border-t border-border bg-background px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-border bg-muted/50 py-1.5 pl-2 pr-3 transition-all focus-within:border-primary/40 focus-within:bg-background focus-within:ring-3 focus-within:ring-primary/15">
              <button
                type="button"
                disabled
                aria-label="Attach a photo (coming soon)"
                title="Photo uploads coming soon"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground/50 transition-colors disabled:cursor-not-allowed"
              >
                <Paperclip className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about repairs, prices, or your suburb…"
                aria-label="Message"
                className="h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <SendButton state={sendState} disabled={!input.trim()} reduceMotion={!!reduceMotion} />
          </form>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[10.5px] text-muted-foreground">
            <Sparkles className="h-3 w-3 shrink-0 text-primary/60" aria-hidden="true" />
            Powered by Capital Garage Doors knowledge base
          </p>
        </div>

        {/* In-chat overlays (booking / calculator / quote) — cover the sheet so the conversation is kept. */}
        {overlay === "booking" && (
          <InChatBooking onClose={() => setOverlay(null)} onComplete={handleBookingComplete} />
        )}
        {overlay === "quote" && <InChatQuote onClose={() => setOverlay(null)} />}
        {overlay === "calculator" && (
          <div className="absolute inset-0 z-20 flex flex-col bg-background">
            <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-2.5">
              <button
                type="button"
                onClick={() => setOverlay(null)}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back to chat
              </button>
              <span className="ml-auto text-sm font-semibold text-foreground">Price estimate</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {/* Already inside the AI chat — show the structured calculator only (no "Ask AI" tab). */}
              <SmartPriceCalculator showChatMode={false} />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function PanelSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
    </div>
  );
}

function WelcomeCard() {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-primary/15 bg-background/85 p-4 shadow-[0_8px_30px_rgba(13,31,69,0.1)] backdrop-blur-sm"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl"
      />
      <div className="relative z-10 flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(27,59,140,0.35)] ring-1 ring-primary/10">
          <BotAvatar />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-foreground">Smart Garage Assistant</p>
          <p className="text-[11px] font-medium text-primary/70">AI concierge &middot; replies in seconds</p>
        </div>
      </div>
      <p className="relative z-10 mt-3 text-sm font-semibold text-foreground">
        <span aria-hidden="true">👋</span> Hi, I&apos;m your Smart Garage Assistant.
      </p>
      <p className="relative z-10 mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
        I can help you understand repair costs, choose a garage door, check service areas, or
        request a quote.
      </p>
    </m.div>
  );
}

function QuickChips({ onPick }: { onPick: (text: string) => void }) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const chip: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  };

  return (
    <m.div variants={container} initial="hidden" animate="show">
      <p className="mb-2 px-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        Popular questions
      </p>
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((q) => (
          <m.button
            key={q.label}
            type="button"
            variants={chip}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onPick(q.label)}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background px-3.5 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <q.icon className="h-3.5 w-3.5 shrink-0 text-cta" aria-hidden="true" />
            {q.label}
          </m.button>
        ))}
      </div>
    </m.div>
  );
}

function TypingIndicator() {
  return (
    <m.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_10px_rgba(27,59,140,0.4)] ring-1 ring-primary/10">
        <BotAvatar />
      </span>
      <span className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-background px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    </m.div>
  );
}

const PILL_WIDTH = 90; // idle "Send" pill width (px)
const CIRCLE_WIDTH = 44; // sending/success circle width (px), matches h-11

function SendButton({
  state,
  disabled,
  reduceMotion,
}: {
  state: SendState;
  disabled: boolean;
  reduceMotion: boolean;
}) {
  const isAnimating = state !== "idle";
  // The pill stays full-width while the icon swipes across it (state ===
  // "launch") and only shrinks into the circle once we reach "success".
  const morph = state === "success" && !reduceMotion;

  return (
    <m.button
      type="submit"
      disabled={disabled || isAnimating}
      aria-label="Send message"
      initial={false}
      animate={{ width: morph ? CIRCLE_WIDTH : PILL_WIDTH }}
      transition={{ type: "spring", stiffness: 450, damping: 30 }}
      whileHover={!disabled && !isAnimating ? { scale: 1.04 } : undefined}
      whileTap={!disabled && !isAnimating ? { scale: 0.95 } : undefined}
      className={cn(
        "relative flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#e0443a] via-cta to-[#a81c23] text-sm font-semibold text-cta-foreground shadow-[0_5px_16px_rgba(200,34,42,0.4)] transition-[opacity,box-shadow] duration-300",
        !isAnimating && disabled && "opacity-40 shadow-none",
        state === "success" && "shadow-[0_0_24px_rgba(200,34,42,0.6)]"
      )}
    >
      {/* Success glow pulse */}
      {state === "success" && !reduceMotion && (
        <m.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-cta"
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.9 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      )}

      {/* Pill label — the plane swipes left-to-right across the button and
          clips when it hits the edge (overflow-hidden). It also rotates 45
          degrees so the nose points straight right before leaving. */}
      <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
        <m.span
          className="inline-flex"
          initial={false}
          animate={
            isAnimating
              ? { x: 86, rotate: 45, opacity: 0 }
              : { x: 0, rotate: 0, opacity: 1 }
          }
          transition={{
            x: { duration: reduceMotion ? 0.12 : 0.85, ease: [0.4, 0, 0.2, 1] },
            rotate: { duration: reduceMotion ? 0.12 : 0.4, ease: "easeOut" },
            // Fades right as it crosses the edge so it doesn't just hard clip
            opacity: { duration: reduceMotion ? 0.12 : 0.2, ease: "easeIn", delay: reduceMotion ? 0 : 0.3 },
          }}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </m.span>
        <m.span
          initial={false}
          animate={state === "idle" ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.4, ease: "easeOut" }}
        >
          Send
        </m.span>
      </span>

      {/* Checkmark confirmation, once the pill has morphed to a circle */}
      <AnimatePresence>
        {state === "success" && (
          <m.span
            key="success"
            className="absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <DrawCheck reduceMotion={reduceMotion} />
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  );
}

function DrawCheck({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <m.svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <m.path
        d="M5 12.5l4.4 4.4L19 7.5"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut", delay: reduceMotion ? 0 : 0.08 }}
      />
    </m.svg>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isBot = message.role === "bot";
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex items-end gap-2", isBot ? "justify-start" : "justify-end")}
    >
      {isBot && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_0_10px_rgba(27,59,140,0.4)] ring-1 ring-primary/10">
          <BotAvatar />
        </span>
      )}
      <span
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm",
          isBot
            ? "rounded-bl-md border border-border bg-background text-foreground"
            : "rounded-br-md bg-gradient-to-br from-cta to-[#a81c23] text-cta-foreground shadow-[0_4px_16px_rgba(200,34,42,0.3)]"
        )}
      >
        {message.text}
      </span>
    </m.div>
  );
}
