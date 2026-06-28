"use client";

import { useActionState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Welcome back to Capital Garage Door CMS.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
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
          className="mt-2 h-11 w-full rounded-xl"
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
    </div>
  );
}
