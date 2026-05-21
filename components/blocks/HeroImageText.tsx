"use client";

import Image from "next/image";
import { Cta, hasCta, type CtaMode } from "./Cta";
import { parseHeroSlidePairs } from "@/lib/heroSlideshow";
import { HeroSlideshow } from "./HeroSlideshow";
import { HeroVignetteOverlay } from "./HeroVignetteOverlay";
import { useHeroSlideshow } from "./useHeroSlideshow";

/** Matches title panel glow on top and sides only (no shadow on bottom edge). */
const HERO_BTN_GLOW =
  "shadow-[0_-20px_50px_-12px_color-mix(in_srgb,var(--color-frame)_60%,transparent),-18px_-6px_44px_-14px_color-mix(in_srgb,var(--color-frame)_55%,transparent),18px_-6px_44px_-14px_color-mix(in_srgb,var(--color-frame)_55%,transparent)]";

const HERO_BTN_BASE =
  "font-display not-italic text-small leading-relaxed rounded-t-md rounded-b-none outline-none ring-0 px-2.5 py-1 transition-opacity";

type Props = {
  anchorId?: string;
  image: string;
  imageAlt: string;
  slides?: unknown;
  headline: string;
  subtitle: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  primaryCtaMode?: CtaMode;
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
  primaryCtaMode = "link",
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
  );

  return (
    <section id={anchorId} className="bg-surface">
      <div className="relative w-full h-[420px] md:h-[560px] overflow-hidden">
        {useSlideshow ? (
          <HeroSlideshow
            pairs={pairs}
            pair={slideshow.pair}
            index={slideshow.index}
            fromIndex={slideshow.fromIndex}
            slideDirection={slideshow.slideDirection}
            showBefore={slideshow.showBefore}
            fallbackAlt={imageAlt}
            onGoToPair={slideshow.goToPair}
            onNext={slideshow.goToNextPair}
            onPrev={slideshow.goToPrevPair}
          />
        ) : image ? (
          <>
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <HeroVignetteOverlay />
          </>
        ) : null}
      </div>

      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16">
        {/* Overlap + button anchor: bottom of button = top of this box = top of title panel */}
        <div className="relative max-w-[880px] -mt-10 md:-mt-14">
          {useSlideshow && !slideshow.showBefore && (
            <button
              type="button"
              onClick={slideshow.showBeforeImage}
              className={`absolute left-0 bottom-full z-30 ${HERO_BTN_BASE} ${HERO_BTN_GLOW} text-ink-secondary bg-page opacity-100 hover:opacity-95`}
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
