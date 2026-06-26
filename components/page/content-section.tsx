"use client";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/page/section-heading";
import { EditableText, EditableList } from "@/components/admin/editor/editable";

interface ContentSectionProps {
  eyebrow?: string;
  title: string;
  /** Body copy as an array of paragraphs. */
  paragraphs: string[];
}

/** Reusable titled prose block (e.g. the local intro). Real HTML for SEO. */
export function ContentSection({ eyebrow, title, paragraphs }: ContentSectionProps) {
  return (
    <section className="bg-background">
      <Container className="py-12 sm:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} className="max-w-3xl" />
        <div className="mt-6 flex max-w-3xl flex-col gap-4">
          <EditableList<string>
            path="localIntro"
            items={paragraphs}
            itemTemplate={() => ""}
            addLabel="Add paragraph"
            getKey={(_p, i) => i}
            renderItem={(paragraph, i) => (
              <Reveal delay={0.05 * (i + 1)}>
                <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                  <EditableText path={`localIntro[${i}]`} placeholder="Paragraph…">
                    {paragraph}
                  </EditableText>
                </p>
              </Reveal>
            )}
          />
        </div>
      </Container>
    </section>
  );
}
