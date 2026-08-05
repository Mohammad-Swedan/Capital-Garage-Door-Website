import type { Article } from "@/types/article";

/**
 * /blog/how-to-reset-a-garage-door-opener-and-remote — help-hub post #2 (2026-08).
 *
 * Targets the reset cluster from the Semrush pull: "how do you reset a garage
 * door opener" 260/mo KD 0, "how to reset garage door remote" 260/6,
 * "how to reset garage door opener" 210/10, "how to reset garage door opener
 * remote" 210/7 + variants. Funnels to opener repair + remote replacement.
 */
export const howToResetAGarageDoorOpenerAndRemote: Article = {
  title: "How to Reset a Garage Door Opener & Remote (Step by Step)",
  slug: "how-to-reset-a-garage-door-opener-and-remote",
  category: "Motors & Remotes",
  excerpt:
    "When a garage door opener misbehaves, a reset often fixes it. How to reset the remote, clear the motor's memory, re-set travel limits after a power outage — and how to tell a reset problem from a repair problem.",
  author: "Capital Garage Doors Team",
  authorTitle: "Licensed garage door technicians, Perth WA",
  authorBio:
    "Our technicians repair and install garage door openers across Perth every day — including plenty of 'broken' openers that only needed the right reset.",
  publishedAt: "2026-08-05",
  updatedAt: "2026-08-05",
  featuredImage:
    "https://jadara-hub.b-cdn.net/capital-garage-door/gallery/garage-door-motor-gear-replacement-perth.webp",
  featuredImageAlt: "Garage door opener powerhead opened up for inspection during a reset and repair in Perth",
  shortAnswer:
    "To reset a garage door remote, remove and re-insert the battery, then re-program it at the motor: press the learn/SET button on the powerhead and press the remote button within about 10 seconds. To fully reset the opener's stored remotes, hold the learn button for around 10 seconds until its LED goes out — this erases every paired remote, so re-program the ones you keep. After a power outage, most openers only need one full open-close cycle to re-find their limits; if the door stops short or reverses, the travel limits need re-setting at the powerhead's limit dials or buttons.",
  contentBlocks: [
    {
      type: "paragraph",
      text: "\"Have you tried turning it off and on again\" genuinely applies to garage doors. Openers are simple computers, and a surprising share of the 'broken motor' calls we attend end with a reset — of the remote, the motor's memory, or the travel limits. Here's how to do each one, in the order worth trying, and the signs that tell you it's a genuine fault instead.",
    },
    { type: "heading", level: 2, text: "Step 1: Reset the remote", id: "reset-the-remote" },
    {
      type: "list",
      ordered: true,
      items: [
        "Open the remote and take the battery out for 30 seconds, then re-fit it (check it's a fresh battery while you're there — a weak cell causes more 'faults' than everything else combined).",
        "Re-program the remote to the motor: press the learn/SET/CODE button on the powerhead, then press the remote button within the 10–30 second window. Our [remote programming guide](/blog/how-to-program-a-garage-door-remote) covers the brand-specific quirks.",
        "Test from the driveway, not just under the motor — range problems masquerade as pairing problems.",
      ],
    },
    { type: "heading", level: 2, text: "Step 2: Clear the opener's memory", id: "clear-the-memory" },
    {
      type: "paragraph",
      text: "Every opener stores its paired remotes in memory, and that memory can fill up or corrupt. Clearing it is also the right move after a remote is lost or stolen — until you do, the missing remote still opens your door.",
    },
    {
      type: "list",
      ordered: true,
      items: [
        "Press and HOLD the learn button on the powerhead — typically about 10 seconds — until its LED goes out or flashes rapidly.",
        "That's it: every remote, keypad and (on some models) phone pairing is now erased.",
        "Re-program each remote you want to keep, one at a time.",
      ],
    },
    {
      type: "callout",
      variant: "safety",
      title: "Lost or stolen remote?",
      body: "Clear the memory the same day. A garage remote that went missing with anything carrying your address is a key to your house. Two minutes on a ladder closes that door — literally.",
    },
    { type: "heading", level: 2, text: "Step 3: Reset after a power outage", id: "after-a-power-outage" },
    {
      type: "paragraph",
      text: "After Perth's summer storms this is our most common call. Most modern openers re-find their position automatically: run one full open-close cycle from the wall button and watch it complete. If the door was disengaged onto manual release during the blackout, re-engage it first — pull the release cord toward the door (or run the opener until the trolley clicks back in) — then cycle it.",
    },
    {
      type: "paragraph",
      text: "If the door now stops short of the floor, reverses at the last moment, or leaves a gap at the top, its travel limits have drifted. Limits are set on the powerhead — dials on older units, buttons with LED indicators on newer ones — and one notch of adjustment is often all it takes. The label inside the light cover usually shows the procedure for your model.",
    },
    { type: "heading", level: 2, text: "When a reset won't fix it", id: "when-reset-wont-fix-it" },
    {
      type: "list",
      items: [
        "**The motor hums but the door doesn't move** — stripped drive gear or a snapped belt/chain, a mechanical repair.",
        "**The door is suddenly very heavy on manual release** — a broken spring. Stop using the opener entirely; forcing it burns out motors. This one is [an urgent repair](/garage-door-repairs-perth).",
        "**Remotes keep un-pairing after a proper clear and re-program** — failing receiver or logic board.",
        "**The door reverses at random points** — safety sensors misaligned or failing (see our [sensor guide](/blog/how-to-fix-garage-door-sensor)), or the force limits are masking a binding door.",
        "**Clicking relay, dead display, burning smell** — logic board on the way out. Unplug it and call.",
      ],
    },
    {
      type: "paragraph",
      text: "Opener repairs in Perth typically run $380–$490 for receiver, gear and board-level faults, and a full [motor replacement is $770–$990](/garage-door-motor-replacement-cost-perth) supplied, installed and programmed. If your opener is over 15 years old and misbehaving weekly, replacement is usually the honest recommendation — you get soft start/stop, better safety reversing and Wi-Fi control in the deal.",
    },
  ],
  expertTips: [
    {
      kind: "technician",
      title: "One cycle tells you a lot",
      body: "Watch a full open-close from inside the garage after any reset. Hesitation at the same spot every time is mechanical (tracks, springs, binding); random stopping is electrical (sensors, logic board). That one observation halves the diagnosis time.",
    },
    {
      kind: "maintenance",
      title: "Storm season prep",
      body: "Before Perth's winter fronts, make sure you know where your manual release is and that its cord is reachable — a blackout with the car inside is the wrong time to learn.",
    },
  ],
  relatedServices: [
    {
      label: "Garage Door Opener Repair Perth",
      href: "/garage-door-opener-repair-perth",
      description: "Receivers, gears, logic boards and motors repaired.",
      icon: "Wrench",
    },
    {
      label: "Garage Door Remote Replacement Perth",
      href: "/garage-door-remote-replacement-perth",
      description: "Remotes replaced, programmed and lost ones wiped.",
      icon: "Radio",
    },
    {
      label: "Garage Door Motor Replacement Cost Perth",
      href: "/garage-door-motor-replacement-cost-perth",
      description: "What a new opener costs, and when it beats repairing.",
      icon: "CircleDollarSign",
    },
  ],
  relatedArticles: [
    {
      slug: "how-to-program-a-garage-door-remote",
      title: "How to Program a Garage Door Remote (All Brands)",
    },
    {
      slug: "how-to-open-a-garage-door-manually",
      title: "How to Open a Garage Door Manually",
    },
  ],
  faqs: [
    {
      question: "How do I reset my garage door opener after a power outage?",
      answer:
        "Re-engage the trolley if the door was put on manual release (pull the cord toward the door or run the opener until it clicks in), then run one full open-close cycle from the wall button so the opener re-finds its limits. If the door then stops short or reverses near the floor, adjust the travel limits at the powerhead — dials or marked buttons, with the procedure on the label inside the light cover.",
    },
    {
      question: "Does unplugging a garage door opener reset it?",
      answer:
        "Partially. Power-cycling (unplug for 30 seconds) clears transient logic glitches and is always worth trying first, but it does not erase paired remotes or travel limits — those live in permanent memory. Remote memory is cleared by holding the learn button; limits are re-set at their own dials or buttons.",
    },
    {
      question: "Will resetting the opener delete all my remotes?",
      answer:
        "Only the memory clear does — holding the learn button about 10 seconds erases every paired remote, keypad and phone link. A power cycle or limit adjustment leaves pairings untouched. After a memory clear, re-program each remote you keep, which takes under a minute per remote.",
    },
    {
      question: "My garage door opener resets but still won't work — what now?",
      answer:
        "A fault that survives a proper reset is a real fault: most commonly a stripped drive gear (motor runs, door doesn't), failing receiver (remotes keep dropping), misaligned safety sensors (door reverses), or a broken spring (door suddenly heavy — stop using the opener immediately). Repairs typically run $380–$490; a technician can tell you within minutes which one you have.",
    },
  ],
  seo: {
    title: "How to Reset a Garage Door Opener & Remote | Perth Guide",
    description:
      "Reset a garage door remote, clear the opener's memory, and fix travel limits after a power outage — plus the faults a reset can't cure. Perth guide.",
  },
};
