"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  FileTextIcon,
  LayersIcon,
  ImageIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { label: "Overview", href: "/admin", icon: HomeIcon },
  { label: "Pages", href: "/admin/pages", icon: FileTextIcon },
  { label: "Navigation", href: "/admin/navigation", icon: LayersIcon },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Variables", href: "/admin/variables", icon: GearIcon },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-page border-r border-divider min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b border-divider">
        <p className="font-brand italic text-[1.25rem] text-ink leading-none">
          Yard House Studio
        </p>
        <p className="font-body text-label uppercase tracking-[0.08em] text-ink-2 mt-1.5">
          Admin
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        <p className="font-body text-label uppercase tracking-[0.08em] text-ink-2 px-2.5 pb-1.5">
          Content
        </p>
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 font-body text-small transition-colors ${
                active
                  ? "bg-footer text-ink font-medium"
                  : "text-ink-2 hover:text-ink hover:bg-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-divider">
        <p className="font-body text-label text-ink-2 px-2.5 truncate">
          {email}
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full text-left font-body text-small text-ink-2 hover:text-ink px-2.5 py-1.5 mt-0.5 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
