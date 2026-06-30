"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetUploadForm, type UploadedAsset } from "./asset-upload-form";

/** Upload a new image straight into the media library (with a category). */
export function MediaUploadDialog({
  open,
  onOpenChange,
  onUploaded,
  defaultCategory = "Uncategorized",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: (asset: UploadedAsset) => void;
  defaultCategory?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload image</DialogTitle>
          <DialogDescription>Add a new image to the media library.</DialogDescription>
        </DialogHeader>
        {open && (
          <div className="mt-2">
            <AssetUploadForm defaultCategory={defaultCategory} submitLabel="Upload" onUploaded={onUploaded} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
