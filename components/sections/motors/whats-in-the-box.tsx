import Image from "next/image";
import { Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { MOTOR_IMAGES } from "./motor-data";

const BOX_ITEMS = [
  "Capital motor head unit with built-in LED strip",
  "Reinforced belt rail kit",
  "2× multi-button remotes",
  "Wired wall control",
  "Auto-reverse safety beam sensors",
  "Heavy-duty mounting brackets & fixings",
  "WiFi app set up on your phone before we leave",
  "Professional installation, programming & safety test",
];

/** Dark "kit on the bench" band — everything included, no surprise extras. */
export function MotorWhatsInTheBox() {
  return (
    <section className="relative overflow-hidden bg-[#0d1f60] py-14 text-primary-foreground sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_60%_at_50%_40%,black_30%,transparent_80%)]" />
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#1b3b8c]/45 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cta/15 blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300 sm:text-xs">
                What&apos;s in the box
              </p>
              <h2 className="mt-3 text-balance font-display text-2xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl">
                The Whole Kit, Fitted — Not a Box on Your Doorstep
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-primary-foreground/80">
                Every Capital motor arrives with our installer, not a courier. One price covers the
                full kit and the workmanship — nothing sold separately at the door.
              </p>
            </Reveal>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              {BOX_ITEMS.map((item, i) => (
                <Reveal key={item} delay={i * 0.05}>
                  <li className="flex items-start gap-2.5 text-sm text-white/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.12}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:p-4">
              <Image
                src={MOTOR_IMAGES.accessoriesKit.src}
                alt={MOTOR_IMAGES.accessoriesKit.alt}
                width={MOTOR_IMAGES.accessoriesKit.width}
                height={MOTOR_IMAGES.accessoriesKit.height}
                quality={60}
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="h-auto w-full rounded-2xl"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
