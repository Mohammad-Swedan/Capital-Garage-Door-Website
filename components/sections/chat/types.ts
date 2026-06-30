/**
 * Shared types for the Smart Garage Assistant chat. Mirrors the backend envelope returned by the CMS
 * (`ChatResponseDto` / `ChatActionDto`) and forwarded through `app/api/chat`.
 */

export type ChatActionType = "call" | "book" | "calculator" | "quote" | "suburb" | "link";

export interface ChatAction {
  type: ChatActionType;
  label: string;
  /** Payload for a "suburb" action — the suburb to prefill + send. */
  value?: string;
  /** Internal path for a "link" action (e.g. "/roller-door-repair"). */
  href?: string;
}

export interface AssistantReply {
  reply: string;
  suggestions: string[];
  actions: ChatAction[];
}

/** Overlays the chat can raise inside its own sheet (booking / calculator / quote). */
export type ChatOverlay = "booking" | "calculator" | "quote" | null;
