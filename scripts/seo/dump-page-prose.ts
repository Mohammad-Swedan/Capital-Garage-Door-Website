/**
 * Dump the prose of a local content page as plain text, for the cross-domain
 * duplication check before a page is imported into the CMS:
 *
 *   npx tsx scripts/seo/dump-page-prose.ts <service-page-slug> > draft.txt
 *   py -3.12 "<perth-garage-door-seo skill>/scripts/check_dup.py" --text-file draft.txt --against <sister sites>
 *
 * Reads the servicePages registry only (the page types this program creates);
 * extend `sources` if another registry needs the same check.
 */
import { servicePages } from "../../content/service-pages";
import { serviceSuburbPages } from "../../content/service-suburb-pages";

const slug = process.argv[2];
const suburb = serviceSuburbPages.find((p) => p.slug === slug);
if (suburb) {
  const blocks = [
    suburb.hero.subtitle,
    suburb.directAnswer,
    ...suburb.localIntro,
    ...suburb.availableServices.flatMap((s) => [s.title, s.description]),
    ...suburb.problems.flatMap((p) => [p.title, p.description]),
    suburb.costGuidance.intro,
    ...suburb.costGuidance.factors,
    ...suburb.whyChooseUs.flatMap((w) => [w.title, w.description]),
    ...suburb.faqs.flatMap((f) => [f.question, f.answer]),
  ];
  process.stdout.write(blocks.join("\n\n") + "\n");
  process.exit(0);
}
const page = servicePages.find((p) => p.slug === slug);
if (!page) {
  console.error(`unknown service or suburb page slug: ${slug}`);
  process.exit(1);
}
const blocks: string[] = [
  page.hero.h1,
  page.hero.subtitle,
  page.directAnswer,
  page.intro.heading,
  ...page.intro.paragraphs,
  ...page.problems.map((p) => p.label),
  ...page.includedItems,
  ...page.processSteps.flatMap((s) => [s.title, s.description]),
  page.costGuidance.intro,
  ...page.whyChoose.flatMap((w) => [w.title, w.description]),
  ...page.relatedServices.map((r) => r.description),
  ...page.faqs.flatMap((f) => [f.question, f.answer]),
  page.cta.heading,
  page.cta.subtitle,
];
process.stdout.write(blocks.join("\n\n") + "\n");
