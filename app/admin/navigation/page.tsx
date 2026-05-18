import { createClient } from "@/lib/supabase/server";
import { NavbarEditor } from "@/components/admin/NavbarEditor";
import type { NavbarRow } from "@/lib/types";

export default async function NavigationPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("navbar")
    .select("id, logo, links, cta_button")
    .eq("id", 1)
    .single<NavbarRow>();

  const navbar: NavbarRow = data ?? {
    id: 1,
    logo: { text: "Yard House Studio", href: "/" },
    links: [],
    cta_button: null,
  };

  return (
    <div>
      <h1 className="font-display text-section text-ink">Navigation</h1>
      <p className="font-body text-small text-ink-2 mt-1 mb-6">
        Edit the site header — logo, links and call-to-action button.
      </p>
      <NavbarEditor navbar={navbar} />
    </div>
  );
}
