import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { CallNowButton, RequestQuoteButton } from "@/components/page/cta-buttons";

interface CTASectionProps {
  title: string;
  description?: string;
}

/** Final conversion band — navy background, strong CTAs. */
export function CTASection({ title, description }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-navy">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-10 h-72 w-72 rounded-full bg-[#0f4e9b]/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-cta/20 blur-3xl" />
      </div>

      <Container className="relative z-10 py-16 sm:py-24">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-balance cgd-h1 text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-xl text-pretty cgd-lead text-white/80">
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CallNowButton />
            <RequestQuoteButton variant="ghost" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
