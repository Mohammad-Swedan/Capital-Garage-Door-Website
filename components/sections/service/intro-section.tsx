import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

interface IntroSectionProps {
  heading: string;
  paragraphs: string[];
}

/** Service-overview prose block — real server-rendered HTML for SEO/AEO, answering what/who/when/why for the service. */
export function IntroSection({ heading, paragraphs }: IntroSectionProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
          <div className="mt-5 space-y-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
