/**
 * Bridge from the host's own analytics call (`track(event, params)` or
 * equivalent) into the module. The host adds ONE line to its analytics
 * function: `captureFromAnalytics(event, payload)`.
 *
 * Only allow-listed events are forwarded, and for each one only allow-listed
 * params — so nothing a visitor typed (name, email, phone, message, booking
 * reference) can reach the tracking pipeline even if a host starts passing it.
 * The business number a visitor dialled IS kept (call_click label): it is the
 * business's own number, and with call tracking it says which number rang.
 *
 * No-op on the server, never throws.
 */
import { MAX_LABEL, cleanString } from "../shared";
import type { ClientEventType } from "../taxonomy";
import { takeRecentClickPlacement } from "./placement";
import { enqueue } from "./sink";

interface BridgeRule {
  /** Param keys tried in order for the label. */
  label?: readonly string[];
  /** Params copied into props (scalars only). */
  props?: readonly string[];
  /** Max label length (default 120). */
  labelMax?: number;
}

/** Event allow-list: host event name → how to map it. */
export const BRIDGE_RULES: Readonly<Record<string, BridgeRule>> = {
  call_click: { label: ["phone", "link_text"], props: ["link_text"] },
  email_click: {},
  quote_open: { label: ["service_type", "service", "source"], props: ["service_id", "source"] },
  quote_submit: { label: ["service_type", "service", "source"], props: ["service_id", "source"] },
  booking_open: { label: ["service_type", "service", "source"], props: ["service_id", "source"] },
  booking_submit: { label: ["service_type", "service", "source"], props: ["service_id", "source"] },
  chat_open: {},
  chat_message: { props: ["turn"] },
  chat_cta_click: { label: ["type"], props: ["type"] },
  calc_chat_cta_click: { label: ["type"], props: ["type"] },
  chat_quote_open: { label: ["source"], props: ["source"] },
  chat_booking_complete: {},
  chat_lead_submit: { label: ["type", "source"], props: ["type", "source"] },
  calculator_complete: {
    label: ["service_type"],
    props: ["service_type", "problem_id", "emergency", "price_source", "price_min", "price_max"],
  },
  suburb_search: { label: ["query"], props: ["results"], labelMax: 60 },
};

/** Looks like an email address or a phone number (7+ digits) — never forwarded from user input. */
function looksPersonal(value: string): boolean {
  return value.includes("@") || /\d[\d\s().-]{5,}\d/.test(value);
}

function normalisePhone(raw: string): string | null {
  const cleaned = raw.replace(/^tel:/i, "").replace(/[^\d+]/g, "");
  return cleaned.length >= 6 ? cleaned.slice(0, 20) : null;
}

function scalar(value: unknown): string | number | boolean | null | undefined {
  if (value === null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const s = cleanString(value, 120);
    if (s === null) return undefined;
    return looksPersonal(s) ? undefined : s;
  }
  return undefined;
}

export interface BridgedEvent {
  type: ClientEventType;
  label: string | null;
  props: Record<string, string | number | boolean | null> | null;
}

/** Pure mapping, exported for tests. Null = not forwarded. */
export function mapAnalyticsEvent(event: string, payload: Record<string, unknown> | null | undefined): BridgedEvent | null {
  const rule = BRIDGE_RULES[event];
  if (!rule) return null;
  const params = payload && typeof payload === "object" ? payload : {};

  let label: string | null = null;
  for (const key of rule.label ?? []) {
    const raw = params[key];
    if (event === "call_click" && key === "phone" && typeof raw === "string") {
      label = normalisePhone(raw);
    } else {
      const value = scalar(raw);
      label = value === null || value === undefined ? null : cleanString(String(value), rule.labelMax ?? MAX_LABEL);
    }
    if (label) break;
  }

  let props: BridgedEvent["props"] = null;
  for (const key of rule.props ?? []) {
    const value = scalar(params[key]);
    if (value === undefined) continue;
    props = props ?? {};
    props[key] = value;
  }

  return { type: event as ClientEventType, label, props };
}

export function captureFromAnalytics(event: string, payload?: Record<string, unknown> | null): void {
  try {
    if (typeof window === "undefined") return;
    const mapped = mapAnalyticsEvent(event, payload);
    if (!mapped) return;
    enqueue(mapped.type, {
      label: mapped.label,
      props: mapped.props,
      placement: takeRecentClickPlacement(),
    });
  } catch {
    // Analytics must never throw into the host.
  }
}
