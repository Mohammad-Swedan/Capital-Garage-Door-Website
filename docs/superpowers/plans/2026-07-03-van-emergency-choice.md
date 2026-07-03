# Hero Van Tap → Call-or-Book Choice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tapping the hero's animated van shows a Call-or-Book choice (Call Now / Emergency Booking) instead of auto-opening the general booking dialog, with Emergency Booking pointed at a specific booking flow (`/booking/9`). Also correct the site's business hours, which were found to be wrong while gathering data for this feature.

**Architecture:** `BookingDialog` gains an optional `path` prop so the same shared iframe/sheet can point at a specific booking URL. The hero's existing shake→approach→onway van animation is untouched; only what happens once it reaches "onway" changes — instead of auto-opening the dialog, the same card slot shows two buttons. `config/site.ts` business hours are corrected, and the two places that render Saturday/Sunday as separate (and, for Sunday, broken) rows are collapsed into one accurate "Sat–Sun" row.

**Tech Stack:** Next.js 16 / React 19, TypeScript, Tailwind v4, lucide-react icons. Import alias `@/*` → repo root.

## Global Constraints

- **No test runner exists.** The correctness gate is `npm run build` (fails on type/route errors). Per-task verification is `npm run build` + a precise manual browser check.
- **This branch (`perf/island-refactor`) already has unrelated uncommitted work** (smart-calculator refactor, chat quote-prefill, etc. — not part of this feature). Never use `git add -A` or `git add .`. Stage only the exact files each task lists.
- Full spec: `docs/superpowers/specs/2026-07-03-van-emergency-choice-design.md`.
- Do not change the van's shake/approach animation timings or CSS keyframes — only what happens once `vanPhase` reaches `"onway"`.
- Do not change the separate "Book Emergency Repair" outline button's behavior beyond routing it through the new shared `openBooking()` helper (same net effect: opens the root booking form).
- "Not recommended outside business hours" is static copy — no live time-of-day check (explicit non-goal in the spec).

---

### Task 1: Fix business hours (config + footer + service-contact-panel)

**Files:**
- Modify: `config/site.ts:29-37`
- Modify: `components/layout/footer.tsx:16-18,105-131`
- Modify: `components/sections/service/service-contact-panel.tsx:15-17,49-69`

**Interfaces:**
- No new exports. `business.hours` keeps its existing shape (`{ day, opens, closes }[]`) — only values change, plus the two display components now look up a `weekend` entry (Saturday) instead of separate `saturday`/`sunday` entries.

- [ ] **Step 1: Correct the hours data**

In `config/site.ts`, the existing block is:

```ts
    hours: [
      { day: "Monday", opens: "08:00", closes: "18:00" },
      { day: "Tuesday", opens: "08:00", closes: "18:00" },
      { day: "Wednesday", opens: "08:00", closes: "18:00" },
      { day: "Thursday", opens: "08:00", closes: "18:00" },
      { day: "Friday", opens: "08:00", closes: "18:00" },
      { day: "Saturday", opens: "09:00", closes: "15:00" },
      { day: "Sunday", opens: "", closes: "" },
    ],
```

Change it to:

```ts
    hours: [
      { day: "Monday", opens: "07:00", closes: "18:00" },
      { day: "Tuesday", opens: "07:00", closes: "18:00" },
      { day: "Wednesday", opens: "07:00", closes: "18:00" },
      { day: "Thursday", opens: "07:00", closes: "18:00" },
      { day: "Friday", opens: "07:00", closes: "18:00" },
      { day: "Saturday", opens: "08:00", closes: "16:00" },
      { day: "Sunday", opens: "08:00", closes: "16:00" },
    ],
```

- [ ] **Step 2: Collapse Saturday/Sunday into one "Sat–Sun" row in the footer**

In `components/layout/footer.tsx`, the existing lookups are:

```ts
  const weekday = business.hours.find((h) => h.day === "Monday");
  const saturday = business.hours.find((h) => h.day === "Saturday");
  const sunday = business.hours.find((h) => h.day === "Sunday");
```

Change to:

```ts
  const weekday = business.hours.find((h) => h.day === "Monday");
  const weekend = business.hours.find((h) => h.day === "Saturday");
```

The existing hours list is:

```tsx
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden="true" />
                <span className="flex w-full justify-between gap-4">
                  <span>Mon&ndash;Fri</span>
                  <span className="font-medium text-white">
                    {formatHour(weekday?.opens ?? "")} &ndash; {formatHour(weekday?.closes ?? "")}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden="true" />
                <span className="flex w-full justify-between gap-4">
                  <span>Saturday</span>
                  <span className="font-medium text-white">
                    {formatHour(saturday?.opens ?? "")} &ndash; {formatHour(saturday?.closes ?? "")}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden="true" />
                <span className="flex w-full justify-between gap-4">
                  <span>Sunday</span>
                  <span className="font-medium text-white">{formatHour(sunday?.opens ?? "")}</span>
                </span>
              </li>
            </ul>
```

Change to:

```tsx
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden="true" />
                <span className="flex w-full justify-between gap-4">
                  <span>Mon&ndash;Fri</span>
                  <span className="font-medium text-white">
                    {formatHour(weekday?.opens ?? "")} &ndash; {formatHour(weekday?.closes ?? "")}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden="true" />
                <span className="flex w-full justify-between gap-4">
                  <span>Sat&ndash;Sun</span>
                  <span className="font-medium text-white">
                    {formatHour(weekend?.opens ?? "")} &ndash; {formatHour(weekend?.closes ?? "")}
                  </span>
                </span>
              </li>
            </ul>
```

- [ ] **Step 3: Same collapse in the service-page contact panel**

In `components/sections/service/service-contact-panel.tsx`, the existing lookups are:

```ts
  const weekday = business.hours.find((h) => h.day === "Monday");
  const saturday = business.hours.find((h) => h.day === "Saturday");
  const sunday = business.hours.find((h) => h.day === "Sunday");
```

Change to:

```ts
  const weekday = business.hours.find((h) => h.day === "Monday");
  const weekend = business.hours.find((h) => h.day === "Saturday");
```

The existing hours block is:

```tsx
          <div className="flex-1 space-y-1 text-muted-foreground">
            <div className="flex justify-between gap-6">
              <span>Mon&ndash;Fri</span>
              <span className="font-medium text-foreground">
                {formatHour(weekday?.opens ?? "")} &ndash; {formatHour(weekday?.closes ?? "")}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Saturday</span>
              <span className="font-medium text-foreground">
                {formatHour(saturday?.opens ?? "")} &ndash; {formatHour(saturday?.closes ?? "")}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Sunday</span>
              <span className="font-medium text-foreground">{formatHour(sunday?.opens ?? "")}</span>
            </div>
          </div>
```

Change to:

```tsx
          <div className="flex-1 space-y-1 text-muted-foreground">
            <div className="flex justify-between gap-6">
              <span>Mon&ndash;Fri</span>
              <span className="font-medium text-foreground">
                {formatHour(weekday?.opens ?? "")} &ndash; {formatHour(weekday?.closes ?? "")}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span>Sat&ndash;Sun</span>
              <span className="font-medium text-foreground">
                {formatHour(weekend?.opens ?? "")} &ndash; {formatHour(weekend?.closes ?? "")}
              </span>
            </div>
          </div>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build completes with no type errors.

- [ ] **Step 5: Manual verification**

Run `npm run dev`, then in a browser:

1. Load `/` and scroll to the footer — "Business Hours" shows exactly two rows: `Mon–Fri 7 AM – 6 PM` and `Sat–Sun 8 AM – 4 PM`.
2. Load any service page (e.g. `/garage-door-repairs-perth`) — the on-page contact panel shows the same two corrected rows, no "Closed".
3. View page source on `/` and find the `LocalBusiness` JSON-LD `<script type="application/ld+json">` block — confirm `openingHoursSpecification` lists `07:00`–`18:00` for Mon–Fri and `08:00`–`16:00` for Saturday and Sunday.

- [ ] **Step 6: Commit**

```bash
git add config/site.ts components/layout/footer.tsx components/sections/service/service-contact-panel.tsx
git commit -m "Fix business hours (Mon-Fri 7am-6pm, Sat-Sun 8am-4pm)

Corrects config/site.ts, which was Mon-Fri 8am-6pm / Sat 9am-3pm / Sun
closed. Sunday previously rendered as a single 'Closed'-style value in
the footer and service-contact-panel; both now render a Sat-Sun range
since the two days share hours.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: `BookingDialog` gets an optional `path` prop

**Files:**
- Modify: `components/sections/booking-dialog.tsx`

**Interfaces:**
- Produces: `BookingDialogProps.path?: string` — appended to the booking origin (e.g. `"/booking/9"`); omitted/undefined keeps today's root-URL behavior. Consumed by Task 3.

- [ ] **Step 1: Rename the URL constant and extend the props type**

The existing top of the file is:

```tsx
const BOOKING_URL = "https://booking-system-cgd.netlify.app/";

interface BookingDialogProps {
  /** Optional element that opens the sheet (rendered as the dialog trigger). */
  trigger?: React.ReactElement;
  /** Controlled open state — use with `onOpenChange` to drive the sheet externally. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
```

Change to:

```tsx
const BOOKING_ORIGIN = "https://booking-system-cgd.netlify.app";

interface BookingDialogProps {
  /** Optional element that opens the sheet (rendered as the dialog trigger). */
  trigger?: React.ReactElement;
  /** Controlled open state — use with `onOpenChange` to drive the sheet externally. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Path appended to the booking origin, e.g. "/booking/9". Defaults to the root booking form. */
  path?: string;
}
```

- [ ] **Step 2: Thread `path` through to `BookingFrame`**

The existing function signature and frame usage are:

```tsx
export function BookingDialog({ trigger, open, onOpenChange }: BookingDialogProps) {
```

and, further down:

```tsx
          <BookingFrame key={sessionKey} />
```

Change the signature to:

```tsx
export function BookingDialog({ trigger, open, onOpenChange, path }: BookingDialogProps) {
```

and the frame usage to:

```tsx
          <BookingFrame key={sessionKey} path={path} />
```

- [ ] **Step 3: Build the `src` from origin + path in `BookingFrame`**

The existing function is:

```tsx
function BookingFrame() {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div className="relative flex-1 bg-background">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <iframe
        src={BOOKING_URL}
        title="Book your garage door service"
        className={cn(
          "h-full w-full border-0 transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
```

Change to:

```tsx
function BookingFrame({ path }: { path?: string }) {
  const [loaded, setLoaded] = React.useState(false);
  const src = `${BOOKING_ORIGIN}${path ?? "/"}`;

  return (
    <div className="relative flex-1 bg-background">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <iframe
        src={src}
        title="Book your garage door service"
        className={cn(
          "h-full w-full border-0 transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build completes, no type errors. (`path` is optional and unused by every current caller, so no other file needs to change yet.)

- [ ] **Step 5: Manual verification**

Run `npm run dev`. Open any existing booking trigger (e.g. the "Book a Technician" button in the Service Area section, or the hero's "Book Emergency Repair" button) and confirm the dialog still loads `https://booking-system-cgd.netlify.app/` (root) exactly as before — no visible change yet, since no caller passes `path`.

- [ ] **Step 6: Commit**

```bash
git add components/sections/booking-dialog.tsx
git commit -m "Add optional path prop to BookingDialog

Lets a caller point the shared booking iframe at a specific path (e.g.
/booking/9) instead of always the root form. No behavior change for
existing callers, which all omit the new prop.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Hero van tap shows the Call-or-Book choice

**Files:**
- Modify: `components/sections/hero.tsx`
- Modify: `app/globals.css:842-866`

**Interfaces:**
- Consumes: `BookingDialogProps.path` from Task 2.

- [ ] **Step 1: Add the two new icon imports**

The existing import block is:

```tsx
import {
  Phone,
  Star,
  Siren,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
```

Change to:

```tsx
import {
  Phone,
  Star,
  Siren,
  ShieldCheck,
  CheckCircle2,
  CalendarClock,
  X,
} from "lucide-react";
```

- [ ] **Step 2: Add `bookingPath` state and an `openBooking` helper**

The existing state declarations are:

```tsx
export function Hero() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [vanPhase, setVanPhase] = useState<VanPhase>("idle");
```

Change to:

```tsx
export function Hero() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPath, setBookingPath] = useState<string | undefined>(undefined);
  const [vanPhase, setVanPhase] = useState<VanPhase>("idle");
```

Just below the existing `resetTilt` function:

```tsx
  const resetTilt = () => {
    const el = tiltRef.current;
    if (el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
  };
```

add the new helper right after it:

```tsx
  const openBooking = (path?: string) => {
    setBookingPath(path);
    setBookingOpen(true);
  };
```

- [ ] **Step 3: Stop `handleVanClick` from auto-opening the booking dialog**

The existing function is:

```tsx
  const handleVanClick = () => {
    if (vanLockedRef.current || vanPhase === "onway") return;
    vanLockedRef.current = true;
    resetTilt();

    const queue = (fn: () => void, delay: number) => {
      timeoutsRef.current.push(window.setTimeout(fn, delay));
    };

    if (reducedMotionRef.current) {
      setVanPhase("onway");
      queue(() => {
        vanLockedRef.current = false;
        setBookingOpen(true);
      }, 900);
      return;
    }

    setVanPhase("shake");
    queue(() => {
      setVanPhase("approach");
      queue(() => {
        setVanPhase("onway");
        queue(() => {
          vanLockedRef.current = false;
          setBookingOpen(true);
        }, 800);
      }, 600);
    }, 400);
  };
```

Change to:

```tsx
  const handleVanClick = () => {
    if (vanLockedRef.current || vanPhase === "onway") return;
    vanLockedRef.current = true;
    resetTilt();

    const queue = (fn: () => void, delay: number) => {
      timeoutsRef.current.push(window.setTimeout(fn, delay));
    };

    if (reducedMotionRef.current) {
      setVanPhase("onway");
      vanLockedRef.current = false;
      return;
    }

    setVanPhase("shake");
    queue(() => {
      setVanPhase("approach");
      queue(() => {
        setVanPhase("onway");
        vanLockedRef.current = false;
      }, 600);
    }, 400);
  };
```

- [ ] **Step 4: Add the choice-card handlers**

Directly below `handleVanClick`, before `handleBookingOpenChange`, add:

```tsx
  const handleChoiceDismiss = () => {
    setVanPhase("idle");
  };

  const handleCallTap = () => {
    timeoutsRef.current.push(
      window.setTimeout(() => {
        setVanPhase("idle");
      }, 2500),
    );
  };

  const handleEmergencyBooking = () => {
    openBooking("/booking/9");
  };
```

- [ ] **Step 5: Route the outline "Book Emergency Repair" button through `openBooking`**

The existing button is:

```tsx
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setBookingOpen(true)}
                  className="h-[clamp(2.75rem,6.5svh,3rem)] w-full cursor-pointer rounded-xl border-primary/35 bg-primary/5 px-8 text-base text-primary hover:bg-primary/10 hover:text-primary sm:h-14 sm:w-auto"
                >
```

Change the `onClick` to:

```tsx
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => openBooking()}
                  className="h-[clamp(2.75rem,6.5svh,3rem)] w-full cursor-pointer rounded-xl border-primary/35 bg-primary/5 px-8 text-base text-primary hover:bg-primary/10 hover:text-primary sm:h-14 sm:w-auto"
                >
```

- [ ] **Step 6: Update the van button's `aria-label`**

The existing attribute is:

```tsx
                aria-label="Tap for emergency service — opens the booking form"
```

Change to:

```tsx
                aria-label="Tap for emergency service options"
```

- [ ] **Step 7: Replace the "Technician Dispatched" card with the Call-or-Book choice**

The existing block is:

```tsx
              {/* Technician Dispatched Success UI (CSS spring-in on `onway`) */}
              <div className="cgd-van-success absolute top-1/2 left-1/2 z-30 flex w-[90%] flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-5 shadow-[0_30px_60px_rgba(13,31,69,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl sm:w-80 dark:border-white/10 dark:bg-[#0d1f45]/50 dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Technician Dispatched!
                  </h3>
                  <p className="mt-1 text-xs font-medium text-muted-foreground/80">
                    ETA: &lt; 30 minutes
                  </p>
                </div>
                {/* Animated progress bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/5 dark:bg-white/10">
                  <div className="cgd-van-progress h-full w-full rounded-full bg-emerald-500" />
                </div>
              </div>
```

Change to:

```tsx
              {/* Call-or-Book choice card (CSS spring-in on `onway`, same slot the
                  old auto-dispatch card used) */}
              <div className="cgd-van-success absolute top-1/2 left-1/2 z-30 flex w-[90%] flex-col gap-3 overflow-hidden rounded-2xl border border-white/40 bg-white/60 p-5 shadow-[0_30px_60px_rgba(13,31,69,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl sm:w-80 dark:border-white/10 dark:bg-[#0d1f45]/50 dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Need Us Now?
                  </h3>
                  <button
                    type="button"
                    aria-label="Cancel"
                    onClick={handleChoiceDismiss}
                    className="cursor-pointer rounded-full p-1 text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <a
                  href={`tel:${siteConfig.business.phone}`}
                  onClick={handleCallTap}
                  className="flex cursor-pointer flex-col items-center gap-0.5 rounded-xl bg-cta px-4 py-2.5 text-center text-cta-foreground shadow-[0_6px_16px_rgba(200,34,42,0.25)] transition-transform hover:scale-[1.02] hover:bg-cta/90"
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call Now
                  </span>
                  <span className="text-[11px] font-medium text-cta-foreground/80">
                    Recommended &mdash; fastest response
                  </span>
                </a>

                <button
                  type="button"
                  onClick={handleEmergencyBooking}
                  className="flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 text-center text-primary transition-colors hover:bg-primary/10"
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                    Emergency Booking
                  </span>
                  <span className="text-[11px] font-medium text-primary/70">
                    Not recommended outside business hours
                  </span>
                </button>
              </div>
```

- [ ] **Step 8: Pass `bookingPath` into the shared `BookingDialog`**

The existing usage at the bottom of the component is:

```tsx
      <BookingDialog
        open={bookingOpen}
        onOpenChange={handleBookingOpenChange}
      />
```

Change to:

```tsx
      <BookingDialog
        open={bookingOpen}
        onOpenChange={handleBookingOpenChange}
        path={bookingPath}
      />
```

- [ ] **Step 9: Remove the now-unused dispatch-progress-bar CSS**

In `app/globals.css`, the existing block is:

```css
/* "Technician Dispatched" card: springy entrance when the van is on the way */
.cgd-van-success {
  opacity: 0;
  transform: translate(-50%, -50%) translateY(20px) scale(0.95);
  pointer-events: none;
  transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
[data-phase="onway"] .cgd-van-success {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: auto;
}

/* Dispatch progress bar fills once the card is shown */
.cgd-van-progress {
  transform: translateX(-100%);
}
[data-phase="onway"] .cgd-van-progress {
  animation: cgd-van-progress 2s ease-out forwards;
}
@keyframes cgd-van-progress {
  to {
    transform: translateX(0);
  }
}
```

Change to:

```css
/* Call-or-Book choice card: springy entrance when the van is on the way */
.cgd-van-success {
  opacity: 0;
  transform: translate(-50%, -50%) translateY(20px) scale(0.95);
  pointer-events: none;
  transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
[data-phase="onway"] .cgd-van-success {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: auto;
}
```

(The `.cgd-van-success` selector is still referenced by the `prefers-reduced-motion` block further down — leave that reference as-is; it still applies to the choice card.)

- [ ] **Step 10: Verify build**

Run: `npm run build`
Expected: build completes, no type errors.

- [ ] **Step 11: Manual verification (dev server)**

Run `npm run dev`, load `/` in a browser:

1. Tap the van: shake → drive-up plays exactly as before, then the card springs in showing **"Need Us Now?"** with **Call Now** and **Emergency Booking** — no automatic dialog pop-open.
2. Click **Call Now** — the browser's `tel:` handling fires (or, on desktop without a dialer, nothing visually happens, which is expected); the choice card fades back to the idle van after ~2.5s.
3. Click **Emergency Booking** — the booking sheet/dialog opens; open DevTools → Network (or the Elements panel) and confirm the iframe's `src` is `https://booking-system-cgd.netlify.app/booking/9`. Close the dialog — the van returns to idle after ~2.5s.
4. Click the **✕** — the card disappears and the van returns to idle immediately, no dialog.
5. Click the separate **"Book Emergency Repair"** outline button below the headline — the booking dialog opens directly at the root URL (no choice card, no animation) — unchanged from before.
6. With OS "reduce motion" enabled, tap the van — it jumps straight to showing the choice card with no shake/drive frames.

- [ ] **Step 12: Commit**

```bash
git add components/sections/hero.tsx app/globals.css
git commit -m "Show Call-or-Book choice when the hero van is tapped

Replaces the auto-opened booking dialog with an explicit choice: Call
Now (tel: link, recommended/fastest) or Emergency Booking (opens the
booking dialog at /booking/9, labeled not recommended outside business
hours). The shake/drive-up animation is unchanged; only what happens
once the van arrives changes. The separate 'Book Emergency Repair'
button is unaffected (still opens the root booking form directly).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Spec §Design.1 (hours fix) → Task 1 Step 1. ✓
- Spec §Design.2 (footer/service-panel Sunday + Sat/Sun collapse) → Task 1 Steps 2–3. ✓
- Spec §Design.3 (`BookingDialog` `path` prop) → Task 2. ✓
- Spec §Design.4 (hero: unchanged animation, state, content swap, aria-label, CSS cleanup) → Task 3, Steps 1–9. ✓
- Spec §Edge cases — ignores both choices (Task 3 Step 7: no auto-dismiss timer, matches spec), reduced motion (Task 3 Step 3 + manual check #6), rapid re-tap (unchanged guard, untouched by this plan), reused dialog for two destinations (Task 3 Step 2 `openBooking` always sets `bookingPath` immediately before opening). ✓
- Spec §Verification → covered by each task's manual-verification step; JSON-LD check in Task 1 Step 5.3. ✓
- Spec §Non-goals — no live time-of-day check (static copy only, Task 3 Step 7); "Book Emergency Repair" / `ServiceAreaBookButton` behavior unchanged (Task 3 Step 5 only reroutes through `openBooking()`, same net effect). ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases" placeholders; every step shows complete code. ✓

**Type consistency:** `openBooking(path?: string)`, `BookingDialogProps.path?: string`, and `BookingFrame({ path }: { path?: string })` use the same name and optional-`string` type end-to-end (Task 2 Steps 1–3, Task 3 Steps 2 and 8). ✓
