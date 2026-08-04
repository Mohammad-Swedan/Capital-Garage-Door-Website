"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { BOOKING_EMBED_ORIGIN, parseBookingCompletion } from "@/lib/booking-embed";

/**
 * Site-wide conversion-click tracking, via ONE delegated listener on `document`.
 *
 * Why delegation rather than an onClick on each link: `tel:` links appear in 20+
 * components (header, footer, hero, sticky mobile CTA, every page template's
 * quote form and contact panel, both landing-page layouts, the chat actions…),
 * and more arrive inside CMS-authored content that this repo never sees. Wiring
 * each call site guarantees drift — a new phone button ships untracked and
 * nobody notices, because missing analytics is silent. A single listener at the
 * document root catches every one of them, forever, including CMS content.
 *
 * The same argument rules out doing this with CSS-selector triggers in Google
 * Tag Manager: this site is styled with Tailwind, so class strings change
 * whenever a component is restyled and the trigger would break with no error.
 * Matching on `href` is stable in a way that matching on markup is not.
 *
 * Mounted unconditionally (not inside layout.tsx's production-only analytics
 * gate) so the events can be verified locally — `track()` is a no-op in effect
 * when gtag never loads, since the queued entries just sit unread.
 *
 * It also listens for the booking app's completion postMessages, which is what
 * turns `quote_open`/`booking_open` (intent) into `quote_submit`/`booking_submit`
 * (an actual lead, attributed to the page it came from).
 */
export function InteractionTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";

      if (href.startsWith("tel:")) {
        track("call_click", {
          // The dialled number, so a future second number (call tracking) is
          // distinguishable from the main one in reports.
          phone: href.slice(4),
          // Trimmed so a long accessible name can't blow past GA4's parameter
          // value limit; enough to tell the header button from the sticky bar.
          link_text: (link.textContent ?? "").trim().slice(0, 60),
        });
        return;
      }

      if (href.startsWith("mailto:")) {
        track("email_click", {});
      }
    };

    // Lead completions reported by the embedded booking app (cross-origin iframe).
    // Same delegation argument as the click listener: quote and booking frames are
    // mounted by half a dozen components, so one listener at the window beats
    // wiring each surface.
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== BOOKING_EMBED_ORIGIN) return;
      const completion = parseBookingCompletion(event.data);
      if (!completion) return;
      track(completion.event, completion.params);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("message", onMessage);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return null;
}
