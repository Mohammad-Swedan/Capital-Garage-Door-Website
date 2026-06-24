"use client";

import { useEffect, useRef, useState } from "react";
import {
  m,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Phone, MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";

const AiChatWidget = dynamic(
  () => import("@/components/sections/ai-chat-widget").then((mod) => mod.AiChatWidget),
  { ssr: false }
);

/**
 * Fixed bottom mobile CTA bar (Call + Smart Chat) shared across the homepage
 * hero and inner templated pages. Render once per page, outside any
 * `overflow-hidden`/`relative` section, since `position: fixed` would
 * otherwise be clipped to its bounds.
 */
export function StickyMobileCta() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const hasShownTooltipRef = useRef(false);
  const tooltipTimeoutRef = useRef<number | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 150);
  });

  useEffect(() => {
    if (visible && !hasShownTooltipRef.current) {
      tooltipTimeoutRef.current = window.setTimeout(() => {
        setShowTooltip(true);
        setBadgeVisible(true);
        hasShownTooltipRef.current = true;
      }, 3000);
    }
    return () => window.clearTimeout(tooltipTimeoutRef.current);
  }, [visible]);

  // Dismiss after 7s if ignored, or on an actual outside tap. Outside taps
  // are tracked via "click" rather than "pointerdown" — a scroll gesture
  // also fires pointerdown the instant a finger touches the screen, which
  // was closing the tooltip the moment the user tried to keep scrolling.
  // "click" only fires for an actual tap, not a touch-and-drag/scroll.
  useEffect(() => {
    if (!showTooltip) return;

    function handleClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    }
    const autoHide = window.setTimeout(() => setShowTooltip(false), 7000);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      window.clearTimeout(autoHide);
    };
  }, [showTooltip]);

  function openChat() {
    setChatOpen(true);
    setShowTooltip(false);
    setBadgeVisible(false);
  }

  return (
    <m.div
      ref={wrapperRef}
      initial={false}
      animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-sm items-center gap-2 lg:hidden"
    >
      <AnimatePresence>
        {showTooltip && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute right-0 bottom-full mb-3 w-64"
          >
            {/* The pointer sits outside this card on purpose — the card needs
                overflow-hidden so its glass background respects the rounded
                corners, but that would also clip the pointer's protruding
                tip, leaving only an unclipped sliver that reads as an
                upward chevron instead of a downward-pointing tail. */}
            <div className="cgd-glass-tooltip relative overflow-hidden p-4 text-foreground">
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setShowTooltip(false)}
                className="absolute top-2.5 right-2.5 z-10 rounded-full p-1 text-foreground/45 transition-colors hover:bg-white/50 hover:text-foreground/70"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <p className="relative z-10 flex items-center gap-1.5 text-sm font-bold text-foreground">
                <span aria-hidden="true">👋</span> Smart Chat
              </p>
              <p className="relative z-10 mt-1.5 text-xs leading-snug text-foreground/70">
                Need a quote or repair advice? Ask me instantly.
              </p>
              <button
                type="button"
                onClick={openChat}
                className="relative z-10 mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-cta"
              >
                Ask now <span aria-hidden="true">→</span>
              </button>
            </div>
            <span className="cgd-glass-tooltip-pointer absolute right-6 -bottom-1.5 h-3 w-3 rotate-45" />
          </m.div>
        )}
      </AnimatePresence>

      <div className="flex w-full items-center gap-2 rounded-full border bg-card/95 p-2 shadow-[0_10px_30px_rgba(13,31,69,0.16)]">
        <a
          href={`tel:${siteConfig.business.phone}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-[0_6px_16px_rgba(200,34,42,0.25)] transition-colors hover:bg-cta/90"
        >
          <Phone className="h-4.5 w-4.5" aria-hidden="true" />
          Call Us
        </a>
        <button
          type="button"
          aria-label="Open smart chat assistant"
          onClick={openChat}
          className="relative flex h-11.5 w-11.5 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-muted text-foreground transition-colors hover:bg-muted/70"
        >
          {showTooltip && !shouldReduceMotion && (
            <span className="absolute inset-0 rounded-full" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full border-2 border-cta/70" />
              <span className="absolute inset-0 animate-ping rounded-full border-2 border-cta/70 [animation-delay:0.7s]" />
            </span>
          )}
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {badgeVisible && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cta text-[10px] font-bold text-white ring-2 ring-card">
              1
            </span>
          )}
        </button>
      </div>

      <AiChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </m.div>
  );
}
