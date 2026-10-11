/**
 * Bounding (not trusting) the browser body. Pure, so it is unit-tested.
 * The CRM API re-validates everything; this only keeps a hostile body from
 * costing more than a few KB downstream.
 */
import {
  MAX_LABEL,
  MAX_LANDING_PATH,
  MAX_LANDING_QUERY,
  MAX_PATH,
  MAX_PLACEMENT,
  MAX_REFERRER,
  cleanProps,
  cleanString,
  isUuid,
} from "../shared";
import { isClientEventType, isPageGroup } from "../taxonomy";
import type { WireBatch, WireEntry, WireEvent } from "../types";

export const MAX_EVENTS = 20;
export const MAX_AGE_MS = 120_000;
/** Bodies larger than this are not parsed at all. */
export const MAX_BODY_BYTES = 64 * 1024;

function cleanPath(value: unknown, max: number): string | null {
  const s = cleanString(value, max);
  return s && s.startsWith("/") ? s : null;
}

function cleanEntry(value: unknown): WireEntry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const e = value as Record<string, unknown>;
  const landingPath = cleanPath(e.landingPath, MAX_LANDING_PATH);
  if (!landingPath) return null;
  const query = cleanString(e.landingQuery, MAX_LANDING_QUERY) ?? "";
  return {
    landingPath,
    landingQuery: query && !query.startsWith("?") ? `?${query}`.slice(0, MAX_LANDING_QUERY) : query,
    referrer: cleanString(e.referrer, MAX_REFERRER) ?? "",
  };
}

function cleanEvent(value: unknown): WireEvent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const e = value as Record<string, unknown>;
  if (!isClientEventType(e.type)) return null;
  const age = typeof e.ageMs === "number" && Number.isFinite(e.ageMs) ? e.ageMs : 0;
  return {
    type: e.type,
    path: cleanPath(e.path, MAX_PATH) ?? "/",
    pageGroup: isPageGroup(e.pageGroup) ? e.pageGroup : "other",
    label: cleanString(e.label, MAX_LABEL),
    placement: cleanString(e.placement, MAX_PLACEMENT),
    ageMs: Math.max(0, Math.min(MAX_AGE_MS, Math.round(age))),
    props: cleanProps(e.props),
  };
}

/** A clean batch, or null when there is nothing worth forwarding. */
export function validateBatch(body: unknown): WireBatch | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  if (!isUuid(b.sessionId)) return null;
  if (!Array.isArray(b.events)) return null;

  const events: WireEvent[] = [];
  for (const raw of b.events.slice(0, MAX_EVENTS)) {
    const event = cleanEvent(raw);
    if (event) events.push(event);
  }
  if (events.length === 0) return null;

  return { sessionId: b.sessionId.toLowerCase(), entry: cleanEntry(b.entry), events };
}
