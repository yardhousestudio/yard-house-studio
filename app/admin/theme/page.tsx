import { createClient } from "@/lib/supabase/server";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { DEFAULT_THEME, THEME_TOKENS, type ThemeColors } from "@/lib/theme";

export default async function ThemePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("theme")
    .select("colors")
    .eq("id", 1)
    .single();

  // Build strictly from the current tokens so renamed/removed keys
  // (e.g. old ink-soft / ink-faint) never linger in the editor.
  const stored = (data?.colors as ThemeColors) ?? {};
  const colors: ThemeColors = Object.fromEntries(
    THEME_TOKENS.map((t) => [t.key, stored[t.key] ?? DEFAULT_THEME[t.key]]),
  );

  return (
    <div>
      <h1 className="font-display text-section text-ink">Colours</h1>
      <p className="font-body text-small text-ink-secondary mt-1 mb-6">
        The site&apos;s colour palette. Changes apply across the whole site on
        save.
      </p>
      <ThemeEditor initial={colors} />
    </div>
  );
}
