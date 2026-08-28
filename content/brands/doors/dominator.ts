import type { BrandPage } from "@/types/brand";

/**
 * /dominator-garage-doors-perth — Dominator is manufactured in Christchurch and Auckland, New
 * Zealand, and sold into Australia through state-based supply networks; no confirmed Perth/WA
 * supplier was found in research (docs/marketing/brand-research-2026-08/entities/dominator.md), so
 * this page is built around Capital servicing Dominator doors already in Perth, not a supply
 * arrangement. Not a supply-partner brand for this page — keep this file free of that kind of
 * language (see brief rule 16). The 2005 B&D-acquisition claim in the research file is explicitly
 * unconfirmed background, not stated here. FAQs mirror the Perth PAA set
 * (docs/marketing/brand-research-2026-08/paa/dominator-garage-doors-perth.md).
 */
export const dominatorGarageDoorsPerth: BrandPage = {
  brand: "dominator",
  kind: "door",
  slug: "dominator-garage-doors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "Dominator Garage Doors Perth | Repairs, Service & Install",
    description:
      "Dominator garage door repairs, servicing and replacement across Perth. Same-day visits, fixed quotes, genuine panels sourced fast. Call today.",
  },
  hero: {
    h1: "Dominator Garage Doors in Perth — Repairs, Service & New Door Installs",
    subtitle:
      "New Zealand-manufactured Milano, Nevada, Sierra and Kinetic doors serviced across Perth: springs re-tensioned, panels matched where possible, and an honest call on repair versus replace.",
    pills: [
      { icon: "Wrench", label: "Same-day Dominator repairs" },
      { icon: "ShieldCheck", label: "Panel matching where possible" },
      { icon: "Building2", label: "NZ-manufactured door range" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "New Zealand (Christchurch & Auckland)" },
    { label: "Known for", value: "Milano, Nevada, Sierra & Kinetic sectional doors" },
    { label: "Door types", value: "Sectional, roller, tilt & commercial" },
    { label: "Smart control", value: "MyQ compatible on some opener models" },
    { label: "What we do", value: "Service, repair & replace" },
  ],
  directAnswer:
    "Dominator garage doors — the New Zealand-manufactured Milano, Nevada, Sierra and Kinetic sectional ranges — are serviced, repaired and replaced across Perth by Capital Garage Doors. Most faults, from a spring that's lost tension to a track knocked out of alignment, are diagnosed and fixed in one same-day visit, and a full service to keep a Dominator door balanced and running smoothly is {{price:service}}.",
  intro: {
    heading: "Dominator Doors in Perth — An Imported Range, Serviced Locally",
    paragraphs: [
      "Dominator is a New Zealand-manufactured door brand, built at facilities in Christchurch and Auckland and sold into the Australian market through state-based supply networks rather than a single national retailer. In Perth that means Dominator doors turn up less often than the big Australian-made names, but they're far from rare — homeowners who've moved from the eastern states, or who bought through an interstate-linked network, often have a Milano, Nevada or Sierra sectional door fitted to their garage. Wherever it came from, we service, repair and replace it the same as any other brand.",
      "The Dominator range covers steel and insulated sectional doors in the Milano, Nevada and Sierra styles, the folded Kinetic sectional line, and roller, tilt and industrial doors for larger openings. New doors and openers are backed by Dominator's own Total Confidence Warranty, and some opener models support MyQ smartphone control. Because the doors are imported rather than made in WA, matching an exact panel finish can take a little longer than for a locally manufactured brand — something we always flag honestly before quoting a repair versus a straightforward replacement.",
      "The faults we see on Dominator doors are the same ones any sectional or roller door develops with age: a spring that's lost its tension, rollers worn from years of use, or a track that's been knocked slightly out of true. None of that is specific to the brand — it's ordinary wear, and it's almost always a straightforward same-day repair. Where a Dominator door has genuinely reached the end of its life, or panel matching isn't practical for an older import, we quote a clear replacement rather than chase parts that take weeks to source.",
    ],
  },
  services: [
    {
      title: "Dominator door repairs",
      description: "Springs, cables, rollers, tracks and Kinetic curtain faults diagnosed and fixed on the day, with common parts carried on board.",
      icon: "Wrench",
      href: "/garage-door-repairs-perth",
    },
    {
      title: "Dominator panel replacement",
      description: "Damaged Milano, Nevada, Sierra or Kinetic panels sourced and matched to your existing door wherever possible, with import lead times on an exact profile explained honestly upfront.",
      icon: "LayoutPanelTop",
      href: "/garage-door-panel-replacement-perth",
    },
    {
      title: "New Dominator-style door install",
      description: "A new sectional door supplied and installed when repair no longer stacks up, sized to your garage's exact opening.",
      icon: "DoorOpen",
      href: "/garage-door-installation-perth",
    },
    {
      title: "Annual door service",
      description: "Springs, tracks, rollers and hardware checked, lubricated and rebalanced every year so the Dominator door keeps running smoothly, safely and quietly for years to come.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "Milano", type: "Sectional door", note: "One of Dominator's core Australian-market sectional door styles." },
    { name: "Nevada", type: "Sectional door", note: "A steel sectional door style in the Australian Dominator range." },
    { name: "Sierra", type: "Sectional door", note: "The third of Dominator's Australian-market sectional door styles." },
    { name: "Kinetic", type: "Sectional door", note: "Dominator's folded sectional range, more prominent on the New Zealand site." },
  ],
  faults: [
    { label: "Door won't open at all", icon: "Power", problemSlug: "garage-door-wont-open" },
    { label: "Won't close fully or reverses", icon: "AlertTriangle", problemSlug: "garage-door-wont-close" },
    { label: "Broken spring or frayed cable", icon: "Cable", problemSlug: "garage-door-spring-or-cable-broken" },
    { label: "Door has jumped its tracks", icon: "Unplug", problemSlug: "garage-door-off-track" },
    { label: "Door stops part-way up", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Grinding or rattling on the way up", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  parts: {
    heading: "Panel Matching, Genuine Hardware — Or an Honest New-Door Quote",
    paragraphs: [
      "Matching a damaged panel on an imported Dominator door takes a little more legwork than a locally made brand, since Milano, Nevada, Sierra and Kinetic sections aren't stocked on the shelf in WA — but it's usually achievable, and we source the correct profile and colour before quoting. Springs, cables, rollers and tracks are replaced with correctly rated components for the door's size and weight, regardless of who originally supplied it.",
      "A new door is the honest answer when an older Dominator's exact panel or finish can no longer be sourced, or the door has simply reached the end of its working life. In those cases we quote a straightforward replacement in a comparable style, or point you to the full range of doors we supply and install across Perth at /garage-doors-perth — whichever suits your home and budget.",
    ],
  },
  pricingPins: ["spring", "cable", "damaged", "service", "new-standard"],
  costIntro:
    "Dominator repairs are priced from the same guide list we use on every Perth garage door: a broken spring is {{price:spring}}, a snapped cable is {{price:cable}}, and a damaged panel is quoted once we've seen it, typically from {{price:damaged}}. A full service is {{price:service}}, and a comparable new sectional door installed is from {{price:new-standard}}. You get the figure in writing before any work starts.",
  costFactors: [
    "Whether the fault is a part (spring, cable, roller) or a full panel replacement",
    "How readily a matching Milano, Nevada, Sierra or Kinetic panel can be sourced",
    "Door size and weight — insulated and double sectional doors cost more to match",
    "Whether tracks and hardware need straightening before the door will run true again",
  ],
  faqs: [
    {
      question: "How much does a Dominator garage door cost in Perth?",
      answer:
        "A comparable new sectional door installed in Perth starts from {{price:new-standard}}, covering the door, tracks, hardware and removal of the old one. Because Dominator is manufactured in New Zealand rather than stocked locally, lead times on a genuine Dominator panel or full door can run longer than for a Perth-made brand — we'll confirm exact pricing and availability once we've measured your opening.",
    },
    {
      question: "What is the best garage door brand in Australia?",
      answer:
        "There's no single 'best' brand — it depends on the door type, budget and how the door will be used. Dominator's Milano, Nevada, Sierra and Kinetic sectional doors are solidly built and backed by a Total Confidence Warranty, and we service them alongside locally made brands like Danmar and Steel-Line. We'll give you an honest comparison for your home rather than push one name.",
    },
    {
      question: "How does Dominator compare to Gliderol and B&D for a Perth garage door?",
      answer:
        "Gliderol and B&D are Australian-manufactured and widely stocked in WA, so parts and panel matching tend to be quicker for those brands. Dominator is manufactured in New Zealand and sold through state-based supply networks, so it's less common in Perth, but the doors themselves are well made — the main practical difference is how quickly we can source a matching panel, not the quality of the door.",
    },
    {
      question: "Do you also service Dominator garage door openers?",
      answer:
        "Yes — alongside the Milano, Nevada, Sierra and Kinetic door ranges, Dominator sells openers including MyQ-compatible models, and we repair and replace those too. If your Dominator opener has stopped responding to remotes or won't lift the door, book a technician the same way you would for a door fault and we'll diagnose it on the day.",
    },
    {
      question: "Can you supply a new Dominator garage door in Perth, or only service existing ones?",
      answer:
        "We primarily service, repair and replace existing Dominator doors across Perth rather than operating as a Dominator supply outlet. If you'd like a new door in a similar sectional style, we supply and install a comparable range — see our full new-door range for Perth — and we're upfront if a genuine Dominator panel needs to be specially sourced.",
    },
    {
      question: "Do you service Dominator doors across all of Perth?",
      answer:
        "Yes — technicians cover the whole Perth metro area, including Stirling, Osborne Park, Malaga, Rockingham, Port Kennedy, Mandurah, Kalamunda and Huntingdale, with same-day slots on most days. Call with your suburb and a description of the fault and we'll give you an arrival window and a fixed price before we start.",
    },
  ],
  relatedBrands: ["danmar", "steel-line", "gliderol", "perth-windsor-doors"],
  relatedServices: [
    { label: "All garage door brands in Perth", href: "/garage-door-brands-perth" },
    { label: "Garage door repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Garage door panel replacement", href: "/garage-door-panel-replacement-perth" },
    { label: "New garage door installation Perth", href: "/garage-door-installation-perth" },
    { label: "Garage door repair cost guide", href: "/garage-door-repair-cost-perth" },
  ],
  serviceAreas: ["Stirling", "Osborne Park", "Malaga", "Rockingham", "Port Kennedy", "Mandurah", "Kalamunda", "Huntingdale"],
  cta: {
    heading: "Dominator Door Playing Up? Get It Sorted Today",
    subtitle: "Tell us the fault and your suburb — you'll get a same-day slot and a fixed price before we start.",
  },
};
