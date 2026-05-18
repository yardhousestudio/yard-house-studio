import type { Metadata } from "next";
import { requireAdmin } from "@/lib/requireAdmin";
import { Sidebar } from "@/components/admin/Sidebar";

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
    <div className="flex min-h-screen bg-page-outer">
      <Sidebar email={admin.email} />
      <main className="flex-1 min-w-0 px-8 py-8">
        <div className="max-w-[1080px]">{children}</div>
      </main>
    </div>
  );
}
