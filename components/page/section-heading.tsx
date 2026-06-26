import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Render the heading as h2 (default) or h3. */
  as?: "h2" | "h3";
  className?: string;
}

/** Consistent eyebrow + heading + intro block reused across page sections. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="text-[11px] font-bold tracking-[0.18em] text-[#0f4e9b] uppercase sm:text-xs">
          {eyebrow}
        </span>
      )}
      <Heading className="text-balance font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2.25rem] lg:leading-[1.15]">
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
