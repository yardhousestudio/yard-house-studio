/** Non-destructive radial vignette over hero imagery (all slides/states). */
export function HeroVignetteOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden
      style={{
        background: [
          "radial-gradient(ellipse 92% 82% at 50% 42%, transparent 0%, transparent 48%, color-mix(in srgb, var(--color-ink) 10%, transparent) 68%)",
          "radial-gradient(ellipse 100% 95% at 50% 50%, transparent 52%, color-mix(in srgb, var(--color-ink) 22%, transparent) 88%, color-mix(in srgb, var(--color-ink) 32%, transparent) 100%)",
        ].join(", "),
      }}
    />
  );
}
