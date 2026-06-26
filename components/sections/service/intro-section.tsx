"use client";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableText, EditableList } from "@/components/admin/editor/editable";
import { serviceItemTemplates } from "@/components/admin/editor/item-templates";

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
            <EditableText path="intro.heading" placeholder="Section heading…">
              {heading}
            </EditableText>
          </h2>
          <div className="mt-5 space-y-4">
            <EditableList<string>
              path="intro.paragraphs"
              items={paragraphs}
              itemTemplate={serviceItemTemplates.paragraph}
              addLabel="Add paragraph"
              getKey={(_p, i) => i}
              renderItem={(paragraph, index) => (
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  <EditableText path={`intro.paragraphs[${index}]`} placeholder="Paragraph…">
                    {paragraph}
                  </EditableText>
                </p>
              )}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
