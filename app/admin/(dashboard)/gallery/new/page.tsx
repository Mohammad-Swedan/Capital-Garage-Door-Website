import Link from "next/link";
import { GalleryItemForm } from "@/components/admin/gallery-item-form";

export default function NewGalleryItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/gallery" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to gallery
        </Link>
        <h1 className="mt-1 text-xl font-semibold">New gallery item</h1>
        <p className="text-sm text-muted-foreground">Upload an image and assign it a category.</p>
      </div>
      <GalleryItemForm />
    </div>
  );
}
