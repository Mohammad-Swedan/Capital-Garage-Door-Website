import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "garage-door-repair",
    name: "Garage Door Repair",
    shortDescription: "Fast, reliable repair for any garage door issue.",
    description:
      "From off-track doors to dented panels, our technicians diagnose and fix garage door problems quickly so your home stays safe and secure.",
    image: "/images/services/garage-door-repair.webp",
    icon: "Wrench",
    faqs: [
      {
        question: "How quickly can you repair my garage door?",
        answer:
          "Most repairs are completed same-day. Call us and we'll give you an accurate arrival window.",
      },
    ],
  },
  {
    slug: "garage-door-installation",
    name: "Garage Door Installation",
    shortDescription: "New garage door installation for any home.",
    description:
      "Choose from a wide range of styles and materials. We handle full installation, old door removal, and final safety inspection.",
    image: "/images/services/garage-door-installation.webp",
    icon: "DoorOpen",
  },
  {
    slug: "spring-repair",
    name: "Garage Door Spring Repair",
    shortDescription: "Safe replacement of broken torsion and extension springs.",
    description:
      "Broken springs are dangerous to handle yourself. Our trained technicians safely replace torsion and extension springs with proper tools.",
    image: "/images/services/spring-repair.webp",
    icon: "Settings",
  },
  {
    slug: "garage-door-opener-repair",
    name: "Garage Door Opener Repair & Installation",
    shortDescription: "Opener troubleshooting, repair, and smart upgrades.",
    description:
      "We repair and install garage door openers from all major brands, including smart Wi-Fi enabled openers for remote access.",
    image: "/images/services/garage-door-opener-repair.webp",
    icon: "Cpu",
  },
  {
    slug: "emergency-garage-door-service",
    name: "Emergency Garage Door Service",
    shortDescription: "24/7 emergency response for urgent garage door issues.",
    description:
      "A stuck or broken garage door can't wait. Our emergency team is available around the clock for urgent repairs.",
    image: "/images/services/emergency-garage-door-service.webp",
    icon: "Siren",
  },
  {
    slug: "garage-door-maintenance",
    name: "Garage Door Maintenance",
    shortDescription: "Preventive maintenance to extend the life of your door.",
    description:
      "Regular tune-ups catch small issues before they become costly repairs, keeping your garage door operating smoothly and safely.",
    image: "/images/services/garage-door-maintenance.webp",
    icon: "ShieldCheck",
  },
];
