/**
 * The module's only network path: queue → batch (≤20) → POST to the
 * same-origin ingest route (config.endpoint).
 *
 * - Batches flush 2.5 s after the first queued event.
 * - call_click / quote_submit / booking_submit flush immediately.
 * - When the page is hidden or being unloaded, everything flushes at once via
 *   navigator.sendBeacon (a JSON Blob), falling back to fetch keepalive.
 * - `ageMs` is computed at send time, so the server can place each event in
 *   time without trusting the browser's clock.
 * - Failures are dropped silently: no retries, no storage, no console noise.
 *   Losing a page view is fine; a retry storm against our own API is not.
 */
import { sourceTrackingConfig as config } from "@/config/source-tracking";
import { classifyPageGroup } from "../classify/page-group";
import {
  MAX_LABEL,
  MAX_PATH,
  MAX_PLACEMENT,
  cleanProps,
  cleanString,
  isUnderPrefix,
} from "../shared";
import { IMMEDIATE_EVENTS, type ClientEventType } from "../taxonomy";
import type { EventProps, WireBatch, WireEntry, WireEvent } from "../types";
import { activeEntryFor, touchSession } from "./session";

export const MAX_BATCH = 20;
export const FLUSH_DELAY_MS = 2500;
const MAX_AGE_MS = 120_000;

interface QueuedEvent {
  type: ClientEventType;
  path: string;
  pageGroup: WireEvent["pageGroup"];
  label: string | null;
  placement: string | null;
  props: EventProps | null;
  at: number;
}

export interface EnqueueOptions {
  label?: string | null;
  placement?: string | null;
  props?: Record<string, unknown> | null;
  /** Defaults to the current location's pathname. */
  path?: string;
}

let queue: QueuedEvent[] = [];
let queueSessionId: string | null = null;
let queueEntry: WireEntry | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let listening = false;
let unloading = false;

function debug(...args: unknown[]): void {
  if (config.debug && typeof console !== "undefined") console.debug("[source-tracking]", ...args);
}

/** Build the queued form of an event. Exported for tests. */
export function buildQueuedEvent(type: ClientEventType, pathname: string, options: EnqueueOptions, now: number): QueuedEvent {
  const path = cleanString(pathname.split(/[?#]/)[0], MAX_PATH) ?? "/";
  return {
    type,
    path,
    pageGroup: classifyPageGroup(path, config.pageGroups),
    label: cleanString(options.label, MAX_LABEL),
    placement: cleanString(options.placement, MAX_PLACEMENT),
    props: cleanProps(options.props),
    at: now,
  };
}

/** What the queue is bound to: the session its events belong to and the entry (if any) that session owns. */
export interface QueueBinding {
  sessionId: string | null;
  entry: WireEntry | null;
}

/**
 * Re-bind the queue to the session an event is about to be queued for. Pure;
 * exported for tests. The entry is tied to the session that created it: on a
 * session change (expiry, or adopting another tab's cookie) the pending entry
 * is dropped — never attached to the new session's batches — and the new
 * session's own entry (null when adopted) takes its place. Within one session
 * an entry that arrives late is adopted once.
 */
export function bindQueue(current: QueueBinding, session: { id: string; entry: WireEntry | null }, queued: number): { binding: QueueBinding; flushFirst: boolean } {
  if (current.sessionId !== session.id) {
    return { binding: { sessionId: session.id, entry: session.entry }, flushFirst: queued > 0 };
  }
  return { binding: { sessionId: session.id, entry: current.entry ?? session.entry }, flushFirst: false };
}

/** Wire form, with ageMs computed now. Exported for tests. */
export function toWireEvent(event: QueuedEvent, now: number): WireEvent {
  return {
    type: event.type,
    path: event.path,
    pageGroup: event.pageGroup,
    label: event.label,
    placement: event.placement,
    ageMs: Math.max(0, Math.min(MAX_AGE_MS, Math.round(now - event.at))),
    props: event.props,
  };
}

function send(batch: WireBatch, useBeacon: boolean): void {
  const body = JSON.stringify(batch);
  debug(useBeacon ? "beacon" : "fetch", batch);
  if (useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      if (navigator.sendBeacon(config.endpoint, new Blob([body], { type: "application/json" }))) return;
    } catch {
      // Fall through to fetch.
    }
  }
  try {
    void fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      // keepalive bodies are capped at 64 KB in flight; a 20-event batch is a few KB.
      keepalive: body.length < 60_000,
      credentials: "same-origin",
    }).catch(() => {});
  } catch {
    // Measurement must never surface as a visible failure.
  }
}

/** Send everything queued. `useBeacon` when the page may be going away. */
export function flush(useBeacon = false): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  if (queue.length === 0 || !queueSessionId) return;

  const sessionId = queueSessionId;
  const entry = queueEntry;
  const pending = queue;
  queue = [];
  const now = Date.now();
  for (let i = 0; i < pending.length; i += MAX_BATCH) {
    send(
      { sessionId, entry, events: pending.slice(i, i + MAX_BATCH).map((e) => toWireEvent(e, now)) },
      useBeacon,
    );
  }
  // The next batch carries the entry only while we are still on the session's
  // first page — and only this session's entry, never one left over from
  // another session.
  queueEntry = activeEntryFor(sessionId);
}

function isHidden(): boolean {
  return unloading || (typeof document !== "undefined" && document.visibilityState === "hidden");
}

function ensureListeners(): void {
  if (listening) return;
  listening = true;
  window.addEventListener("pagehide", () => {
    unloading = true;
    flush(true);
  });
  window.addEventListener("pageshow", () => {
    unloading = false;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
  });
}

/** True when tracking is off for this path (config.excludePathPrefixes). */
export function isExcludedPath(pathname: string): boolean {
  return config.excludePathPrefixes.length > 0 && isUnderPrefix(pathname, config.excludePathPrefixes);
}

/** Queue one event. No-op on the server, when disabled, or on excluded paths. Never throws. */
export function enqueue(type: ClientEventType, options: EnqueueOptions = {}): void {
  try {
    if (typeof window === "undefined" || !config.enabled) return;
    const pathname = options.path ?? window.location.pathname;
    if (isExcludedPath(pathname)) return;

    const session = touchSession();
    const { binding, flushFirst } = bindQueue({ sessionId: queueSessionId, entry: queueEntry }, session, queue.length);
    // A different session (expired, or replaced by another tab): send what belongs to the old one first.
    if (flushFirst) flush(isHidden());
    queueSessionId = binding.sessionId;
    queueEntry = binding.entry;

    queue.push(buildQueuedEvent(type, pathname, options, Date.now()));
    ensureListeners();

    if (isHidden()) {
      flush(true);
    } else if (IMMEDIATE_EVENTS.has(type)) {
      flush(true);
    } else if (queue.length >= MAX_BATCH) {
      flush(false);
    } else if (timer === null) {
      timer = setTimeout(() => flush(false), FLUSH_DELAY_MS);
    }
  } catch {
    // Never let tracking break the page.
  }
}
