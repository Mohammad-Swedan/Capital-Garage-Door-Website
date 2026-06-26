import Image from "next/image";
import { MapPin } from "lucide-react";
import type { GalleryItem } from "@/types/gallery";

interface GalleryCardProps {
  item: GalleryItem;
}

/** Single job-photo card for the gallery grid — image, category badge, suburb, and short description. */
export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface-elevated elevate-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Bottom scrim for depth on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0a1733]/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="cgd-eyebrow absolute top-3 left-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="cgd-h3 text-base text-foreground sm:text-lg">{item.title}</h3>
        <p className="flex items-center gap-1.5 cgd-eyebrow text-[11px] text-brand">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {item.suburb}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      </div>
    </article>
  );
}
