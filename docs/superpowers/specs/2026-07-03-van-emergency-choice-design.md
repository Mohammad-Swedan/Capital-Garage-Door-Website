# Hero van tap → Call-or-Book choice, design

**Date:** 2026-07-03
**Status:** Approved, pending implementation plan
**Area:** `components/sections/hero.tsx`, `components/sections/booking-dialog.tsx`, `config/site.ts`, `components/layout/footer.tsx`, `components/sections/service/service-contact-panel.tsx`

## Problem

Tapping the hero's animated van (`components/sections/hero.tsx`, `handleVanClick`) plays a
shake → drive-up animation, shows a "Technician Dispatched!" success card, then
automatically opens the general `BookingDialog` (the live booking iframe, root URL).

The business wants the van tap to instead offer a choice: **call now** (fastest,
recommended) or **submit an emergency booking** that goes straight to a specific booking
flow (`https://booking-system-cgd.netlify.app/booking/9`), with a note that booking is not
the recommended path outside business hours.

Separately, while gathering the real business hours for this feature, the hours currently
in `config/site.ts` were found to be wrong (Mon–Fri 8am–6pm / Sat 9am–3pm / Sun closed)
versus the real hours (Mon–Fri 7am–6pm / Sat–Sun 8am–4pm). That config feeds the footer,
the on-page service-contact panel, and the `LocalBusiness` JSON-LD schema, so it's fixed
as part of this change.

## Goals

- Tapping the van keeps its existing shake/drive-up animation, then shows two clear
  choices instead of auto-opening the booking dialog.
- **Call Now** — `tel:` link, labeled as the recommended/fastest option.
- **Emergency Booking** — opens the existing shared booking dialog/iframe, but pointed at
  `/booking/9` instead of the root, labeled as not recommended outside business hours
  (static copy — no live time-of-day logic).
- Correct business hours in the one shared config location, reflected consistently in the
  footer and the service-page contact panel.
- No change to any other entry point: the separate "Book Emergency Repair" outline button
  in the hero keeps opening the general booking dialog directly.

## Non-goals

- No live/dynamic "are we open right now" check — the "not recommended outside business
  hours" label is static copy on the Emergency Booking option, always shown.
- No change to the "Book Emergency Repair" outline button or `ServiceAreaBookButton`
  behavior.
- No change to the shake/approach animation timings or visuals — only what happens once
  the van has "arrived."

## Design

### 1. `config/site.ts` — fix business hours

Replace `business.hours` with the real hours:

```
Monday–Friday: 07:00–18:00
Saturday:      08:00–16:00
Sunday:        08:00–16:00
```

This is read by `lib/seo/schema.ts` (`localBusinessSchema` → `openingHoursSpecification`),
`components/layout/footer.tsx`, and `components/sections/service/service-contact-panel.tsx`.

### 2. Footer + service-contact-panel — render Sunday correctly

Both currently special-case Sunday as a single value (`formatHour(sunday?.opens ?? "")`),
which rendered "Closed" because Sunday had no hours before. Now that Sunday has real
hours, and Saturday/Sunday are identical, collapse the two rows into one **"Sat–Sun"**
row showing the open–close range (same pattern already used for the weekday row), instead
of two duplicate lines.

### 3. `BookingDialog` — optional `path` prop

`components/sections/booking-dialog.tsx` currently hardcodes the iframe `src` to
`https://booking-system-cgd.netlify.app/`. Change:

- `BOOKING_URL` → `BOOKING_ORIGIN = "https://booking-system-cgd.netlify.app"` (no trailing
  slash).
- Add `path?: string` to `BookingDialogProps`, threaded through to `BookingFrame`.
- `BookingFrame` builds `src` as `` `${BOOKING_ORIGIN}${path ?? "/"}` ``.
- Every existing caller (`ServiceAreaBookButton`, `smart-cta.tsx`, `cta-buttons.tsx`,
  `in-chat-booking.tsx`, `calculator-dialog.tsx`, and the hero's own default use) omits
  `path` and is unaffected — same root URL as today.

### 4. Hero — van tap shows a choice instead of auto-opening booking

`components/sections/hero.tsx`:

- **Animation unchanged**: `handleVanClick` still runs shake (400ms) → approach (600ms) →
  onway. What happens once `vanPhase` reaches `"onway"` changes:
  - Remove the queued `setBookingOpen(true)` call (and its 800ms delay) — nothing
    auto-opens anymore.
  - Set `vanLockedRef.current = false` immediately upon entering `"onway"` (previously this
    was gated behind the removed 800ms queue).
  - Same simplification for the `prefers-reduced-motion` branch: jump straight to
    `"onway"`, no auto-open.
- **State**: add `bookingPath: string | undefined`. Add a helper
  `openBooking(path?: string)` that sets `bookingPath` and `setBookingOpen(true)`. The
  existing "Book Emergency Repair" outline button switches to `onClick={() =>
  openBooking()}` (root, unchanged behavior). Pass `path={bookingPath}` to the shared
  `<BookingDialog>` at the bottom of the component.
- **Content swap**: the `.cgd-van-success` card (same glass-card container, same
  spring-in CSS animation gated on `[data-phase="onway"]`) no longer shows "Technician
  Dispatched! / ETA < 30 minutes" + progress bar. It shows instead:
  - A heading ("Need Us Now?") and a small dismiss control (✕) that calls
    `setVanPhase("idle")` immediately.
  - **Call Now** — `<a href="tel:{phone}">`, styled as the primary action, subtext
    "Recommended — fastest response." On click, queue a ~2.5s timeout back to `"idle"`
    (same pacing already used elsewhere for resetting the van after the booking dialog
    closes) so the card doesn't vanish instantly under the user's finger.
  - **Emergency Booking** — button calling `openBooking("/booking/9")`, subtext "Not
    recommended outside business hours." Reuses the existing
    `handleBookingOpenChange` → 2.5s-delayed reset-to-idle when the dialog closes.
  - The now-unused "dispatch progress bar" (`.cgd-van-progress` element + its CSS
    keyframe in `app/globals.css`) is removed since nothing is being auto-dispatched.
- **Accessibility**: the van button's `aria-label` changes from "Tap for emergency service
  — opens the booking form" to "Tap for emergency service options" to match the new
  behavior.

## Edge cases

- **User ignores both choices**: card has no auto-dismiss timer (unlike the old
  auto-open); it sits until the visitor taps Call, Emergency Booking, or the ✕. This is a
  deliberate behavior change from "always eventually opens booking" to "waits for an
  explicit choice."
- **Reduced motion**: van jumps straight to the "onway" phase/choice card, no
  shake/approach frames — same as today's reduced-motion path, just without the auto-open.
- **Rapid re-tap**: unchanged guard — `handleVanClick` still no-ops while
  `vanPhase === "onway"` or `vanLockedRef.current` is true mid-sequence.
- **Booking dialog reused for two different destinations**: `bookingPath` is plain
  component state, reset implicitly whenever `openBooking()` is called again with a
  different (or no) path before the next open — no stale-path risk since it's always set
  immediately before `setBookingOpen(true)`.

## Verification

No automated test suite; `npm run build` is the correctness gate (types/routes/image
qualities).

Manual verification:

1. `npm run build` passes.
2. On the home page, tap the van: shake/drive-up plays as before, then the choice card
   appears (Call Now / Emergency Booking), no automatic dialog pop-open.
3. Tap **Call Now** → device dialer intent fires (`tel:` link); van returns to idle after
   ~2.5s.
4. Tap **Emergency Booking** → the booking sheet/dialog opens showing the
   `/booking/9` flow (verify via the iframe's loaded URL / network tab); closing it
   returns the van to idle after ~2.5s, matching existing behavior.
5. Tap the ✕ → returns to idle immediately, no dialog.
6. The separate "Book Emergency Repair" outline button still opens the booking dialog at
   the root URL directly (no choice card).
7. Footer and the service-page contact panel show Mon–Fri 7 AM–6 PM and a single Sat–Sun
   8 AM–4 PM row (no "Closed" for Sunday).
8. View page source / rendered JSON-LD (`localBusinessSchema`) to confirm
   `openingHoursSpecification` reflects the corrected hours.

## Risks

- Low risk, isolated to one hero component + one shared dialog + static config data.
- Behavior change (no auto-open) is intentional per this spec, not a regression — flagged
  here in case it's surprising during review.
