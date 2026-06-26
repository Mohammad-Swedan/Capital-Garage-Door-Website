"use client";

import { useActionState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Paperclip, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitQuote, type QuoteFormState } from "@/lib/actions/quote";
import { siteConfig } from "@/config/site";

interface ServiceQuoteFormProps {
  serviceName: string;
  heading?: string;
}

const initialState: QuoteFormState = { status: "idle" };

const URGENCY_OPTIONS = [
  { value: "standard", label: "Standard — within a few days" },
  { value: "urgent", label: "Urgent — today if possible" },
  { value: "emergency", label: "Emergency — after-hours" },
];

const CONTACT_METHOD_OPTIONS = [
  { value: "phone", label: "Phone call" },
  { value: "sms", label: "Text / SMS" },
  { value: "email", label: "Email" },
];

/** Lead-capture form for service landing pages — service/suburb prefilled, with urgency, contact preference, and attribution tracking fields. */
export function ServiceQuoteForm({ serviceName, heading = "Request a Free Quote" }: ServiceQuoteFormProps) {
  const [state, formAction, isPending] = useActionState(submitQuote, initialState);
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);

  // Tracking fields are write-only (the server action reads them on submit)
  // and never affect what's rendered, so they're set directly on the hidden
  // inputs via the DOM rather than React state — no re-render, no
  // setState-in-effect, no hydration mismatch risk.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const values: Record<string, string> = {
      referrer: document.referrer,
      source: params.get("source") ?? "",
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      suburb: params.get("suburb") ?? "",
    };
    for (const [name, value] of Object.entries(values)) {
      const input = form.elements.namedItem(name);
      if (input instanceof HTMLInputElement) input.value = value;
    }
  }, []);

  return (
    <div id="quote" className="rounded-3xl border border-border/70 bg-surface-elevated p-6 elevate-elevated sm:p-8">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="cgd-h2 text-balance text-foreground">
          {heading}
        </h2>
        <a
          href={`tel:${siteConfig.business.phone}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:underline"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Prefer to call? {siteConfig.business.phoneDisplay}
        </a>
      </div>

      <form ref={formRef} action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="landingPage" value={pathname ?? ""} />
        <input type="hidden" name="pageType" value="service" />
        <input type="hidden" name="referrer" defaultValue="" />
        <input type="hidden" name="source" defaultValue="" />
        <input type="hidden" name="utmSource" defaultValue="" />
        <input type="hidden" name="utmMedium" defaultValue="" />
        <input type="hidden" name="utmCampaign" defaultValue="" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="quote-name">Name</Label>
            <Input id="quote-name" name="name" required autoComplete="name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-phone">Phone</Label>
            <Input id="quote-phone" name="phone" type="tel" required autoComplete="tel" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="quote-email">Email (optional)</Label>
            <Input id="quote-email" name="email" type="email" autoComplete="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-suburb">Suburb</Label>
            <Input id="quote-suburb" name="suburb" placeholder="e.g. Joondalup" autoComplete="address-level2" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="quote-service">Service needed</Label>
            <Select name="service" defaultValue={serviceName}>
              <SelectTrigger id="quote-service" className="w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={serviceName}>{serviceName}</SelectItem>
                <SelectItem value="Garage Door Installation">Garage Door Installation</SelectItem>
                <SelectItem value="Garage Door Motor Replacement">Garage Door Motor Replacement</SelectItem>
                <SelectItem value="Roller Door Repairs">Roller Door Repairs</SelectItem>
                <SelectItem value="Emergency Garage Door Repairs">Emergency Garage Door Repairs</SelectItem>
                <SelectItem value="Garage Door Servicing">Garage Door Servicing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-urgency">Urgency</Label>
            <Select name="urgency" defaultValue="standard">
              <SelectTrigger id="quote-urgency" className="w-full">
                <SelectValue placeholder="How urgent is it?" />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quote-notes">Message (optional)</Label>
          <Textarea id="quote-notes" name="notes" rows={4} placeholder="Tell us what's happening with your garage door" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="quote-attachment" className="flex items-center gap-1.5">
              <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
              Upload a photo or video (optional)
            </Label>
            <input
              id="quote-attachment"
              name="attachment"
              type="file"
              accept="image/*,video/*"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-contact-method">Preferred contact method</Label>
            <Select name="preferredContactMethod" defaultValue="phone">
              <SelectTrigger id="quote-contact-method" className="w-full">
                <SelectValue placeholder="How should we reach you?" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {state.status !== "idle" && (
          <p
            role="status"
            className={state.status === "success" ? "text-sm text-green-600" : "text-sm text-destructive"}
          >
            {state.message}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          variant="cta"
          disabled={isPending}
          className="h-12 w-full rounded-xl text-base"
        >
          {isPending ? "Sending..." : "Request a Quote"}
        </Button>
      </form>
    </div>
  );
}
