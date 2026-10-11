/**
 * Wire types for the browser → Next route → CRM API protocol
 * (docs/source-tracking/DESIGN.md §1). Field names are the contract.
 */
import type { ClientEventType, PageGroup } from "./taxonomy";

/** A prop value: flat scalars, or a short flat list of scalars (e.g. scroll milestones). */
export type PropValue = string | number | boolean | null | Array<string | number>;
export type EventProps = Record<string, PropValue>;

export interface WireEvent {
  type: ClientEventType;
  path: string;
  pageGroup: PageGroup;
  label: string | null;
  placement: string | null;
  /** Milliseconds since the event happened, computed at send time. */
  ageMs: number;
  props: EventProps | null;
}

export interface WireEntry {
  landingPath: string;
  landingQuery: string;
  referrer: string;
}

/** What the browser posts to /api/source-tracking/events. */
export interface WireBatch {
  sessionId: string;
  entry: WireEntry | null;
  events: WireEvent[];
}

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface WireGeo {
  country: string | null;
  region: string | null;
  city: string | null;
  postcode: string | null;
}

export interface WireContext {
  userAgent: string;
  deviceType: DeviceType;
  isBot: boolean;
  geo: WireGeo;
}

/** What the Next route forwards to `{CRM_API_URL}/source-tracking/events`. */
export interface ForwardedBatch extends WireBatch {
  visitorKey: string | null;
  context: WireContext;
}
