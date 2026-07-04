import type { ChatMessage } from "./use-assistant-chat";

/**
 * Summarise the customer's own chat questions into an editable, pre-filled quote note, so a quote raised
 * from the assistant already describes what they asked about. Only client-facing user turns are used.
 */
export function buildChatQuoteNotes(messages: ChatMessage[]): string {
  const userTurns = messages
    .filter((m) => m.role === "user")
    .map((m) => m.text.trim())
    .filter(Boolean);
  if (userTurns.length === 0) return "";
  const recent = userTurns.slice(-3);
  return `From my chat with the assistant:\n${recent.map((t) => `• ${t}`).join("\n")}`;
}
