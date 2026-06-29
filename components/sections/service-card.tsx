import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { resolveIcon } from "@/lib/icons";
import type { ServicePage } from "@/types/service-page";

interface ServiceCardProps {
  page: ServicePage;
}

/**
 * Services index card — the service's hero image (the same one shown on its
 * landing page), an icon chip, name, and a short answer. Models the blog
 * ArticleCard so the two index pages share a visual language. The full
 * `directAnswer` stays in the DOM (clamped visually) for on-page SEO.
 */
export function ServiceCard({ page }: ServiceCardProps) {
  const Icon = resolveIcon(page.hero.badges[0]?.icon ?? "Wrench");

  return (
    <Link
      href={`/${page.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:border-cta/30 hover:shadow-[0_12px_40px_rgba(13,31,69,0.12)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={page.hero.image}
          alt={page.hero.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={60}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1733]/55 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white backdrop-blur-md">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-cta">
          {page.serviceName}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {page.directAnswer}
        </p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Learn more
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
