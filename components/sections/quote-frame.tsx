"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BOOKING_EMBED_ORIGIN,
  buildQuoteEmbedSrc,
  type QuoteEmbedPrefill,
} from "@/lib/booking-embed";

/** Initial/minimum frame height while the widget loads (the widget's documented default). */
const DEFAULT_HEIGHT = 700;

interface QuoteFrameProps {
  /** Fields to pre-fill in the widget via URL query (only known values — leave the rest unset). */
  prefill?: QuoteEmbedPrefill;
  /**
   * `false` (default): inline embed whose height follows the widget's
   * `booking-widget-resize` postMessage, so the wizard grows/shrinks with its steps
   * and never shows an internal scrollbar.
   * `true`: fill the parent (dialog/chat overlay) and let the widget scroll internally.
   */
  fill?: boolean;
  className?: string;
}

/**
 * The live quote-request widget (booking-system-cgd.netlify.app/embed/quote) in an iframe.
 * Submissions land directly in the CRM — every "request a quote" surface on the site
 * renders this embed.
 */
export function QuoteFrame({ prefill, fill = false, className }: QuoteFrameProps) {
  const [loaded, setLoaded] = React.useState(false);
  const [height, setHeight] = React.useState(DEFAULT_HEIGHT);
  const frameRef = React.useRef<HTMLIFrameElement>(null);

  // Auto-resize handshake: the widget posts its content height on every wizard-step
  // change. Scoped to this frame via event.source so multiple embeds coexist.
  React.useEffect(() => {
    if (fill) return;
    function handleMessage(event: MessageEvent) {
      if (event.origin !== BOOKING_EMBED_ORIGIN) return;
      const data = event.data as { type?: unknown; height?: unknown } | null;
      if (!data || typeof data !== "object" || data.type !== "booking-widget-resize") return;
      if (event.source !== frameRef.current?.contentWindow) return;
      if (typeof data.height === "number" && data.height > 0) setHeight(Math.ceil(data.height));
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fill]);

  const src = buildQuoteEmbedSrc(prefill);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-background",
        fill ? "h-full flex-1" : "w-full",
        className
      )}
      style={fill ? undefined : { height }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <iframe
        ref={frameRef}
        src={src}
        title="Request a quote"
        allow="payment"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        className={cn(
          "h-full w-full border-0 transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
