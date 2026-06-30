import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <section className="pt-4 pb-12 md:pt-8 md:pb-24 bg-background overflow-hidden relative" id="about">
      <div className="max-w-6xl px-4 md:px-6 mx-auto">

        {/* Top Part: SVG Cutout Image + Social Header */}
        <div className="relative w-full mb-8 md:mb-20">
          {/* Header with social icons */}
          <div className="flex justify-between items-center mb-6 w-[85%] absolute lg:top-4 md:top-0 sm:-top-2 -top-3 z-10 px-2 md:px-0">
            <div className="flex items-center gap-2 text-lg">
              <span className="text-cta animate-spin">✱</span>
              <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Who We Are
              </span>
            </div>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 border border-border bg-background rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors shadow-sm"
              >
                <img src="/images/social/facebook.svg" alt="fb" width={18} height={18} className="opacity-70 hover:opacity-100" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 border border-border bg-background rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors shadow-sm"
              >
                <img src="/images/social/instagram.svg" alt="insta" width={18} height={18} className="opacity-70 hover:opacity-100" />
              </a>
            </div>
          </div>

          <figure className="relative group mt-6 md:mt-10 w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[2/1] lg:aspect-[2.2/1]">
            <svg
              className="w-full h-full drop-shadow-2xl"
              preserveAspectRatio="none"
            >
              <defs>
                <clipPath
                  id="clip-inverted"
                  clipPathUnits={"objectBoundingBox"}
                >
                  <path
                    d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z"
                    fill="#D9D9D9"
                  />
                </clipPath>
              </defs>
              <image
                clipPath="url(#clip-inverted)"
                preserveAspectRatio="xMidYMid slice"
                width={"100%"}
                height={"100%"}
                xlinkHref="https://jadara-hub.b-cdn.net/capital-garage-door/premium-garage-door-about.webp"
              ></image>
            </svg>
          </figure>
        </div>

        {/* Bottom Part: Clean Minimalist Text & Stats */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-20 items-start">

          {/* Left Side: Story & CTA */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center">
            <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-2.5 md:mb-5 leading-[1.15]">
              Securing Homes with <span className="text-primary">Style</span> & <span className="text-cta">Precision.</span>
            </h2>

            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed mb-4 md:mb-8 max-w-lg">
              For over two decades, we&apos;ve blended premium materials with expert craftsmanship to transform curb appeal. No shortcuts. Just perfection.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {/* Primary CTA — uses the site's shared rounded-full red button language. */}
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-bold text-cta-foreground shadow-[0_4px_20px_rgba(200,34,42,0.3)] transition-all hover:bg-cta/90 hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(200,34,42,0.45)] active:translate-y-0 active:scale-95"
              >
                Get Your Free Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              {/* Secondary CTA → /about (internal link for SEO) — shared navy outline style. */}
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-6 py-3 text-sm font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/10 active:translate-y-0 active:scale-95"
              >
                Learn our story
              </Link>
            </div>
          </div>

          {/* Right Side: Modest Stats */}
          <div className="w-full lg:w-5/12 grid grid-cols-3 gap-x-4 gap-y-4 lg:pt-2">
            <div>
              <p className="text-xl md:text-4xl font-black text-foreground mb-0.5 md:mb-1 tracking-tight">20<span className="text-cta">+</span></p>
              <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Years Exp.</p>
            </div>
            <div>
              <p className="text-xl md:text-4xl font-black text-foreground mb-0.5 md:mb-1 tracking-tight">10k<span className="text-cta">+</span></p>
              <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Installed</p>
            </div>
            <div>
              <p className="text-xl md:text-4xl font-black text-foreground mb-0.5 md:mb-1 tracking-tight">100<span className="text-cta">%</span></p>
              <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Satisfaction</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
