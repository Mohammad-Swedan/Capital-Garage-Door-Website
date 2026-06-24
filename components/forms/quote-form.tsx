"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitQuote, type QuoteFormState } from "@/lib/actions/quote";
import { ctaPrimaryClass } from "@/components/page/cta-buttons";

const initialState: QuoteFormState = { status: "idle" };

interface QuoteFormProps {
  /** Prefilled, e.g. "Garage Door Repairs". */
  service: string;
  /** Prefilled, e.g. "Joondalup". */
  suburb: string;
  /** pageType tracking value. */
  pageType?: string;
}

/** Page type 2 attribution payload — fixed value for these landing pages. */
const URGENCY_OPTIONS = [
  "Emergency — today",
  "Within 24 hours",
  "Within a few days",
  "Just getting a quote",
];

/**
 * Quote request form for Service+Suburb pages. Posts to the shared
 * `submitQuote` server action (validates, logs payload — wire to CRM later).
 * Captures hidden tracking fields (pageType, service, suburb, landingPage,
 * source, referrer, utm*) read from the URL on mount.
 */
export function QuoteForm({ service, suburb, pageType = "ServiceSuburbPage" }: QuoteFormProps) {
  const [state, formAction, isPending] = useActionState(submitQuote, initialState);

  const formRef = useRef<HTMLFormElement>(null);

  // Attribution is browser-only — populate the hidden inputs directly on mount
  // (a DOM write, not React state) so the values post with the form.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const set = (name: string, value: string) => {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.value = value;
    };
    set("landingPage", window.location.pathname);
    set("referrer", document.referrer);
    set("utmSource", params.get("utm_source") ?? "");
    set("utmMedium", params.get("utm_medium") ?? "");
    set("utmCampaign", params.get("utm_campaign") ?? "");
  }, []);

  const isSuccess = state.status === "success";

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      {/* Hidden tracking + attribution fields (attribution set on mount). */}
      <input type="hidden" name="pageType" value={pageType} />
      <input type="hidden" name="service" value={service} />
      <input type="hidden" name="source" value="website" />
      <input type="hidden" name="landingPage" defaultValue="" />
      <input type="hidden" name="referrer" defaultValue="" />
      <input type="hidden" name="utmSource" defaultValue="" />
      <input type="hidden" name="utmMedium" defaultValue="" />
      <input type="hidden" name="utmCampaign" defaultValue="" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="q-name">Name</Label>
          <Input id="q-name" name="name" required autoComplete="name" placeholder="Your name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-phone">Phone</Label>
          <Input id="q-phone" name="phone" type="tel" required autoComplete="tel" placeholder="04xx xxx xxx" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-email">Email</Label>
          <Input id="q-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-suburb">Suburb</Label>
          <Input id="q-suburb" name="suburb" defaultValue={suburb} autoComplete="address-level2" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="q-service">Service</Label>
          <Input id="q-service" defaultValue={service} readOnly aria-readonly className="bg-muted/60" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="q-urgency">Urgency</Label>
          <select
            id="q-urgency"
            name="urgency"
            aria-label="Urgency"
            defaultValue=""
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="" disabled>
              Select urgency…
            </option>
            {URGENCY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="q-notes">Message</Label>
        <Textarea
          id="q-notes"
          name="notes"
          rows={4}
          placeholder={`Tell us what's happening with your garage door in ${suburb}…`}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="q-attachment">Upload photo or video (optional)</Label>
        <label
          htmlFor="q-attachment"
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-[#0f4e9b]/40 hover:bg-[#0f4e9b]/5"
        >
          <Upload className="h-4 w-4 shrink-0 text-[#0f4e9b]" aria-hidden="true" />
          <span>Attach a photo or short video for a faster, more accurate quote</span>
        </label>
        <input id="q-attachment" name="attachment" type="file" accept="image/*,video/*" className="sr-only" />
      </div>

      {state.status !== "idle" && (
        <p
          role="status"
          className={cn(
            "flex items-center gap-2 text-sm font-medium",
            isSuccess ? "text-emerald-600" : "text-destructive"
          )}
        >
          {isSuccess && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          {state.message}
        </p>
      )}

      <button type="submit" disabled={isPending} className={cn(ctaPrimaryClass, "w-full disabled:opacity-60")}>
        {isPending ? "Sending…" : "Request My Quote"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        No call-out fee to quote · We typically reply within the hour during business hours.
      </p>
    </form>
  );
}
