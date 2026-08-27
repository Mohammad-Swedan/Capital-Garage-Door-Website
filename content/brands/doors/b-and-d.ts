import type { BrandPage } from "@/types/brand";

/**
 * /b-and-d-garage-doors-perth — B&D is Australia's best-known garage door name, and its Roll-A-Door
 * roller door is the door most often found on established Perth homes from the 1970s through the
 * 2000s. This page owns the LOCAL repair/service/install slice; FAQs mirror the Perth PAA set
 * (docs/marketing/brand-research-2026-08/paa/b-and-d-garage-doors-perth.md). Dealer brand. B&D has
 * been owned by Dulux Group / Nippon Paint since 2019 — noted as a fact, not framed as independent.
 */
export const bAndDGarageDoorsPerth: BrandPage = {
  brand: "b-and-d",
  kind: "door",
  slug: "b-and-d-garage-doors-perth",
  updatedAt: "2026-08-28",
  seo: {
    title: "B&D Garage Doors Perth | Repairs, Service & Installation",
    description:
      "Authorised B&D dealer in Perth for Roll-A-Door and Panelift repairs, servicing and new installs. Same-day fixes, genuine parts. Call for a fixed quote.",
  },
  hero: {
    h1: "B&D Garage Doors in Perth — Roll-A-Door Repairs, Service & New Installs",
    subtitle:
      "Australia's best-known garage door name, kept running by local technicians: same-day Roll-A-Door and Panelift repairs, genuine parts and an honest replacement call.",
    pills: [
      { icon: "Wrench", label: "Same-day B&D repairs" },
      { icon: "ShieldCheck", label: "Authorised dealer" },
      { icon: "BadgeCheck", label: "Genuine parts & springs" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia (founded Sydney, 1946)" },
    { label: "Warranty", value: "10-year manufacturer warranty" },
    { label: "Known for", value: "Roll-A-Door, Panelift & the Designer Series" },
    { label: "Door types", value: "Roller, sectional & commercial" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "B&D garage doors are supplied, installed, serviced and repaired across Perth by Capital Garage Doors, an authorised B&D dealer. Whether it's a worn spring on an older Roll-A-Door or a full Panelift sectional replacement, most faults are fixed in a single same-day visit, and a routine service to keep the door running the way it did when it was new is {{price:service}}.",
  intro: {
    heading: "Why So Many Older Perth Homes Run a B&D Roll-A-Door",
    paragraphs: [
      "B&D has been Australia's best-known garage door name since it was founded in Sydney in 1946, and nowhere is that more visible than on Perth's established brick-and-tile suburbs. The original Roll-A-Door — the compact steel roller door B&D is credited with inventing — became the default fit on homes built through the 1970s, 80s and 90s, and it's still the badge most Perth homeowners picture when they think 'garage door'. That long run in the market is why we still see so many Roll-A-Doors on daily call-outs across the metro area, from Thornlie to Kalamunda.",
      "B&D says it is the only manufacturer that makes both its doors and its openers in-house, and backs new doors and openers with a market-leading 10-year warranty. Alongside the classic Roll-A-Door roller range, the Panelift sectional line (including the Panelift Seville) and the Sheer Panel finish Designer Series cover newer residential builds, while the Series 2 Commercial Roller Door and ToughPanel sectional range extend the same engineering to sheds and small commercial sites. The Controll-A-Door Power Drive and Smart Pro opener ranges, paired with the B&D App, add smartphone control to compatible doors.",
      "Age is the main thing working against an older Roll-A-Door: decades of use wear the torsion spring, corrode the curtain guides and stretch the Nylofelt running strips B&D pioneered. None of that is unusual — it is simply what a 20 or 30-year-old roller door needs, and it is almost always a straightforward same-day repair rather than a reason to replace the door. Newer Panelift sectional and Designer Series doors face different age-related wear: hinges, rollers and the opener's travel limits are the usual wear points on any sectional door, which is why we check the whole door — not just the fault reported — on every call-out.",
    ],
  },
  services: [
    {
      title: "B&D door repairs",
      description: "Springs, cables, rollers, guides and Roll-A-Door curtain faults diagnosed and fixed on the day, with common B&D parts carried on board.",
      icon: "Wrench",
      href: "/garage-door-repairs-perth",
    },
    {
      title: "B&D panel replacement",
      description: "Dented or corroded Roll-A-Door and Panelift panels matched and replaced without needing to re-do the whole door structure.",
      icon: "LayoutPanelTop",
      href: "/garage-door-panel-replacement-perth",
    },
    {
      title: "New B&D door install",
      description: "Supply and installation of a new B&D Roll-A-Door, Panelift or Designer Series door as an authorised dealer, sized to your opening.",
      icon: "DoorOpen",
      href: "/garage-door-installation-perth",
    },
    {
      title: "Annual B&D service",
      description: "Springs, tracks, rollers and running strips checked, lubricated and rebalanced so an older Roll-A-Door keeps running smoothly and safely.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  models: [
    { name: "Roll-A-Door", type: "Roller door", tech: "Roll-A-Door Neo & Roll-A-Door Secure", note: "B&D's original roller door — the one fitted to most established Perth homes." },
    { name: "Panelift", type: "Sectional door", tech: "Incl. Panelift Seville", note: "B&D's sectional range, common on homes built from the 2000s on." },
    { name: "Designer Series", type: "Sectional door", tech: "Sheer Panel finish", note: "A styled sectional finish for a more architectural look." },
    { name: "Series 2 Commercial Roller Door", type: "Commercial roller door", note: "B&D's heavier-duty roller line for sheds, workshops and small commercial sites." },
  ],
  faults: [
    { label: "Roll-A-Door won't open", icon: "Power", problemSlug: "garage-door-wont-open" },
    { label: "Curtain jumped its guides", icon: "AlertTriangle", problemSlug: "garage-door-off-track" },
    { label: "Door stuck partway up", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Broken torsion spring or cable", icon: "Unplug", problemSlug: "garage-door-spring-or-cable-broken" },
    { label: "Grinding, screeching roller door", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  parts: {
    heading: "Genuine B&D Panels, Curtains & Parts",
    paragraphs: [
      "As an authorised B&D dealer we can order genuine Roll-A-Door curtain sections, Panelift panels and Nylofelt running strips to match your existing door, so a single damaged or corroded section doesn't force a full replacement. Torsion springs, cables and hardware are sourced to the correct rating for your door's size and weight, matching how it was originally set up.",
      "For a Roll-A-Door old enough that its exact colour or profile is no longer made, we tell you honestly whether a close match is available or whether the door has reached the point where a new one is the better value. For a full comparison of new-door options across every brand we install, see /garage-doors-perth.",
    ],
  },
  pricingPins: ["spring", "cable", "damaged", "service", "new-standard"],
  costIntro:
    "B&D work is priced from the same guide list as every door we touch: a spring or cable repair on a Roll-A-Door covers diagnosis and the part, and a new B&D door supplied and installed starts at {{price:new-standard}}. You get the figure in writing before any work starts.",
  costFactors: [
    "Door type and size — Roll-A-Door roller, Panelift sectional or commercial roller, single or double",
    "Age and condition — an older Roll-A-Door may need springs, guides and running strips together",
    "Panel finish — plain steel versus the Designer Series Sheer Panel look",
    "Whether the B&D opener and Smart Pro/App setup need attention alongside the door",
  ],
  faqs: [
    {
      question: "How much is a B&D garage door in Perth?",
      answer:
        "A new B&D door supplied and installed in Perth starts at {{price:new-standard}}, covering a standard Roll-A-Door or Panelift sectional with tracks, hardware and removal of the old door. The Designer Series and larger or commercial doors cost more, and we confirm the exact figure for your size and finish before booking any work.",
    },
    {
      question: "How much does it cost to replace a garage door in Perth?",
      answer:
        "For a B&D like-for-like replacement, expect a figure from around {{price:new-standard}} for a standard roller or sectional door supplied and installed, rising for larger openings, insulated panels or a Designer Series finish. We always quote a fixed price for your exact door before any work starts, so there's no guessing.",
    },
    {
      question: "What is the best garage door brand in Australia?",
      answer:
        "B&D is Australia's best-known and most widely fitted garage door brand, and it's a genuinely solid choice — but 'best' really depends on the door type and finish you want. We install and repair B&D alongside Steel-Line, Gliderol and other quality brands, and we'll give you a straight comparison for your home rather than pushing one name.",
    },
    {
      question: "Are B&D garage doors good?",
      answer:
        "Yes — B&D has been Australia's leading garage door brand for decades and backs new doors and openers with a market-leading warranty. Like any door, an older Roll-A-Door eventually needs new springs, guides or running strips, but that's routine wear rather than a fault with the brand, and it's almost always a same-day repair.",
    },
    {
      question: "What are some common problems with B&D garage doors?",
      answer:
        "On older Roll-A-Doors, the most common calls are a worn torsion spring, a curtain that has jumped its guides, or stretched running strips causing the door to run unevenly. On newer Panelift sectional doors, a dented panel or a Smart Pro opener that has stopped responding to remotes are the usual faults — most are fixed in one visit.",
    },
    {
      question: "What is the average cost to install a new garage door?",
      answer:
        "A new door installed in Perth typically starts around {{price:new-standard}} for a standard Roll-A-Door or sectional door, including tracks, hardware and disposal of the old one. Larger openings, insulated panels or a Designer Series finish push the figure up — we give you an exact, fixed quote for your home before work begins.",
    },
    {
      question: "Do you repair B&D Roll-A-Doors that weren't installed by you?",
      answer:
        "Yes. We repair, service and replace B&D doors regardless of who originally installed them — most of our Roll-A-Door call-outs are on doors fitted by a builder or another dealer decades ago. Bring us the age and any model details you can find and we'll carry the parts most likely to be needed.",
    },
    {
      question: "Can you still get parts for an older B&D Roll-A-Door?",
      answer:
        "In most cases, yes — springs, cables, rollers and Nylofelt running strips are common consumable parts we stock or order for Roll-A-Doors of any age. Curtain and colour matching gets harder the older the door is, and we'll tell you plainly if a full-panel or new-door replacement makes more sense than chasing a discontinued finish.",
    },
  ],
  relatedBrands: ["steel-line", "gliderol", "centurion", "danmar"],
  relatedServices: [
    { label: "All garage door brands in Perth", href: "/garage-door-brands-perth" },
    { label: "Garage door repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Roller door repairs Perth", href: "/roller-door-repairs-perth" },
    { label: "Garage door panel replacement", href: "/garage-door-panel-replacement-perth" },
    { label: "B&D garage door motors", href: "/b-and-d-garage-door-motors-perth" },
    { label: "Repair cost guide", href: "/garage-door-repair-cost-perth" },
  ],
  serviceAreas: ["Thornlie", "Midland", "Cannington", "Gosnells", "Maddington", "Bayswater", "Belmont", "Kalamunda"],
  cta: {
    heading: "B&D Door Playing Up? Get It Sorted Today",
    subtitle: "Tell us the fault and your suburb — you'll get a same-day slot and a fixed price before we start.",
  },
};
