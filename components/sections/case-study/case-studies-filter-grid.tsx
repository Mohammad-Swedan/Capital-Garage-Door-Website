"use client";

import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { CaseStudyCard } from "@/components/sections/case-study/case-study-card";
import { scrollToElement } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";
import type { CaseStudyPage } from "@/types/case-study";

const PAGE_SIZE = 12;

// Canonical job-type order — only types present in the data render as pills, so
// the bar never offers an empty bucket.
const JOB_TYPE_ORDER: readonly string[] = ["Repair", "Replacement", "Installation", "Emergency", "Service"];

interface CaseStudiesFilterGridProps {
  caseStudies: CaseStudyPage[];
}

/**
 * The /case-studies listing: filter by job type + service + suburb, then
 * paginate. Filters combine with AND and every option list/count is derived from
 * the case studies themselves, so the bar never offers an empty bucket. The
 * "All" defaults mean the first page renders immediately; the controls are
 * progressive enhancement over the full ISR list.
 */
export function CaseStudiesFilterGrid({ caseStudies }: CaseStudiesFilterGridProps) {
  const [jobType, setJobType] = useState(""); // "" = all
  const [service, setService] = useState(""); // "" = all
  const [suburb, setSuburb] = useState(""); // "" = all
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const goToPage = (p: number) => {
    setPage(p);
    scrollToElement(topRef.current);
  };

  const jobTypeOptions = useMemo(
    () => JOB_TYPE_ORDER.filter((t) => caseStudies.some((c) => c.jobType === t)),
    [caseStudies],
  );
  const serviceOptions = useMemo(
    () =>
      Array.from(new Set(caseStudies.map((c) => c.service).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [caseStudies],
  );
  const suburbOptions = useMemo(
    () =>
      Array.from(new Set(caseStudies.map((c) => c.suburb).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [caseStudies],
  );

  const filtered = useMemo(
    () =>
      caseStudies.filter(
        (c) =>
          (jobType === "" || c.jobType === jobType) &&
          (service === "" || c.service === service) &&
          (suburb === "" || c.suburb === suburb),
      ),
    [caseStudies, jobType, service, suburb],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const hasFilters = jobType !== "" || service !== "" || suburb !== "";

  const countMatching = (over: { jobType?: string; service?: string; suburb?: string }) => {
    const jt = over.jobType ?? jobType;
    const sv = over.service ?? service;
    const sb = over.suburb ?? suburb;
    return caseStudies.filter(
      (c) =>
        (jt === "" || c.jobType === jt) && (sv === "" || c.service === sv) && (sb === "" || c.suburb === sb),
    ).length;
  };

  const onJobType = (v: string) => {
    setJobType(v);
    setPage(1);
  };
  const onService = (v: string) => {
    setService(v);
    setPage(1);
  };
  const onSuburb = (v: string) => {
    setSuburb(v);
    setPage(1);
  };
  const clearAll = () => {
    setJobType("");
    setService("");
    setSuburb("");
    setPage(1);
  };

  return (
    <section className="bg-background py-14 sm:py-20">
      <Container>
        <div ref={topRef} className="scroll-mt-24" />
        <Reveal>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            All Case Studies
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-6 space-y-4">
          {/* Job type */}
          {jobTypeOptions.length > 0 && (
            <FilterRow label="Type">
              <Pill active={jobType === ""} onClick={() => onJobType("")} count={countMatching({ jobType: "" })}>
                All
              </Pill>
              {jobTypeOptions.map((t) => (
                <Pill key={t} active={jobType === t} onClick={() => onJobType(t)} count={countMatching({ jobType: t })}>
                  {t}
                </Pill>
              ))}
            </FilterRow>
          )}

          {/* Service + suburb + clear */}
          <div className="flex flex-wrap items-center gap-3">
            {serviceOptions.length > 0 && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Service</span>
                <select
                  value={service}
                  onChange={(e) => onService(e.target.value)}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground outline-none transition-colors hover:border-[#0f4e9b]/25 focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="">All services</option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s}>
                      {s} ({countMatching({ service: s })})
                    </option>
                  ))}
                </select>
              </label>
            )}
            {suburbOptions.length > 0 && (
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Suburb</span>
                <select
                  value={suburb}
                  onChange={(e) => onSuburb(e.target.value)}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground outline-none transition-colors hover:border-[#0f4e9b]/25 focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="">All suburbs</option>
                  {suburbOptions.map((s) => (
                    <option key={s} value={s}>
                      {s} ({countMatching({ suburb: s })})
                    </option>
                  ))}
                </select>
              </label>
            )}
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear filters
              </button>
            )}
          </div>
        </Reveal>

        <p className="mt-6 text-sm text-muted-foreground">
          {filtered.length === 0
            ? "No case studies match these filters yet."
            : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length} ${filtered.length === 1 ? "case study" : "case studies"}`}
        </p>

        {pageItems.length > 0 ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((cs, index) => (
              <Reveal key={cs.slug} delay={index * 0.05} className="h-full">
                <CaseStudyCard caseStudy={cs} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Try a different filter — or{" "}
            <button
              type="button"
              onClick={clearAll}
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              show all case studies
            </button>
            .
          </p>
        )}

        {/*
          Crawlable complete index. The visible grid above paginates client-side
          (PAGE_SIZE = 12), so only the first page's links reach the server-rendered
          HTML — leaving the other case studies with no crawlable inbound link from
          their own hub (a 2026-07-24 audit found 8 of 20 unreachable this way).
          This sr-only nav renders EVERY case study's link server-side, so search
          engines discover and pass equity to all of them; screen-reader users get a
          full index too. The links are real and also reachable via the filters above.
        */}
        <nav aria-label="All case studies" className="sr-only">
          <ul>
            {caseStudies.map((cs) => (
              <li key={cs.slug}>
                <a href={`/case-studies/${cs.slug}`}>{cs.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => goToPage(safePage - 1)}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground transition-colors enabled:hover:border-[#0f4e9b]/25 enabled:hover:text-[#0f4e9b] disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm font-medium text-muted-foreground tabular-nums">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => goToPage(safePage + 1)}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold text-foreground transition-colors enabled:hover:border-[#0f4e9b]/25 enabled:hover:text-[#0f4e9b] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "border-[#0f4e9b]/35 bg-[#0f4e9b]/10 text-[#0f4e9b]"
          : "border-border bg-card text-muted-foreground hover:border-[#0f4e9b]/25 hover:text-[#0f4e9b]",
      )}
    >
      {children}
      {typeof count === "number" && <span className="ml-1.5 tabular-nums opacity-60">{count}</span>}
    </button>
  );
}
