"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  EditableText,
  EditableList,
  EditableIcon,
} from "@/components/admin/editor/editable";
import type { ComparisonOption } from "@/types/comparison-page";

interface OptionSectionProps {
  option: ComparisonOption;
  /** "subtle" tints the section background so Option B visually separates from Option A instead of looking like a repeated block. */
  tone?: "default" | "subtle";
  /** Draft path prefix for this option's leaves, e.g. "optionA" or "optionB". */
  pathPrefix?: string;
}

const blankString = (): string => "";

/** Reused for both Option A and Option B — name, summary, benefits vs limitations, and best-use cases. */
export function OptionSection({ option, tone = "default", pathPrefix = "optionA" }: OptionSectionProps) {
  const icons = { Resolved: resolveIcon(option.icon) };

  return (
    <section className={cn("py-14 sm:py-20", tone === "subtle" ? "bg-muted/30" : "bg-background")}>
      <Container>
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <EditableIcon path={`${pathPrefix}.icon`}>
                <icons.Resolved className="h-5 w-5" aria-hidden="true" />
              </EditableIcon>
            </span>
            <h2 className="cgd-h2 text-balance text-foreground">
              <EditableText path={`${pathPrefix}.name`} singleLine placeholder="Option name…">
                {option.name}
              </EditableText>
            </h2>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            <EditableText path={`${pathPrefix}.summary`} placeholder="Option summary…">
              {option.summary}
            </EditableText>
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-emerald-600/15 bg-emerald-600/5 p-6">
              <h3 className="font-heading text-base font-semibold text-emerald-700">Benefits</h3>
              <ul className="mt-4 space-y-3">
                <EditableList<string>
                  path={`${pathPrefix}.benefits`}
                  items={option.benefits}
                  itemTemplate={blankString}
                  addLabel="Add benefit"
                  getKey={(_item, i) => i}
                  renderItem={(item, index) => (
                    <li className="flex items-start gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" aria-hidden="true" />
                      <EditableText path={`${pathPrefix}.benefits[${index}]`} placeholder="Benefit…">
                        {item}
                      </EditableText>
                    </li>
                  )}
                />
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-border bg-muted/40 p-6">
              <h3 className="cgd-h3 text-base text-foreground">Limitations</h3>
              <ul className="mt-4 space-y-3">
                <EditableList<string>
                  path={`${pathPrefix}.limitations`}
                  items={option.limitations}
                  itemTemplate={blankString}
                  addLabel="Add limitation"
                  getKey={(_item, i) => i}
                  renderItem={(item, index) => (
                    <li className="flex items-start gap-2.5 text-sm text-foreground">
                      <XCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <EditableText path={`${pathPrefix}.limitations[${index}]`} placeholder="Limitation…">
                        {item}
                      </EditableText>
                    </li>
                  )}
                />
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-6">
          <p className="text-sm font-semibold text-foreground">Best for:</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <EditableList<string>
              path={`${pathPrefix}.bestFor`}
              items={option.bestFor}
              itemTemplate={blankString}
              addLabel="Add best-for"
              getKey={(_item, i) => i}
              renderItem={(item, index) => (
                <Badge variant="secondary" className="h-auto whitespace-normal px-3 py-1.5 text-xs">
                  <EditableText path={`${pathPrefix}.bestFor[${index}]`} singleLine placeholder="Best for…">
                    {item}
                  </EditableText>
                </Badge>
              )}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
