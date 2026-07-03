"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookingDialog = dynamic(
  () => import("@/components/sections/booking-dialog").then((mod) => mod.BookingDialog),
  { ssr: false },
);

/**
 * Client island for <ServiceAreaMap>. The section is otherwise a static server
 * component (map, suburb pins, stats), so only this button + its booking dialog
 * hydrate — the rest never runs on the client (mobile TBT).
 */
export function ServiceAreaBookButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="h-11 w-full cursor-pointer gap-2 rounded-xl bg-cta px-6 text-sm font-semibold text-cta-foreground shadow-[0_8px_32px_rgba(200,34,42,0.3)] transition-all hover:scale-[1.03] hover:bg-cta/90 sm:h-12 sm:w-auto sm:px-8 sm:text-base"
      >
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        Book a Technician
      </Button>
      <BookingDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
