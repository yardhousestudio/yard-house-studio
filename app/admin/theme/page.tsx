import { createClient } from "@/lib/supabase/server";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { DEFAULT_THEME, type ThemeColors } from "@/lib/theme";

export default async function ThemePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("theme")
    .select("colors")
    .eq("id", 1)
    .single();

  const colors: ThemeColors = {
    ...DEFAULT_THEME,
    ...((data?.colors as ThemeColors) ?? {}),
  };

  return (
    <div>
      <h1 className="font-display text-section text-ink">Colours</h1>
      <p className="font-body text-small text-ink-soft mt-1 mb-6">
        The site&apos;s colour palette. Changes apply across the whole site on
        save.
      </p>
      <ThemeEditor initial={colors} />
    </div>
  );
}
