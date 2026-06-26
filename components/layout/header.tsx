"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 shadow-card backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Image
            src="/images/CGD-logo-with-text.png"
            alt={siteConfig.name}
            width={220}
            height={110}
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 200px, 220px"
            className="h-20 w-auto sm:h-24"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-md px-1 py-1.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {item.label}
              <span className="absolute inset-x-1 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-cta to-primary transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${siteConfig.business.phone}`}
            className={cn(
              buttonVariants({ variant: "cta", size: "lg" }),
              "hidden rounded-full px-5 font-bold lg:inline-flex",
            )}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Call Now
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open ? "true" : "false"}
            onClick={() => setOpen((value) => !value)}
            className="flex flex-col gap-1.5 p-2 lg:hidden"
          >
            <span
              className={cn(
                "block h-0.5 w-5.5 rounded-full bg-foreground transition-transform duration-300",
                open && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5.5 rounded-full bg-foreground transition-opacity duration-300",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5.5 rounded-full bg-foreground transition-transform duration-300",
                open && "-translate-y-[7px] -rotate-45"
              )}
            />
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col items-center justify-center gap-7 bg-background/98 backdrop-blur-xl lg:hidden"
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-foreground transition-colors hover:text-cta"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${siteConfig.business.phone}`}
              className={cn(
                buttonVariants({ variant: "gradient" }),
                "mt-3 h-auto rounded-full px-7 py-3.5 text-lg font-bold",
              )}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {siteConfig.business.phoneDisplay}
            </a>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
