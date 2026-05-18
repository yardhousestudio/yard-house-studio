import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { NavbarRow } from "@/lib/types";

type Props = {
  sticky?: boolean;
  withBlur?: boolean;
};

export async function SiteHeader({ sticky = true, withBlur = true }: Props) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("navbar")
    .select("logo, links, cta_button")
    .eq("id", 1)
    .single<Pick<NavbarRow, "logo" | "links" | "cta_button">>();

  const logo = data?.logo ?? { text: "Yard House Studio", href: "/" };
  const links = (data?.links ?? []).sort((a, b) => a.order - b.order);
  const cta = data?.cta_button ?? null;

  const positionClass = sticky ? "sticky top-0" : "relative";
  const blurClass = withBlur ? "backdrop-blur-md bg-page/80" : "bg-page";

  return (
    <header className={`${positionClass} z-50 ${blurClass} border-b border-divider`}>
      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16 py-5 flex items-center justify-between">
        <Link
          href={logo.href}
          className="font-brand italic text-[1.375rem] text-ink"
        >
          {logo.text}
        </Link>
        <nav className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={`${link.href}-${link.order}`}
              href={link.href}
              className="font-body text-small text-ink-secondary hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {cta && (
            <Link
              href={cta.href}
              className="font-body text-small bg-ink text-on-dark px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              {cta.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
