import { useEffect, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";

/**
 * Booking system shown as a panel INSIDE the chat sheet (rather than a separate dialog), so the user
 * never loses the conversation. Listens for a `cgd:booking-complete` postMessage from the booking app
 * so we can auto-close and confirm in-thread when they finish.
 *
 * Handshake (booking-system-cgd repo, success screen):
 *   window.parent?.postMessage(
 *     { type: "cgd:booking-complete", ref, name, phone },
 *     "<our-site-origin>"
 *   );
 * Until that ships, the manual back/close button is the fallback — no functional gap.
 */

const BOOKING_URL = "https://booking-system-cgd.netlify.app/";
const BOOKING_ORIGIN = "https://booking-system-cgd.netlify.app";

export interface BookingCompleteDetail {
  ref?: string;
  name?: string;
  phone?: string;
}

export function InChatBooking({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (detail: BookingCompleteDetail) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Only trust messages from the booking app's exact origin.
      if (event.origin !== BOOKING_ORIGIN) return;
      const data = event.data as { type?: unknown } | null;
      if (!data || typeof data !== "object" || data.type !== "cgd:booking-complete") return;
      const detail = data as { ref?: string; name?: string; phone?: string };
      onComplete({ ref: detail.ref, name: detail.name, phone: detail.phone });
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-background">
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-2.5">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to chat
        </button>
        <span className="ml-auto text-sm font-semibold text-foreground">Book your service</span>
      </div>
      <div className="relative flex-1 bg-background">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        <iframe
          src={BOOKING_URL}
          title="Book your garage door service"
          className={`h-full w-full border-0 transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
