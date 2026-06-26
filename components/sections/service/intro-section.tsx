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
          <span className="cgd-eyebrow text-cta">Overview</span>
          <h2 className="mt-3 cgd-h2 text-balance text-foreground">
            <EditableText path="intro.heading" placeholder="Section heading…">
              {heading}
            </EditableText>
          </h2>
          <div className="mt-6 space-y-4">
            <EditableList<string>
              path="intro.paragraphs"
              items={paragraphs}
              itemTemplate={serviceItemTemplates.paragraph}
              addLabel="Add paragraph"
              getKey={(_p, i) => i}
              renderItem={(paragraph, index) => (
                <p className="cgd-lead text-muted-foreground">
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
