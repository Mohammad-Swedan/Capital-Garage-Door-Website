import { cn } from "@/lib/utils";

/** Arch + roller-door silhouette, redrawn from the supplied logo.svg (viewBox 408x365). */
const ARCH_PATH =
  "M36,321 L36,184 A164,164 0 0 1 364,184 L364,321 L36,321 Z M87,139 A113,77 0 0 1 313,139 L87,139 Z M78,175 L78,321 L322,321 L322,175 Z";
const BAR_Y = [192, 239, 287] as const;

type Tone = "brand" | "white";

/**
 * The icon mark alone. Sized via `em` (no intrinsic width/height attributes,
 * so the viewBox aspect ratio governs `w-auto`) so it scales in lockstep with
 * the wordmark's font-size wherever the two are used together in `Logo`.
 */
export function LogoMark({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: Tone;
}) {
  const archFill = tone === "white" ? "#ffffff" : "#EE1D23";
  const barFill = tone === "white" ? "#ffffff" : "#0F4E9B";

  return (
    <svg
      viewBox="0 0 408 365"
      className={cn("h-8 w-auto shrink-0", className)}
      aria-hidden="true"
    >
      <path fill={archFill} fillRule="evenodd" d={ARCH_PATH} />
      {BAR_Y.map((y) => (
        <rect key={y} x={99} y={y} width={201} height={35} fill={barFill} />
      ))}
    </svg>
  );
}

/**
 * Full lockup: icon + the two-line "CAPITAL / GARAGE DOOR" wordmark, replacing
 * the old flattened PNG. Both the icon and the text scale off the font-size
 * set by `className` on the outer wrapper (e.g. `text-2xl`) — pass one size
 * utility per call site instead of tuning icon height and text size separately.
 */
export function Logo({
  className,
  iconClassName,
  textClassName,
  tone = "brand",
}: {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  tone?: Tone;
}) {
  return (
    <span className={cn("inline-flex items-center gap-x-[0.3em]", className)}>
      <LogoMark tone={tone} className={cn("h-[1.9em] w-auto", iconClassName)} />
      <span
        className={cn(
          "flex flex-col leading-none",
          tone === "white" ? "text-white" : "text-[#0F4E9B]",
          textClassName,
        )}
      >
        <span className="font-display text-[1em] tracking-tight uppercase">Capital</span>
        <span className="mt-[0.2em] text-[0.34em] font-bold tracking-[0.24em] uppercase">
          Garage Door
        </span>
      </span>
    </span>
  );
}
