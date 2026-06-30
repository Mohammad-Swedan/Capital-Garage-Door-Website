import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitQuote, type QuoteFormState } from "@/lib/actions/quote";
import { cn } from "@/lib/utils";

/**
 * Compact quote/lead form shown as a panel inside the chat. Posts to the shared `submitQuote` server
 * action (name + phone required). On success it reports the lead up so the widget can confirm in-thread
 * and persist it (see conversation logging).
 */

const initialState: QuoteFormState = { status: "idle" };

export interface QuoteLead {
  name: string;
  phone: string;
}

export function InChatQuote({
  defaultSuburb,
  onClose,
  onSubmitted,
}: {
  defaultSuburb?: string;
  onClose: () => void;
  onSubmitted?: (lead: QuoteLead) => void;
}) {
  const [state, formAction, isPending] = useActionState(submitQuote, initialState);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const isSuccess = state.status === "success";

  useEffect(() => {
    if (isSuccess) onSubmitted?.({ name: name.trim(), phone: phone.trim() });
    // Fire once on success; name/phone are captured at submit time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

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
        <span className="ml-auto text-sm font-semibold text-foreground">Request a quote</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden="true" />
            <p className="text-sm font-semibold text-foreground">{state.message ?? "Thanks! We'll be in touch shortly."}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
            >
              Back to chat
            </button>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-3.5">
            <input type="hidden" name="service" value="General garage door enquiry" />
            <input type="hidden" name="source" value="chat" />
            <input type="hidden" name="pageType" value="ChatAssistant" />

            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Leave your details and we&apos;ll get back to you with a tailored quote — usually within the hour
              during business hours.
            </p>

            <div className="grid gap-1.5">
              <Label htmlFor="cq-name">Name</Label>
              <Input
                id="cq-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cq-phone">Phone</Label>
              <Input
                id="cq-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="04xx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cq-suburb">Suburb</Label>
              <Input id="cq-suburb" name="suburb" defaultValue={defaultSuburb} autoComplete="address-level2" placeholder="Your suburb" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cq-notes">What do you need?</Label>
              <Textarea id="cq-notes" name="notes" rows={3} placeholder="Tell us briefly what's happening…" />
            </div>

            {state.status === "error" && (
              <p role="status" className="text-sm font-medium text-destructive">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "inline-flex w-full items-center justify-center rounded-full bg-gradient-to-br from-[#e0443a] via-cta to-[#a81c23] px-5 py-2.5 text-sm font-semibold text-cta-foreground shadow-[0_4px_14px_rgba(200,34,42,0.35)] transition-all disabled:opacity-60"
              )}
            >
              {isPending ? "Sending…" : "Request my quote"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
