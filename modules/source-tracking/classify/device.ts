/**
 * Coarse device bucket from a User-Agent: mobile | tablet | desktop.
 * Bots are a separate flag (./bot.ts), not a device type — the wire protocol
 * keeps the two apart so a crawler's device class is still visible.
 */
import type { DeviceType } from "../types";

const TABLET_RE = /ipad|tablet|playbook|silk|kindle|(android(?!.*mobile))/i;
const MOBILE_RE = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i;

export function detectDevice(userAgent: string | null | undefined): DeviceType {
  if (!userAgent) return "desktop";
  if (TABLET_RE.test(userAgent)) return "tablet";
  if (MOBILE_RE.test(userAgent)) return "mobile";
  return "desktop";
}
