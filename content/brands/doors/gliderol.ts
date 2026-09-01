import type { BrandPage } from "@/types/brand";

/**
 * /gliderol-garage-doors-perth — Gliderol, Australian-owned since 1974, is a roller-door
 * specialist manufacturing across Australia's major capital cities, and is a common fit across
 * Perth's northern suburbs on project homes from the 1980s–2000s building boom. This page owns the LOCAL
 * repair/service/install slice; FAQs mirror the Perth PAA set
 * (docs/marketing/brand-research-2026-08/paa/gliderol-garage-doors-perth.md). Dealer brand.
 * NOTE: gliderol.com.au blocked direct fetch (403) during research, so only one range
 * (Essentials Series) could be verified — per controller ruling, `models` is omitted entirely
 * rather than shipped as a single-entry section.
 */
export const gliderolGarageDoorsPerth: BrandPage = {
  brand: "gliderol",
  kind: "door",
  slug: "gliderol-garage-doors-perth",
  updatedAt: "2026-09-01",
  seo: {
    title: "Gliderol Garage Doors Perth | Repairs, Service & Install",
    description:
      "Authorised Gliderol dealer in Perth for roller door repairs, servicing and new installs. Same-day fixes, genuine parts. Call for a fixed quote.",
  },
  hero: {
    h1: "Gliderol Garage Doors in Perth — Repairs, Servicing & New Installs",
    subtitle:
      "Australian-owned since 1974, kept running by local technicians: same-day roller and sectional door repairs, genuine parts and an honest replacement call.",
    pills: [
      { icon: "Wrench", label: "Same-day Gliderol repairs" },
      { icon: "ShieldCheck", label: "Authorised dealer" },
      { icon: "BadgeCheck", label: "Genuine curtain & spring parts" },
      { icon: "MapPin", label: "All Perth suburbs" },
    ],
  },
  quickFacts: [
    { label: "Origin", value: "Australia (since 1974)" },
    { label: "Made in", value: "Australian owned & manufactured" },
    { label: "Known for", value: "Essentials Series roller doors & sectional ranges" },
    { label: "Door types", value: "Roller & sectional" },
    { label: "What we do", value: "Supply, install, service & repair" },
  ],
  directAnswer:
    "Gliderol garage doors are supplied, installed, serviced and repaired across Perth by Capital Garage Doors, an authorised Gliderol dealer for both the roller and sectional ranges. Whether it's a corroded curtain guide on an older roller door, a Genesis Series opener that has stopped responding on a sectional door, or a full door replacement, most faults are fixed in a single same-day visit, and a routine service to keep the curtain, springs and track running smoothly is {{price:service}}.",
  intro: {
    heading: "Why Gliderol Roller Doors Are Common Across Perth's North",
    paragraphs: [
      "Australian-owned since 1974, Gliderol built its name on steel roller doors and now manufactures across production facilities in Australia's major capital cities. That history shows up clearly in Perth's northern suburbs, where project homes built through the 1980s, 90s and 2000s boom in areas around Joondalup, Clarkson and the wider northern corridor commonly carry a Gliderol curtain — an affordable, no-fuss roller door that has quietly done its job for decades without needing a full replacement. It's a name many Perth homeowners recognise from their own street long before they need a repair.",
      "Beyond the Essentials Series roller doors we see most often, Gliderol's range extends to sectional doors offered with window and motor upgrade options, plus its own opener lines — the Genesis Series for sectional doors and the Glidermatic GRD Heavy Duty & Dual for roller doors. That breadth means a technician can usually match both the door and its motor to the same brand rather than mixing in an unrelated opener, which keeps warranty terms and parts sourcing simpler for the homeowner.",
      "Decades of Perth sun and salt air are hard on any roller door, and Gliderol curtains are no exception: guides corrode, torsion springs lose tension, and the curtain can start binding or jumping in its tracks. None of that reflects badly on the door — it's simply what a roller door this age needs, and it's almost always a straightforward same-day fix. Sectional doors generally face a different set of age-related wear: hinges loosen, rollers wear and the opener's travel limits can drift, which is why our technicians check the door and its opener together rather than treating the two as separate jobs.",
    ],
  },
  services: [
    {
      title: "Gliderol door repairs",
      description: "Springs, cables, guides, rollers and curtain faults diagnosed and fixed on the day, with common Gliderol parts carried on board.",
      icon: "Wrench",
      href: "/garage-door-repairs-perth",
    },
    {
      title: "Gliderol panel replacement",
      description: "Damaged or corroded roller curtain sections and sectional panels matched and replaced without needing to re-do the whole door.",
      icon: "LayoutPanelTop",
      href: "/garage-door-panel-replacement-perth",
    },
    {
      title: "New Gliderol door install",
      description: "Supply and installation of a new Gliderol roller or sectional door as an authorised dealer, sized and finished to your opening.",
      icon: "DoorOpen",
      href: "/garage-door-installation-perth",
    },
    {
      title: "Annual Gliderol service",
      description: "Springs, tracks, guides and rollers checked, lubricated and rebalanced so an older roller door keeps running smoothly and safely.",
      icon: "ShieldCheck",
      href: "/garage-door-maintenance-perth",
    },
  ],
  faults: [
    { label: "Gliderol roller door won't open", icon: "Power", problemSlug: "garage-door-wont-open" },
    { label: "Curtain binding or off its guides", icon: "AlertTriangle", problemSlug: "garage-door-off-track" },
    { label: "Door stuck partway up", icon: "MoveVertical", problemSlug: "garage-door-stuck-halfway" },
    { label: "Broken torsion spring or cable", icon: "Unplug", problemSlug: "garage-door-spring-or-cable-broken" },
    { label: "Grinding or screeching roller door", icon: "Volume2", problemSlug: "noisy-garage-door" },
  ],
  parts: {
    heading: "Genuine Gliderol Curtain, Guides & Parts",
    paragraphs: [
      "As an authorised Gliderol dealer we can order genuine curtain sections, guides and sectional panels to match your existing door, so a corroded or damaged section doesn't force a full replacement. Torsion springs, cables and hardware are sourced to the correct rating for your door's size and weight, matching how it was originally installed.",
      "Where a curtain profile or colour is old enough that an exact match isn't available, we tell you honestly rather than fitting something that won't line up properly. For a full comparison of new-door options across every brand we install, see /garage-doors-perth.",
    ],
  },
  pricingPins: ["spring", "cable", "damaged", "service", "new-standard"],
  costIntro:
    "Gliderol work is priced from the same guide list as every door we touch: a spring or cable repair on a roller door covers diagnosis and the part, and a new Gliderol door supplied and installed starts at {{price:new-standard}}. You get the figure in writing before any work starts.",
  costFactors: [
    "Door type and size — roller or sectional, and single or double width",
    "Age and condition — an older curtain may need guides and springs attended to together",
    "Whether window or motor upgrade options are wanted on a sectional replacement",
    "Whether the opener needs attention alongside the door itself",
  ],
  faqs: [
    {
      question: "Which is better — Gliderol or B&D garage doors?",
      answer:
        "Both are established Australian dealer brands and we service and install each of them — the better choice usually comes down to door type and finish rather than one brand beating the other outright. Gliderol is a strong, straightforward roller-door option; B&D offers a wider range including its Roll-A-Door and Panelift sectional lines. We'll give you a straight comparison for your opening.",
    },
    {
      question: "What are some common problems with Gliderol garage doors?",
      answer:
        "The faults we see most on Gliderol roller doors are corroded or misaligned curtain guides, a torsion spring that has lost tension, and rollers that have worn enough to make the door bind or run unevenly. On sectional models, a motor that has stopped responding is the other common call — most of these are same-day repairs.",
    },
    {
      question: "How much is a Gliderol garage door in Perth?",
      answer:
        "A new Gliderol door supplied and installed in Perth starts at {{price:new-standard}}, covering a standard Essentials Series roller door or sectional door with tracks, hardware and removal of the old one. Sectional doors with window or motor upgrade options cost more — we confirm the exact figure for your opening before booking any work.",
    },
    {
      question: "Are Gliderol garage doors good?",
      answer:
        "Yes — Gliderol has been an Australian-owned manufacturer since 1974 and its roller doors are a solid, no-fuss option that holds up well when serviced. Like any steel roller door in Perth's climate, guides and springs eventually wear, but that's routine maintenance rather than a fault with the brand, and it's almost always a same-day fix.",
    },
    {
      question: "What is the best garage door brand in Australia?",
      answer:
        "There isn't a single 'best' brand — B&D, Steel-Line, Gliderol and Centurion are all established Australian names we install and repair, and the right one depends on your door type, budget and finish. We'll walk you through the real differences for your home rather than pushing one brand over another.",
    },
    {
      question: "Where are Gliderol garage doors made?",
      answer:
        "Gliderol describes itself as an Australian-owned manufacturing company, a name it says has been trusted since 1974, with production facilities in each of Australia's major capital cities. That local manufacturing base covers its full range, from the Essentials Series roller doors most common on Perth homes to its sectional doors and opener lines. We can confirm exact model details for your door when we quote a repair, service or replacement.",
    },
    {
      question: "Do you service Gliderol doors installed by someone else?",
      answer:
        "Yes. We repair, service and replace Gliderol doors regardless of who originally supplied and fitted them — most of our Gliderol call-outs are on doors that came with the house. Bring us the age and any details you have and we'll carry the curtain and spring parts most likely to be needed.",
    },
    {
      question: "Can you still get parts for an older Gliderol roller door?",
      answer:
        "In most cases, yes — springs, cables, rollers and guides are common consumable parts we stock or order for Gliderol roller doors of any age. Curtain colour matching gets harder the older the door is, and we'll tell you plainly if a full-curtain or new-door replacement is the better value than chasing a discontinued finish.",
    },
  ],
  relatedBrands: ["steel-line", "b-and-d", "centurion", "taurean"],
  relatedServices: [
    { label: "All garage door brands in Perth", href: "/garage-door-brands-perth" },
    { label: "Garage door repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Roller door repairs Perth", href: "/roller-door-repairs-perth" },
    { label: "Roller doors Perth", href: "/roller-doors-perth" },
    { label: "Gliderol garage door motors", href: "/gliderol-garage-door-motors-perth" },
    { label: "Repair cost guide", href: "/garage-door-repair-cost-perth" },
  ],
  serviceAreas: ["Joondalup", "Clarkson", "Padbury", "Kingsley", "Duncraig", "Stirling", "Osborne Park", "Malaga"],
  productImage: {
    src: "https://jadara-hub.b-cdn.net/capital-garage-door/brands/gliderol-door-service.webp",
    width: 1600,
    height: 896,
    alt: "Technician servicing a Gliderol sectional garage door — manufacturer image",
    caption: "Servicing a Gliderol door. Image: Gliderol.",
    source:
      "https://gliderol.com.au/garage-doors/roller/ — official manufacturer image — nominative use (authorised dealer)",
  },
  cta: {
    heading: "Gliderol Door Playing Up? Get It Sorted Today",
    subtitle: "Tell us the fault and your suburb — you'll get a same-day slot and a fixed price before we start.",
  },
};
