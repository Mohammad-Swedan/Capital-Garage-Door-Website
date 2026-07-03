import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { STEP_ICONS, NAVY, TINT } from "./why-choose-us-constants";
import { WhyChooseUsInteractive } from "./why-choose-us-interactive";

interface Reason {
  title: string;
  tagline: string;
  description: string;
  points: string[];
}

const reasons: Reason[] = [
  {
    title: "Licensed, Bonded & Insured",
    tagline: "Work you can trust",
    description:
      "Every technician we send is fully licensed and insured, so you're protected from the moment we step onto your property.",
    points: [
      "Background-checked, factory-trained technicians",
      "Fully insured for your peace of mind",
      "Workmanship that meets manufacturer standards",
    ],
  },
  {
    title: "Same-Day Emergency Service",
    tagline: "Fast when it matters",
    description:
      "A garage door that won't open is a security risk and a hassle. We prioritize urgent calls and aim to be at your door the same day.",
    points: [
      "Emergency callouts 7 days a week",
      "Stocked vans for on-the-spot repairs",
      "Upfront arrival windows, not vague promises",
    ],
  },
  {
    title: "Honest, Upfront Pricing",
    tagline: "No surprises",
    description:
      "You'll know the full cost before any work begins. We quote the job, not the hours, so there's never a surprise on the invoice.",
    points: [
      "Free, no-obligation estimates",
      "Flat-rate pricing agreed before we start",
      "No hidden callout or travel fees",
    ],
  },
  {
    title: "Lifetime Workmanship Warranty",
    tagline: "Backed for the long run",
    description:
      "We stand behind every repair and installation with a warranty that protects your investment long after we've left the driveway.",
    points: [
      "Lifetime warranty on workmanship",
      "Manufacturer warranties honored on parts",
      "Free follow-up if anything isn't right",
    ],
  },
];

/**
 * Server component: renders the header + the static reason cards. The scroll-
 * linked numeral/rail lives in <WhyChooseUsInteractive> (client); the cards are
 * passed to it as a prop so their DOM stays server-rendered and never hydrates
 * (mobile TBT). The island finds the cards via their `data-why-card` attribute.
 */
export function WhyChooseUs() {
  const cards = (
    <div className="space-y-10 md:space-y-16">
      {reasons.map((reason, i) => {
        const Icon = STEP_ICONS[i];
        return (
          <Reveal key={reason.title} delay={0.05}>
            <article
              data-why-card=""
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-(--card-accent) hover:shadow-xl md:p-6 lg:p-7"
              style={{ ["--card-accent" as string]: NAVY }}
            >
              {/* Soft brand-tinted wash in the corner */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${TINT}, transparent 55%)`,
                }}
              />

              {/* Left accent ribbon */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] overflow-hidden">
                <span
                  className="cgd-why-ribbon block h-full w-full origin-top"
                  style={{ backgroundColor: NAVY }}
                />
              </div>

              <div className="relative z-10">
                {/* Header: icon badge + meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 ease-out group-hover:scale-105 md:h-12 md:w-12"
                    style={{
                      backgroundColor: TINT,
                      color: NAVY,
                      boxShadow: `inset 0 0 0 1px ${NAVY}1f`,
                    }}
                  >
                    <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.25} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span
                      className="inline-flex w-fit items-center justify-center h-5 px-2 rounded-full font-mono text-[10px] font-semibold uppercase tracking-widest"
                      style={{ backgroundColor: TINT, color: NAVY }}
                    >
                      0{i + 1} / 04
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {reason.tagline}
                    </span>
                  </div>
                </div>

                <h3 className="font-heading text-[clamp(1.25rem,2.6vw,1.75rem)] font-bold leading-[1.15] mb-3">
                  {reason.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
                  {reason.description}
                </p>

                {/* Deliverables/points */}
                <ul className="mt-5 grid gap-3 border-t border-border/70 pt-5 sm:grid-cols-1">
                  {reason.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <div
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: TINT, color: NAVY }}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-foreground font-medium leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );

  return (
    <section className="relative bg-background border-t border-border py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="grid gap-6 md:grid-cols-12 mb-8 md:mb-12">
          <Reveal className="md:col-span-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-[0.2em] text-cta uppercase">
                Why Choose Us
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-foreground">
                Reasons Perth Homeowners Trust Us
              </h2>
              <p className="mt-3 text-muted-foreground text-base">
                Four reasons to call us first when something goes wrong with
                your garage door.
              </p>
            </div>
          </Reveal>
        </div>

        <WhyChooseUsInteractive cards={cards} count={reasons.length} />
      </div>
    </section>
  );
}
