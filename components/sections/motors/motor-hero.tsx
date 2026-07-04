import Image from "next/image";
import { BadgeDollarSign, ShieldCheck, Timer } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CallNowButton, RequestQuoteButton } from "@/components/page/cta-buttons";
import { MOTOR_IMAGES, MOTOR_PRICE } from "./motor-data";

const CHIPS = [
  {
    icon: BadgeDollarSign,
    label: `$${MOTOR_PRICE.min}–$${MOTOR_PRICE.max} supplied & installed`,
    emphasis: true,
  },
  { icon: ShieldCheck, label: "5-year warranty — extendable to 7", emphasis: false },
  { icon: Timer, label: "Same-day installation across Perth", emphasis: false },
];

/**
 * Dark "showroom power-on" hero for the motors product page. The LED glow
 * behind the render flickers to life via the cgd-motor-* keyframes
 * (globals.css) — pure CSS, compositor-only, reduced-motion safe.
 */
export function MotorHero() {
  return (
    <section className="relative overflow-hidden bg-[#0a1733] text-primary-foreground">
      {/* Decoration: the shared dark-band recipe (grid + ambient orbs). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_60%_at_50%_40%,black_30%,transparent_80%)]" />
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-cta/15 blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#0f4e9b]/35 blur-[100px]" />
      </div>

      <Container className="relative z-10 pb-14 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          {/* Copy */}
          <div className="max-w-xl">
            <p className="cgd-rise text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300 sm:text-xs">
              Capital Motor Range — 1100N &amp; 1500N
            </p>

            <h1 className="cgd-rise mt-4 font-display text-[clamp(2rem,5.2vw,3.4rem)] font-black leading-[1.06] tracking-tight text-white [animation-delay:60ms]">
              Garage Door Motors{" "}
              {/* Bottom border (not an absolute bar) so the highlight tracks each
                  line box when the phrase wraps at narrow widths. */}
              <span className="border-b-6 border-cta/40 pb-0.5 text-[#ff6b72] [box-decoration-break:clone]">
                Built for Perth Doors
              </span>
            </h1>

            <p className="cgd-rise mt-5 max-w-lg text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg [animation-delay:120ms]">
              Our own Capital 1100N and 1500N openers: whisper-quiet belt drive, soft start and
              stop, WiFi app control and a built-in LED that lights the garage the moment the door
              moves — supplied, installed and programmed by our local team.
            </p>

            <ul className="cgd-rise mt-6 flex flex-wrap gap-2.5 [animation-delay:180ms]">
              {CHIPS.map((chip) => (
                <li
                  key={chip.label}
                  className={
                    chip.emphasis
                      ? "inline-flex items-center gap-2 rounded-full border border-sky-300/40 bg-sky-300/15 px-4 py-2 text-sm font-bold text-sky-100"
                      : "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm"
                  }
                >
                  <chip.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {chip.label}
                </li>
              ))}
            </ul>

            <div className="cgd-rise mt-7 flex flex-col gap-3 sm:flex-row [animation-delay:240ms]">
              <CallNowButton />
              <RequestQuoteButton variant="ghost" />
            </div>

            <p className="cgd-rise mt-5 text-sm text-primary-foreground/60 [animation-delay:300ms]">
              Licensed &amp; insured · Local Perth team · Old motor removed and disposed of
            </p>
          </div>

          {/* Product render + power-on light */}
          <div className="cgd-rise relative mx-auto w-full max-w-xl [animation-delay:200ms] lg:max-w-none">
            {/* LED glow behind the unit — powers on, then breathes. */}
            <div
              aria-hidden="true"
              className="cgd-motor-glow absolute left-1/2 top-1/2 h-[68%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(186,220,255,0.5)_0%,rgba(186,220,255,0.14)_52%,transparent_74%)] blur-2xl"
            />
            {/* Light cone thrown down by the LED strip. */}
            <div
              aria-hidden="true"
              className="cgd-motor-beam absolute left-1/2 top-[56%] h-[48%] w-[46%] -translate-x-1/2 bg-[linear-gradient(to_bottom,rgba(210,231,255,0.4),rgba(210,231,255,0.05)_70%,transparent)] blur-md [clip-path:polygon(36%_0,64%_0,100%_100%,0_100%)]"
            />
            <div className="cgd-motor-bob relative z-10">
              <Image
                src={MOTOR_IMAGES.heroDark.src}
                alt={MOTOR_IMAGES.heroDark.alt}
                width={MOTOR_IMAGES.heroDark.width}
                height={MOTOR_IMAGES.heroDark.height}
                priority
                fetchPriority="high"
                quality={75}
                sizes="(min-width: 1024px) 44vw, (min-width: 640px) 80vw, 94vw"
                className="h-auto w-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
