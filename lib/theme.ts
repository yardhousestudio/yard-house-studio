export type ThemeColors = Record<string, string>;

// The 10 colour tokens, with display label + role. Drives the Colours
// admin tab and the runtime CSS-variable injection.
export const THEME_TOKENS = [
  { key: "page", label: "Page", role: "Main page background" },
  { key: "surface", label: "Surface", role: "Alternating section background" },
  { key: "frame", label: "Frame", role: "Outside the content frame, and the footer" },
  { key: "dark", label: "Dark", role: "Dark feature section background" },
  { key: "ink", label: "Ink", role: "Primary text, buttons, active borders" },
  { key: "ink-secondary", label: "Ink secondary", role: "Secondary text + section labels" },
  { key: "ink-muted", label: "Ink muted", role: "Decorative display numbers" },
  { key: "on-dark", label: "On dark", role: "Text on dark sections" },
  { key: "divider", label: "Divider", role: "Borders, rules, dividers" },
] as const;

// Fallback values — mirror the @theme block in app/globals.css.
export const DEFAULT_THEME: ThemeColors = {
  page: "#FFFFFF",
  surface: "#FAF8F3",
  frame: "#C8BB9F",
  dark: "#4A4A2F",
  ink: "#1A1A1A",
  "ink-secondary": "#4A4339",
  "ink-muted": "#A89E8B",
  "on-dark": "#FFFFFF",
  divider: "#D8D1C5",
};

// Build the `{ "--color-page": "#..." }` map for an inline style on <html>.
// Any missing token falls back to its default.
export function themeToCssVars(colors: ThemeColors): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const token of THEME_TOKENS) {
    vars[`--color-${token.key}`] = colors[token.key] ?? DEFAULT_THEME[token.key];
  }
  return vars;
}
