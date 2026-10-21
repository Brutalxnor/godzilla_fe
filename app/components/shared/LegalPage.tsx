// Shared shell for the public, no-login pages the App Store listing links to
// (/privacy, /terms, /guidelines and /support). Plain server component: no auth, no API calls.
import Link from "next/link";
import type { ReactNode } from "react";

export const SUPPORT_EMAIL = "ahmed@primesoftworks.com";
export const OPERATOR = "Mohammed Alshammari";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen px-4 py-12 sm:py-16">
      <article className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
          Godzilla
        </Link>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h1>
        {updated && (
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Last updated: {updated}
          </p>
        )}
        <div className="mt-8 space-y-6 leading-relaxed">{children}</div>
        <footer className="mt-16 border-t pt-6 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          <Link href="/privacy" className="underline">Privacy Policy</Link>
          {" · "}
          <Link href="/terms" className="underline">Terms of Use</Link>
          {" · "}
          <Link href="/guidelines" className="underline">Community Guidelines</Link>
          {" · "}
          <Link href="/support" className="underline">Support</Link>
        </footer>
      </article>
    </main>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
