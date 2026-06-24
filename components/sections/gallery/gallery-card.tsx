import Image from "next/image";
import { MapPin } from "lucide-react";
import type { GalleryItem } from "@/types/gallery";

interface GalleryCardProps {
  item: GalleryItem;
}

/** Single job-photo card for the gallery grid — image, category badge, suburb, and short description. */
export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur-sm">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-base font-semibold text-foreground sm:text-lg">{item.title}</h3>
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {item.suburb}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      </div>
    </article>
  );
}
