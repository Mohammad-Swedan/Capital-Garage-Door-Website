import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Admin",
  // Belt-and-braces with robots.ts: the editor must never be indexed.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
