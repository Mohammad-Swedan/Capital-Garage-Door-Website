import type { Article } from "@/types/article";

/**
 * /blog/how-to-program-a-garage-door-remote — help-hub post #1 (2026-08).
 *
 * Targets the biggest question cluster from the Semrush pull
 * (docs/marketing/semrush-2026-08/): "how to set up garage door remote"
 * 1,300/mo KD 18, "how to program remote control for garage door" 1,000/18,
 * "how to program garage door remote" 720/17 + ~10 variants at 170–390/mo.
 * Funnels to /garage-door-remote-replacement-perth and the opener-repair page.
 * Prices quoted are from pricing-data.ts only.
 */
export const howToProgramAGarageDoorRemote: Article = {
  title: "How to Program a Garage Door Remote (Merlin, B&D, Centurion & More)",
  slug: "how-to-program-a-garage-door-remote",
  category: "Motors & Remotes",
  excerpt:
    "Step-by-step instructions for programming a garage door remote to the common Australian opener brands — Merlin, B&D, Centurion, ATA, Avanti and Gliderol — plus what to do when a remote refuses to pair.",
  author: "Capital Garage Doors Team",
  authorTitle: "Licensed garage door technicians, Perth WA",
  authorBio:
    "Our technicians repair and install garage door openers across Perth every day, programming hundreds of remotes a year across every major Australian brand.",
  publishedAt: "2026-08-05",
  updatedAt: "2026-08-05",
  featuredImage:
    "https://jadara-hub.b-cdn.net/capital-garage-door/motors/capital-garage-door-motor-accessories-kit.png",
  featuredImageAlt:
    "Garage door opener kit laid out with two remotes, wall control and smartphone app — the remotes you program to the motor",
  shortAnswer:
    "Nearly all Australian garage door openers program the same way: press the learn (or SET/CODE) button on the motor's powerhead until its light blinks, then within about 10 seconds press the remote button you want to use, twice on most brands. The motor's light flashing or clicking confirms the pairing. The learn button lives on the powerhead — the unit on the ceiling or wall — not on the wall switch, so you'll need a step ladder. If the remote still won't pair, the motor's memory may be full, the remote may use the wrong code protocol, or the receiver may be failing.",
  contentBlocks: [
    {
      type: "paragraph",
      text: "Programming a garage door remote is a two-minute job once you know where the learn button is — and a frustrating afternoon when you don't. This guide covers the standard procedure that works for nearly every opener sold in Australia, then the brand-specific quirks for Merlin, B&D, Centurion, ATA, Avanti and Gliderol, and finally the reasons a remote refuses to pair no matter what you press.",
    },
    { type: "heading", level: 2, text: "Before you start: identify your opener", id: "identify-your-opener" },
    {
      type: "paragraph",
      text: "The programming procedure is set by the motor, not the remote. Look at the powerhead — the unit mounted on the ceiling for sectional doors, or on the wall beside the drum for roller doors — and find the brand and model on its label. Take a photo; if you end up needing a replacement remote it answers the compatibility question instantly.",
    },
    {
      type: "checklist",
      title: "You'll need",
      items: [
        "A step ladder that lets you reach the powerhead safely",
        "The remote, with a fresh battery (a flat battery is the #1 fake fault)",
        "The door in view — you'll test open and close afterwards",
      ],
    },
    { type: "heading", level: 2, text: "The universal procedure (works for most brands)", id: "universal-procedure" },
    {
      type: "list",
      ordered: true,
      items: [
        "Find the **learn button** on the powerhead. It's usually labelled Learn, SET, CODE or S, often near the aerial wire, sometimes behind the light cover.",
        "Press and release it. An indicator LED will blink or stay lit — you're now in learn mode, typically for 10–30 seconds.",
        "Within that window, press the remote button you want to use. On many brands, press it a second time when the motor's light flashes.",
        "Watch for confirmation: the powerhead light flashes, clicks, or the LED goes out.",
        "Test the remote from a few metres away, then from your driveway.",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Programming from the wall switch",
      body: "Some newer openers also allow programming from a smart wall control — but the ladder method at the powerhead works on virtually everything, so it's the one worth remembering.",
    },
    { type: "heading", level: 2, text: "Brand-by-brand notes", id: "brand-by-brand" },
    { type: "heading", level: 3, text: "Merlin", id: "merlin" },
    {
      type: "paragraph",
      text: "Merlin's learn button sits on the powerhead near the aerial (round yellow or red button on most models). Press it once, then press the remote button twice — the opener's lights flash to confirm. Merlin remotes use Security+ rolling codes, so only genuine or licensed-compatible remotes will hold their pairing.",
    },
    { type: "heading", level: 3, text: "B&D", id: "bd" },
    {
      type: "paragraph",
      text: "Modern B&D openers use TriTran+ remotes and a door-control button sequence: press and hold the SET button until the LED blinks, then press the chosen remote button twice. Older B&D Controll-A-Door models vary by generation — if yours predates the 2010s, check the model's manual or ask us; we keep the legacy procedures on file.",
    },
    { type: "heading", level: 3, text: "Centurion", id: "centurion" },
    {
      type: "paragraph",
      text: "Centurion openers (common on Perth roller doors) have a CODE or learn button on the receiver. Press it, then press the remote button twice within ten seconds. If you're replacing a lost Centurion remote, note the model number on the powerhead — pre- and post-2010 receivers use different remote generations.",
    },
    { type: "heading", level: 3, text: "ATA, Avanti and Gliderol", id: "ata-avanti-gliderol" },
    {
      type: "paragraph",
      text: "ATA (PTX remotes), Avanti and Gliderol all follow the universal procedure: learn button on the powerhead, then the remote button once or twice within the window. Avanti's coding instructions are printed inside the light cover on many units. Gliderol roller-door motors usually put the learn button beside the antenna terminal.",
    },
    { type: "heading", level: 2, text: "Why your remote won't pair", id: "why-it-wont-pair" },
    {
      type: "list",
      items: [
        "**Memory full** — older motors store a limited number of remotes (often 4–8). The fix is a memory clear (hold the learn button ~10 seconds until the LED goes out), which erases every remote, then re-program the ones you keep.",
        "**Wrong code protocol** — a cheap generic remote that doesn't speak your motor's rolling-code system will never pair, or pairs and drops out days later. Match the brand and generation.",
        "**Failing receiver** — if genuine remotes pair but keep un-pairing, or range has shrunk to a metre or two, the receiver board is usually ageing. A technician can replace the receiver or fit an external one.",
        "**Interference** — LED lighting and nearby electronics can drown the receiver's signal. If the remote works with the garage light off, you've found it.",
      ],
    },
    { type: "heading", level: 2, text: "When to call a technician", id: "when-to-call" },
    {
      type: "paragraph",
      text: "If the battery is fresh, the procedure is right and the remote still won't hold a pairing, the fault is almost always in the motor's receiver or logic board — not something a new remote fixes. We [replace and program garage door remotes across Perth](/garage-door-remote-replacement-perth) ($95 per remote plus a single $120 attendance that covers as many remotes as you need), wipe lost or stolen remotes from the motor's memory, and [repair the opener itself](/garage-door-opener-repair-perth) when the receiver is the real problem.",
    },
  ],
  expertTips: [
    {
      kind: "technician",
      title: "Photograph the powerhead label",
      body: "Brand + model number answers every compatibility question — for remotes, receivers and spare parts. It's the first thing we ask for on any opener call.",
    },
    {
      kind: "safety",
      title: "Lost or stolen remote? Wipe it",
      body: "Until the motor's memory is cleared, a missing remote still opens your door. Clear the memory and re-program the remotes you hold — especially if the remote went missing with anything showing your address.",
    },
  ],
  relatedServices: [
    {
      label: "Garage Door Remote Replacement Perth",
      href: "/garage-door-remote-replacement-perth",
      description: "Remotes for every brand, programmed on the spot.",
      icon: "Radio",
    },
    {
      label: "Garage Door Opener Repair Perth",
      href: "/garage-door-opener-repair-perth",
      description: "Receivers, logic boards and motors diagnosed and repaired.",
      icon: "Wrench",
    },
    {
      label: "Garage Door Remote Not Working?",
      href: "/problems/garage-door-remote-not-working",
      description: "Quick checks before you book anything.",
      icon: "HelpCircle",
    },
  ],
  relatedArticles: [
    {
      slug: "how-to-reset-a-garage-door-opener-and-remote",
      title: "How to Reset a Garage Door Opener & Remote",
    },
    {
      slug: "common-garage-door-problems-and-fixes",
      title: "Common Garage Door Problems and Fixes",
    },
  ],
  faqs: [
    {
      question: "Where is the learn button on a garage door opener?",
      answer:
        "On the powerhead — the motor unit itself, on the ceiling for sectional doors or beside the drum for roller doors. It's usually labelled Learn, SET, CODE or S, and often sits near the aerial wire or behind the light cover. It is not on the wall switch on most models, which is why programming usually needs a step ladder.",
    },
    {
      question: "Can I program a garage door remote without the old remote?",
      answer:
        "Yes. Programming happens at the motor's learn button, so you don't need an existing remote — which is exactly how you re-establish control after losing one. If your model supports remote-to-remote cloning it's a convenience, not a requirement.",
    },
    {
      question: "Why does my garage remote work only from very close to the door?",
      answer:
        "Short range points at the receiver, not the remote: a coiled or damaged antenna wire, interference from LED garage lighting, or an ageing receiver board. Try the remote with the garage lights off — if range returns, the lighting is the culprit. Otherwise have the antenna and receiver checked.",
    },
    {
      question: "Do universal garage door remotes work in Australia?",
      answer:
        "Sometimes, and unreliably. Australian openers use several incompatible rolling-code systems (Merlin Security+, B&D TriTran, ATA PTX and others), and many cheap universal remotes cover only some of them — or pair and then drop out. A brand-matched remote costs little more and holds its pairing.",
    },
    {
      question: "How much does it cost to have remotes replaced professionally in Perth?",
      answer:
        "With us, replacement remotes are $95 each plus a single $120 attendance to program them — one attendance covers any number of remotes, and includes wiping lost remotes from the motor's memory. If diagnosis shows the receiver or motor is the real fault, repairs typically run $380–$490.",
    },
  ],
  seo: {
    title: "How to Program a Garage Door Remote: All Brands Guide",
    description:
      "Program a garage door remote to Merlin, B&D, Centurion, ATA, Avanti or Gliderol openers — step-by-step, plus fixes when a remote won't pair. Perth guide.",
  },
};
