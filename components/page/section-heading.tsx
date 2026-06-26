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
        <span className="cgd-eyebrow text-cta">
          {eyebrow}
        </span>
      )}
      <Heading className="text-balance cgd-h2 text-foreground">
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty cgd-lead text-muted-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
