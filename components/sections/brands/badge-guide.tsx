import { Cpu, DoorClosed, PanelBottom } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { GetQuoteButton } from "@/components/page/cta-buttons";
import type { BrandKind } from "@/types/brand";

const CARDS = {
  roller: {
    icon: DoorClosed,
    title: "Roller door",
    body: "Look along the side of the curtain where it meets the guide, and at both ends of the bottom rail — most Australian roller doors carry a foil sticker there, and some have the brand pressed into the rail itself. Raise the door halfway so the whole rail is at eye level.",
  },
  sectional: {
    icon: PanelBottom,
    title: "Sectional door",
    body: "The sticker sits on the inside face of the bottom panel, usually near a corner, or on the vertical track at about head height. It's often tucked behind the weather seal, so run a finger along the lip if nothing is obvious.",
  },
  motor: {
    icon: Cpu,
    title: "Motor / opener",
    body: "The brand and model are printed on a label on the head unit — the box bolted to the garage ceiling. Check the underside first, then the side facing the door; on a few models it hides under the light lens cover.",
  },
} as const;

/**
 * "Where's the badge?" — the one thing a visitor needs before any of this page is useful to them.
 *
 * The finder's empty state links straight here, so the section carries a stable `#badge-guide`
 * anchor and `scroll-mt-24` (the header would otherwise cover the heading). The motor hub leads
 * with the head-unit card because that is the label its visitors are hunting for.
 */
export function BadgeGuide({ kind }: { kind: BrandKind }) {
  const cards =
    kind === "motor"
      ? [CARDS.motor, CARDS.roller, CARDS.sectional]
      : [CARDS.roller, CARDS.sectional, CARDS.motor];

  return (
    <section id="badge-guide" className="scroll-mt-24 bg-muted/30 py-12 sm:py-16">
      <Container>
        <SectionHeading
          eyebrow="Find your badge"
          title="Where the brand name is hiding"
          description="Nearly every garage door and opener is labelled somewhere. Here are the three places to check before you call."
        />

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <li key={card.title}>
                <Reveal delay={0.05 * i} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm ring-1 ring-foreground/5 sm:p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f4e9b]/10 text-[#0f4e9b]">
                      <Icon className="h-5.5 w-5.5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal delay={0.2}>
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Still not sure? Send us a photo
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                A photo of the label — or just of the door and the motor — is usually enough for us to
                name the brand before we arrive.
              </p>
            </div>
            <GetQuoteButton className="shrink-0">Send a photo</GetQuoteButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
