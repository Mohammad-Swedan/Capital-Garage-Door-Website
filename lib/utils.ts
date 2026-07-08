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
 * One-line business-hours summary derived from `siteConfig.business.hours`,
 * e.g. "Mon–Fri 7 AM–6 PM · Sat–Sun 8 AM–4 PM". Use this wherever hours are
 * written as prose (Contact page, FAQ copy) so they can never drift from the
 * footer/JSON-LD again — an audit found three conflicting hour sets on-site.
 */
export function formatHoursSummary(
  hours: readonly { day: string; opens: string; closes: string }[],
) {
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
