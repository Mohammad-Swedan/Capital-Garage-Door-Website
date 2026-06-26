"use client";

import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { EditableText, EditableList } from "@/components/admin/editor/editable";

interface CallTechnicianProps {
  heading?: string;
  signs: string[];
}

/** Signs that warrant a professional call-out rather than a DIY attempt. */
export function CallTechnician({ heading = "When to Call a Technician", signs }: CallTechnicianProps) {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Call a technician straight away if any of the following apply:
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            <EditableList<string>
              path="callTechnicianSigns"
              items={signs}
              itemTemplate={() => ""}
              addLabel="Add sign"
              getKey={(_s, i) => i}
              renderItem={(sign, i) => (
                <li className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-foreground">
                  <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" aria-hidden="true" />
                  <EditableText path={`callTechnicianSigns[${i}]`} placeholder="Warning sign…">
                    {sign}
                  </EditableText>
                </li>
              )}
            />
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
