"use client";

import Image from "next/image";
import { Cta, hasCta } from "./Cta";
import { parseHeroSlidePairs } from "@/lib/heroSlideshow";
import { HeroSlideshow } from "./HeroSlideshow";
import { useHeroSlideshow } from "./useHeroSlideshow";

type Props = {
  anchorId?: string;
  image: string;
  imageAlt: string;
  slides?: unknown;
  headline: string;
  subtitle: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export function HeroImageText({
  anchorId,
  image,
  imageAlt,
  slides,
  headline,
  subtitle,
  primaryCtaLabel = "",
  primaryCtaHref = "",
  secondaryCtaLabel = "",
  secondaryCtaHref = "",
}: Props) {
  const pairs = parseHeroSlidePairs(slides);
  const useSlideshow = pairs.length > 0;
  const slideshow = useHeroSlideshow(pairs);

  const titlePanel = (
    <div className="relative z-10 bg-page shadow-[0_0_60px_-10px_color-mix(in_srgb,var(--color-frame)_60%,transparent)] px-6 md:px-12 pt-12 md:pt-16 pb-10 md:pb-14">
      <h1 className="font-display text-hero text-ink leading-[1.05]">
        {headline}
      </h1>
      <p className="font-body text-subtitle text-ink-secondary max-w-[620px] mt-6 leading-relaxed">
        {subtitle}
      </p>
      {hasCta(primaryCtaLabel, secondaryCtaLabel) && (
        <div className="flex flex-wrap gap-3 mt-8">
          <Cta
            label={primaryCtaLabel}
            href={primaryCtaHref}
            variant="primary"
          />
          <Cta
            label={secondaryCtaLabel}
            href={secondaryCtaHref}
            variant="secondary"
          />
        </div>
      )}
    </div>
  );

  return (
    <section id={anchorId} className="bg-surface">
      <div className="relative w-full h-[420px] md:h-[560px] overflow-hidden">
        {useSlideshow ? (
          <HeroSlideshow
            pair={slideshow.pair}
            index={slideshow.index}
            showBefore={slideshow.showBefore}
            pairsCount={pairs.length}
            fallbackAlt={imageAlt}
            onGoToPair={slideshow.goToPair}
          />
        ) : image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16">
        {/* Overlap + button anchor: bottom of button = top of this box = top of title panel */}
        <div className="relative max-w-[880px] -mt-10 md:-mt-14">
          {useSlideshow && !slideshow.showBefore && (
            <button
              type="button"
              onClick={slideshow.showBeforeImage}
              className="absolute left-0 bottom-full z-30 font-display not-italic text-small text-on-dark leading-relaxed bg-dark hover:bg-dark/95 rounded-t-md rounded-b-none border-0 outline-none ring-0 shadow-none px-2.5 py-1 transition-colors"
            >
              See how it started...
            </button>
          )}
          {titlePanel}
        </div>
      </div>
    </section>
  );
}
