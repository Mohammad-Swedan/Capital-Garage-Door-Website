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
