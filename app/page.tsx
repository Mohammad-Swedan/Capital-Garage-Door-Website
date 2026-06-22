import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { LazyOnVisible } from "@/components/motion/lazy-on-visible";

const AboutSection = dynamic(() => import("@/components/sections/about").then(m => m.AboutSection));
const ServicesGrid = dynamic(() => import("@/components/sections/services-grid").then(m => m.ServicesGrid));
const WhyChooseUs = dynamic(() => import("@/components/sections/why-choose-us").then(m => m.WhyChooseUs));
const ServiceAreaMap = dynamic(() => import("@/components/sections/service-area-map").then(m => m.ServiceAreaMap));
const Testimonials = dynamic(() => import("@/components/sections/testimonials").then(m => m.Testimonials));
const SmartCta = dynamic(() => import("@/components/sections/smart-cta").then(m => m.SmartCta));
const CostSection = dynamic(() => import("@/components/sections/cost-section").then(m => m.CostSection));
const ScrollDoorReveal = dynamic(() => import("@/components/sections/scroll-door-reveal").then(m => m.ScrollDoorReveal));

// Root layout already provides the default title/description/OG for "/".
export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesGrid />
      <WhyChooseUs />
      <ServiceAreaMap />
      <Testimonials />
      <SmartCta />
      <CostSection />
      {/* gsap + ScrollTrigger only load once the user scrolls near this last
          section, keeping them out of the initial main-thread work. */}
      <LazyOnVisible className="min-h-screen">
        <ScrollDoorReveal />
      </LazyOnVisible>
    </>
  );
}
