"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Phone, FileText, Camera, CalendarCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// Booking dialog is heavy + client-only — load it on demand from the button.
const BookingDialog = dynamic(
  () => import("@/components/sections/booking-dialog").then((m) => m.BookingDialog),
  { ssr: false }
);

/* Shared CTA styles — mirror the homepage button language (rounded-full,
   red CTA, soft lift on hover, press feedback). Exported so other sections
   (e.g. the final CTA band) reuse the exact same look. */
export const ctaPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-[0_4px_20px_rgba(200,34,42,0.3)] transition-all hover:bg-cta/90 hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(200,34,42,0.45)] active:scale-95 active:translate-y-0";

export const ctaSecondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-primary/10 hover:-translate-y-0.5 active:scale-95 active:translate-y-0";

export const ctaGhostClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 active:scale-95 active:translate-y-0";

interface CtaProps {
  className?: string;
  /** Visual variant — defaults differ per button (see each component). */
  variant?: "primary" | "secondary" | "ghost";
}

function variantClass(variant: CtaProps["variant"]) {
  if (variant === "secondary") return ctaSecondaryClass;
  if (variant === "ghost") return ctaGhostClass;
  return ctaPrimaryClass;
}

/** Call Now — dials the business number from siteConfig. */
export function CallNowButton({ className, variant = "primary" }: CtaProps) {
  return (
    <a href={`tel:${siteConfig.business.phone}`} className={cn(variantClass(variant), className)}>
      <Phone className="h-4 w-4" aria-hidden="true" />
      Call Now
    </a>
  );
}

/** Request Quote — scrolls to the on-page quote form (#quote). */
export function RequestQuoteButton({ className, variant = "secondary" }: CtaProps) {
  return (
    <a href="#quote" className={cn(variantClass(variant), className)}>
      <FileText className="h-4 w-4" aria-hidden="true" />
      Request Quote
    </a>
  );
}

/** Upload Photo for Quote — scrolls to the quote form (which has a file input). */
export function UploadPhotoButton({ className, variant = "secondary" }: CtaProps) {
  return (
    <a href="#quote" className={cn(variantClass(variant), className)}>
      <Camera className="h-4 w-4" aria-hidden="true" />
      Upload Photo for Quote
    </a>
  );
}

/** Book Now — opens the shared booking dialog. */
export function BookNowButton({ className, variant = "secondary" }: CtaProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn(variantClass(variant), className)}>
        <CalendarCheck className="h-4 w-4" aria-hidden="true" />
        Book Now
      </button>
      <BookingDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
