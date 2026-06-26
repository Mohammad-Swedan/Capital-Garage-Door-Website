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

interface CostGuideQuoteFormProps {
  /** Prefilled repair type, e.g. "Garage Door Repair". */
  topicLabel: string;
  heading?: string;
}

const initialState: QuoteFormState = { status: "idle" };

const REPAIR_TYPE_OPTIONS = [
  "Minor adjustment",
  "Remote or sensor issue",
  "Motor repair or replacement",
  "Spring or cable repair",
  "Track or roller repair",
  "Emergency repair",
  "Not sure — need an inspection",
];

/** Lead-capture form for cost-guide pages — repair type, suburb, photo/video upload, and attribution tracking fields. */
export function CostGuideQuoteForm({ topicLabel, heading = "Get a Clear Quote" }: CostGuideQuoteFormProps) {
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
    };
    for (const [name, value] of Object.entries(values)) {
      const input = form.elements.namedItem(name);
      if (input instanceof HTMLInputElement) input.value = value;
    }
  }, []);

  return (
    <div className="rounded-3xl border border-border/70 bg-surface-elevated p-6 elevate-elevated sm:p-8">
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
        <input type="hidden" name="pageType" value="CostGuidePage" />
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

        <div className="grid gap-2">
          <Label htmlFor="quote-service">Repair type</Label>
          <Select name="service" defaultValue={topicLabel}>
            <SelectTrigger id="quote-service" className="w-full">
              <SelectValue placeholder="Select a repair type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={topicLabel}>{topicLabel}</SelectItem>
              {REPAIR_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quote-notes">Message (optional)</Label>
          <Textarea
            id="quote-notes"
            name="notes"
            rows={4}
            placeholder="Tell us what's happening with your garage door"
          />
        </div>

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
            aria-label="Upload a photo or video of your garage door"
            title="Upload a photo or video of your garage door"
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
          />
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
          {isPending ? "Sending..." : "Request My Quote"}
        </Button>
      </form>
    </div>
  );
}
