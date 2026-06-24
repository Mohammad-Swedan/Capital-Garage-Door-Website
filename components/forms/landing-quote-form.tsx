"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { submitQuote, type QuoteFormState } from "@/lib/actions/quote";
import { ctaPrimaryClass } from "@/components/page/cta-buttons";

const initialState: QuoteFormState = { status: "idle" };

interface LandingQuoteFormProps {
  /** pageType tracking value, e.g. "LandingPage:Emergency". */
  pageType: string;
  /** Service this landing page is about — prefilled + posted as the "service" field. */
  service: string;
  /** Problem dropdown options (usually the page's listed problems). */
  problemOptions: string[];
  /** Submit button label. */
  submitLabel?: string;
}

/**
 * Focused, conversion-first lead form for Google Ads landing pages. Short on
 * purpose — Name, Phone, Suburb, Problem and an optional photo. Posts to the
 * shared `submitQuote` server action and captures Google Ads attribution
 * (gclid, campaign, ad group, keyword, source/medium) plus the standard UTM
 * fields, read from the URL on mount.
 */
export function LandingQuoteForm({
  pageType,
  service,
  problemOptions,
  submitLabel = "Request My Callback",
}: LandingQuoteFormProps) {
  const [state, formAction, isPending] = useActionState(submitQuote, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Attribution is browser-only — write the hidden inputs directly on mount so
  // the values post with the form (a DOM write, not React state).
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const param = (...keys: string[]) => {
      for (const key of keys) {
        const value = params.get(key);
        if (value) return value;
      }
      return "";
    };
    const set = (name: string, value: string) => {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.value = value;
    };

    set("landingPage", window.location.pathname);
    set("referrer", document.referrer);
    set("utmSource", param("utm_source"));
    set("utmMedium", param("utm_medium"));
    set("utmCampaign", param("utm_campaign"));
    // Google Ads attribution — fall back to typical auto-tagging params.
    set("source", param("utm_source") || "google");
    set("medium", param("utm_medium") || "cpc");
    set("campaign", param("utm_campaign", "campaignid"));
    set("adGroup", param("utm_adgroup", "adgroupid"));
    set("keyword", param("utm_term", "keyword"));
    set("gclid", param("gclid"));
  }, []);

  const isSuccess = state.status === "success";

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {/* Fixed tracking values. */}
      <input type="hidden" name="pageType" value={pageType} />
      <input type="hidden" name="service" value={service} />
      {/* Attribution — populated on mount. */}
      <input type="hidden" name="landingPage" defaultValue="" />
      <input type="hidden" name="referrer" defaultValue="" />
      <input type="hidden" name="source" defaultValue="" />
      <input type="hidden" name="medium" defaultValue="" />
      <input type="hidden" name="campaign" defaultValue="" />
      <input type="hidden" name="adGroup" defaultValue="" />
      <input type="hidden" name="keyword" defaultValue="" />
      <input type="hidden" name="gclid" defaultValue="" />
      <input type="hidden" name="utmSource" defaultValue="" />
      <input type="hidden" name="utmMedium" defaultValue="" />
      <input type="hidden" name="utmCampaign" defaultValue="" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="lp-name">Name</Label>
          <Input id="lp-name" name="name" required autoComplete="name" placeholder="Your name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lp-phone">Phone</Label>
          <Input
            id="lp-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="04xx xxx xxx"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="lp-suburb">Suburb</Label>
          <Input
            id="lp-suburb"
            name="suburb"
            autoComplete="address-level2"
            placeholder="e.g. Joondalup"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lp-problem">Problem</Label>
          <select
            id="lp-problem"
            name="problem"
            aria-label="Problem"
            defaultValue=""
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="" disabled>
              Select the problem…
            </option>
            {problemOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="Other / not sure">Other / not sure</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="lp-attachment">Upload a photo (optional)</Label>
        <label
          htmlFor="lp-attachment"
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-cta/40 hover:bg-cta/5"
        >
          <Upload className="h-4 w-4 shrink-0 text-cta" aria-hidden="true" />
          <span>Attach a photo for a faster, more accurate quote</span>
        </label>
        <input
          id="lp-attachment"
          name="attachment"
          type="file"
          accept="image/*,video/*"
          className="sr-only"
        />
      </div>

      {state.status !== "idle" && (
        <p
          role="status"
          className={cn(
            "flex items-center gap-2 text-sm font-medium",
            isSuccess ? "text-emerald-600" : "text-destructive",
          )}
        >
          {isSuccess && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={cn(ctaPrimaryClass, "w-full py-3.5 text-base disabled:opacity-60")}
      >
        {isPending ? "Sending…" : submitLabel}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        No call-out fee to quote · We typically reply within the hour during business hours.
      </p>
    </form>
  );
}
