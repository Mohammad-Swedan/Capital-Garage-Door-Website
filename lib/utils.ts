import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a 24h "HH:MM" opening time as a friendly "8 AM" / "9:30 PM".
 * Empty string → "Closed". Shared by the footer and on-page hours blocks so
 * business hours render identically site-wide.
 */
export function formatHour(time: string) {
  if (!time) return "Closed"
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour} ${period}` : `${hour}:${String(m).padStart(2, "0")} ${period}`
}

/**
 * A service name without its trailing "Perth" / "in Perth" (case-insensitive), for headings that
 * add their own "in Perth": "Garage Door Repairs Perth" → "Garage Door Repairs", so
 * `Book {serviceShortName(name)} in Perth` never reads "…Perth in Perth". A name with no trailing
 * Perth (including one that merely contains it, like "Perth Windsor Doors") is returned trimmed.
 */
export function serviceShortName(name: string): string {
  return name.trim().replace(/\s+(?:in\s+)?perth$/i, "").trim()
}

/**
 * One-line business-hours summary derived from `siteConfig.business.hours`,
 * e.g. "Mon–Fri 7 AM–6 PM · Sat–Sun 8 AM–4 PM". Use this wherever hours are
 * written as prose (Contact page, FAQ copy) so they can never drift from the
 * footer/JSON-LD again — an audit found three conflicting hour sets on-site.
 */
type HoursEntry = { day: string; opens: string; closes: string }

const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

/** True when every day of the week runs 00:00–23:59 (the schema.org "open 24 hours" form). */
export function isOpen24x7(hours: readonly HoursEntry[]) {
  return WEEK.every((day) => {
    const h = hours.find((e) => e.day === day)
    return !!h && h.opens === "00:00" && h.closes === "23:59"
  })
}

/**
 * Display rows for an hours block (footer, service contact panel): one "Mon–Sun · Open 24 hours"
 * row when the business is open around the clock, else "Mon–Fri" + "Sat–Sun" rows (which assume
 * Sat and Sun share hours — schema.ts reads every day independently).
 */
export function hoursDisplayRows(hours: readonly HoursEntry[]): { label: string; value: string }[] {
  if (isOpen24x7(hours)) return [{ label: "Mon–Sun", value: "Open 24 hours" }]
  const span = (day: string) => {
    const h = hours.find((e) => e.day === day)
    return h && h.opens && h.closes ? `${formatHour(h.opens)} – ${formatHour(h.closes)}` : "Closed"
  }
  return [
    { label: "Mon–Fri", value: span("Monday") },
    { label: "Sat–Sun", value: span("Saturday") },
  ]
}

export function formatHoursSummary(
  hours: readonly HoursEntry[],
) {
  if (isOpen24x7(hours)) return "Open 24 hours, 7 days"
  const byDay = (day: string) => hours.find((h) => h.day === day)
  const span = (entry?: { opens: string; closes: string }) =>
    entry && entry.opens && entry.closes
      ? `${formatHour(entry.opens)}–${formatHour(entry.closes)}`
      : "Closed"
  const weekday = span(byDay("Monday"))
  const sat = span(byDay("Saturday"))
  const sun = span(byDay("Sunday"))
  const weekend = sat === sun ? `Sat–Sun ${sat}` : `Sat ${sat} · Sun ${sun}`
  return `Mon–Fri ${weekday} · ${weekend}`
}
