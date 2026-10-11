/**
 * The visit ("session") the browser is in: a uuid in a first-party cookie
 * (config.sessionCookie) with a sliding max-age of config.sessionTimeoutMinutes,
 * refreshed on every event.
 *
 * A NEW session starts when:
 *  - the cookie is missing (first visit, or idle past the timeout), or
 *  - this page load carries campaign parameters (gclid, utm_*, …) — a new ad
 *    click is a new visit even mid-session, or
 *  - this page load is a paid landing page (config.landingPagePrefixes)
 *    reached from another site — an ad click whose click id was stripped.
 * The last two are de-duplicated per tab (sessionStorage), so reloading the
 * same `?gclid=` URL does not mint a session per reload.
 *
 * The `entry` block ({landingPath, landingQuery, referrer}) describes how the
 * session started. It is attached to every batch sent from the session's
 * first page (repeated, because a beacon can be lost) and is null after the
 * first client-side navigation or on any later page load.
 *
 * Why the cookie is written from JavaScript (and so capped at 7 days by
 * Safari ITP): a 30-minute session is far inside that cap, and keeping it
 * client-side means the ISR-cached HTML never carries a Set-Cookie.
 */
import { sourceTrackingConfig as config } from "@/config/source-tracking";
import {
  MAX_LANDING_PATH,
  MAX_LANDING_QUERY,
  MAX_REFERRER,
  cleanString,
  isUnderPrefix,
  isUuid,
  newUuid,
} from "../shared";
import type { WireEntry } from "../types";

// ─── Pure helpers (unit-tested) ─────────────────────────────────────────────

export function hasCampaignParams(search: string, keys: readonly string[]): boolean {
  if (!search || search === "?") return false;
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return keys.some((key) => Boolean(params.get(key)));
}

export function buildEntry(pathname: string, search: string, referrer: string): WireEntry {
  const query = search && search !== "?" ? (search.startsWith("?") ? search : `?${search}`) : "";
  return {
    landingPath: cleanString(pathname, MAX_LANDING_PATH) ?? "/",
    landingQuery: cleanString(query, MAX_LANDING_QUERY) ?? "",
    referrer: cleanString(referrer, MAX_REFERRER) ?? "",
  };
}

/** Hostname of a URL without `www.`, or "" when it isn't one. */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export interface StartDecisionInput {
  existingId: string | null;
  pathname: string;
  search: string;
  referrer: string;
  ownHost: string;
  campaignKeys: readonly string[];
  landingPrefixes: readonly string[];
  /** Signature of the visit that last started a session in this tab (sessionStorage), if any. */
  lastStartSignature: string | null;
}

/**
 * Decide whether this page load starts a new session. Returns the signature to
 * remember when it does (null signature = cookie-missing start).
 */
export function decideSessionStart(input: StartDecisionInput): { start: boolean; signature: string | null } {
  let signature: string | null = null;
  if (hasCampaignParams(input.search, input.campaignKeys)) {
    signature = `q:${input.pathname}${input.search}`;
  } else if (isUnderPrefix(input.pathname, input.landingPrefixes)) {
    const refHost = hostOf(input.referrer);
    if (refHost && refHost !== input.ownHost.toLowerCase().replace(/^www\./, "")) {
      signature = `lp:${input.pathname}|${refHost}`;
    }
  }

  if (!isUuid(input.existingId)) return { start: true, signature };
  if (signature && signature !== input.lastStartSignature) return { start: true, signature };
  return { start: false, signature: null };
}

// ─── Browser state ──────────────────────────────────────────────────────────

interface SessionState {
  id: string;
  /** The entry for this session, when this document started it. */
  entry: WireEntry | null;
  /** True until the first client-side navigation away from the session's first page. */
  onFirstPage: boolean;
  /** Whether the first page_view's referrer prop has been emitted. */
  referrerReported: boolean;
}

let state: SessionState | null = null;
/** When this document last wrote the cookie — tells "expired" apart from "cookies blocked". */
let lastWriteAt = 0;

/**
 * Pure: whether a missing cookie means the session expired (start a new one)
 * rather than that cookies are blocked (keep the in-memory id, or every event
 * would become its own session).
 */
export function cookieExpired(lastWrite: number, now: number, timeoutMs: number): boolean {
  return lastWrite === 0 || now - lastWrite >= timeoutMs;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function writeCookie(name: string, value: string): void {
  const maxAge = Math.round(config.sessionTimeoutMinutes * 60);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
  lastWriteAt = Date.now();
}

function storageGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Blocked storage: the worst case is a reload of a campaign URL starting another session.
  }
}

const signatureKey = () => `${config.sessionCookie}:start`;

/**
 * Snapshot the landing URL and decide the session for this document. Call as
 * early as possible (client navigation rewrites `location`). Idempotent.
 */
export function initSession(): void {
  if (state || typeof window === "undefined") return;
  const { pathname, search, hostname } = window.location;
  const referrer = document.referrer || "";
  const existing = readCookie(config.sessionCookie);

  const decision = decideSessionStart({
    existingId: existing,
    pathname,
    search,
    referrer,
    ownHost: hostname,
    campaignKeys: config.campaignParams,
    landingPrefixes: config.landingPagePrefixes,
    lastStartSignature: storageGet(signatureKey()),
  });

  if (decision.start) {
    state = { id: newUuid(), entry: buildEntry(pathname, search, referrer), onFirstPage: true, referrerReported: false };
    if (decision.signature) storageSet(signatureKey(), decision.signature);
  } else {
    state = { id: existing as string, entry: null, onFirstPage: false, referrerReported: true };
  }
  writeCookie(config.sessionCookie, state.id);
}

/**
 * The session to stamp on an event, refreshing the sliding cookie. Handles a
 * session that expired while the tab stayed open (starts a new one on the
 * current page) and one another tab replaced (adopts it).
 */
export function touchSession(): { id: string; entry: WireEntry | null } {
  initSession();
  const s = state as SessionState;
  const cookie = readCookie(config.sessionCookie);

  const timeoutMs = config.sessionTimeoutMinutes * 60_000;
  if (!isUuid(cookie) && cookieExpired(lastWriteAt, Date.now(), timeoutMs)) {
    // Idle past the timeout: the cookie expired. A new visit starts here.
    const { pathname, search } = window.location;
    state = { id: newUuid(), entry: buildEntry(pathname, search, ""), onFirstPage: true, referrerReported: true };
  } else if (isUuid(cookie) && cookie !== s.id) {
    state = { id: cookie, entry: null, onFirstPage: false, referrerReported: true };
  }

  const current = state as SessionState;
  writeCookie(config.sessionCookie, current.id);
  return { id: current.id, entry: current.onFirstPage ? current.entry : null };
}

/** The entry to attach to the next batch, without touching the cookie. */
export function activeEntry(): WireEntry | null {
  return state && state.onFirstPage ? state.entry : null;
}

/** Same as activeEntry, but only for the session that owns it — never another session's entry. */
export function activeEntryFor(sessionId: string): WireEntry | null {
  return state && state.id === sessionId ? activeEntry() : null;
}

/** Called on every client-side navigation: the session's first page is behind us. */
export function markNavigated(): void {
  if (state) state.onFirstPage = false;
}

/** The session-start referrer, once, for the first page_view of a session that started here. */
export function takeFirstViewReferrer(): string | null {
  if (!state || state.referrerReported || !state.entry) return null;
  state.referrerReported = true;
  return state.entry.referrer || null;
}
