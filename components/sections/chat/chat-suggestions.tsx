import { m } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Model-generated follow-up questions for the latest assistant turn, rendered as tappable chips.
 * Tapping one sends it as the next user message.
 */
export function ChatSuggestions({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (text: string) => void;
}) {
  if (suggestions.length === 0) return null;

  return (
    <m.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-1.5"
    >
      <p className="flex items-center gap-1.5 px-1 text-[10.5px] font-semibold tracking-wide text-muted-foreground uppercase">
        <Sparkles className="h-3 w-3 text-primary/60" aria-hidden="true" />
        You might ask
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <m.button
            key={s}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick(s)}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background px-3 py-1.5 text-left text-xs font-medium text-primary transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            {s}
          </m.button>
        ))}
      </div>
    </m.div>
  );
}
