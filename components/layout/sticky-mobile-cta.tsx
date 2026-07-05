"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const AiChatWidget = dynamic(
  () => import("@/components/sections/ai-chat-widget").then((mod) => mod.AiChatWidget),
  { ssr: false }
);

/**
 * Session flag so the Smart Chat teaser tooltip appears at most **once per
 * visit, across every page**. Each route renders its own StickyMobileCta, so a
 * plain ref/state resets on navigation and the tooltip re-fires on every page
 * (and again when returning home). sessionStorage survives navigations within
 * the tab and clears when the tab closes — a returning visitor gets one fresh
 * nudge next session, but never a repeat while browsing around the site.
 */
const TEASER_SEEN_KEY = "cgd-smartchat-teaser-seen";

function teaserAlreadySeen() {
  try {
    return sessionStorage.getItem(TEASER_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markTeaserSeen() {
  try {
    sessionStorage.setItem(TEASER_SEEN_KEY, "1");
  } catch {
    // sessionStorage can throw (private mode / disabled) — degrade gracefully
    // to once-per-page-load rather than crashing the launcher.
  }
}

/**
 * Fixed conversion launcher shared across the homepage hero and inner templated
 * pages. On mobile/tablet it's a full-width Call + Smart Chat bar; on desktop
 * (lg+) it's a single round Smart Chat bubble bottom-right (chat only, no Call).
 * Both triggers share one AiChatWidget instance + open state. Render once per
 * page, outside any `overflow-hidden`/`relative` section, since `position:
 * fixed` would otherwise be clipped to its bounds.
 *
 * Framer-free: visibility is a passive, rAF-throttled scroll listener and the
 * show/hide + tooltip use CSS transitions/keyframes, so this always-mounted
 * component adds no animation-library weight to hydration (mobile TBT).
 */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hasShownTooltipRef = useRef(false);
  const tooltipTimeoutRef = useRef<number | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Reveal once the user scrolls past the hero. Passive + rAF-throttled — no
  // framer `useScroll` subscription in the critical hydration path.
  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    // If the teaser already fired earlier this session (on any page), suppress
    // it here so it never re-shows on navigation or when returning home.
    if (teaserAlreadySeen()) {
      hasShownTooltipRef.current = true;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      setVisible(window.scrollY > 150);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (visible && !hasShownTooltipRef.current) {
      tooltipTimeoutRef.current = window.setTimeout(() => {
        setShowTooltip(true);
        setBadgeVisible(true);
        hasShownTooltipRef.current = true;
        // Persist immediately on show so navigating away mid-teaser still
        // counts as "seen" — it appears exactly once per session, site-wide.
        markTeaserSeen();
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

    // Effect-local so it isn't a render-scoped dep (setShowTooltip is stable,
    // markTeaserSeen is module-level) — same "hide + persist" as dismissTooltip.
    const hide = () => {
      setShowTooltip(false);
      markTeaserSeen();
    };
    function handleClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        hide();
      }
    }
    const autoHide = window.setTimeout(hide, 7000);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      window.clearTimeout(autoHide);
    };
  }, [showTooltip]);

  // Every dismissal path (tap the X, tap outside, auto-hide, or open chat)
  // also persists "seen", so once the user closes it, it stays closed on every
  // subsequent page this session.
  function dismissTooltip() {
    setShowTooltip(false);
    markTeaserSeen();
  }

  function openChat() {
    setChatOpen(true);
    setShowTooltip(false);
    setBadgeVisible(false);
    markTeaserSeen();
  }

  return (
    <>
      {/* Mobile / tablet: full-width Call + Smart Chat bar (unchanged). */}
      <div
        ref={wrapperRef}
        className={cn(
          "fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-sm items-center gap-2 transition-[transform,opacity] duration-[350ms] ease-out lg:hidden",
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[130%] opacity-0",
        )}
      >
      {showTooltip && (
        <div className="cgd-pop-in absolute right-0 bottom-full mb-3 w-64">
          {/* The pointer sits outside this card on purpose — the card needs
              overflow-hidden so its glass background respects the rounded
              corners, but that would also clip the pointer's protruding
              tip, leaving only an unclipped sliver that reads as an
              upward chevron instead of a downward-pointing tail. */}
          <div className="cgd-glass-tooltip relative overflow-hidden p-4 text-foreground">
            <button
              type="button"
              aria-label="Dismiss"
              onClick={dismissTooltip}
              className="absolute top-2 right-2 z-10 rounded-full p-1.5 text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground/80 active:bg-foreground/15"
            >
              <X className="h-4 w-4" aria-hidden="true" />
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
        </div>
      )}

      <div className="flex w-full items-center gap-2 rounded-full border bg-card/95 p-2 shadow-[0_10px_30px_rgba(13,31,69,0.16)]">
        <a
          href={`tel:${siteConfig.business.phone}`}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-[0_6px_16px_rgba(200,34,42,0.25)] transition-colors hover:bg-cta/90"
        >
          <Phone className="h-4.5 w-4.5" aria-hidden="true" />
          Call Us
        </a>
        <button
          type="button"
          aria-label="Open smart chat assistant"
          onClick={openChat}
          className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-muted text-foreground transition-colors hover:bg-muted/70"
        >
          {showTooltip && !reducedMotion && (
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

      </div>

      {/* Desktop: a single round Smart Chat launcher pinned bottom-right — chat
          only, no Call button. Shares the same widget instance + open state as
          the mobile bar above, so only one AiChatWidget is ever mounted. */}
      <button
        type="button"
        aria-label="Open smart chat assistant"
        onClick={openChat}
        className="group fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#0f4e9b] text-white shadow-[0_12px_34px_rgba(13,31,69,0.32)] ring-1 ring-white/15 transition-transform hover:scale-105 active:scale-95 lg:flex"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-foreground/90 px-3 py-1.5 text-xs font-semibold text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
        >
          Chat with us
        </span>
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </button>

      <AiChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}
