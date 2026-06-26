import { Wrench, MapPin, DoorOpen, Building2, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import {
  CallNowButton,
  RequestQuoteButton,
  UploadPhotoButton,
  BookNowButton,
} from "@/components/page/cta-buttons";
import { EditableText } from "@/components/admin/editor/editable";
import type { CaseStudyPage } from "@/types/case-study";

interface CaseStudyHeroProps {
  data: CaseStudyPage;
}

/**
 * Above-the-fold hero for case-study pages. Single-column (no side image,
 * unlike ServiceHero) so the at-a-glance job stats can take the visual lead.
 */
export function CaseStudyHero({ data }: CaseStudyHeroProps) {
  const stats = [
    { icon: Wrench, label: "Service", value: data.service, path: "service" },
    { icon: MapPin, label: "Suburb", value: data.suburb, path: "suburb" },
    { icon: DoorOpen, label: "Door Type", value: data.doorType, path: "doorType" },
    { icon: Building2, label: "Job Type", value: data.jobType, path: "jobType" },
    { icon: CheckCircle2, label: "Result", value: data.result, path: "result" },
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.06)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_70%_at_50%_0%,black_30%,transparent_85%)]" />
        <div className="absolute -top-24 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute top-1/4 -right-16 h-72 w-72 rounded-full bg-[#0f4e9b]/10 blur-3xl" />
      </div>

      <Container className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="flex max-w-3xl flex-col items-start gap-5 sm:gap-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3.5 py-1.5 text-[11px] font-bold tracking-wider text-emerald-700 uppercase sm:text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Completed Job · Local Proof
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="text-balance font-display text-3xl leading-[1.1] font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              <EditableText path="title" placeholder="Case study title…" aria-label="Case study title">
                {data.title}
              </EditableText>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              <EditableText path="subtitle" placeholder="Subtitle…" aria-label="Subtitle">
                {data.subtitle}
              </EditableText>
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <CallNowButton />
              <RequestQuoteButton />
              <UploadPhotoButton variant="secondary" />
              <BookNowButton variant="secondary" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.24} className="mt-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm ring-1 ring-foreground/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">{stat.label}</p>
                <p className="font-heading text-sm font-semibold text-foreground sm:text-base">
                  <EditableText path={stat.path} singleLine placeholder={`${stat.label}…`} aria-label={stat.label}>
                    {stat.value}
                  </EditableText>
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
