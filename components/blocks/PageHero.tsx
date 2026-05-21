import { Cta, hasCta, type CtaMode } from "./Cta";

type Props = {
  anchorId?: string;
  label?: string;
  headline: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  primaryCtaMode?: CtaMode;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

// A lighter, text-led hero for inner pages — no image, just a confident
// typographic header. Distinct from the image-led homepage hero.
export function PageHero({
  anchorId,
  label = "",
  headline,
  subtitle = "",
  primaryCtaLabel = "",
  primaryCtaHref = "",
  primaryCtaMode = "link",
  secondaryCtaLabel = "",
  secondaryCtaHref = "",
}: Props) {
  return (
    <section
      id={anchorId}
      className="bg-surface border-b border-divider py-20 md:py-32"
    >
      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16">
        {label.trim() && (
          <p className="font-body text-label uppercase tracking-[0.05em] font-medium text-ink-secondary mb-4">
            {label}
          </p>
        )}
        <h1 className="font-display text-hero text-ink leading-[1.05] max-w-[800px]">
          {headline}
        </h1>
        {subtitle.trim() && (
          <p className="font-body text-subtitle text-ink-secondary max-w-[620px] mt-6 leading-relaxed">
            {subtitle}
          </p>
        )}
        {hasCta(primaryCtaLabel, secondaryCtaLabel) && (
          <div className="flex flex-wrap gap-3 mt-8">
            <Cta
              label={primaryCtaLabel}
              href={primaryCtaHref}
              variant="primary"
              mode={primaryCtaMode}
            />
            <Cta
              label={secondaryCtaLabel}
              href={secondaryCtaHref}
              variant="secondary"
            />
          </div>
        )}
      </div>
    </section>
  );
}
