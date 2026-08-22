/**
 * Content manifest for scripts/import-job-pages-2026-08.ts — one entry per job in
 * `Downloads\jobs` (2026-08-19 export). Everything a case study + its gallery items
 * need: copy, FAQs, links, per-photo alt/caption, PII crops, and the suburb-centroid
 * GEO tag written into every photo's EXIF.
 *
 * Rules encoded here (see CLAUDE.md → SEO):
 *  - suburb only — no customer name, phone, street or house number on-page;
 *  - NO dollar figures anywhere (prices live only in the CMS PricingItems catalog;
 *    cost FAQs point at the pinned cost guides);
 *  - jobs 13–18 had their suburb ASSIGNED editorially (real location lost) — the
 *    copy never claims a verified address, and never names a street;
 *  - GEO tags are suburb centroids (approx.), deliberately not the job address.
 */

export type GalleryCategory = "Repairs" | "Installations" | "Motors" | "RollerDoors" | "Commercial" | "BeforeAfter";

/** Fractions of the (EXIF-rotated) image: crop these edges off. */
export interface Crop {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}
/** Fractions of the (rotated, cropped) image: pixelate this box (plates, house numbers). */
export interface PixelBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface JobPhoto {
  /** File name inside the job folder's photos/ dir. */
  file: string;
  /** Remote name (no extension) under capital-garage-door/gallery/. */
  slug: string;
  /** Alt text used in the case-study gallery AND as the asset alt. */
  alt: string;
  /** Case-study caption (short). */
  caption: string;
  crop?: Crop;
  pixelate?: PixelBox[];
}

export interface GalleryEntry {
  /** slug of the main photo (must exist in `photos`). */
  photo: string;
  /** slug of the before photo (optional, must exist in `photos`). */
  before?: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  serviceType: string;
}

export interface JobPage {
  /** Folder name under Downloads\jobs. */
  dir: string;
  /** CRM job id (jobs 1–12) — used by --finalize to mark converted. */
  crmJobId?: number;
  slug: string;
  suburb: string;
  /** Approx. suburb centroid for the EXIF GPS tag. */
  geo: { lat: number; lng: number };
  /** Flat suburb-page slugs whose Recent-work should show this case study. */
  wireSuburbSlugs: string[];
  title: string;
  subtitle: string;
  service: string;
  doorType: string;
  jobType: string;
  result: string;
  summary: { problem: string; diagnosis: string; solution: string };
  problem: { intro: string; points: string[] };
  diagnosis: { intro: string; points: string[] };
  solution: { intro: string; points: string[] };
  partsUsed: string[];
  relatedServices: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
  seo: { title: string; description: string };
  photos: JobPhoto[];
  /** Order = case-study gallery order (before/after pairs first). */
  imageOrder: string[];
  gallery: GalleryEntry[];
}

const L = {
  repairs: { label: "Garage Door Repairs Perth", href: "/garage-door-repairs-perth" },
  emergency: { label: "Emergency Garage Door Repairs", href: "/emergency-garage-door-repairs-perth" },
  springs: { label: "Garage Door Spring Repair", href: "/garage-door-spring-repair-perth" },
  springCost: { label: "Spring Replacement Cost Guide", href: "/garage-door-spring-replacement-cost-perth" },
  opener: { label: "Garage Door Opener Repair", href: "/garage-door-opener-repair-perth" },
  motors: { label: "Garage Door Motors Perth", href: "/garage-door-motors-perth" },
  motorCost: { label: "Motor Replacement Cost Guide", href: "/garage-door-motor-replacement-cost-perth" },
  repairCost: { label: "Garage Door Repair Cost Guide", href: "/garage-door-repair-cost-perth" },
  serviceCost: { label: "Garage Door Service Cost Guide", href: "/garage-door-service-cost-perth" },
  roller: { label: "Roller Door Repairs Perth", href: "/roller-door-repairs-perth" },
  rollerDoors: { label: "Roller Doors Perth", href: "/roller-doors-perth" },
  panels: { label: "Garage Door Panel Replacement", href: "/garage-door-panel-replacement-perth" },
  remotes: { label: "Garage Door Remote Replacement", href: "/garage-door-remote-replacement-perth" },
  install: { label: "Garage Door Installation Perth", href: "/garage-door-installation-perth" },
  maintenance: { label: "Garage Door Servicing", href: "/garage-door-maintenance-perth" },
  offTrack: { label: "Garage Door Off Track?", href: "/problems/garage-door-off-track" },
  springCable: { label: "Broken Spring or Cable?", href: "/problems/garage-door-spring-or-cable-broken" },
  motorDead: { label: "Motor Not Responding?", href: "/problems/garage-door-motor-not-responding" },
  stuckHalf: { label: "Door Stuck Halfway?", href: "/problems/garage-door-stuck-halfway" },
  cableBlog: { label: "Cable Repair Signs & Cost", href: "/blog/garage-door-cable-repair-signs-and-cost" },
  springLife: { label: "How Long Do Springs Last?", href: "/blog/how-long-do-garage-door-springs-last" },
  springsDanger: { label: "Are Garage Door Springs Dangerous?", href: "/blog/are-garage-door-springs-dangerous" },
  springsGuide: { label: "Garage Door Springs Guide", href: "/blog/garage-door-springs-guide" },
  suburb: (name: string, slug: string) => ({ label: `Garage Door Repairs ${name}`, href: `/${slug}` }),
};

const costFaq = (suburb: string, guide: "spring" | "motor" | "repair") => ({
  question: `What does a repair like this cost in ${suburb}?`,
  answer:
    guide === "spring"
      ? `It depends on the door — a single spring on a small door is a smaller job than a matched pair on a double door with a new torsion pipe. We quote from a published price list before any work starts, and the range for every scenario is in our garage door spring replacement cost guide (or use the instant price calculator on this site).`
      : guide === "motor"
        ? `It depends on the opener you choose and whether the door itself needs work first — an opener swap on a well-balanced door is the simplest case. We quote from a published price list before starting, and every scenario's range is in our garage door motor replacement cost guide (or the instant price calculator on this site).`
        : `It depends on exactly what the door needs — cables and brackets, a re-track, springs, or a combination. We inspect the whole door and quote the full scope from a published price list before any work starts; our garage door repair cost guide lists the range for each scenario, or use the instant price calculator on this site.`,
});

const sameDayFaq = (suburb: string, neighbours: string) => ({
  question: `Do you do same-day garage door repairs in ${suburb}?`,
  answer: `Yes — ${suburb}, ${neighbours} are all covered by our same-day mobile service, with the common springs, cables, brackets, rollers and openers carried on the van so most repairs are finished in the first visit.`,
});

const residentialFaq = (suburb: string) => ({
  question: `Do you repair all brands of residential garage doors in ${suburb}?`,
  answer: `Yes — B&D, Steel-Line, Centurion, Gliderol, Merlin, Chamberlain, Avanti, ATA and the other common Perth brands, on sectional, roller and tilt doors. Most parts are universal, and where a brand-specific part is needed we source it.`,
});

/* ------------------------------------------------------------------ *
 * The 17 jobs (Kelmscott — job 03 — is skipped: no problem, no work
 * done and no photos were recorded, so there is nothing truthful to
 * publish. Claremont — job 04 — has a real story but no photos.)
 * ------------------------------------------------------------------ */

export const JOBS: JobPage[] = [
  /* ---------------- 01 East Cannington — broken springs ---------------- */
  {
    dir: "job 01 - JOB-20260722-001 - East Cannington",
    crmJobId: 7,
    slug: "garage-door-repairs-east-cannington-broken-springs-perth",
    suburb: "East Cannington",
    geo: { lat: -32.018, lng: 115.955 },
    wireSuburbSlugs: ["garage-door-repairs-cannington"],
    title: "Garage Door Repairs in East Cannington: Broken Torsion Springs Replaced",
    subtitle:
      "A sectional door in East Cannington stopped dead when its torsion spring snapped. We replaced both springs as a matched pair, re-balanced the door and had it running the same morning.",
    service: "Spring Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Both torsion springs replaced and the door balanced — back in service in one visit.",
    summary: {
      problem: "Torsion spring snapped — the door became too heavy for the opener to lift.",
      diagnosis: "Both springs at end of cycle life; only one had failed so far.",
      solution: "New matched pair of torsion springs, door balanced and safety-tested.",
    },
    problem: {
      intro:
        "The homeowner heard a loud bang from the garage and found the sectional door wouldn't budge — the opener hummed and gave up. On arrival the cause was obvious: a clean break in the torsion spring above the door, with the coils sitting apart on the shaft. With the spring gone, the opener was being asked to lift the full weight of the door on its own.",
      points: [
        "Loud bang, then the door refused to open",
        "Visible gap in the torsion spring coils above the door",
        "Opener straining and stopping — a safety cut-out doing its job",
      ],
    },
    diagnosis: {
      intro:
        "Torsion springs on a two-spring door are wound the same day and cycle together, so when one snaps its partner is almost always weeks from doing the same. Replacing only the broken one would leave a mismatched pair and a second call-out — which is why we quote springs as a matched set on doors like this. The rest of the hardware — cables, drums and bearings — checked out fine.",
      points: [
        "Spring failed at the end of its rated cycle life, not from damage",
        "Second spring the same age — replaced as a pair",
        "Cables, drums and centre bearing inspected and retained",
      ],
    },
    solution: {
      intro:
        "We fitted two new high-cycle torsion springs sized to the door's weight, wound them to spec, then balanced the door so it sits still at half height by hand — the test that tells you the springs are doing the lifting, not the motor. Finally the opener's force limits and safety reversal were re-checked and the moving parts lubricated.",
      points: [
        "Matched pair of high-cycle torsion springs fitted and wound to spec",
        "Door balanced by hand at half-height",
        "Opener force limits and auto-reverse re-tested",
        "Hinges, rollers and bearings lubricated",
      ],
    },
    partsUsed: ["High-cycle torsion springs ×2", "Balance, limit & safety-reversal test", "Lubrication service"],
    relatedServices: [L.repairs, L.springs, L.springCost, L.suburb("Cannington", "garage-door-repairs-cannington"), L.springsDanger],
    faqs: [
      {
        question: "Why replace both garage door springs when only one broke?",
        answer:
          "Paired torsion springs are the same age and have done the same number of cycles, so the survivor is close to failing too. A new spring next to a tired one also unbalances the door and overworks the opener. Replacing the pair costs far less than two separate call-outs a few weeks apart.",
      },
      {
        question: "Can I still use my garage door with a broken spring?",
        answer:
          "No — don't. The spring carries the door's weight; without it the opener can burn out, the cables can jump the drums, and the door can drop. Leave it where it is and call us; we carry the common spring sizes and attend East Cannington same-day.",
      },
      costFaq("East Cannington", "spring"),
      {
        question: "How long do garage door springs last?",
        answer:
          "Standard springs are rated for roughly 10,000 cycles — about 7–10 years for a family using the door a few times a day. High-cycle springs like the ones fitted here last considerably longer. Rust and lack of lubrication shorten either.",
      },
      sameDayFaq("East Cannington", "Cannington, Queens Park, Beckenham, Welshpool and Wilson"),
    ],
    seo: {
      title: "Garage Door Repairs East Cannington | Springs Replaced",
      description:
        "Snapped torsion spring on an East Cannington sectional door — both springs replaced as a pair and the door balanced the same morning. Real job photos.",
    },
    photos: [
      {
        file: "before-01-broken-garage-door-spring-east-cannington.jpeg",
        slug: "broken-garage-door-spring-east-cannington-perth-before",
        alt: "Snapped torsion spring with a visible gap in the coils above a sectional garage door in East Cannington, Perth",
        caption: "Before — the snapped torsion spring",
      },
      {
        file: "after-01-new-garage-door-spring-east-cannington.jpeg",
        slug: "broken-garage-door-spring-east-cannington-perth",
        alt: "New pair of torsion springs installed above a sectional garage door in East Cannington, Perth",
        caption: "After — new matched pair of springs, wound and balanced",
      },
    ],
    imageOrder: ["broken-garage-door-spring-east-cannington-perth-before", "broken-garage-door-spring-east-cannington-perth"],
    gallery: [
      {
        photo: "broken-garage-door-spring-east-cannington-perth",
        before: "broken-garage-door-spring-east-cannington-perth-before",
        title: "Broken Garage Door Spring Replaced in East Cannington",
        caption:
          "Before and after in East Cannington: a snapped torsion spring replaced with a matched pair of high-cycle springs, then the door balanced and safety-tested.",
        category: "BeforeAfter",
        serviceType: "Spring Replacement",
      },
    ],
  },

  /* ---------------- 02 Jane Brook — cable + bottom brackets ---------------- */
  {
    dir: "job 02 - JOB-20260804-003 - Jane Brook",
    crmJobId: 10,
    slug: "garage-door-repairs-jane-brook-snapped-cable-brackets-perth",
    suburb: "Jane Brook",
    geo: { lat: -31.87, lng: 116.06 },
    wireSuburbSlugs: ["garage-door-repairs-midland"],
    title: "Garage Door Repairs in Jane Brook: Snapped Cable & Bottom Brackets Replaced",
    subtitle:
      "A double sectional door in Jane Brook dropped on one side when a lift cable snapped at the bottom bracket. We replaced both cables and both bottom brackets, squared the door and had it running the same visit.",
    service: "Cable & Bottom Bracket Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New cables and bottom brackets both sides — the door lifts level and true again.",
    summary: {
      problem: "Lift cable snapped — the door sat crooked and jammed in the opening.",
      diagnosis: "Cable frayed through at a corroded bottom bracket; the other side was close behind.",
      solution: "New galvanised cables and heavy-duty bottom brackets fitted both sides, door re-levelled.",
    },
    problem: {
      intro:
        "The double sectional door on this Jane Brook home came down crooked and stuck — one corner higher than the other, with the panels twisted in the opening. A snapped lift cable is the classic cause: with one side unloaded the door drops on that side and jams against the tracks. Forcing it any further risks bending panels and pulling rollers out of the track.",
      points: [
        "Door dropped on one side and jammed crooked",
        "Lift cable snapped where it anchors at the bottom bracket",
        "Door unsafe to operate until re-cabled and re-levelled",
      ],
    },
    diagnosis: {
      intro:
        "The old bottom brackets told the story: the cable had frayed and finally parted right at the bracket anchor, where grit and moisture collect and the strands work back and forth on every cycle. The opposite cable showed the same wear pattern, so replacing one side alone would only have moved the failure across the door. The brackets themselves were the original light-gauge pressed steel, worn at the roller stem hole.",
      points: [
        "Cable frayed through at the bottom-bracket anchor point",
        "Second cable showing identical wear — replaced as a pair",
        "Original bottom brackets worn at the roller stem — replaced with heavy-duty units",
        "Springs, drums and tracks inspected — serviceable",
      ],
    },
    solution: {
      intro:
        "With the door secured and the springs de-tensioned, we removed both bottom brackets, fitted new heavy-duty galvanised brackets with new rollers, and ran a matched pair of new galvanised lift cables onto the drums. The door was then squared in the opening, the springs re-tensioned and the balance checked, and the opener's travel limits and safety reversal re-set.",
      points: [
        "New heavy-duty galvanised bottom brackets both sides",
        "Matched pair of new galvanised lift cables",
        "New bottom rollers fitted with the brackets",
        "Door squared and levelled, springs re-tensioned, opener limits reset",
      ],
    },
    partsUsed: ["Galvanised lift cables (pair)", "Heavy-duty bottom brackets ×2", "Bottom rollers ×2", "Re-level, balance & safety test"],
    relatedServices: [L.repairs, L.springCable, L.cableBlog, L.suburb("Midland", "garage-door-repairs-midland"), L.emergency],
    faqs: [
      {
        question: "Why did the garage door cable snap at the bottom bracket?",
        answer:
          "The bottom bracket is where the cable anchors and where dirt, moisture and salt collect, so the strands corrode and fatigue there first. On this Jane Brook door the cable had frayed strand by strand at the anchor until it let go. It's why we always inspect both bottom brackets, not just the broken cable.",
      },
      {
        question: "Can you replace just one garage door cable?",
        answer:
          "Technically yes, but we don't recommend it: both cables are the same age and wear identically, and a new cable paired with a stretched old one leaves the door out of level. Cables are cheap relative to a second call-out, so we fit them as a pair.",
      },
      {
        question: "Is a crooked garage door dangerous?",
        answer:
          "Yes. A door that has dropped on one side is hanging on one cable and its springs are unevenly loaded. Don't run the opener or try to lift it — the panels can bend and the rollers can jump the track. Leave it, keep people clear, and call us for a same-day visit.",
      },
      costFaq("Jane Brook", "repair"),
      sameDayFaq("Jane Brook", "Swan View, Stratton, Midland, Middle Swan and the Swan Valley"),
    ],
    seo: {
      title: "Garage Door Repairs Jane Brook | Cable & Brackets Replaced",
      description:
        "Snapped lift cable dropped a Jane Brook double sectional door on one side. New cables and heavy-duty bottom brackets both sides, door re-levelled same visit.",
    },
    photos: [
      {
        file: "before-01-garage-door-cable-snapped-jane-brook.jpeg",
        slug: "snapped-garage-door-cable-jane-brook-perth-before",
        alt: "Cream double sectional garage door in Jane Brook, Perth sitting crooked in the opening after a lift cable snapped",
        caption: "Before — the door dropped and jammed crooked after the cable snapped",
      },
      {
        file: "after-01-replace-both-sides-of-cables-jane-brook.jpeg",
        slug: "snapped-garage-door-cable-jane-brook-perth",
        alt: "The same double sectional garage door in Jane Brook, Perth closed square and level after new cables and brackets were fitted",
        caption: "After — new cables and brackets both sides, door square and level",
      },
      {
        file: "other-01-garage-door-bottom-brackets-replaced-jane-brook.jpeg",
        slug: "worn-garage-door-bottom-brackets-cables-jane-brook-perth",
        alt: "Two old garage door bottom brackets with frayed, snapped lift cables removed from a sectional door in Jane Brook, Perth",
        caption: "The old bottom brackets and frayed cables that came off the door",
      },
    ],
    imageOrder: [
      "snapped-garage-door-cable-jane-brook-perth-before",
      "snapped-garage-door-cable-jane-brook-perth",
      "worn-garage-door-bottom-brackets-cables-jane-brook-perth",
    ],
    gallery: [
      {
        photo: "snapped-garage-door-cable-jane-brook-perth",
        before: "snapped-garage-door-cable-jane-brook-perth-before",
        title: "Snapped Garage Door Cable Repaired in Jane Brook",
        caption:
          "Before and after in Jane Brook: a double sectional door dropped crooked by a snapped lift cable, back square and level with new cables and heavy-duty bottom brackets both sides.",
        category: "BeforeAfter",
        serviceType: "Cable Replacement",
      },
      {
        photo: "worn-garage-door-bottom-brackets-cables-jane-brook-perth",
        title: "Worn Bottom Brackets & Frayed Cables, Jane Brook",
        caption:
          "Straight off a Jane Brook sectional door: the original bottom brackets and the lift cables that frayed through at the anchor — why we replace cables and brackets as a set.",
        category: "Repairs",
        serviceType: "Cable Replacement",
      },
    ],
  },

  /* ---------------- 04 Claremont — opener replacement (no photos) ---------------- */
  {
    dir: "job 04 - JOB-20260804-001 - Claremont",
    crmJobId: 8,
    slug: "garage-door-repairs-claremont-opener-replacement-perth",
    suburb: "Claremont",
    geo: { lat: -31.981, lng: 115.781 },
    wireSuburbSlugs: [],
    title: "Garage Door Repairs in Claremont: Failed Opener Replaced",
    subtitle:
      "A Claremont garage door opener stopped responding altogether — no movement from the remote or the wall button. We confirmed the motor was beyond economical repair, fitted a new opener and programmed the remotes the same visit.",
    service: "Opener Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New garage door opener installed, programmed and safety-tested in one visit.",
    summary: {
      problem: "Opener dead — no response from remotes or the wall button.",
      diagnosis: "Motor unit failed and past economical repair; the door itself was in good order.",
      solution: "New opener installed on the existing rail position, remotes programmed, limits and reversal set.",
    },
    problem: {
      intro:
        "The homeowner's garage door opener simply stopped working: no light, no movement, nothing from the remotes or the wall button. The door could still be lifted by hand on the manual release, so the springs were fine — the fault sat squarely with the motor unit. In Claremont's older homes we see a lot of first-generation openers reaching the end of their life this way.",
      points: [
        "Opener completely unresponsive to remotes and wall control",
        "Door lifts normally by hand — springs and hardware sound",
        "Older opener with worn internals and no parts support",
      ],
    },
    diagnosis: {
      intro:
        "We checked power, the logic board and the drive before condemning the unit. Repairing an opener of this age rarely makes sense: parts are scarce, a board swap can cost a large share of a new unit, and the remaining components are just as old. With the door balanced and the hardware in good condition, a straight opener replacement was the right call.",
      points: [
        "Power and control board checked — motor unit failed",
        "Repair uneconomical against a new opener with warranty",
        "Door balance confirmed good, so the new opener starts on a healthy door",
      ],
    },
    solution: {
      intro:
        "We removed the old unit, fitted a new sectional door opener, programmed the customer's remotes, then set the travel limits and force settings and tested the safety reversal against an obstruction. The homeowner was shown the manual release and how to add remotes.",
      points: [
        "New sectional door opener installed and wired",
        "Remotes and wall button programmed",
        "Travel limits, force and safety reversal set and tested",
        "Manual release and remote pairing demonstrated",
      ],
    },
    partsUsed: ["New sectional garage door opener", "Remote programming", "Limit, force & safety-reversal set-up"],
    relatedServices: [L.opener, L.motors, L.motorCost, L.motorDead, L.remotes],
    faqs: [
      {
        question: "My garage door opener is completely dead — is it the motor or the remote?",
        answer:
          "If the wall button does nothing either and the opener's light is off, it's the unit or its power supply, not the remote. Check the power point first; if that's live, the motor or its board has failed. We can usually confirm on the phone whether a call-out is worth it.",
      },
      {
        question: "Is it worth repairing an old garage door opener?",
        answer:
          "Sometimes — a capacitor, gear or limit switch on a mid-life opener is a cheap fix. But once the logic board fails on a unit more than 10–15 years old, the parts cost approaches a new opener that comes with a full warranty, quieter operation and rolling-code security. We tell you which side of that line your opener sits on before quoting.",
      },
      costFaq("Claremont", "motor"),
      {
        question: "Which garage door opener brands do you install?",
        answer:
          "We supply and fit our own Capital 1100N and 1500N motors as well as Merlin, Chamberlain, B&D, Steel-Line and ATA units, matched to your door type and size. All come with remotes programmed and safety reversal tested on the day.",
      },
      sameDayFaq("Claremont", "Swanbourne, Cottesloe, Nedlands, Dalkeith and Mosman Park"),
    ],
    seo: {
      title: "Garage Door Repairs Claremont | Failed Opener Replaced",
      description:
        "A dead garage door opener in Claremont replaced with a new unit — remotes programmed, limits and safety reversal set the same visit. Same-day western suburbs.",
    },
    photos: [],
    imageOrder: [],
    gallery: [],
  },

  /* ---------------- 05 Belmont — Avanti opener → Superlift + springs ---------------- */
  {
    dir: "job 05 - JOB-20260804-002 - Belmont",
    crmJobId: 9,
    slug: "garage-door-repairs-belmont-motor-springs-replacement-perth",
    suburb: "Belmont",
    geo: { lat: -31.947, lng: 115.929 },
    wireSuburbSlugs: ["garage-door-repairs-belmont", "garage-door-repairs-lathlain"],
    title: "Garage Door Repairs in Belmont: Failed Avanti Opener & Springs Replaced",
    subtitle:
      "A Belmont sectional door's Avanti opener gave up after years of straining against tired springs. We fitted a new Superlift motor and new torsion springs together, so the new opener starts on a properly balanced door.",
    service: "Motor & Spring Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New Superlift opener plus new springs — quiet, balanced and covered by warranty.",
    summary: {
      problem: "Opener failing — struggling to lift and stopping part-way.",
      diagnosis: "Worn Avanti motor, but the real load was tired springs it had been fighting for years.",
      solution: "New torsion springs and a new Superlift opener fitted together, door balanced and limits set.",
    },
    problem: {
      intro:
        "The Avanti opener on this Belmont sectional door had been getting slower and noisier for months and finally started stopping part-way and reversing. The homeowner assumed the motor was the whole story — and it was on its last legs — but a motor that has spent years lifting an out-of-balance door usually dies of the springs, not old age.",
      points: [
        "Opener slow, straining and stopping mid-travel",
        "Door heavy to lift by hand on the manual release",
        "Older Avanti unit with worn drive components",
      ],
    },
    diagnosis: {
      intro:
        "The balance test settled it: released from the opener, the door wouldn't hold at half height and wanted to fall — the torsion springs had lost their tension. Fitting a new opener onto that door would have overworked it from day one and voided its warranty. The right fix was springs and motor together, in one visit.",
      points: [
        "Torsion springs weak — door fails the half-height balance test",
        "Avanti opener worn beyond sensible repair",
        "Cables, drums and rollers inspected — retained",
      ],
    },
    solution: {
      intro:
        "We fitted a new pair of torsion springs and balanced the door by hand, then installed a new Superlift opener on the existing rail line, programmed the remotes and set the travel limits and force. Safety reversal was tested against an obstruction and the door's moving parts lubricated before handover.",
      points: [
        "New torsion springs fitted and door balanced",
        "New Superlift garage door opener installed and programmed",
        "Travel limits, force and safety reversal set and tested",
        "Full lubrication service",
      ],
    },
    partsUsed: ["Superlift garage door opener", "Torsion springs (pair)", "Remote programming", "Balance & safety-reversal test"],
    relatedServices: [L.suburb("Belmont", "garage-door-repairs-belmont"), L.opener, L.motors, L.springs, L.motorCost, L.springCost, L.suburb("Lathlain", "garage-door-repairs-lathlain")],
    faqs: [
      {
        question: "Why replace the springs when I only asked for a new motor?",
        answer:
          "Because the springs lift the door — the motor only guides it. If the door is out of balance, a new opener works far harder than designed, wears early and can void its warranty. On this Belmont job the balance test showed the springs were the reason the old Avanti died, so we fixed both in one visit.",
      },
      {
        question: "How do I check if my garage door springs are worn?",
        answer:
          "With the opener disconnected on the manual release, lift the door to about half height and let go. A balanced door stays put; if it drops or feels very heavy, the springs have lost tension. Don't attempt to adjust springs yourself — they're under high tension and cause serious injuries.",
      },
      {
        question: "What is a Superlift garage door opener?",
        answer:
          "Superlift is a quiet, belt-and-chain sectional door opener with LED lighting, soft start/stop, rolling-code remotes and battery-backup options — a solid mid-range replacement for older Avanti, Gliderol and ATA units. We also supply our own Capital 1100N/1500N motors and Merlin and Chamberlain units.",
      },
      {
        question: "How long does a garage door motor last?",
        answer:
          "Ten to fifteen years is typical, and this Belmont Avanti was at the end of that road. What shortens it is exactly what we found here: a door that has gone out of balance. Weak springs leave the opener lifting weight it was never designed to carry, so it runs hot, wears its gears and dies years early. Replacing the springs at the same time is what makes the new motor last its full life.",
      },
      {
        question: "Is it cheaper to repair or replace a garage door opener?",
        answer:
          "On a mid-life opener with a single fault — a capacitor, a gear set, a limit switch or a remote — a repair is much cheaper and we will do exactly that. Once an older unit's drive or logic board fails, the parts cost approaches a new opener that comes with a full warranty, quieter operation and rolling-code remotes, which is where this Belmont Avanti had landed. We test the door's balance first either way, because an out-of-balance door is what kills openers early.",
      },
      costFaq("Belmont", "motor"),
      sameDayFaq("Belmont", "Cloverdale, Kewdale, Redcliffe, Rivervale, Ascot and Lathlain"),
    ],
    seo: {
      // Differentiated from the suburb page (which owns "Garage Door Repairs
      // Belmont WA") so the two don't compete for the same head term.
      title: "Garage Door Motor & Springs Replaced in Belmont, Perth",
      description:
        "A failing Avanti opener on a Belmont sectional door replaced with a Superlift motor plus new torsion springs, balanced and tested in one visit. Real job photos.",
    },
    photos: [
      {
        file: "before-01-avanti-garage-door-opener-belmont-wa-6104.jpeg",
        slug: "garage-door-motor-replacement-belmont-perth-before",
        alt: "Old Avanti garage door opener mounted on the ceiling rail above a sectional door in Belmont, Perth before replacement",
        caption: "Before — the worn Avanti opener",
      },
      {
        file: "after-01-superlift-motor-belmont-wa-6104.jpeg",
        slug: "garage-door-motor-replacement-belmont-perth",
        alt: "New Superlift garage door opener with LED light on the ceiling rail above a sectional door in Belmont, Perth",
        caption: "After — new Superlift opener on a freshly balanced door",
      },
    ],
    imageOrder: ["garage-door-motor-replacement-belmont-perth-before", "garage-door-motor-replacement-belmont-perth"],
    gallery: [
      {
        photo: "garage-door-motor-replacement-belmont-perth",
        before: "garage-door-motor-replacement-belmont-perth-before",
        title: "Garage Door Motor Replacement in Belmont",
        caption:
          "Before and after in Belmont: a worn Avanti opener replaced with a new Superlift motor — fitted together with new torsion springs so the opener starts on a balanced door.",
        category: "Motors",
        serviceType: "Motor Replacement",
      },
    ],
  },

  /* ---------------- 06 Mount Pleasant — snapped spring ---------------- */
  {
    dir: "job 06 - JOB-20260804-004 - Mount Pleasant",
    crmJobId: 11,
    slug: "garage-door-repairs-mount-pleasant-snapped-spring-perth",
    suburb: "Mount Pleasant",
    geo: { lat: -32.026, lng: 115.85 },
    wireSuburbSlugs: [],
    title: "Garage Door Repairs in Mount Pleasant: Snapped Torsion Spring Replaced",
    subtitle:
      "The single torsion spring on a Mount Pleasant sectional door snapped clean in the middle, leaving the door too heavy to lift. We fitted a new correctly-sized spring, balanced the door and had it running again the same visit.",
    service: "Spring Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New torsion spring fitted and balanced — door back in service in one visit.",
    summary: {
      problem: "Torsion spring snapped in two — the door wouldn't lift.",
      diagnosis: "Spring failed at end of cycle life; shaft, drums and cables sound.",
      solution: "New high-cycle spring sized to the door, wound, balanced and safety-tested.",
    },
    problem: {
      intro:
        "This Mount Pleasant sectional door runs on a single torsion spring, and it let go with the usual bang — the two halves sitting apart on the shaft with a clear gap between them. From that moment the opener was trying to lift the whole door unaided, which it can't and shouldn't do. The homeowner sensibly left the door closed and called.",
      points: [
        "Single torsion spring snapped mid-coil",
        "Door dead weight — opener unable to lift it",
        "Door left closed until repaired — the right call",
      ],
    },
    diagnosis: {
      intro:
        "A clean mid-coil break with even wear along the spring is the signature of a spring that simply reached the end of its cycle life — not damage or a fitting fault. We measured the door's weight and the old spring's wire size and length to match a replacement exactly; an undersized spring leaves the door heavy, an oversized one makes it fly up. Cables, drums and the shaft bearing were checked and retained.",
      points: [
        "Clean fatigue break — end of cycle life",
        "Replacement spring matched to door weight and old spring dimensions",
        "Cables, drums and centre bearing serviceable",
      ],
    },
    solution: {
      intro:
        "We fitted a new high-cycle torsion spring, wound it to the door's specification and balanced the door so it holds at half height by hand. The opener's force settings and safety reversal were re-checked and the hinges and rollers lubricated. Total time on site: well under an hour.",
      points: [
        "New high-cycle torsion spring fitted and wound to spec",
        "Door balanced by hand at half-height",
        "Opener force and safety reversal re-tested",
        "Hinges and rollers lubricated",
      ],
    },
    partsUsed: ["High-cycle torsion spring", "Balance, limit & safety-reversal test", "Lubrication service"],
    relatedServices: [L.springs, L.springCost, L.springLife, L.springCable, L.repairs],
    faqs: [
      {
        question: "My garage door spring snapped — can I open the door by hand?",
        answer:
          "Only if you must, and only with two people: without the spring, a double sectional door can weigh well over 100 kg and it will slam if you let go. It's safer to leave it closed and call us — we attend Mount Pleasant same-day with the common spring sizes on board.",
      },
      {
        question: "Why does a garage door spring snap?",
        answer:
          "Metal fatigue. Every open and close is one cycle, and standard springs are rated for around 10,000 cycles — 7–10 years of typical use. Rust, no lubrication and an out-of-balance door all shorten that. When it finally goes, it goes with a bang, usually while the door is closed.",
      },
      costFaq("Mount Pleasant", "spring"),
      {
        question: "Should I upgrade to a high-cycle spring?",
        answer:
          "For a door used several times a day, yes — a high-cycle spring costs a little more and lasts two to three times as long. It's what we fitted on this Mount Pleasant door.",
      },
      sameDayFaq("Mount Pleasant", "Applecross, Ardross, Booragoon, Brentwood and Bull Creek"),
    ],
    seo: {
      title: "Garage Door Repairs Mount Pleasant | Snapped Spring Fixed",
      description:
        "A Mount Pleasant sectional door's torsion spring snapped clean in two. New high-cycle spring fitted, door balanced and safety-tested in one same-day visit.",
    },
    photos: [
      {
        file: "before-01-broken-spring-mount-pleasant.jpeg",
        slug: "snapped-garage-door-spring-mount-pleasant-perth-before",
        alt: "Torsion spring snapped in two with a gap between the halves above a grey sectional garage door in Mount Pleasant, Perth",
        caption: "Before — the spring snapped clean through the middle",
      },
      {
        file: "after-01-new-spring-mount-pleasant.jpeg",
        slug: "snapped-garage-door-spring-mount-pleasant-perth",
        alt: "New torsion spring installed on the shaft above a grey sectional garage door in Mount Pleasant, Perth",
        caption: "After — new high-cycle spring wound and balanced",
      },
    ],
    imageOrder: ["snapped-garage-door-spring-mount-pleasant-perth-before", "snapped-garage-door-spring-mount-pleasant-perth"],
    gallery: [
      {
        photo: "snapped-garage-door-spring-mount-pleasant-perth",
        before: "snapped-garage-door-spring-mount-pleasant-perth-before",
        title: "Snapped Garage Door Spring Replaced in Mount Pleasant",
        caption:
          "Before and after in Mount Pleasant: a torsion spring snapped in two, replaced with a new high-cycle spring wound to spec and the door balanced by hand.",
        category: "BeforeAfter",
        serviceType: "Spring Replacement",
      },
    ],
  },

  /* ---------------- 07 Byford — roller door cable off the drum ---------------- */
  {
    dir: "job 07 - JOB-20260804-005 - Byford",
    crmJobId: 12,
    slug: "garage-door-repairs-byford-roller-door-cable-off-drum-perth",
    suburb: "Byford",
    geo: { lat: -32.221, lng: 115.995 },
    wireSuburbSlugs: ["garage-door-repairs-armadale"],
    title: "Garage Door Repairs in Byford: Roller Door Cable Off the Drum",
    subtitle:
      "A near-new roller door in Byford went crooked and jammed when a lift cable jumped off its drum. We re-seated and re-tensioned the cables, levelled the curtain and had the door running smoothly again the same afternoon.",
    service: "Cable Repair & Re-level",
    doorType: "Roller",
    jobType: "Repair",
    result: "Cable back on the drum, curtain level, door running smoothly — no parts needed.",
    summary: {
      problem: "Door crooked and jammed — a lift cable had come off the drum.",
      diagnosis: "Cable slack on one side let it jump the drum; no damage to the cable or curtain.",
      solution: "Cables re-seated and re-tensioned, curtain levelled, travel and safety re-set.",
    },
    problem: {
      intro:
        "The homeowner arrived home to find their roller door sitting lopsided — one side an inch or two higher than the other, and refusing to close fully. On a roller door that almost always means a lift cable has jumped its drum: with the cable slack on one side the curtain lifts unevenly, binds in the guides and stops. It's common on newer estates like Byford where doors are large, used constantly and rarely serviced.",
      points: [
        "Curtain sitting crooked, higher on one side",
        "Door binding in the guides and stopping short",
        "Lift cable found off its drum on the raised side",
      ],
    },
    diagnosis: {
      intro:
        "We inspected the cable for fraying and the drum for damage before touching anything — a cable that jumps because it's frayed needs replacing, not re-seating. This one was sound: it had simply gone slack (usually from the door being stopped on an obstruction or bounced on the way down) and walked off the drum. The curtain, guides and opener were undamaged.",
      points: [
        "Cable intact — no fraying or crushed strands",
        "Drum and guides undamaged",
        "Curtain edges checked for bends — none",
        "Cause: cable slack on one side, not a worn part",
      ],
    },
    solution: {
      intro:
        "With the door supported we unwound the slack, re-seated the cable in its drum grooves and re-tensioned both sides evenly, then ran the door by hand to confirm the curtain tracked level for its full height. The opener's travel limits and safety reversal were re-set and tested, and the guides lubricated so the door runs freely.",
      points: [
        "Cable re-seated on the drum and both cables re-tensioned evenly",
        "Curtain levelled and checked through full travel",
        "Opener limits and safety reversal re-set",
        "Guides and running edges lubricated",
      ],
    },
    partsUsed: ["Cable re-seat & re-tension (no parts required)", "Curtain level & travel check", "Opener limit & safety-reversal reset"],
    relatedServices: [L.roller, L.repairs, L.suburb("Armadale", "garage-door-repairs-armadale"), L.offTrack, L.maintenance],
    faqs: [
      {
        question: "Why does a roller door cable come off the drum?",
        answer:
          "Cables only stay on their drums under tension. If the door hits something on the way down, is bounced or forced, or the opener's down-limit is set too far, one cable goes slack for a moment and can walk off. Worn or frayed cables do the same — which is why we check the cable before simply putting it back.",
      },
      {
        question: "Can I fix a crooked roller door myself?",
        answer:
          "We'd advise against it. The cables and drums are connected to the spring system, which is under high tension, and lifting an unbalanced curtain by hand can bend it. It's a quick job for a technician and the door comes back level with the limits reset — call us for a same-day Byford visit.",
      },
      costFaq("Byford", "repair"),
      {
        question: "Do you service Byford's newer estates?",
        answer:
          "Yes — Byford, The Glades, Redgum Brook, Mundijong, Serpentine, Darling Downs and the whole Armadale–Byford corridor are covered by our same-day mobile service. Newer roller and sectional doors benefit from a service every 12–18 months to keep cables and limits in tune.",
      },
      {
        question: "Does a door that jumped its cable need new parts?",
        answer:
          "Not if the cable and drum are undamaged, as on this Byford job — a re-seat and re-tension is all it needs. If the cable is frayed, kinked or has crushed strands it must be replaced as a pair.",
      },
    ],
    seo: {
      title: "Garage Door Repairs Byford | Roller Door Cable Off Drum",
      description:
        "A crooked, jammed roller door in Byford: the lift cable jumped its drum — re-seated, re-tensioned and the curtain levelled the same afternoon. Real photos.",
    },
    photos: [
      {
        file: "before-01-cable-repair-byford.jpeg",
        slug: "roller-door-cable-off-drum-byford-perth-before",
        alt: "White roller garage door in Byford, Perth sitting crooked with one side raised after a lift cable came off the drum",
        caption: "Before — the curtain crooked with one side raised",
        crop: { right: 0.14 },
      },
      {
        file: "after-01-cable-fixed-byford.jpeg",
        slug: "roller-door-cable-off-drum-byford-perth",
        alt: "The same white roller garage door in Byford, Perth closed level after the cable was re-seated and re-tensioned",
        caption: "After — cable back on the drum, curtain level",
        crop: { right: 0.14 },
      },
    ],
    imageOrder: ["roller-door-cable-off-drum-byford-perth-before", "roller-door-cable-off-drum-byford-perth"],
    gallery: [
      {
        photo: "roller-door-cable-off-drum-byford-perth",
        before: "roller-door-cable-off-drum-byford-perth-before",
        title: "Crooked Roller Door Fixed in Byford",
        caption:
          "Before and after in Byford: a roller door left crooked and jammed by a lift cable that jumped its drum — re-seated, re-tensioned and running level again the same afternoon.",
        category: "RollerDoors",
        serviceType: "Roller Door Repair",
      },
    ],
  },

  /* ---------------- 08 Aveley — Gliderol Glidermatic → Superlift ---------------- */
  {
    dir: "job 08 - JOB-20260804-007 - Aveley",
    crmJobId: 14,
    slug: "garage-door-repairs-aveley-opener-replacement-perth",
    suburb: "Aveley",
    geo: { lat: -31.783, lng: 115.984 },
    wireSuburbSlugs: ["garage-door-repairs-ellenbrook"],
    title: "Garage Door Repairs in Aveley: Gliderol Opener Replaced with a Superlift",
    subtitle:
      "The original Gliderol Glidermatic opener on an Aveley sectional door stopped operating. We replaced it with a new Superlift motor on the existing rail line, programmed the remotes and tested the door the same visit.",
    service: "Opener Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New Superlift opener installed and programmed — quiet, reliable and under warranty.",
    summary: {
      problem: "Gliderol Glidermatic opener stopped operating the door.",
      diagnosis: "Original opener at end of life; door hardware and balance in good order.",
      solution: "New Superlift opener fitted, remotes programmed, limits and safety reversal set.",
    },
    problem: {
      intro:
        "The Gliderol Glidermatic on this Aveley home was the original opener from when the house was built, and it finally stopped operating the door — the light and hum were there but the drive wasn't moving the trolley reliably. Aveley and Ellenbrook were built out through the 2000s, so a lot of first-generation openers in the area are now hitting the same wall.",
      points: [
        "Opener no longer moving the door reliably",
        "Original builder-fitted Glidermatic unit",
        "Door itself in good condition — the opener was the weak link",
      ],
    },
    diagnosis: {
      intro:
        "We tested the door on the manual release first: it balanced properly at half height, so the springs and hardware were fine and the fault was internal to the opener. With parts support for the older Glidermatic units limited and the drive worn, a straight replacement was more sensible than a repair.",
      points: [
        "Door balance test passed — springs and hardware sound",
        "Opener drive worn, parts availability poor",
        "Replacement more economical than repair",
      ],
    },
    solution: {
      intro:
        "The old opener came off and a new Superlift unit went on the same rail line, with a new door arm bracket, the remotes programmed and the wall control connected. We set the travel limits and force settings, tested the safety reversal against an obstruction and demonstrated the manual release before leaving.",
      points: [
        "New Superlift garage door opener installed on the existing rail position",
        "Remotes and wall control programmed",
        "Travel limits, force and safety reversal set and tested",
        "Manual release demonstrated",
      ],
    },
    partsUsed: ["Superlift garage door opener", "Door arm & rail bracket", "Remote programming", "Limit, force & safety-reversal set-up"],
    relatedServices: [L.opener, L.motors, L.motorCost, L.suburb("Ellenbrook", "garage-door-repairs-ellenbrook"), L.motorDead, L.remotes],
    faqs: [
      {
        question: "Can you replace a Gliderol Glidermatic opener with a different brand?",
        answer:
          "Yes. Sectional door openers are largely interchangeable — the new unit mounts on the ceiling in the same position and drives the same door arm. On this Aveley job the Glidermatic was replaced with a Superlift in a single visit, using the existing rail line.",
      },
      {
        question: "How long does a garage door opener replacement take?",
        answer:
          "Around one to two hours on site for a straightforward swap like this one, including programming remotes and setting the limits. If the door also needs springs or cables it's still usually a same-day job.",
      },
      costFaq("Aveley", "motor"),
      {
        question: "Which opener brands do you supply in Aveley and Ellenbrook?",
        answer:
          "Superlift, our own Capital 1100N and 1500N motors, Merlin, Chamberlain, B&D, Steel-Line and ATA — matched to your door's size, weight and how often it's used. All come with rolling-code remotes and safety reversal set up on the day.",
      },
      sameDayFaq("Aveley", "Ellenbrook, The Vines, Henley Brook, Brabham and Dayton"),
    ],
    seo: {
      title: "Garage Door Repairs Aveley | Gliderol Opener Replaced",
      description:
        "A failed Gliderol Glidermatic opener on an Aveley sectional door replaced with a new Superlift motor, programmed and safety-tested the same visit. Photos.",
    },
    photos: [
      {
        file: "before-01-glidermatic-motor-replacement-aveley.jpeg",
        slug: "garage-door-opener-replacement-aveley-perth-before",
        alt: "Old grey Gliderol Glidermatic garage door opener on the ceiling rail of a sectional door in Aveley, Perth before replacement",
        caption: "Before — the original Gliderol Glidermatic opener",
      },
      {
        file: "after-01-new-superlift-motor-aveley.jpeg",
        slug: "garage-door-opener-replacement-aveley-perth",
        alt: "New Superlift garage door opener installed on the ceiling rail of a sectional door in Aveley, Perth",
        caption: "After — new Superlift opener on the same rail line",
      },
    ],
    imageOrder: ["garage-door-opener-replacement-aveley-perth-before", "garage-door-opener-replacement-aveley-perth"],
    gallery: [
      {
        photo: "garage-door-opener-replacement-aveley-perth",
        before: "garage-door-opener-replacement-aveley-perth-before",
        title: "Garage Door Opener Replacement in Aveley",
        caption:
          "Before and after in Aveley: the original Gliderol Glidermatic opener replaced with a new Superlift motor on the existing rail — remotes programmed and safety reversal tested.",
        category: "Motors",
        serviceType: "Motor Replacement",
      },
    ],
  },

  /* ---------------- 09 Lynwood — Steel-Line opener → Superlift ---------------- */
  {
    dir: "job 09 - JOB-20260804-008 - Lynwood",
    crmJobId: 15,
    slug: "garage-door-repairs-lynwood-steel-line-motor-replacement-perth",
    suburb: "Lynwood",
    geo: { lat: -32.04, lng: 115.93 },
    wireSuburbSlugs: ["garage-door-repairs-lynwood", "garage-door-repairs-cannington"],
    title: "Garage Door Repairs in Lynwood: Steel-Line Motor Replaced",
    subtitle:
      "A Lynwood sectional door was opening only half-way and behaving unpredictably. The Steel-Line opener was the culprit — we replaced it with a new Superlift motor, set the limits properly and had the door running full travel the same visit.",
    service: "Motor Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New Superlift opener fitted — full, reliable travel restored in one visit.",
    summary: {
      problem: "Door not functioning properly — sometimes opening only half-way.",
      diagnosis: "Steel-Line opener losing its limits and drive; door balance was fine.",
      solution: "New Superlift opener installed, limits and force set, remotes programmed.",
    },
    problem: {
      intro:
        "The homeowner's sectional door had become a lottery: some days it opened fully, others it stopped half-way and had to be sent up again. That intermittent, half-travel behaviour points at the opener — a drive losing power under load or a control board that has stopped holding its limits — rather than at the door hardware, and that's what we found on this Steel-Line unit.",
      points: [
        "Door stopping half-way on some cycles",
        "Behaviour intermittent and getting worse",
        "Steel-Line opener showing drive and limit faults",
      ],
    },
    diagnosis: {
      intro:
        "First the balance test on the manual release: the door held at half height, so the springs weren't the cause. Then the opener — its drive was weak under load and it wouldn't hold a set travel limit, both signs of a unit at the end of its life. A repair would have chased faults on an old board; a new opener fixed all of them at once and came with a warranty.",
      points: [
        "Balance test passed — springs and hardware sound",
        "Opener drive weak under load; limits not holding",
        "Replacement chosen over piecemeal repair",
      ],
    },
    solution: {
      intro:
        "We removed the Steel-Line unit and installed a new Superlift opener on the existing rail line, then set the travel limits and force settings, programmed the remotes and tested the safety reversal. The door now runs its full travel every cycle, quietly.",
      points: [
        "New Superlift garage door opener installed",
        "Travel limits and force settings set from scratch",
        "Remotes programmed, safety reversal tested",
        "Full-travel operation confirmed over repeated cycles",
      ],
    },
    partsUsed: ["Superlift garage door opener", "Remote programming", "Limit, force & safety-reversal set-up"],
    relatedServices: [L.opener, L.stuckHalf, L.motors, L.motorCost, L.suburb("Cannington", "garage-door-repairs-cannington")],
    faqs: [
      {
        question: "Why does my garage door only open half-way?",
        answer:
          "Three usual causes: the opener's travel limit has drifted or its board is failing (as on this Lynwood door), the door is out of balance so the opener's force cut-out trips, or something is physically binding in the tracks. A balance test on the manual release quickly separates the opener from the door.",
      },
      {
        question: "Can a Steel-Line opener be repaired instead of replaced?",
        answer:
          "Sometimes — remotes, sensors and limit resets are quick fixes. But when the drive is weak and the limits won't hold on an older unit, you're paying to chase faults on tired electronics. We'll tell you honestly which it is; here a new Superlift was the better value.",
      },
      costFaq("Lynwood", "motor"),
      residentialFaq("Lynwood"),
      sameDayFaq("Lynwood", "Ferndale, Parkwood, Langford, Cannington, Willetton and Riverton"),
    ],
    seo: {
      title: "Garage Door Repairs Lynwood | Steel-Line Motor Replaced",
      description:
        "A Lynwood sectional door opening only half-way: the failing Steel-Line opener replaced with a new Superlift motor, set up and tested the same visit. Photos.",
    },
    photos: [
      {
        file: "before-01-steel-line-garage-door-opener-lynwood-wa-6147.jpeg",
        slug: "steel-line-garage-door-motor-replacement-lynwood-perth-before",
        alt: "Old black Steel-Line garage door opener on the ceiling rail above a sectional door in Lynwood, Perth before replacement",
        caption: "Before — the Steel-Line opener that was stopping half-way",
      },
      {
        file: "after-01-superlift-garage-door-motor-lynwood-wa-6147.jpeg",
        slug: "steel-line-garage-door-motor-replacement-lynwood-perth",
        alt: "New Superlift garage door opener installed on the ceiling rail above a sectional door in Lynwood, Perth",
        caption: "After — new Superlift opener, full travel restored",
      },
    ],
    imageOrder: ["steel-line-garage-door-motor-replacement-lynwood-perth-before", "steel-line-garage-door-motor-replacement-lynwood-perth"],
    gallery: [
      {
        photo: "steel-line-garage-door-motor-replacement-lynwood-perth",
        before: "steel-line-garage-door-motor-replacement-lynwood-perth-before",
        title: "Steel-Line Garage Door Motor Replaced in Lynwood",
        caption:
          "Before and after in Lynwood: a Steel-Line opener that was stopping half-way replaced with a new Superlift motor — limits set from scratch and full travel restored.",
        category: "Motors",
        serviceType: "Motor Replacement",
      },
    ],
  },

  /* ---------------- 10 Spearwood — stuck door, snapped cable, brackets ---------------- */
  {
    dir: "job 10 - JOB-20260804-009 - Spearwood",
    crmJobId: 16,
    slug: "garage-door-repairs-spearwood-stuck-door-cables-brackets-perth",
    suburb: "Spearwood",
    geo: { lat: -32.107, lng: 115.777 },
    wireSuburbSlugs: ["garage-door-repairs-cockburn-central", "garage-door-repairs-fremantle"],
    title: "Garage Door Repairs in Spearwood: Stuck Door, Snapped Cable & Brackets Replaced",
    subtitle:
      "A Spearwood garage door jammed solid when a corroded lift cable snapped at the bottom bracket. We replaced both cables and both bottom brackets with new rollers, re-levelled the door and had it back in service the same visit.",
    service: "Cable & Bottom Bracket Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New cables, brackets and rollers both sides — the door lifts freely and level again.",
    summary: {
      problem: "Door stuck — a lift cable had snapped and the door was jammed.",
      diagnosis: "Cable corroded through at a rusted bottom bracket; roller and bracket worn.",
      solution: "New galvanised cables, heavy-duty bottom brackets and rollers fitted both sides.",
    },
    problem: {
      intro:
        "The door on this Spearwood home was stuck fast — it wouldn't go up on the opener and was too heavy and lopsided to move by hand. The cause was a snapped lift cable: once one side lets go the door twists in the tracks and locks itself in place. Spearwood sits close enough to the coast that salt air quietly eats away at cables and brackets, and this one had corroded through right at the anchor.",
      points: [
        "Door stuck and unable to lift",
        "Lift cable snapped at the bottom bracket anchor",
        "Salt-air corrosion visible on the cable strands and bracket",
      ],
    },
    diagnosis: {
      intro:
        "The old bottom bracket came off with the frayed cable still attached — the strands had corroded and broken one by one at the anchor, and the roller stem and bracket were worn and rusted. The other side showed the same corrosion, so both cables and both brackets were replaced together rather than repairing one side and waiting for the other to fail.",
      points: [
        "Cable frayed and corroded through at the bracket anchor",
        "Bottom bracket and roller rusted and worn",
        "Opposite side corroded to a similar degree — replaced as a set",
        "Springs, drums and tracks inspected — serviceable",
      ],
    },
    solution: {
      intro:
        "With the door secured and springs de-tensioned we fitted new heavy-duty galvanised bottom brackets with new rollers, ran a matched pair of new galvanised cables to the drums, then squared and levelled the door, re-tensioned the springs and confirmed the balance. The opener's limits and safety reversal were re-set and everything lubricated.",
      points: [
        "New heavy-duty galvanised bottom brackets both sides",
        "New nylon rollers on the bottom brackets",
        "Matched pair of new galvanised lift cables",
        "Door levelled, springs re-tensioned, opener limits and reversal re-set",
      ],
    },
    partsUsed: ["Galvanised lift cables (pair)", "Heavy-duty bottom brackets ×2", "Bottom rollers ×2", "Re-level, balance & safety test"],
    relatedServices: [L.repairs, L.springCable, L.cableBlog, L.suburb("Cockburn Central", "garage-door-repairs-cockburn-central"), L.suburb("Fremantle", "garage-door-repairs-fremantle"), L.maintenance],
    faqs: [
      {
        question: "Why do garage door cables corrode faster near the coast?",
        answer:
          "Salt-laden air settles on the cables and brackets and gets into the strands, and the bottom bracket — closest to the ground and often damp — corrodes first. In coastal suburbs like Spearwood, Coogee and Hamilton Hill we recommend a service every 12 months so worn cables are caught before they snap.",
      },
      {
        question: "My garage door is stuck and won't open — what should I do?",
        answer:
          "Don't force it or keep pressing the remote. Look for a slack or snapped cable and a door sitting crooked; if you see either, leave it and call us. Forcing a jammed door bends panels and pulls rollers from the tracks, turning a cable job into a much bigger repair.",
      },
      costFaq("Spearwood", "repair"),
      residentialFaq("Spearwood"),
      sameDayFaq("Spearwood", "Coogee, Hamilton Hill, Munster, Yangebup, Beeliar and Cockburn Central"),
    ],
    seo: {
      title: "Garage Door Repairs Spearwood | Stuck Door, Cables Fixed",
      description:
        "A stuck Spearwood garage door with a corroded, snapped lift cable: new cables, heavy-duty bottom brackets and rollers both sides, levelled the same visit.",
    },
    photos: [
      {
        file: "before-01-garage-door-brackets-spearwood-wa-6163.jpeg",
        slug: "snapped-garage-door-cable-bracket-spearwood-perth-before",
        alt: "Rusted garage door bottom bracket held in a technician's hand with a frayed, corroded lift cable still attached, removed from a door in Spearwood, Perth",
        caption: "Before — the corroded bracket and frayed cable that came off the door",
      },
      {
        file: "after-01-garage-door-new-brackets-and-new-cables-spearwood-wa-6163.jpeg",
        slug: "snapped-garage-door-cable-bracket-spearwood-perth",
        alt: "New galvanised bottom bracket, roller and lift cable fitted at the base of a sectional garage door in Spearwood, Perth",
        caption: "After — new heavy-duty bracket, roller and cable",
      },
      {
        file: "after-02-garage-door-new-brackets-and-new-cables-spearwood-wa-6163.jpeg",
        slug: "new-garage-door-bottom-bracket-cable-spearwood-perth",
        alt: "Close-up of the new galvanised bottom bracket and cable on the opposite side of a sectional garage door in Spearwood, Perth",
        caption: "The opposite side — replaced as a matched set",
      },
    ],
    imageOrder: [
      "snapped-garage-door-cable-bracket-spearwood-perth-before",
      "snapped-garage-door-cable-bracket-spearwood-perth",
      "new-garage-door-bottom-bracket-cable-spearwood-perth",
    ],
    gallery: [
      {
        photo: "snapped-garage-door-cable-bracket-spearwood-perth",
        before: "snapped-garage-door-cable-bracket-spearwood-perth-before",
        title: "Snapped Garage Door Cable & Bracket Replaced in Spearwood",
        caption:
          "Before and after in Spearwood: a salt-corroded bottom bracket and frayed lift cable that jammed the door, replaced with a new heavy-duty galvanised bracket, roller and cable.",
        category: "BeforeAfter",
        serviceType: "Cable Replacement",
      },
      {
        photo: "new-garage-door-bottom-bracket-cable-spearwood-perth",
        title: "New Bottom Bracket & Cable, Spearwood",
        caption:
          "The second side of the Spearwood job — cables, brackets and rollers are always replaced as a set so both sides of the door wear evenly.",
        category: "Repairs",
        serviceType: "Cable Replacement",
      },
    ],
  },

  /* ---------------- 11 Bennett Springs — car impact ---------------- */
  {
    dir: "job 11 - JOB-20260804-010 - Bannett Springs",
    crmJobId: 17,
    slug: "garage-door-repairs-bennett-springs-car-impact-perth",
    suburb: "Bennett Springs",
    geo: { lat: -31.876, lng: 115.943 },
    wireSuburbSlugs: ["garage-door-repairs-dayton"],
    title: "Garage Door Repairs in Bennett Springs: Sectional Door Hit by a Car",
    subtitle:
      "A car backed into a sectional door in Bennett Springs, knocking the rollers out of the track, bending the horizontal track and throwing the cables off. We straightened the tracks, re-seated the rollers, re-set the cables and levelled the door — no new panels needed.",
    service: "Impact Damage Repair",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Tracks straightened, rollers back in, cables reset — the door operates again without a panel replacement.",
    summary: {
      problem: "Door struck by a vehicle — off its track, tracks bent, cables thrown.",
      diagnosis: "Rollers out of the vertical track, horizontal track bent, cables slack; panels dented but serviceable.",
      solution: "Tracks straightened, rollers re-seated, cables re-adjusted, door levelled and tested.",
    },
    problem: {
      intro:
        "The homeowner had reversed into the closed sectional door — enough to push the bottom panels in, pop the rollers out of the vertical track on one side and shove the door up into the horizontal track, bending it. The cables had gone slack and one had come off its drum. The door was hanging skewed in the opening and couldn't be moved safely.",
      points: [
        "Vehicle impact from inside the garage",
        "Rollers knocked out of the vertical track on one side",
        "Horizontal track bent at the curve; cables slack and off the drum",
        "Door skewed and jammed in the opening",
      ],
    },
    diagnosis: {
      intro:
        "The good news was that the panels — a woodgrain-finish sectional — were dented but not creased or split, and the hinges had held. That meant the door could be saved rather than re-panelled. The tracks and cable system had taken the impact: the horizontal track needed straightening, the rollers needed re-seating and both cables needed re-setting and re-tensioning before the door could be levelled.",
      points: [
        "Panels dented but structurally sound — no replacement needed",
        "Hinges and roller carriers intact",
        "Horizontal track bent; vertical track needed re-aligning",
        "Cables slack, one off the drum — reset rather than replaced",
      ],
    },
    solution: {
      intro:
        "With the door supported we straightened the bent horizontal track, re-aligned the vertical track, walked the rollers back into the track and re-seated the cable on its drum, then re-tensioned both cables evenly and levelled the door in the opening. The door was cycled by hand and on the opener, the limits and safety reversal re-set, and everything lubricated.",
      points: [
        "Horizontal track straightened and vertical track re-aligned",
        "Rollers re-seated in the track",
        "Cables re-seated on the drums and re-tensioned evenly",
        "Door levelled, opener limits and safety reversal re-set",
      ],
    },
    partsUsed: ["Track straightening & re-alignment", "Roller re-seat", "Cable reset & re-tension", "Level, balance & safety test"],
    relatedServices: [L.offTrack, L.panels, L.repairs, L.emergency, L.suburb("Dayton", "garage-door-repairs-dayton"), L.repairCost],
    faqs: [
      {
        question: "Can a garage door hit by a car be repaired, or does it need replacing?",
        answer:
          "Often it can be repaired — as here in Bennett Springs, where the panels were dented but not creased and the damage was in the tracks, rollers and cables. If a panel is folded, split or its hinge fixings have torn out, that panel is replaced; the whole door only when several panels are creased or the frame is bent beyond straightening.",
      },
      {
        question: "What should I do straight after backing into my garage door?",
        answer:
          "Stop, don't try to open or close it, and don't move the car back out if the door is resting on it — you can pull the door down. Keep people clear and call us; impact damage is a same-day emergency job and the sooner it's stabilised the more of the door we can save.",
      },
      {
        question: "Will my insurance cover a garage door hit by a car?",
        answer:
          "Usually, under either your home or your comprehensive car policy. We provide an itemised written quote and photos of the damage that you can attach to a claim.",
      },
      costFaq("Bennett Springs", "repair"),
      sameDayFaq("Bennett Springs", "Dayton, Caversham, Beechboro, Kiara, Lockridge and Malaga"),
    ],
    seo: {
      title: "Garage Door Repairs Bennett Springs | Door Hit by Car",
      description:
        "A sectional door in Bennett Springs knocked off its tracks by a car — tracks straightened, rollers re-seated and cables reset, no new panels needed. Photos.",
    },
    photos: [
      {
        file: "before-01-garage-door-wheels-out-bannett-springs.jpeg",
        slug: "garage-door-hit-by-car-bennett-springs-perth-before",
        alt: "Sectional garage door in Bennett Springs, Perth hanging skewed in the opening with its rollers knocked out of the track after a car impact",
        caption: "The door skewed in the opening after the impact",
      },
      {
        file: "before-02-garage-door-bended-track-bannett-springs.jpeg",
        slug: "bent-garage-door-track-bennett-springs-perth",
        alt: "Bent horizontal garage door track above the door opening in Bennett Springs, Perth after a vehicle impact",
        caption: "The horizontal track bent at the curve",
      },
      {
        file: "before-03-garage-door-cable-repair-bannett-springs.jpeg",
        slug: "garage-door-cable-off-drum-impact-bennett-springs-perth",
        alt: "Woodgrain sectional garage door in Bennett Springs, Perth pushed out of its guide with the lift cable hanging slack after a car hit it",
        caption: "Cable slack and the door pushed out of its guide",
      },
      {
        file: "before-04-garage-door-impact-bannett-springs.jpeg",
        slug: "garage-door-rollers-out-of-track-bennett-springs-perth",
        alt: "Close-up of a sectional garage door hinge and roller popped out of the vertical track in Bennett Springs, Perth",
        caption: "Rollers popped out of the vertical track",
      },
    ],
    imageOrder: [
      "garage-door-hit-by-car-bennett-springs-perth-before",
      "bent-garage-door-track-bennett-springs-perth",
      "garage-door-cable-off-drum-impact-bennett-springs-perth",
      "garage-door-rollers-out-of-track-bennett-springs-perth",
    ],
    gallery: [
      {
        photo: "garage-door-hit-by-car-bennett-springs-perth-before",
        title: "Garage Door Hit by a Car in Bennett Springs",
        caption:
          "A sectional door in Bennett Springs after a car reversed into it — rollers out of the track, horizontal track bent and cables thrown. Straightened, re-tracked and levelled without new panels.",
        category: "Repairs",
        serviceType: "Impact Damage Repair",
      },
      {
        photo: "bent-garage-door-track-bennett-springs-perth",
        title: "Bent Garage Door Track, Bennett Springs",
        caption:
          "The horizontal track bent at the curve by the impact — straightened and re-aligned on site so the door could be re-tracked and put back into service.",
        category: "Repairs",
        serviceType: "Track Repair",
      },
    ],
  },

  /* ---------------- 12 Caversham — Avanti opener + rusted springs ---------------- */
  {
    dir: "job 12 - JOB-20260804-006 - Caversham",
    crmJobId: 13,
    slug: "garage-door-repairs-caversham-motor-springs-replacement-perth",
    suburb: "Caversham",
    geo: { lat: -31.88, lng: 115.976 },
    wireSuburbSlugs: ["garage-door-repairs-dayton", "garage-door-repairs-midland"],
    title: "Garage Door Repairs in Caversham: New Motor & Rusted Springs Replaced",
    subtitle:
      "A Caversham sectional door stopped going up or down: the Avanti opener had failed and the torsion springs above it were rusted and tired. We replaced both springs and fitted a new Ezi-Lift opener in one visit, so the new motor drives a properly balanced door.",
    service: "Motor & Spring Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New Ezi-Lift opener plus a new pair of torsion springs — the door runs quietly and balanced.",
    summary: {
      problem: "Door wouldn't go up or down — opener dead, door heavy.",
      diagnosis: "Avanti opener failed; torsion springs rusted and past their working life.",
      solution: "New torsion springs fitted and balanced, then a new Ezi-Lift opener installed and set up.",
    },
    problem: {
      intro:
        "The homeowner's door had stopped in every sense — the Avanti opener wasn't responding, and on the manual release the door was far too heavy to lift comfortably. Above the door the reason for the second half of that was plain: a pair of torsion springs coated in orange rust, the coils pitted and the tension long gone. The opener had spent years doing the springs' job before it gave up.",
      points: [
        "Opener unresponsive — door wouldn't move on the remote",
        "Door very heavy on the manual release",
        "Torsion springs heavily rusted and out of tension",
      ],
    },
    diagnosis: {
      intro:
        "This is the classic pairing we see across the Swan Valley estates: springs that were never serviced lose tension, the opener compensates until it burns out, and the homeowner books a motor replacement. Fitting a new opener onto rusted, weak springs would have repeated the cycle. Both had to be done, and doing them in one visit saved a second call-out.",
      points: [
        "Springs rusted and pitted — end of service life",
        "Door failed the half-height balance test",
        "Avanti opener failed and uneconomical to repair",
        "Cables, drums and bearing inspected — serviceable",
      ],
    },
    solution: {
      intro:
        "We fitted a new matched pair of torsion springs, wound them to the door's weight and balanced it by hand, then installed a new Ezi-Lift 1200 opener with LED lighting on the existing rail line. Remotes were programmed, travel limits and force set, safety reversal tested and the door's moving parts lubricated before handover.",
      points: [
        "New pair of torsion springs fitted and balanced",
        "New Ezi-Lift 1200 sectional door opener installed",
        "Remotes programmed, limits and force set, safety reversal tested",
        "Full lubrication service",
      ],
    },
    partsUsed: ["Torsion springs (pair)", "Ezi-Lift 1200 garage door opener", "Remote programming", "Balance & safety-reversal test"],
    relatedServices: [L.opener, L.springs, L.motors, L.motorCost, L.springCost, L.suburb("Dayton", "garage-door-repairs-dayton"), L.suburb("Midland", "garage-door-repairs-midland")],
    faqs: [
      {
        question: "Why do garage door springs rust, and does rust matter?",
        answer:
          "Springs are bare high-carbon steel; humidity and a lack of lubrication let surface rust form, which pits the wire and creates stress points. A rusted spring loses tension and snaps years earlier than a lightly oiled one. On this Caversham door the springs were rusted through their coating and well past their working life.",
      },
      {
        question: "Do I need new springs when I replace my garage door motor?",
        answer:
          "Only if the balance test fails — but it often does on doors that have never been serviced. A new opener on weak springs works overtime and wears early. We test every door before fitting a motor and only recommend springs when the door genuinely needs them.",
      },
      {
        question: "What opener did you install?",
        answer:
          "An Ezi-Lift 1200 sectional door opener — a quiet, LED-lit unit with soft start/stop, rolling-code remotes and safety reversal, well suited to a standard double sectional door. We also supply our own Capital 1100N/1500N motors and Merlin, Chamberlain and Superlift units.",
      },
      costFaq("Caversham", "motor"),
      sameDayFaq("Caversham", "Dayton, Bennett Springs, West Swan, Guildford, Midland and Ellenbrook"),
    ],
    seo: {
      title: "Garage Door Repairs Caversham | New Motor & Springs Fitted",
      description:
        "A Caversham sectional door with a dead Avanti opener and rusted springs — new torsion springs and an Ezi-Lift 1200 motor fitted in one visit. Real photos.",
    },
    photos: [
      {
        file: "before-01-broken-motor-caversham-wa-6055.jpeg",
        slug: "garage-door-motor-replacement-caversham-perth-before",
        alt: "Old Avanti garage door opener on the ceiling rail above a grey sectional door in Caversham, Perth before replacement",
        caption: "Before — the failed Avanti opener",
      },
      {
        file: "after-01-new-1100n-motor-caversham-wa-6055.jpeg",
        slug: "garage-door-motor-replacement-caversham-perth",
        alt: "New Ezi-Lift 1200 garage door opener with LED light installed on the ceiling rail above a grey sectional door in Caversham, Perth",
        caption: "After — new Ezi-Lift 1200 opener with LED lighting",
      },
      {
        file: "before-02-old-springs-caversham-wa-6055.jpeg",
        slug: "rusted-garage-door-springs-caversham-perth-before",
        alt: "Rusted orange torsion springs above a grey sectional garage door in Caversham, Perth before replacement",
        caption: "Before — rusted, tired torsion springs",
      },
      {
        file: "after-02-new-springs-caversham-wa-6055.jpeg",
        slug: "rusted-garage-door-springs-caversham-perth",
        alt: "New pair of black torsion springs installed above a grey sectional garage door in Caversham, Perth",
        caption: "After — new matched pair of torsion springs",
      },
    ],
    imageOrder: [
      "garage-door-motor-replacement-caversham-perth-before",
      "garage-door-motor-replacement-caversham-perth",
      "rusted-garage-door-springs-caversham-perth-before",
      "rusted-garage-door-springs-caversham-perth",
    ],
    gallery: [
      {
        photo: "garage-door-motor-replacement-caversham-perth",
        before: "garage-door-motor-replacement-caversham-perth-before",
        title: "Garage Door Motor Replacement in Caversham",
        caption:
          "Before and after in Caversham: a failed Avanti opener replaced with a new Ezi-Lift 1200 motor — fitted with new springs so the opener drives a balanced door.",
        category: "Motors",
        serviceType: "Motor Replacement",
      },
      {
        photo: "rusted-garage-door-springs-caversham-perth",
        before: "rusted-garage-door-springs-caversham-perth-before",
        title: "Rusted Garage Door Springs Replaced in Caversham",
        caption:
          "Before and after in Caversham: heavily rusted torsion springs that had lost their tension, replaced with a new matched pair and the door balanced by hand.",
        category: "BeforeAfter",
        serviceType: "Spring Replacement",
      },
    ],
  },

  /* ---------------- 13 Padbury — roller door guide tracks (assigned suburb) ---------------- */
  {
    dir: "job 13 - PHOTOS-01 - Padbury",
    slug: "garage-door-repairs-padbury-roller-door-tracks-perth",
    suburb: "Padbury",
    geo: { lat: -31.807, lng: 115.767 },
    wireSuburbSlugs: ["garage-door-repairs-padbury", "garage-door-repairs-kingsley", "garage-door-repairs-joondalup"],
    title: "Garage Door Repairs in Padbury: Rusted Roller Door Guide Tracks Replaced",
    subtitle:
      "The roller door on an older brick carport in Padbury was scraping and binding in corroded guide tracks. We fitted new galvanised guides plumb to the brick piers, re-hung the curtain and had it running smoothly again — the customer kept their door and opener.",
    service: "Roller Door Track Replacement",
    doorType: "Roller",
    jobType: "Repair",
    result: "New galvanised guide tracks both sides — the door runs smoothly and quietly for its full height.",
    summary: {
      problem: "Roller door binding and scraping in its guides.",
      diagnosis: "Original guide tracks corroded where they meet the brick piers; curtain and drum still sound.",
      solution: "New galvanised guide tracks fitted both sides, curtain re-hung and re-tensioned.",
    },
    problem: {
      intro:
        "This roller door on a double-brick carport had become hard work — scraping on the way up, catching on the way down and chewing the edges of its curtain. The original steel guide tracks had rusted where they meet the brick piers, and the steel lintel above the opening was heavily corroded too, so the curtain no longer ran true. Padbury's 1970s–80s brick-and-tile homes were largely built with steel roller doors, and after forty-odd years the guides are usually the first thing to rust out.",
      points: [
        "Curtain scraping and binding through its travel",
        "Guide tracks corroded at the brick pier faces",
        "Rusted lintel visible above the opening",
      ],
    },
    diagnosis: {
      intro:
        "The curtain itself was straight and the drum and opener were sound, so this didn't need a new door — just new guides. Replacing tracks alone restores smooth travel at a fraction of the cost of a new roller door, provided the curtain hasn't been bent or split by the binding. Here it hadn't.",
      points: [
        "Curtain straight, not split or badly corroded — retained",
        "Drum, springs and opener serviceable",
        "Guide tracks beyond cleaning — replaced",
      ],
    },
    solution: {
      intro:
        "We removed the worn guides, cleaned back the brick pier faces and fitted new galvanised guide tracks plumb and square to the opening on both sides. The curtain was re-hung and re-tensioned in the new guides, the running edges lubricated, and the full travel checked by hand and on the opener.",
      points: [
        "Old guide tracks removed, pier faces cleaned back",
        "New galvanised guide tracks fitted plumb and square both sides",
        "Curtain re-hung and re-tensioned",
        "Running edges lubricated, full travel tested",
      ],
    },
    partsUsed: ["Galvanised roller door guide tracks (pair)", "Fixings for brick piers", "Curtain re-hang & tension", "Lubrication service"],
    relatedServices: [L.suburb("Padbury", "garage-door-repairs-padbury"), L.roller, L.rollerDoors, L.suburb("Kingsley", "garage-door-repairs-kingsley"), L.suburb("Joondalup", "garage-door-repairs-joondalup"), L.repairCost],
    faqs: [
      {
        question: "Can you replace roller door tracks without replacing the whole door?",
        answer:
          "Yes — if the curtain and drum are still sound, new guide tracks alone restore smooth travel, as on this Padbury carport. We only recommend a new door when the curtain itself is bent, split or badly corroded.",
      },
      {
        question: "Why does my roller door scrape or jam on one side?",
        answer:
          "Usually worn or corroded guide tracks, a curtain that has shifted on the drum, or a rusted lintel letting the whole assembly sag. A service visit identifies which one it is before any parts are ordered.",
      },
      costFaq("Padbury", "repair"),
      {
        question: "How long do new galvanised guide tracks last?",
        answer:
          "Decades — galvanised steel resists the rust that ate the originals, especially on carports open to the weather. An occasional clean and a light lubricant on the running edges is all they need.",
      },
      sameDayFaq("Padbury", "Hillarys, Craigie, Kingsley, Woodvale, Duncraig and the Joondalup corridor"),
    ],
    seo: {
      title: "Garage Door Repairs Padbury | Roller Door Tracks Replaced",
      description:
        "Rusted roller door guide tracks replaced on an older brick home in Padbury. Same-day garage door repairs across Perth's northern suburbs.",
    },
    photos: [
      {
        file: "after-01-new-galvanised-guide-track-on-brick-pier-padbury.jpeg",
        slug: "roller-door-guide-track-replacement-padbury-perth",
        alt: "New galvanised roller door guide track fitted to a brick pier in Padbury, Perth",
        caption: "New galvanised guide track fitted plumb to the brick pier",
      },
      {
        file: "after-02-carport-opening-with-new-roller-door-tracks-padbury.jpeg",
        slug: "roller-door-new-tracks-carport-padbury-perth",
        alt: "Older brick carport in Padbury, Perth with new roller door guide tracks fitted both sides of the opening",
        caption: "The carport opening with new tracks both sides — the rusted lintel shows why the originals failed",
      },
    ],
    imageOrder: ["roller-door-guide-track-replacement-padbury-perth", "roller-door-new-tracks-carport-padbury-perth"],
    gallery: [
      {
        photo: "roller-door-guide-track-replacement-padbury-perth",
        title: "Roller Door Guide Tracks Replaced in Padbury",
        caption:
          "New galvanised roller door guide tracks fitted to the brick piers of an older Padbury carport — the curtain and opener were kept, so a track replacement cost a fraction of a new door.",
        category: "RollerDoors",
        serviceType: "Roller Door Repair",
      },
    ],
  },

  /* ---------------- 14 Forrestfield — Centurion cable + bottom brackets (assigned) ---------------- */
  {
    dir: "job 14 - PHOTOS-02 - Forrestfield",
    slug: "garage-door-repairs-forrestfield-snapped-cable-brackets-perth",
    suburb: "Forrestfield",
    geo: { lat: -31.986, lng: 116.011 },
    wireSuburbSlugs: ["garage-door-repairs-kalamunda"],
    title: "Garage Door Repairs in Forrestfield: Snapped Cable & Bottom Brackets on a Centurion Door",
    subtitle:
      "A Centurion sectional door in Forrestfield dropped a frayed lift cable at a worn bottom bracket. We fitted new heavy-duty bottom brackets and rollers, a new pair of cables, and re-seated the door in its tracks the same visit.",
    service: "Cable & Bottom Bracket Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New cables, brackets and rollers both sides — the door lifts level and true again.",
    summary: {
      problem: "Lift cable frayed and snapped at the bottom bracket — door out of level and unsafe.",
      diagnosis: "Original Centurion bottom brackets worn at the roller stem; both cables at end of life.",
      solution: "New heavy-duty brackets, rollers and a matched pair of cables; door re-seated and levelled.",
    },
    problem: {
      intro:
        "The homeowner noticed the lift cable on one side of their Centurion sectional door hanging loose at the bottom bracket, and the door starting to lift unevenly. On closer inspection the cable had frayed strand by strand at the anchor and finally parted — with one side unloaded the door twists in the tracks and becomes unsafe to run.",
      points: [
        "Lift cable frayed and snapped at the bottom-bracket anchor",
        "Door lifting unevenly and starting to bind",
        "Original Centurion bottom bracket worn at the roller stem",
      ],
    },
    diagnosis: {
      intro:
        "Laid side by side, the old and new brackets told the story: the original pressed-steel bracket had worn oval where the roller stem sits and the cable anchor had chewed through the strands. The other side had the same wear, so cables and brackets were replaced as a set — the standard fix on a door of this age.",
      points: [
        "Cable frayed through at the bracket anchor",
        "Bracket worn at the roller stem — replaced with a heavy-duty unit",
        "Opposite side showing identical wear — replaced together",
        "Springs, drums and tracks inspected — serviceable",
      ],
    },
    solution: {
      intro:
        "With the door secured and springs de-tensioned we removed both bottom brackets, fitted new heavy-duty galvanised brackets with new rollers, ran a matched pair of new galvanised cables to the drums, and re-seated the door in the vertical tracks. Springs were re-tensioned, the door levelled and balanced, and the opener limits and safety reversal re-set.",
      points: [
        "New heavy-duty galvanised bottom brackets both sides",
        "New rollers fitted with the brackets",
        "Matched pair of new galvanised lift cables",
        "Door re-seated, levelled, springs re-tensioned, opener re-set",
      ],
    },
    partsUsed: ["Galvanised lift cables (pair)", "Heavy-duty bottom brackets ×2", "Bottom rollers ×2", "Re-level, balance & safety test"],
    relatedServices: [L.repairs, L.springCable, L.cableBlog, L.emergency, L.repairCost],
    faqs: [
      {
        question: "Why do Centurion sectional door cables fray at the bottom bracket?",
        answer:
          "It isn't brand-specific — every sectional door anchors its cable at the bottom bracket, and that's where grit, moisture and constant flexing wear the strands. Once the bracket itself wears at the roller stem the cable angle changes and fraying accelerates, as it did on this Forrestfield door.",
      },
      {
        question: "Can I keep using the door if one cable is loose?",
        answer:
          "No — a loose or frayed cable is about to snap, and a door with one cable gone hangs unevenly on the other. Stop using it and call; we carry the brackets, rollers and cables to fix it in one visit across Forrestfield and the foothills.",
      },
      costFaq("Forrestfield", "repair"),
      {
        question: "Do you also install new garage doors in Forrestfield?",
        answer:
          "Yes — sectional, roller and custom doors, supplied and installed with a new opener if wanted. Where a door like this one is structurally sound we'll always quote the repair first; a new door only makes sense when the panels or curtain are past saving.",
      },
      sameDayFaq("Forrestfield", "High Wycombe, Maida Vale, Kalamunda, Lesmurdie, Wattle Grove and Kewdale"),
    ],
    seo: {
      title: "Garage Door Repairs Forrestfield | Cable & Brackets Fixed",
      description:
        "Frayed lift cable and worn bottom brackets on a Centurion sectional door in Forrestfield — new cables, heavy-duty brackets and rollers fitted the same visit.",
    },
    photos: [
      {
        file: "before-01-loose-lift-cable-at-worn-bottom-bracket-forrestfield.jpeg",
        slug: "snapped-garage-door-cable-forrestfield-perth-before",
        alt: "Loose, frayed lift cable hanging at a worn bottom bracket on a Centurion sectional garage door in Forrestfield, Perth",
        caption: "Before — the cable frayed loose at the worn bottom bracket",
        crop: { top: 0.18 },
      },
      {
        file: "after-01-new-heavy-duty-bottom-bracket-and-roller-forrestfield.jpeg",
        slug: "snapped-garage-door-cable-forrestfield-perth",
        alt: "New heavy-duty galvanised bottom bracket and roller fitted to a Centurion sectional garage door in Forrestfield, Perth",
        caption: "After — new heavy-duty bracket, roller and cable",
      },
      {
        file: "before-02-frayed-snapped-lift-cable-removed-forrestfield.jpeg",
        slug: "frayed-garage-door-cable-forrestfield-perth",
        alt: "Frayed, snapped garage door lift cable removed from a sectional door in Forrestfield, Perth",
        caption: "The frayed cable that came off the door",
      },
      {
        file: "after-02-door-re-seated-in-vertical-track-forrestfield.jpeg",
        slug: "garage-door-re-seated-in-track-forrestfield-perth",
        alt: "Sectional garage door re-seated in its vertical track with a new bottom bracket in Forrestfield, Perth",
        caption: "Door re-seated in the vertical track and levelled",
      },
      {
        file: "other-01-new-bottom-bracket-beside-worn-centurion-bracket-forrestfield.jpeg",
        slug: "new-vs-worn-garage-door-bottom-bracket-forrestfield-perth",
        alt: "New heavy-duty garage door bottom bracket beside the worn original Centurion bracket in Forrestfield, Perth",
        caption: "New heavy-duty bracket beside the worn original",
      },
    ],
    imageOrder: [
      "snapped-garage-door-cable-forrestfield-perth-before",
      "snapped-garage-door-cable-forrestfield-perth",
      "frayed-garage-door-cable-forrestfield-perth",
      "garage-door-re-seated-in-track-forrestfield-perth",
      "new-vs-worn-garage-door-bottom-bracket-forrestfield-perth",
    ],
    gallery: [
      {
        photo: "snapped-garage-door-cable-forrestfield-perth",
        before: "snapped-garage-door-cable-forrestfield-perth-before",
        title: "Snapped Garage Door Cable & Bracket Replaced in Forrestfield",
        caption:
          "Before and after in Forrestfield: a frayed lift cable at a worn Centurion bottom bracket, replaced with a new heavy-duty galvanised bracket, roller and cable — both sides done as a set.",
        category: "BeforeAfter",
        serviceType: "Cable Replacement",
      },
      {
        photo: "new-vs-worn-garage-door-bottom-bracket-forrestfield-perth",
        title: "New vs Worn Bottom Bracket, Forrestfield",
        caption:
          "Side by side in Forrestfield: the new heavy-duty bottom bracket next to the worn original — the roller-stem wear is what changed the cable angle and frayed it through.",
        category: "Repairs",
        serviceType: "Cable Replacement",
      },
    ],
  },

  /* ---------------- 15 Secret Harbour — door off track (assigned) ---------------- */
  {
    dir: "job 15 - PHOTOS-03 - Secret Harbour",
    slug: "garage-door-repairs-secret-harbour-door-off-track-perth",
    suburb: "Secret Harbour",
    geo: { lat: -32.406, lng: 115.757 },
    wireSuburbSlugs: ["garage-door-repairs-rockingham", "garage-door-repairs-port-kennedy"],
    title: "Garage Door Repairs in Secret Harbour: Sectional Door Off Its Tracks",
    subtitle:
      "A sectional door in Secret Harbour came off its horizontal track, the top panels sagging out of line and the door stuck part-open. We re-tracked the door, checked the rollers and cables, reconnected the opener and had it running full travel the same visit.",
    service: "Off-Track Repair",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Door re-tracked, rollers and cables checked, opener reconnected — running full travel again.",
    summary: {
      problem: "Door off its track — panels sagging off the horizontal rail, door stuck part-open.",
      diagnosis: "Rollers had jumped the horizontal track; hardware sound, no bent panels.",
      solution: "Door re-tracked, track alignment checked, rollers seated, opener reconnected and re-set.",
    },
    problem: {
      intro:
        "The homeowner found their sectional door stuck part-open with the top panels sagging away from the horizontal track on one side — the rollers had jumped out. A door in that state can't be closed and shouldn't be forced: the panels are hanging on the hinges and the remaining rollers, and pushing it either way risks bending them.",
      points: [
        "Top panels sagging off the horizontal track",
        "Door stuck part-open, unable to close",
        "Rollers jumped out of the horizontal rail on one side",
      ],
    },
    diagnosis: {
      intro:
        "We checked why the rollers had come out before putting them back — a bent track, a worn roller or a slack cable will just throw the door again. Here the track was straight and the cables intact; the rollers were serviceable, and the door had most likely been bumped or run with something in its path. Coastal suburbs like Secret Harbour also see more corrosion in roller stems, so each one was checked.",
      points: [
        "Horizontal track straight and securely fixed",
        "Cables intact and on their drums",
        "Rollers checked for wear and corrosion — serviceable",
        "No creased or split panels",
      ],
    },
    solution: {
      intro:
        "With the door supported we walked the panels back into line, seated every roller in the track and confirmed the track alignment, then reconnected the door to the opener and cycled it slowly by hand and on the motor. Travel limits and safety reversal were re-set and the rollers and hinges lubricated.",
      points: [
        "Panels realigned and rollers re-seated in the track",
        "Track alignment and fixings checked",
        "Opener reconnected, limits and safety reversal re-set",
        "Rollers and hinges lubricated",
      ],
    },
    partsUsed: ["Re-track & realignment (no parts required)", "Roller & cable inspection", "Opener limit & safety-reversal reset", "Lubrication service"],
    relatedServices: [L.offTrack, L.repairs, L.suburb("Rockingham", "garage-door-repairs-rockingham"), L.suburb("Baldivis", "garage-door-repairs-baldivis"), L.emergency],
    faqs: [
      {
        question: "Why did my garage door come off its track?",
        answer:
          "Most often the door was bumped or ran into something in its path, a roller has worn or corroded, a cable has gone slack, or a track fixing has loosened. We find and fix the cause before re-tracking — otherwise the door simply comes off again.",
      },
      {
        question: "Can I push a garage door back onto its track myself?",
        answer:
          "We'd advise against it. The panels are heavy, the springs are under tension, and forcing a sagging door bends panels and hinges. Leave it where it is, don't run the opener, and call — an off-track door is a same-day job for us across Secret Harbour and Rockingham.",
      },
      costFaq("Secret Harbour", "repair"),
      {
        question: "Does living near the beach affect my garage door?",
        answer:
          "Yes — salt air corrodes roller stems, cables, brackets and springs faster than inland. In Secret Harbour, Golden Bay and Warnbro we recommend a service every 12 months so worn parts are replaced before they cause a jam or off-track like this one.",
      },
      sameDayFaq("Secret Harbour", "Golden Bay, Singleton, Port Kennedy, Warnbro, Baldivis and Rockingham"),
    ],
    seo: {
      title: "Garage Door Repairs Secret Harbour | Door Off Track Fixed",
      description:
        "A sectional door off its tracks in Secret Harbour, stuck part-open — re-tracked, rollers and cables checked, opener reconnected and running the same visit.",
    },
    photos: [
      {
        file: "before-01-panels-sagging-off-the-horizontal-track-secret-harbour.jpeg",
        slug: "garage-door-off-track-secret-harbour-perth-before",
        alt: "Sectional garage door in Secret Harbour, Perth with its top panels sagging off the horizontal track, stuck part-open",
        caption: "Before — panels sagging off the horizontal track",
      },
      {
        file: "after-01-door-open-and-running-on-the-opener-secret-harbour.jpeg",
        slug: "garage-door-off-track-secret-harbour-perth",
        alt: "The same sectional garage door in Secret Harbour, Perth open and running normally on its opener after being re-tracked",
        caption: "After — door re-tracked and running on the opener",
      },
      {
        file: "other-01-door-re-tracked-opener-reconnected-secret-harbour.jpeg",
        slug: "garage-door-re-tracked-opener-secret-harbour-perth",
        alt: "Sectional garage door back in its tracks with the opener reconnected in Secret Harbour, Perth",
        caption: "Rollers seated and the opener reconnected",
      },
    ],
    imageOrder: [
      "garage-door-off-track-secret-harbour-perth-before",
      "garage-door-off-track-secret-harbour-perth",
      "garage-door-re-tracked-opener-secret-harbour-perth",
    ],
    gallery: [
      {
        photo: "garage-door-off-track-secret-harbour-perth",
        before: "garage-door-off-track-secret-harbour-perth-before",
        title: "Garage Door Off Its Track Repaired in Secret Harbour",
        caption:
          "Before and after in Secret Harbour: a sectional door with its top panels sagging off the horizontal track, re-tracked with every roller checked and the opener reconnected the same visit.",
        category: "BeforeAfter",
        serviceType: "Off-Track Repair",
      },
    ],
  },

  /* ---------------- 16 Clarkson — night emergency, jammed half-open (assigned) ---------------- */
  {
    dir: "job 16 - PHOTOS-04 - Clarkson",
    slug: "garage-door-repairs-clarkson-emergency-jammed-door-perth",
    suburb: "Clarkson",
    geo: { lat: -31.683, lng: 115.729 },
    wireSuburbSlugs: ["garage-door-repairs-clarkson", "garage-door-repairs-butler"],
    title: "Emergency Garage Door Repairs in Clarkson: Door Jammed Half-Open at Night",
    subtitle:
      "A Clarkson family's sectional door jammed half-open after dark with both cars inside. A sheared roller stem and a frayed cable were the cause — we replaced the bracket, roller and cable that night and left the door closed, locked and working.",
    service: "Emergency Repair — Roller, Bracket & Cable",
    doorType: "Sectional",
    jobType: "Emergency Repair",
    result: "New bottom bracket, roller and cable fitted after hours — door closed and secure the same night.",
    summary: {
      problem: "Door jammed half-open at night, cars trapped, house unsecured.",
      diagnosis: "Roller stem sheared at the end hinge; lift cable frayed at the drum; bottom bracket worn.",
      solution: "New heavy-duty bottom bracket, roller and cable fitted, door freed, levelled and closed.",
    },
    problem: {
      intro:
        "The call came in the evening: the sectional door had stopped half-way up and wouldn't move either way, with two cars inside and the garage open to the street. A half-open door at night is both a security and a safety problem, so it went straight to the top of the list as an after-hours emergency.",
      points: [
        "Door jammed half-open after dark",
        "Cars trapped inside; garage open to the street",
        "Door unable to move in either direction",
      ],
    },
    diagnosis: {
      intro:
        "Up close the cause was mechanical, not the opener: the roller stem at one end hinge had sheared clean off, dropping that panel edge out of the track, and the lift cable on the same side had frayed at the drum as the door twisted. The bottom bracket was worn where the roller stem sits. Between the missing roller and the damaged cable the door had wedged itself in the tracks.",
      points: [
        "Roller stem sheared at the end hinge — panel edge out of the track",
        "Lift cable frayed at the drum",
        "Bottom bracket worn at the roller stem",
        "Opener undamaged; door wedged mechanically",
      ],
    },
    solution: {
      intro:
        "We secured the door, de-tensioned the springs and fitted a new heavy-duty bottom bracket with a new nylon roller, then replaced the frayed cable, re-seated the panel in the track and re-tensioned and levelled the door. It was cycled by hand and on the opener, the limits and safety reversal re-set, and closed and locked before we left.",
      points: [
        "New heavy-duty bottom bracket and nylon roller fitted",
        "Frayed lift cable replaced and re-run to the drum",
        "Panel re-seated in the track, door levelled and re-tensioned",
        "Opener limits and safety reversal re-set; door closed and secured",
      ],
    },
    partsUsed: ["Heavy-duty bottom bracket", "Nylon roller", "Galvanised lift cable", "After-hours call-out; level, balance & safety test"],
    relatedServices: [L.emergency, L.stuckHalf, L.suburb("Clarkson", "garage-door-repairs-clarkson"), L.suburb("Butler", "garage-door-repairs-butler"), L.repairs, L.repairCost],
    faqs: [
      {
        question: "My garage door is stuck half-open at night — what should I do?",
        answer:
          "Don't keep pressing the remote and don't try to force it down by hand — a door jammed by a broken roller or cable can drop or bend. Pull the manual release only if the door is fully supported. Call us: after-hours emergency call-outs across Clarkson, Butler and the northern corridor are what this service is for.",
      },
      {
        question: "Do you charge extra for after-hours emergency repairs?",
        answer:
          "There is an after-hours call-out component on top of the standard repair, and we tell you what it is on the phone before we leave the depot. Every scenario is quoted from a published price list — see the emergency repairs page for how it works.",
      },
      {
        question: "What causes a garage door roller to shear off?",
        answer:
          "Age and fatigue in the steel stem, a worn bracket letting the roller sit at an angle, or the door being run out of level for a long time. Once one roller goes the panel edge drops out of the track and the door jams — which is exactly what happened on this Clarkson door.",
      },
      costFaq("Clarkson", "repair"),
      sameDayFaq("Clarkson", "Butler, Merriwa, Quinns Rocks, Mindarie, Ridgewood and Tamala Park"),
    ],
    seo: {
      title: "Emergency Garage Door Repairs Clarkson | Jammed Door Fixed",
      description:
        "After-hours emergency garage door repair in Clarkson: sectional door jammed half-open, sheared roller and frayed cable replaced the same night.",
    },
    photos: [
      {
        file: "before-01-door-jammed-half-open-at-night-clarkson.jpeg",
        slug: "emergency-garage-door-repair-clarkson-perth-before",
        alt: "Sectional garage door jammed half-open at night in Clarkson, Perth with cars trapped inside, before the emergency repair",
        caption: "Before — jammed half-open after dark, cars inside",
        pixelate: [
          { x: 0.785, y: 0.415, w: 0.085, h: 0.075 },
          { x: 0.36, y: 0.53, w: 0.11, h: 0.095 },
          { x: 0.485, y: 0.57, w: 0.1, h: 0.065 },
        ],
      },
      {
        file: "after-01-new-bracket-and-roller-fitted-cable-re-run-clarkson.jpeg",
        slug: "emergency-garage-door-repair-clarkson-perth",
        alt: "New heavy-duty bottom bracket and roller fitted with the lift cable re-run on a sectional garage door in Clarkson, Perth",
        caption: "After — new bracket and roller fitted, cable re-run",
      },
      {
        file: "before-02-sheared-roller-stem-at-end-hinge-clarkson.jpeg",
        slug: "sheared-garage-door-roller-stem-clarkson-perth",
        alt: "Sheared garage door roller stem at the end hinge of a sectional door in Clarkson, Perth",
        caption: "The sheared roller stem at the end hinge",
      },
      {
        file: "before-03-worn-end-hinge-and-roller-carrier-clarkson.jpeg",
        slug: "worn-garage-door-end-hinge-clarkson-perth",
        alt: "Worn end hinge and roller carrier on a sectional garage door in Clarkson, Perth",
        caption: "The worn end hinge and roller carrier",
      },
      {
        file: "before-04-frayed-cable-at-the-drum-clarkson.jpeg",
        slug: "frayed-garage-door-cable-drum-clarkson-perth",
        alt: "Frayed garage door lift cable at the cable drum on a sectional door in Clarkson, Perth",
        caption: "The lift cable frayed at the drum",
      },
      {
        file: "other-01-old-bottom-bracket-removed-with-frayed-cable-clarkson.jpeg",
        slug: "old-garage-door-bottom-bracket-clarkson-perth",
        alt: "Old worn garage door bottom bracket removed with its frayed lift cable in Clarkson, Perth",
        caption: "The old bracket and frayed cable, removed",
      },
    ],
    imageOrder: [
      "emergency-garage-door-repair-clarkson-perth-before",
      "emergency-garage-door-repair-clarkson-perth",
      "sheared-garage-door-roller-stem-clarkson-perth",
      "frayed-garage-door-cable-drum-clarkson-perth",
      "worn-garage-door-end-hinge-clarkson-perth",
      "old-garage-door-bottom-bracket-clarkson-perth",
    ],
    gallery: [
      {
        photo: "emergency-garage-door-repair-clarkson-perth",
        before: "emergency-garage-door-repair-clarkson-perth-before",
        title: "Emergency Garage Door Repair in Clarkson",
        caption:
          "Before and after in Clarkson: a sectional door jammed half-open at night with cars inside — sheared roller and frayed cable replaced after hours and the door closed and secured the same night.",
        category: "BeforeAfter",
        serviceType: "Emergency Repair",
      },
      {
        photo: "sheared-garage-door-roller-stem-clarkson-perth",
        title: "Sheared Garage Door Roller, Clarkson",
        caption:
          "The sheared roller stem that dropped a panel edge out of its track and jammed this Clarkson door half-open — replaced with a new heavy-duty bracket and nylon roller.",
        category: "Repairs",
        serviceType: "Roller Replacement",
      },
    ],
  },

  /* ---------------- 17 Butler — Avanti → Chamberlain (assigned) ---------------- */
  {
    dir: "job 17 - PHOTOS-05 - Butler",
    slug: "garage-door-repairs-butler-motor-replacement-chamberlain-perth",
    suburb: "Butler",
    geo: { lat: -31.643, lng: 115.706 },
    wireSuburbSlugs: ["garage-door-repairs-butler", "garage-door-repairs-clarkson"],
    title: "Garage Door Repairs in Butler: Failed Avanti Opener Replaced with a Chamberlain",
    subtitle:
      "The Avanti opener on a Butler sectional door failed outright — light cover hanging open, no drive. We replaced it with a new Chamberlain opener on the existing rail line, programmed the remotes and tested the door the same visit.",
    service: "Motor Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "New Chamberlain opener installed and programmed — quiet, reliable and under warranty.",
    summary: {
      problem: "Avanti opener failed — no drive, door only movable by hand.",
      diagnosis: "Motor unit at end of life; door balance and hardware in good order.",
      solution: "New Chamberlain opener fitted, remotes programmed, limits and safety reversal set.",
    },
    problem: {
      intro:
        "The Avanti opener on this Butler home had reached the end: it no longer drove the door, and the homeowner had been lifting it by hand on the manual release. Butler was built out through the 2000s, and the builder-fitted openers of that era are now failing across the suburb — usually the drive or logic board rather than anything with the door.",
      points: [
        "Opener no longer driving the door",
        "Homeowner operating the door manually",
        "Older Avanti unit, drive and board worn",
      ],
    },
    diagnosis: {
      intro:
        "The balance test came first: released from the opener the door held at half height, so the springs and hardware were fine and the fault was inside the motor unit. With the unit's age and limited parts support, a repair would have been poor value against a new opener with a full warranty and quieter operation.",
      points: [
        "Balance test passed — springs and hardware sound",
        "Avanti opener failed internally; parts support poor",
        "Replacement chosen over repair",
      ],
    },
    solution: {
      intro:
        "We removed the old Avanti and installed a new Chamberlain sectional door opener on the existing rail line, programmed the remotes and the wall control, then set the travel limits and force settings and tested the safety reversal against an obstruction. The manual release and remote pairing were demonstrated before we left.",
      points: [
        "New Chamberlain garage door opener installed",
        "Remotes and wall control programmed",
        "Travel limits, force and safety reversal set and tested",
        "Manual release demonstrated",
      ],
    },
    partsUsed: ["Chamberlain garage door opener", "Remote programming", "Limit, force & safety-reversal set-up"],
    relatedServices: [L.opener, L.motors, L.motorCost, L.suburb("Butler", "garage-door-repairs-butler"), L.motorDead, L.remotes],
    faqs: [
      {
        question: "Can you replace an Avanti opener with a Chamberlain?",
        answer:
          "Yes — sectional door openers are largely interchangeable. The new Chamberlain mounts in the same ceiling position and drives the same door arm; on this Butler job it went on the existing rail line in a single visit.",
      },
      {
        question: "How long does a garage door motor replacement take?",
        answer:
          "Around one to two hours for a straightforward swap like this, including programming remotes and setting the limits. If the door also needs springs or cables it's still usually finished the same day.",
      },
      costFaq("Butler", "motor"),
      {
        question: "How long does a garage door motor last?",
        answer:
          "Ten to fifteen years is typical. The Avanti replaced on this job was the builder-fitted unit from when the home was built, so it had done its time. An out-of-balance door (weak springs) and coastal air both shorten a motor's life — which is why we test the door's balance before fitting a new opener, so the replacement starts on a healthy door.",
      },
      {
        question: "Which garage door openers do you install in Butler?",
        answer:
          "Chamberlain, Merlin, Superlift, B&D, Steel-Line, ATA and our own Capital 1100N and 1500N motors — matched to your door's size and how often it's used. All come with rolling-code remotes and safety reversal set up on the day.",
      },
      sameDayFaq("Butler", "Clarkson, Jindalee, Alkimos, Merriwa, Ridgewood and Quinns Rocks"),
    ],
    seo: {
      title: "Garage Door Repairs Butler | Avanti Opener Replaced",
      description:
        "Failed Avanti opener replaced with a new Chamberlain motor in Butler, programmed and tested the same visit. Garage door motor replacement, Perth north.",
    },
    photos: [
      {
        file: "before-01-failed-avanti-opener-with-light-cover-open-butler.jpeg",
        slug: "garage-door-motor-replacement-butler-perth-before",
        alt: "Failed Avanti garage door opener with its light cover hanging open above a sectional door in Butler, Perth before replacement",
        caption: "Before — the failed Avanti opener",
      },
      {
        file: "after-01-new-chamberlain-opener-installed-butler.jpeg",
        slug: "garage-door-motor-replacement-butler-perth",
        alt: "New Chamberlain garage door opener installed on the ceiling rail above a sectional door in Butler, Perth",
        caption: "After — new Chamberlain opener on the same rail line",
      },
    ],
    imageOrder: ["garage-door-motor-replacement-butler-perth-before", "garage-door-motor-replacement-butler-perth"],
    gallery: [
      {
        photo: "garage-door-motor-replacement-butler-perth",
        before: "garage-door-motor-replacement-butler-perth-before",
        title: "Garage Door Motor Replacement in Butler",
        caption:
          "Before and after in Butler: a failed Avanti opener replaced with a new Chamberlain motor on the existing rail — remotes programmed and safety reversal tested the same visit.",
        category: "Motors",
        serviceType: "Motor Replacement",
      },
    ],
  },

  /* ---------------- 18 Kingsley — Guardian chain-drive opener, snapped chain (assigned) ---------------- */
  {
    dir: "job 18 - PHOTOS-06 - Kingsley",
    slug: "garage-door-repairs-kingsley-opener-chain-snapped-perth",
    suburb: "Kingsley",
    geo: { lat: -31.812, lng: 115.803 },
    wireSuburbSlugs: ["garage-door-repairs-kingsley"],
    title: "Garage Door Repairs in Kingsley: Snapped Chain on an Old Guardian Opener",
    subtitle:
      "The drive chain on an old Guardian chain-drive opener in Kingsley snapped and dropped from the rail, leaving the sectional door stranded. With the unit decades old and parts unavailable, we replaced the opener rather than the chain and had the door running the same visit.",
    service: "Opener Replacement",
    doorType: "Sectional",
    jobType: "Repair",
    result: "Old Guardian chain-drive replaced with a new opener — door back on automatic operation.",
    summary: {
      problem: "Opener drive chain snapped and hanging from the rail — door stranded.",
      diagnosis: "Decades-old Guardian chain-drive with no parts support; door hardware sound.",
      solution: "New opener installed on a new rail, remotes programmed, limits and safety reversal set.",
    },
    problem: {
      intro:
        "The homeowner heard a clatter and found the drive chain of their Guardian chain-drive opener hanging slack from the rail — snapped, with the trolley free and the door going nowhere. Guardian units of this vintage were fitted across Kingsley and Woodvale in the 1980s and 90s, and while they were tough, this is how most of them finally retire.",
      points: [
        "Drive chain snapped and hanging from the rail",
        "Trolley disconnected — door not driven",
        "Opener decades old, worn throughout",
      ],
    },
    diagnosis: {
      intro:
        "A new chain alone wasn't the answer: on an opener this old the sprocket, trolley and motor are just as worn, replacement chains for the model are effectively unavailable, and a chain repair carries no warranty. The door itself balanced correctly on the manual release, so a straight opener replacement was the sensible, one-visit fix.",
      points: [
        "Chain, sprocket and trolley all worn; parts unavailable",
        "Door balance test passed — springs and hardware sound",
        "Opener replacement chosen over a chain repair",
      ],
    },
    solution: {
      intro:
        "We removed the old Guardian unit and its rail, installed a new sectional door opener with a new rail and door arm, programmed the remotes and set the travel limits and force settings, then tested the safety reversal against an obstruction and demonstrated the manual release.",
      points: [
        "Old Guardian opener and rail removed",
        "New sectional door opener and rail installed",
        "Remotes programmed, limits and force set",
        "Safety reversal tested, manual release demonstrated",
      ],
    },
    partsUsed: ["New sectional garage door opener & rail", "Door arm & brackets", "Remote programming", "Limit, force & safety-reversal set-up"],
    relatedServices: [L.opener, L.motors, L.motorCost, L.suburb("Kingsley", "garage-door-repairs-kingsley"), L.suburb("Joondalup", "garage-door-repairs-joondalup"), L.motorDead],
    faqs: [
      {
        question: "Can a snapped garage door opener chain be replaced?",
        answer:
          "On a modern opener, yes — chains and belts are service parts. On a decades-old unit like this Guardian, the chain, sprocket and trolley are all worn together and matching parts are usually unobtainable, so a new opener is the honest recommendation. We'll tell you which applies before quoting.",
      },
      {
        question: "Chain drive or belt drive — which should I choose?",
        answer:
          "Belt-drive openers are quieter, which matters if there's a bedroom over the garage; chain drives are robust and cost slightly less. Both come with LED lighting, soft start/stop and rolling-code remotes on the units we fit.",
      },
      costFaq("Kingsley", "motor"),
      {
        question: "Do you also supply new garage doors in Kingsley?",
        answer:
          "Yes — sectional, roller and custom doors, supplied and installed with a matched opener. Where the door is sound, as it was here, we'll always quote the repair or opener first.",
      },
      sameDayFaq("Kingsley", "Woodvale, Greenwood, Padbury, Warwick, Duncraig and Joondalup"),
    ],
    seo: {
      title: "Garage Door Repairs Kingsley | Old Opener Chain Snapped",
      description:
        "Old Guardian chain-drive garage door opener with a snapped chain in Kingsley, replaced with a new opener. Motor repairs and replacement in Perth's north.",
    },
    photos: [
      {
        file: "before-01-old-guardian-chain-drive-opener-kingsley.jpeg",
        slug: "old-guardian-garage-door-opener-kingsley-perth",
        alt: "Old Guardian chain-drive garage door opener on the ceiling of a garage in Kingsley, Perth",
        caption: "The old Guardian chain-drive opener",
      },
      {
        file: "before-03-snapped-drive-chain-hanging-from-rail-kingsley.jpeg",
        slug: "snapped-garage-door-opener-chain-kingsley-perth",
        alt: "Snapped drive chain hanging from the rail of an old Guardian garage door opener in Kingsley, Perth",
        caption: "The snapped drive chain hanging from the rail",
      },
      {
        file: "before-02-guardian-opener-with-slack-chain-kingsley.jpeg",
        slug: "guardian-opener-slack-chain-kingsley-perth",
        alt: "Guardian garage door opener with a slack, broken drive chain in Kingsley, Perth",
        caption: "Chain slack at the opener head",
      },
      {
        file: "before-04-sectional-door-with-broken-opener-chain-kingsley.jpeg",
        slug: "sectional-door-broken-opener-chain-kingsley-perth",
        alt: "Sectional garage door in Kingsley, Perth stranded with a broken opener chain above it",
        caption: "The stranded sectional door beneath the broken opener",
      },
    ],
    imageOrder: [
      "snapped-garage-door-opener-chain-kingsley-perth",
      "old-guardian-garage-door-opener-kingsley-perth",
      "guardian-opener-slack-chain-kingsley-perth",
      "sectional-door-broken-opener-chain-kingsley-perth",
    ],
    gallery: [
      {
        photo: "snapped-garage-door-opener-chain-kingsley-perth",
        title: "Snapped Opener Chain on a Guardian Unit, Kingsley",
        caption:
          "The drive chain snapped and hanging from the rail of a decades-old Guardian chain-drive opener in Kingsley — replaced with a new opener rather than an unobtainable chain.",
        category: "Motors",
        serviceType: "Motor Replacement",
      },
    ],
  },
];
