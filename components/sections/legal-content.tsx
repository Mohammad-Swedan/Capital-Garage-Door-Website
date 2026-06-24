import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

interface LegalContentProps {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}

/** Shared layout for the /privacy and /terms pages — plain-language legal copy in the site's typography. */
export function LegalContent({ title, updatedAt, intro, sections }: LegalContentProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Reveal>
          <h1 className="text-balance font-display text-[clamp(1.75rem,5vw,2.5rem)] leading-[1.1] font-black tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {updatedAt}</p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-8">
          {sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 0.03}>
              <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.paragraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-1 flex flex-col gap-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-base leading-relaxed text-muted-foreground">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
