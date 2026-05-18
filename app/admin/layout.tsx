import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/requireAdmin";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Admin — Yard House Studio",
  robots: { index: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-page-outer">
      <header className="bg-page border-b border-divider">
        <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16 py-4 flex items-center justify-between gap-6">
          <Link
            href="/admin"
            className="font-brand italic text-[1.25rem] text-ink"
          >
            Yard House Studio
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-body text-small text-ink-2">
              {admin.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="font-body text-small text-ink-2 hover:text-ink underline underline-offset-4"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-content px-6 md:px-8 lg:px-16 py-10">
        {children}
      </main>
    </div>
  );
}
