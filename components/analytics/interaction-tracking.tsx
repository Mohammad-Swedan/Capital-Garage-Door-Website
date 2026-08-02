"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

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

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
