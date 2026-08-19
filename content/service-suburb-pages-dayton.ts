import type { ServiceSuburbPage } from "@/types";

/**
 * Dayton (2026-08-12) — user-priority Swan Valley suburb, built to own a
 * wide-open SERP. Created in the CMS as a DRAFT by
 * scripts/import-dayton-page.ts (which also pins the guide-price table).
 *
 * Research behind the copy (DataForSEO live Perth SERP + volumes, 2026-08-12):
 *  - NO competitor has a dedicated Dayton page. Organic #1 for "garage door
 *    repairs dayton wa" is Gecko's MADDINGTON page (irrelevant match), #2 is
 *    a ServiceTasker directory, #3 is Gryphon's generic "City of Swan" page.
 *    The local pack is ABC (Bennett Springs) and DMT (Caversham) — adjacent
 *    suburbs, proving real demand; nearby Ellenbrook's CPC is ~$89.
 *  - Related searches: "Residential garage door repairs dayton wa",
 *    "Garage door repairs dayton wa cost", "Best garage door repairs dayton
 *    wa" — the same price-transparency + residential intent that drove the
 *    Maddington/Cockburn refactors.
 *  - PAA: service cost / motor lifespan / repair cost / most common repair /
 *    door lifespan.
 *
 * Angle that differentiates the copy: Dayton is one of Perth's NEWEST
 * suburbs (build-out from ~2012 onward), so this page deliberately inverts
 * the "aging doors" story used elsewhere on the site. Honest new-suburb
 * material: builder-grade doors and openers hitting their first failures,
 * high-cycle family doors snapping springs early, remote/keypad/smart-opener
 * setup, panel damage on tight new-estate driveways, upgrades and new-build
 * supply-and-install, plus the semi-rural Swan Valley properties next door
 * with sheds and roller doors.
 *
 * NOTE: no dollar figures anywhere — visible prices come only from the CMS
 * pricing catalog (the importer pins the standard 8-scenario table).
 */
export const daytonPage: ServiceSuburbPage = {
  slug: "garage-door-repairs-dayton",
  service: "Garage Door Repairs",
  suburb: "Dayton",
  region: "Perth, WA",

  // Ellenbrook and Midland are live pages; the rest point at the
  // service-areas index until they get their own pages.
  nearbySuburbs: [
    { label: "Brabham", href: "/service-areas" },
    { label: "Caversham", href: "/service-areas" },
    { label: "West Swan", href: "/service-areas" },
    { label: "Bennett Springs", href: "/service-areas" },
    { label: "Henley Brook", href: "/service-areas" },
    { label: "Aveley", href: "/service-areas" },
    { label: "Ellenbrook", href: "/garage-door-repairs-ellenbrook" },
    { label: "Midland", href: "/garage-door-repairs-midland" },
  ],

  hero: {
    subtitle:
      "Same-day garage door repairs across Dayton and the Swan Valley estates — springs, openers, remotes and off-track doors fixed in one visit, with honest advice for doors that are barely a decade old.",
    trustBadges: [
      "Local Perth Team",
      "Same-Day Response",
      "All Major Brands",
      "Warranty Support",
    ],
  },

  directAnswer:
    "Capital Garage Doors provides same-day garage door repairs in Dayton — broken springs and cables, faulty motors and openers, remotes, keypads and sensors, noisy or off-track doors — plus first services for newer doors and the supply and installation of new sectional and roller doors.",

  localIntro: [
    "Dayton is one of Perth's newest suburbs — most of its streets didn't exist a decade and a half ago — and that changes what garage door work looks like here. We're not nursing forty-year-old doors like we are in the older suburbs; we're fixing builder-grade doors and openers that were installed quickly during the build-out and are now hitting their first real failures.",
    "That's the honest story of a new estate: the door itself is usually fine, but the components chosen to hit a builder's budget aren't always the ones we'd fit. Entry-level openers strain on big double sectional doors, springs on high-cycle family doors reach their rated life years sooner than anyone expects, and remotes, keypads and safety sensors that were never set up properly at handover cause faults that look far more serious than they are.",
    "The daily workload does the rest. Dayton is young-family territory — school runs, the commute down Lord Street or Reid Highway, sport on the weekend — and a garage door that cycles four or six times a day gets through its spring life quickly. When one lets go the door suddenly weighs a ton, and forcing the opener to lift it is how a cheap repair becomes an expensive one. Leave it down and call us — spring replacement is a standard same-day job.",
    "We also look after the edges of Dayton that aren't new estate: the semi-rural properties toward West Swan and the Swan Valley with big sheds, workshop roller doors and gate motors, where the fix is more often curtain tension, guide wear or a motor that's been living outdoors. Same-day calls cover Dayton, Brabham, Caversham, West Swan, Bennett Springs and Henley Brook, with Ellenbrook and Midland both on our daily north-east routes.",
    "Whatever the builder fitted, we carry parts for it — B&D, Steel-Line, Centurion, Gliderol and Dominator doors, plus Merlin, ATA, Chamberlain and Grifco openers — so most Dayton repairs are diagnosed and finished in a single visit. Not sure what you've got? Send a photo with your quote request and we'll identify it before we arrive.",
  ],

  availableServices: [
    {
      title: "Garage Door Repairs",
      description:
        "Diagnosis and repair for sectional and roller doors that won't open, close or run smoothly — same-day across Dayton's estates.",
      icon: "Wrench",
    },
    {
      title: "Spring & Cable Replacement",
      description:
        "Snapped torsion springs and frayed cables replaced in matched pairs and rebalanced — the classic first failure on a hard-working family door.",
      icon: "Cable",
    },
    {
      title: "Motor & Opener Repairs",
      description:
        "Builder-grade openers repaired, re-programmed or upgraded to quiet, smart Wi-Fi units — including remotes, keypads and safety sensors.",
      icon: "Cpu",
    },
    {
      title: "First Service & Tune-Up",
      description:
        "The service most new-build doors never got: tension checked, tracks aligned, hardware tightened, opener limits and safety reverse set properly.",
      icon: "Settings",
    },
    {
      title: "Panel & Track Repairs",
      description:
        "Bumped panels, bent tracks and off-track rollers on tight new-estate driveways — straightened, realigned or replaced to match.",
      icon: "LayoutPanelTop",
    },
    {
      title: "New Door Supply & Install",
      description:
        "Upgrading a builder-spec door, or building new? Sectional and roller doors supplied and installed after a free on-site measure.",
      icon: "Building2",
    },
    {
      title: "Emergency Repairs",
      description:
        "Door stuck open with the house exposed, or shut with the car inside? Priority response across Dayton and the Swan Valley.",
      icon: "Siren",
    },
  ],

  problems: [
    {
      title: "Door suddenly feels heavy",
      description:
        "The tell-tale broken-spring symptom — and it happens sooner than you'd think on high-cycle new-estate doors. Don't force it; springs are replaced in pairs.",
      icon: "Scale",
    },
    {
      title: "Remote or keypad not working",
      description:
        "Lost programming, flat batteries or a receiver that was never paired properly at handover — we re-pair, repair or upgrade on the spot.",
      icon: "BatteryWarning",
    },
    {
      title: "Opener strains or stalls",
      description:
        "Entry-level builder openers work hard on big double doors. We rebalance the door first — often the motor is fine once it stops fighting the springs.",
      icon: "Cpu",
    },
    {
      title: "Door won't open or close",
      description:
        "A snapped spring, a tripped safety sensor or a failed opener — we find the real cause and get you moving the same day.",
      icon: "DoorClosed",
    },
    {
      title: "Grinding, banging or squealing",
      description:
        "Dry rollers, loose hardware or tracks knocked out of line — a tune-up usually returns a newer door to near-silent.",
      icon: "Volume2",
    },
    {
      title: "Bumped or dented panel",
      description:
        "Tight double garages and busy driveways take a toll. Single panels can often be replaced or straightened without buying a whole new door.",
      icon: "TrafficCone",
    },
  ],

  costGuidance: {
    intro:
      "Garage door repair costs in Dayton depend on what's actually failed, the parts your door needs and whether it's an after-hours emergency. You'll get a clear, fixed quote before any work starts — the guide prices below show where the common repairs typically land.",
    factors: [
      "The fault — re-pairing a remote is a very different job to replacing snapped springs",
      "Parts required and their quality (genuine vs aftermarket components)",
      "Door type and size — single vs double, sectional vs roller",
      "Opener grade — repairing a builder-spec unit vs upgrading to a quiet smart opener",
      "Urgency — standard booking vs after-hours emergency call-out",
      "Whether a repair still adds up, or an upgrade is the smarter long-term spend",
    ],
    note: "Describe the fault (or send a photo) with your quote request and we'll confirm an exact price before we arrive.",
  },

  whyChooseUs: [
    {
      title: "On the north-east run daily",
      description:
        "Dayton sits between our Midland and Ellenbrook work — we're already driving Lord Street and Reid Highway, not dispatched from across Perth.",
      icon: "MapPin",
    },
    {
      title: "Same-day response",
      description:
        "Most Dayton repairs are booked and completed the same day, with emergency call-outs pushed to the front of the queue.",
      icon: "Zap",
    },
    {
      title: "Clear, upfront quotes",
      description:
        "The price is agreed before we start — no vague estimates and no surprise extras on the invoice.",
      icon: "FileText",
    },
    {
      title: "New-build specialists",
      description:
        "We know builder-grade doors and openers inside out — what fails first, what's worth upgrading, and what just needs setting up properly.",
      icon: "BadgeCheck",
    },
    {
      title: "One-visit repairs",
      description:
        "Vans stocked for the common failures on every major brand, so you're not waiting days for a second visit.",
      icon: "Wrench",
    },
    {
      title: "Warranty support",
      description:
        "Workmanship and parts backed by warranty, with real people to call if anything needs a second look.",
      icon: "ShieldCheck",
    },
  ],

  relatedPages: [
    { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
    { label: "Garage Door Repair Cost Perth", href: "/garage-door-repair-cost-perth" },
    { label: "Garage Door Spring Repair Perth", href: "/garage-door-spring-repair-perth" },
    { label: "Garage Door Opener & Motor Repair Perth", href: "/garage-door-opener-repair-perth" },
    { label: "Garage Door Motors — Capital 1100N & 1500N", href: "/garage-door-motors-perth" },
    { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
    { label: "Emergency Garage Door Repairs Perth", href: "/emergency-garage-door-repairs-perth" },
  ],

  faqs: [
    {
      question: "Do you repair garage doors in Dayton?",
      answer:
        "Yes — Dayton is on our daily north-east run between Midland and Ellenbrook. We repair sectional and roller doors across the suburb every week: broken springs and cables, faulty motors and openers, remote and sensor problems, noisy operation and doors that won't open or close. Same-day and emergency repairs are both available.",
    },
    {
      question: "How much does garage door repair cost in Dayton?",
      answer:
        "It depends on the fault, the parts needed, your door type and whether it's an after-hours call-out. The guide-price table on this page shows where the common repairs typically land, and you always get a fixed quote before work starts — describe the problem or send a photo with your quote request and we'll confirm the price up front.",
    },
    {
      question: "My house is only a few years old — why has the garage door already failed?",
      answer:
        "It's the most common surprise in new suburbs like Dayton. Springs are rated in open-close cycles, not years, so a busy family door can use up an entry-level spring's life in well under a decade. Builder-grade openers also work at their limit on big double doors, and remotes or sensors that were never commissioned properly at handover fail early. None of this means the door is bad — it means a component needs replacing or setting up right, which is exactly what we do.",
    },
    {
      question: "Can you come out the same day in Dayton?",
      answer:
        "Usually, yes. We drive the Lord Street and Reid Highway corridor daily for our Midland and Ellenbrook work, so Dayton bookings slot into a route we're already on. If your door is stuck open and the house isn't secure, or stuck shut with the car trapped, say so when you call — those are emergency call-outs and they're prioritised.",
    },
    {
      question: "Do you charge a call-out fee in Dayton?",
      answer:
        "You'll always know the full price before we begin — we quote the whole job upfront rather than adding charges afterwards. Tell us what's happening with the door when you request a quote and we'll explain exactly what's included, so there are no surprises on the invoice.",
    },
    {
      question: "Is my garage door still under the builder's warranty?",
      answer:
        "It might be — doors and openers on newer Dayton homes can still be covered by the manufacturer's warranty, and some faults are worth pursuing through your builder first. When we inspect, we'll tell you honestly if what we're seeing looks like a warranty matter rather than a chargeable repair, and either way you'll get a clear picture of the fault to take forward.",
    },
    {
      question: "Can you upgrade my builder-grade opener to a quieter smart one?",
      answer:
        "Yes — it's one of our most popular Dayton jobs. If the door itself is sound, we replace the entry-level unit with a modern belt-drive or quality chain-drive opener from Merlin, ATA, Chamberlain or Grifco, set the travel limits and safety reverse properly, pair your remotes, keypad and phone app, and take the old unit away. On a bedroom-adjacent garage the difference is night and day.",
    },
    {
      question: "Which garage door brands do you repair in Dayton?",
      answer:
        "All the major Australian makes the estate builders fit — B&D, Steel-Line, Centurion, Gliderol and Dominator doors, plus openers and motors from Merlin, ATA, Chamberlain and Grifco. If you're not sure what's on your door, send a photo with your quote request and we'll identify it and bring the right parts first visit.",
    },
    {
      question: "How often should a newer garage door be serviced?",
      answer:
        "Annually — and the first service matters most. Many new-build doors are installed to deadline and never see a tune-up afterwards, so the first service catches loose hardware, dry rollers, mis-set opener limits and spring tension drift while they're still cheap to fix. A door that cycles several times a day on school runs and commutes is worth checking every nine to twelve months.",
    },
    {
      question: "Do you supply and install new garage doors in Dayton?",
      answer:
        "Yes. Alongside repairs we handle complete garage door supply and installation across Dayton and the Swan Valley — upgrading builder-spec doors to insulated or quieter panels, doors for new builds and owner-builders, and modern smart openers. Every supply-and-install job starts with a free on-site measure and a fixed quote, and we take care of removing the old door.",
    },
    {
      question: "What's the most common garage door problem in Dayton?",
      answer:
        "Opener and remote faults, closely followed by snapped springs. Dayton's doors are young, so instead of the corrosion and worn panels we see in older suburbs, it's builder-grade openers straining on double doors, remotes and keypads losing their programming, and springs on busy family doors reaching cycle end-of-life early. All of them are routine same-day repairs for us.",
    },
  ],

  // Real completed jobs from the surrounding north-east corridor.
  caseStudySlugs: [
    "garage-door-motor-installation-ellenbrook-perth",
    "roller-door-repair-midland-perth",
    "garage-door-lift-cable-replacement-bayswater-perth",
  ],

  seo: {
    title: "Garage Door Repairs Dayton WA | Same-Day Swan Valley",
    description:
      "Same-day garage door repairs in Dayton WA — springs, openers, remotes & new-build installs. Upfront guide prices. Covering Brabham, Caversham & Henley Brook.",
  },
};
