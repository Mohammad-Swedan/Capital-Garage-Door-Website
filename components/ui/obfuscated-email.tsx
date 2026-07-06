"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * The business email, base64-encoded and only assembled in the browser after
 * hydration — the plain address never appears in the served HTML, so spam
 * harvesters scraping page source can't collect it. Humans still get a normal
 * clickable mailto link. Keep in sync with `siteConfig.business.email`.
 */
const ENCODED = "aW5mb0BjYXBpdGFsZ2FyYWdlZG9vcnMuY29tLmF1"; // info@…com.au

/** Decoded address after mount; null during SSR/prerender and hydration. */
export function useObfuscatedEmail(): string | null {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    setEmail(atob(ENCODED));
  }, []);
  return email;
}

interface ObfuscatedEmailProps {
  className?: string;
  /** Rendered before the address text (e.g. an icon wrapper). */
  children?: ReactNode;
}

/**
 * mailto link whose address exists only in the browser DOM. Renders "Email us"
 * until hydration completes (static HTML therefore contains no address).
 */
export function ObfuscatedEmail({ className, children }: ObfuscatedEmailProps) {
  const email = useObfuscatedEmail();
  return (
    <a href={email ? `mailto:${email}` : undefined} className={className}>
      {children}
      {email ?? "Email us"}
    </a>
  );
}
