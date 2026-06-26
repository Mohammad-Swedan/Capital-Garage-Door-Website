"use client";

import { useActionState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <Card
      variant="premium"
      className="w-full max-w-sm gap-0 overflow-visible"
    >
      <CardHeader className="gap-2 pb-3 pt-7 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-base font-bold text-brand-foreground shadow-elevated ring-1 ring-inset ring-white/15">
          C
        </div>
        <div className="mx-auto mt-1 flex items-center gap-2">
          <span className="font-heading text-base font-semibold text-foreground">
            Capital Garage Door
          </span>
          <span className="rounded-md bg-cta px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-cta-foreground uppercase">
            CMS
          </span>
        </div>
        <CardTitle className="text-lg">Sign in</CardTitle>
        <CardDescription>Sign in to manage your site content.</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-7 pt-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              inputSize="lg"
              variant="filled"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              inputSize="lg"
              variant="filled"
              placeholder="••••••••"
              required
            />
          </div>
          {state.error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}
          <Button
            type="submit"
            variant="premium"
            size="lg"
            className="h-11 w-full rounded-xl"
            disabled={pending}
          >
            {pending ? (
              "Signing in…"
            ) : (
              <>
                <Lock className="size-4" />
                Sign in
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
