import { BadgeCheck, ExternalLink, Wrench } from "lucide-react";
import { BrandMark } from "./brand-mark";
import type { BrandEntity, BrandKind, BrandQuickFact } from "@/types/brand";

interface BrandPlateProps {
  entity: BrandEntity;
  quickFacts: BrandQuickFact[];
  kind: BrandKind;
}

/**
 * The brand's identity card, used in the page hero: an accent-tinted band over the shared 44px
 * grid, the brand mark straddling its bottom edge, the quick facts as a definition list, and a
 * ribbon that states our relationship with the manufacturer (authorised dealer, or independent
 * service). A slow sheen crosses the band once on mount and again on hover.
 */
export function BrandPlate({ entity, quickFacts, kind }: BrandPlateProps) {
  const ribbon = entity.dealer
    ? { icon: BadgeCheck, label: "Authorised dealer", cls: "bg-emerald-500/12 text-emerald-700" }
    : {
        icon: Wrench,
        label: `${kind === "motor" ? "Openers" : "Doors"} serviced & repaired in Perth`,
        cls: "bg-primary/10 text-primary",
      };
  const Icon = ribbon.icon;
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_50px_rgba(13,31,69,0.12)]">
      <div
        aria-hidden="true"
        className="cgd-brand-plate-band relative h-36 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, color-mix(in oklab, ${entity.accent} 14%, white) 0%, color-mix(in oklab, ${entity.accent} 4%, white) 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.06)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,black_30%,transparent_90%)]" />
        <span className="cgd-brand-plate-sheen absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      {/* The mark overlaps the band's bottom ~64px. It isn't interactive, so it must not swallow
          the pointer — otherwise it masks a third of the band's hover target for the sheen. */}
      <div className="pointer-events-none -mt-16 flex justify-center">
        <BrandMark entity={entity} size="xl" priority className="ring-4 ring-card" />
      </div>
      <div className="px-6 pt-4 pb-6 sm:px-8">
        <p className="text-center font-heading text-xl font-bold text-foreground">{entity.name}</p>
        <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {quickFacts.map((f) => (
            <div key={f.label}>
              <dt className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                {f.label}
              </dt>
              <dd className="mt-0.5 text-[15px] leading-snug font-semibold text-foreground">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${ribbon.cls}`}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {ribbon.label}
          </span>
          {entity.url && (
            <a
              href={entity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
            >
              Official {entity.name} site
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
