import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/page/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { MOTOR_IMAGES } from "./motor-data";

/** Real power-flow sequence — the numbering mirrors the annotated render. */
const STEPS = [
  {
    title: "The drive unit generates the force",
    description:
      "The motor head converts power into up to 1100 N or 1500 N of controlled pulling force, with a soft ramp so it never jolts.",
  },
  {
    title: "The belt rail carries it forward",
    description:
      "A reinforced belt transmits that force along the rail — smooth and near-silent where an old chain would rattle.",
  },
  {
    title: "The trolley and arm pull the door",
    description:
      "The trolley rides the rail and the linkage arm transfers the pull to the top panel of your sectional door.",
  },
  {
    title: "The springs balance the weight",
    description:
      "Your door's springs carry most of the load, so the motor guides a balanced door instead of dragging dead weight — that's what keeps it quiet and long-lived.",
  },
];

/** Annotated cutaway + the four-step force path. Server component. */
export function MotorHowItWorks() {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl border border-border shadow-[0_12px_40px_rgba(13,31,69,0.12)]">
              <Image
                src={MOTOR_IMAGES.howItWorks.src}
                alt={MOTOR_IMAGES.howItWorks.alt}
                width={MOTOR_IMAGES.howItWorks.width}
                height={MOTOR_IMAGES.howItWorks.height}
                quality={75}
                sizes="(min-width: 1024px) 50vw, 92vw"
                className="h-auto w-full"
              />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="How it works"
              title="From Motor to Moving Door"
              description="One clean line of force — that's why a properly matched motor runs quietly for years."
            />
            <ol className="mt-8 space-y-6">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08}>
                  <li className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-heading text-base font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.3}>
              <p className="mt-7 text-sm text-muted-foreground">
                Motor straining, clicking or stopping halfway? It may be repairable — see our{" "}
                <Link
                  href="/garage-door-opener-repair-perth"
                  className="font-semibold text-primary hover:underline"
                >
                  garage door opener repair service
                </Link>{" "}
                before you commit to a replacement.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
