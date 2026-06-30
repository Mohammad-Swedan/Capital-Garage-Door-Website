import { MediaLibrary } from "@/components/admin/media/media-library";

export const dynamic = "force-dynamic";

/**
 * Media library — manage every uploaded asset (browse by category, search, paginate, edit alt/
 * category, delete). The grid is client-driven (`MediaLibrary`), reading through the
 * `/admin/api/assets` proxy and mutating via server actions in `app/admin/asset-actions.ts`.
 */
export default function MediaPage() {
  return <MediaLibrary />;
}
