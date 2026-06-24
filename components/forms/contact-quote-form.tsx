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

const SERVICE_OPTIONS = [
  "Garage Door Repair",
  "Garage Door Installation",
  "Motor Replacement",
  "Roller Door Repair",
  "Emergency Repair",
  "Servicing",
  "Commercial Garage Door",
];

const URGENCY_OPTIONS = ["Emergency", "This week", "Flexible", "Just asking"];

const CONTACT_METHOD_OPTIONS = ["Phone Call", "Text Message", "Email"];

const selectClass =
  "h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm";

/**
 * Full lead-capture form for the /contact page. Posts to the shared
 * `submitQuote` server action (same as the suburb-page QuoteForm) but with
 * editable service/suburb fields plus urgency and preferred-contact-method,
 * since this page isn't prefilled from a service+suburb landing slug.
 */
export function ContactQuoteForm() {
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
      <input type="hidden" name="pageType" value="ContactPage" />
      <input type="hidden" name="source" value="website" />
      <input type="hidden" name="landingPage" defaultValue="" />
      <input type="hidden" name="referrer" defaultValue="" />
      <input type="hidden" name="utmSource" defaultValue="" />
      <input type="hidden" name="utmMedium" defaultValue="" />
      <input type="hidden" name="utmCampaign" defaultValue="" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="cq-name">Name</Label>
          <Input id="cq-name" name="name" required autoComplete="name" placeholder="Your name" className="h-11" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cq-phone">Phone</Label>
          <Input
            id="cq-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="04xx xxx xxx"
            className="h-11"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cq-email">Email</Label>
          <Input
            id="cq-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cq-suburb">Suburb</Label>
          <Input id="cq-suburb" name="suburb" autoComplete="address-level2" placeholder="e.g. Joondalup" className="h-11" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="cq-service">Service Needed</Label>
          <select id="cq-service" name="service" aria-label="Service needed" defaultValue="" className={selectClass}>
            <option value="" disabled>
              Select a service…
            </option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cq-urgency">Urgency</Label>
          <select id="cq-urgency" name="urgency" aria-label="Urgency" defaultValue="" className={selectClass}>
            <option value="" disabled>
              How urgent is it?
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
        <Label htmlFor="cq-contact-method">Preferred Contact Method</Label>
        <select
          id="cq-contact-method"
          name="preferredContactMethod"
          aria-label="Preferred contact method"
          defaultValue=""
          className={selectClass}
        >
          <option value="" disabled>
            How should we reach you?
          </option>
          {CONTACT_METHOD_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cq-notes">Message</Label>
        <Textarea
          id="cq-notes"
          name="notes"
          rows={4}
          placeholder="Tell us what's happening with your garage door…"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cq-attachment">Upload photo or video (optional)</Label>
        <label
          htmlFor="cq-attachment"
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-[#0f4e9b]/40 hover:bg-[#0f4e9b]/5"
        >
          <Upload className="h-4 w-4 shrink-0 text-[#0f4e9b]" aria-hidden="true" />
          <span>Attach a photo or short video for a faster, more accurate quote</span>
        </label>
        <input id="cq-attachment" name="attachment" type="file" accept="image/*,video/*" className="sr-only" />
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

      <button
        type="submit"
        disabled={isPending}
        className={cn(ctaPrimaryClass, "h-12 w-full text-base disabled:opacity-60")}
      >
        {isPending ? "Sending…" : "Request My Quote"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        No call-out fee to quote · We typically reply within the hour during business hours.
      </p>
    </form>
  );
}
