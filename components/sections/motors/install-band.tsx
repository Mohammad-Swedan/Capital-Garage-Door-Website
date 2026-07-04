import Image from "next/image";
import { BadgeCheck, Recycle, Settings2, ShieldCheck, Timer } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/page/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { BookNowButton, CallNowButton } from "@/components/page/cta-buttons";
import { MOTOR_IMAGES } from "./motor-data";

const INSTALL_POINTS = [
  {
    icon: Settings2,
    text: "We size the motor to your door on the spot — 1100N for standard doors, 1500N for big or insulated ones.",
  },
  {
    icon: Recycle,
    text: "Your old opener comes down, gets disconnected safely and leaves with us.",
  },
  {
    icon: BadgeCheck,
    text: "Remotes, wall control and the app are paired and tested before we pack up.",
  },
  {
    icon: ShieldCheck,
    text: "Full safety check — auto-reverse, spring balance and travel limits set correctly.",
  },
  {
    icon: Timer,
    text: "Most swaps take under two hours, with same-day slots across Perth.",
  },
];

/** Installed-in-a-real-garage proof band with the install promise. Server component. */
export function MotorInstallBand() {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Fitted by our team"
              title="Installed and Tested by Perth Technicians"
              description="A motor is only as good as its install. Ours go in level, tensioned and programmed — by the same local team that answers the phone afterwards."
            />
            <ul className="mt-7 space-y-4">
              {INSTALL_POINTS.map((point, i) => (
                <Reveal key={point.text} delay={i * 0.06}>
                  <li className="flex items-start gap-3.5">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                      <point.icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <p className="pt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {point.text}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <BookNowButton variant="primary" />
                <CallNowButton variant="secondary" />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-3xl border border-border shadow-[0_12px_40px_rgba(13,31,69,0.12)]">
              <Image
                src={MOTOR_IMAGES.installedGarage.src}
                alt={MOTOR_IMAGES.installedGarage.alt}
                width={MOTOR_IMAGES.installedGarage.width}
                height={MOTOR_IMAGES.installedGarage.height}
                quality={75}
                sizes="(min-width: 1024px) 50vw, 92vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
