import {
  AudioWaveform,
  BatteryCharging,
  Gauge,
  Lightbulb,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/page/section-heading";
import { Reveal } from "@/components/motion/reveal";

const FEATURES = [
  {
    icon: AudioWaveform,
    title: "Whisper-quiet belt drive",
    description:
      "A reinforced belt rail instead of a rattling chain — quiet enough for a bedroom above the garage.",
  },
  {
    icon: Gauge,
    title: "Soft start & stop",
    description:
      "The motor ramps up and eases down on every cycle, cutting noise and taking strain off the door.",
  },
  {
    icon: Wifi,
    title: "WiFi app control",
    description:
      "Open, close and check the door from your phone — from the driveway or the other side of the country.",
  },
  {
    icon: BatteryCharging,
    title: "Battery backup option",
    description:
      "Add the backup battery and the door still opens in a blackout — no climbing for the manual release.",
  },
  {
    icon: Lightbulb,
    title: "Built-in LED lighting",
    description:
      "A bright LED strip lights the garage the moment the door moves, then switches itself off.",
  },
  {
    icon: ShieldCheck,
    title: "Auto-reverse safety",
    description:
      "Safety beam sensors stop and reverse the door the instant anything is in its path.",
  },
];

/** Six-up feature grid for the Capital motor range — server-rendered, CSS reveals only. */
export function MotorFeatureGrid() {
  return (
    <section className="bg-muted/30 py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Why owners pick them"
          title="Everything a Modern Opener Should Do"
          description="Both Capital motors ship with the full feature set — the only choice you make is how much pulling power your door needs."
          align="center"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06} className="h-full">
              <article className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-[0_4px_20px_rgba(13,31,69,0.05)] transition-transform duration-300 hover:-translate-y-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
