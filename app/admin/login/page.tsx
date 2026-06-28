import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/cms/admin";
import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin/pages");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Decorative background — matches the hero: faint navy grid + soft glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid pattern, fading out toward the edges (centered behind the card) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,31,69,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,31,69,0.07)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(ellipse_80%_70%_at_50%_50%,black_20%,transparent_80%)]" />
        {/* Soft ambient glows behind the card */}
        <div className="absolute top-1/2 left-1/2 h-[34rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-[#0f4e9b]/8 blur-3xl" />
      </div>

      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-3xl shadow-float ring-1 ring-black/5">
        {/* LEFT: image panel — visible only on desktop */}
        <div className="relative hidden min-h-[600px] w-[55%] lg:block">
          <Image
            src="/images/premium_garage_door_about.png"
            alt="Premium garage door"
            fill
            className="object-cover"
            priority
          />
          {/* Bottom-to-top gradient overlay */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#0d1f45]/90 via-[#0d1f45]/40 to-[#0d1f45]/10"
          />
          {/* Logo — top-left */}
          <div className="absolute left-6 top-6">
            <Image
              src="/images/CGD-logo-with-text.png"
              alt="Capital Garage Door"
              width={128}
              height={44}
              className="object-contain brightness-0 invert"
            />
          </div>
          {/* Tagline — bottom-left */}
          <div className="absolute bottom-8 left-7 text-white">
            <p className="font-heading text-2xl font-bold leading-tight">
              Manage Your
              <br />
              Digital Presence
            </p>
            <p className="mt-2 text-sm text-white/50">Capital Garage Door CMS</p>
          </div>
        </div>

        {/* RIGHT: form panel */}
        <div className="flex flex-1 flex-col justify-center bg-card px-8 py-12 lg:px-12">
          {/* Mobile logo mark — hidden on desktop where the left panel shows it */}
          <div className="mb-8 flex flex-col items-center gap-2 lg:hidden">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-base font-bold text-brand-foreground shadow-elevated ring-1 ring-inset ring-white/15">
              C
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-base font-semibold text-foreground">
                Capital Garage Door
              </span>
              <span className="rounded-md bg-cta px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-cta-foreground uppercase">
                CMS
              </span>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
