import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/cms/admin";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin/pages");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-muted px-4">
      {/* Subtle branded backdrop: navy brand glow + faint grid lines. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 size-[40rem] -translate-x-1/2 bg-glow-brand"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]"
      />
      <div className="relative z-10 w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
