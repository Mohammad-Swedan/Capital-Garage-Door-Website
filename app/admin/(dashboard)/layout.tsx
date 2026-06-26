import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/cms/admin";
import { logoutAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/ui/admin-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return <AdminShell logoutAction={logoutAction}>{children}</AdminShell>;
}
