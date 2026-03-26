"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

type DashboardLayoutProps = {
  userEmail: string;
  children: ReactNode;
};

export function DashboardLayout({ userEmail, children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-8">
      <header className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              SickFit Leads
            </p>
            <h1 className="text-2xl font-bold">Leads Dashboard</h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Run your scraper, monitor job status, search results, and export
              CSV.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--color-brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-brand)]">
              {userEmail}
            </span>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      </header>
      {children}
    </main>
  );
}
