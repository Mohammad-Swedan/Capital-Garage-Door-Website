import type { Testimonial } from "@/types";

/**
 * Real customer reviews sourced from the business's Google profile, shown on the
 * homepage "What Our Customers Say" marquee. Names are shortened to first name +
 * last initial for privacy. The cards render the quote, an initials avatar, and
 * the service label (no photos, no dates) — see
 * components/ui/testimonials-columns-1.tsx.
 *
 * Keep this list small (≈6–9). Each of the 3 columns renders the FULL list,
 * duplicated for a seamless loop, so the rendered card count is
 * length × 3 × 2 — a long list makes the marquee janky. The full review set
 * lives in content/reviews.ts (the /reviews page); this is a curated subset.
 */
export const testimonials: Testimonial[] = [
  {
    id: "janelle-s",
    name: "Janelle S.",
    rating: 5,
    quote:
      "Musab was extremely efficient, professional, organised and a nice bloke. Would highly recommend his service and installation of roller doors to anyone.",
    date: "2026-04-18",
    service: "Roller Door Installation",
  },
  {
    id: "andrea-r",
    name: "Andrea R.",
    rating: 5,
    quote:
      "I cannot speak highly enough about this company. My garage door stopped working and my car was trapped inside. Adam was there in an hour and fixed it in 30 minutes. Friendly, professional service.",
    date: "2024-06-15",
    service: "Emergency Repair",
  },
  {
    id: "jacques-d",
    name: "Jacques D.",
    rating: 5,
    quote:
      "Called on a Monday and he came in early and gave me options. I chose to fully replace my system and rollers, and he removed the old system and rails too. Quick and easy — not even 45 minutes, with no issues.",
    date: "2024-07-11",
    service: "Motor Replacement",
  },
  {
    id: "khaled-k",
    name: "Khaled K.",
    rating: 5,
    quote:
      "Capital Garage Doors provided exceptional service from start to finish. Professional, prompt and knowledgeable. The quality of work exceeded my expectations and the pricing was fair.",
    date: "2025-07-09",
    service: "Repairs",
  },
  {
    id: "stephen-o",
    name: "Stephen O.",
    rating: 5,
    quote:
      "Outstanding work — replaced a broken spring and fixed a panel that was dented by a car. Prompt and efficient. Will definitely use again.",
    date: "2025-05-20",
    service: "Spring Repair",
  },
  {
    id: "trina-s",
    name: "Trina S.",
    rating: 5,
    quote:
      "So impressed with the support after two garage doors went, with a home open looming. They inspected, ordered parts and completed repairs within 24 hours. Highly recommended.",
    date: "2025-06-10",
    service: "Emergency Repair",
  },
  {
    id: "marty-p",
    name: "Marty P.",
    rating: 5,
    quote:
      "Sam and crew responded very quickly on the same day to fix my broken garage door panel. The door works even better now. Will be booking them for the regular service from now on.",
    date: "2024-06-22",
    service: "Panel Repair",
  },
  {
    id: "agness-t",
    name: "Agness T.",
    rating: 5,
    quote:
      "Super fast and helpful — fixed my garage issue in under a minute. Highly recommend. Thank you!",
    date: "2025-10-22",
    service: "Repairs",
  },
  {
    id: "charlotte-d",
    name: "Charlotte D.",
    rating: 5,
    quote:
      "Very appreciative of Moussab's excellent, prompt and efficient service. He fixed my roller door at short notice with no fuss at all. Thank you so much.",
    date: "2025-06-02",
    service: "Roller Door Repair",
  },
];
