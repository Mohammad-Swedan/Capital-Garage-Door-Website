"use client";

import * as React from "react";
import { Loader2, Maximize2, Minimize2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const WARRANTY_FORM_URL = "https://booking-system-cgd.netlify.app/warranty/register";

/**
 * Embeds the external warranty system (register a warranty or check its status)
 * as an inline panel with a toolbar:
 *  - "New tab" — the reliable escape hatch (full browser page, no iframe limits).
 *  - "Full screen" — lifts the panel into an on-site overlay covering the viewport
 *    (z above the sticky header/CTA), Escape to close, background scroll locked.
 *
 * Both actions are labelled on every breakpoint — they matter most on a phone,
 * where the embedded form is tightest. Shortly after mount a one-time popup +
 * glow (CSS, motion-safe — see .cgd-hint-* in globals.css) draws the eye to the
 * Full screen button; it's NOT gated on the (often slow) external iframe load, so
 * it always shows, and it dismisses the moment the user opens full screen.
 *
 * The iframe is a single element reused across both states (the wrapper only swaps
 * classes), so expanding/collapsing never reloads a half-completed form. Loading
 * mirrors components/sections/booking-dialog.tsx (spinner until `onLoad`, then fade in).
 */
export function WarrantyRegistrationFrame() {
  const [loaded, setLoaded] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [hint, setHint] = React.useState(false);
  const dismissed = React.useRef(false);

  // Show the attention hint once, ~0.9s after mount (independent of iframe load).
  React.useEffect(() => {
    if (dismissed.current) return;
    const showT = setTimeout(() => setHint(true), 900);
    const hideT = setTimeout(() => {
      setHint(false);
      dismissed.current = true;
    }, 8400);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, []);

  // While full screen: lock background scroll and close on Escape.
  React.useEffect(() => {
    if (!expanded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  const toggleExpanded = () => {
    setHint(false); // they found it — stop nudging for good
    dismissed.current = true;
    setExpanded((v) => !v);
  };

  const showHint = hint && !expanded;

  return (
    // Outer wrapper keeps its reserved height even when the panel lifts into the
    // overlay, so the page below doesn't jump while full screen is open.
    <div className="relative h-[78dvh] min-h-150 w-full">
      <div
        className={cn(
          "flex flex-col overflow-hidden border border-border bg-card shadow-lg ring-1 ring-foreground/5",
          expanded ? "fixed inset-0 z-[60] rounded-none" : "absolute inset-0 rounded-2xl",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-card/95 px-3 py-2 sm:px-4">
          <span className="truncate text-sm font-semibold text-foreground">
            <span className="sm:hidden">Warranty</span>
            <span className="hidden sm:inline">Warranty registration</span>
          </span>

          <div className="flex items-center gap-1.5">
            <a
              href={WARRANTY_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              New tab
            </a>

            <div className="relative">
              <button
                type="button"
                onClick={toggleExpanded}
                aria-pressed={expanded}
                aria-label={expanded ? "Exit full screen" : "Open form full screen"}
                className="relative inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                {showHint && (
                  <span
                    aria-hidden="true"
                    className="cgd-hint-glow pointer-events-none absolute inset-0 rounded-lg"
                  />
                )}
                <span className="relative inline-flex items-center gap-1.5">
                  {expanded ? (
                    <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {expanded ? "Exit full screen" : "Full screen"}
                </span>
              </button>

              {showHint && (
                <div
                  aria-hidden="true"
                  className="cgd-hint-pop pointer-events-none absolute right-1 top-full z-20 mt-2.5 whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25"
                >
                  <span className="absolute -top-1 right-4 h-2 w-2 rotate-45 rounded-[2px] bg-primary" />
                  Tap for a bigger view
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative flex-1 bg-card">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">Loading the warranty form…</p>
            </div>
          )}
          <iframe
            src={WARRANTY_FORM_URL}
            title="Register or check your garage door warranty"
            className={cn(
              "h-full w-full border-0 transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}
