/**
 * Small pure helpers shared by the client and server halves of the module.
 * No DOM, no Node APIs.
 */
import type { EventProps, PropValue } from "./types";

export const MAX_LABEL = 120;
export const MAX_PLACEMENT = 60;
export const MAX_PATH = 300;
export const MAX_PROPS_JSON = 2000;
export const MAX_PROP_KEYS = 30;
export const MAX_PROP_KEY = 40;
export const MAX_PROP_STRING = 300;
export const MAX_PROP_LIST = 20;
export const MAX_LANDING_PATH = 500;
export const MAX_LANDING_QUERY = 1000;
export const MAX_REFERRER = 500;

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/** True for C0 controls and DEL. A code-point test, not a regex with literal control bytes. */
function isControl(codePoint: number): boolean {
  return codePoint <= 0x1f || codePoint === 0x7f;
}

/** Strip control characters, trim, cap. Empty → null. */
export function cleanString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  let out = "";
  for (const char of value) {
    if (!isControl(char.codePointAt(0) ?? 0)) out += char;
  }
  out = out.trim();
  if (!out) return null;
  return out.length > max ? out.slice(0, max) : out;
}

/** Like cleanString, but first collapses runs of whitespace (for visible text). */
export function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  return cleanString(value.replace(/\s+/g, " "), max);
}

/** RFC 4122 v4 id. Falls back to getRandomValues where randomUUID is missing (insecure contexts). */
export function newUuid(): string {
  const c: Crypto | undefined = typeof crypto !== "undefined" ? crypto : undefined;
  if (c && typeof c.randomUUID === "function") {
    try {
      return c.randomUUID();
    } catch {
      // Not a secure context — fall through to the manual v4 below.
    }
  }
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === "function") {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function cleanPropValue(value: unknown): PropValue | undefined {
  if (value === null) return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string") return cleanString(value, MAX_PROP_STRING) ?? undefined;
  if (Array.isArray(value)) {
    const items: Array<string | number> = [];
    for (const item of value.slice(0, MAX_PROP_LIST)) {
      if (typeof item === "number" && Number.isFinite(item)) items.push(item);
      else if (typeof item === "string") {
        const s = cleanString(item, 60);
        if (s) items.push(s);
      }
    }
    return items;
  }
  return undefined;
}

/**
 * Bound a props object to "small flat JSON": scalar values or flat scalar
 * lists, ≤30 keys, serialised ≤2000 chars. Anything else is dropped; an
 * oversized or empty result becomes null rather than a truncated object.
 */
export function cleanProps(input: unknown): EventProps | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const out: EventProps = {};
  let count = 0;
  for (const [rawKey, rawValue] of Object.entries(input as Record<string, unknown>)) {
    if (count >= MAX_PROP_KEYS) break;
    const key = cleanString(rawKey, MAX_PROP_KEY);
    if (!key) continue;
    const value = cleanPropValue(rawValue);
    if (value === undefined) continue;
    out[key] = value;
    count += 1;
  }
  if (count === 0) return null;
  return JSON.stringify(out).length > MAX_PROPS_JSON ? null : out;
}

/**
 * True when `path` equals one of `prefixes` or sits beneath it on a whole
 * segment, case-insensitively: `/lp` and `/lp/x` match `/lp`; `/lpx` does not.
 */
export function isUnderPrefix(path: string, prefixes: readonly string[]): boolean {
  const p = path.toLowerCase();
  return prefixes.some((raw) => {
    const prefix = raw.toLowerCase().replace(/\/+$/, "");
    if (!prefix) return false;
    return p === prefix || p.startsWith(`${prefix}/`);
  });
}
