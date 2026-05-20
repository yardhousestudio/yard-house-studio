"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  HERO_PAIR_SLIDE_MS,
  type HeroSlidePair,
} from "@/lib/heroSlideshow";
import type { HeroSlideDirection } from "./useHeroSlideshow";

type Props = {
  pairs: HeroSlidePair[];
  pair: HeroSlidePair;
  index: number;
  fromIndex: number | null;
  slideDirection: HeroSlideDirection | null;
  showBefore: boolean;
  fallbackAlt: string;
  onGoToPair: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

function PairAfterImage({
  pair,
  alt,
  priority,
}: {
  pair: HeroSlidePair;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={pair.afterImage!}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      className="object-cover object-center pointer-events-none"
    />
  );
}

function PairDissolve({
  pair,
  showBefore,
  fallbackAlt,
  priority,
}: {
  pair: HeroSlidePair;
  showBefore: boolean;
  fallbackAlt: string;
  priority?: boolean;
}) {
  const beforeAlt = pair.beforeAlt?.trim() || `${fallbackAlt} (before)`;
  const afterAlt = pair.afterAlt?.trim() || fallbackAlt;
  const fadeClass =
    "object-cover object-center pointer-events-none transition-opacity duration-700 ease-in-out";

  return (
    <>
      <Image
        src={pair.afterImage!}
        alt={afterAlt}
        fill
        priority={priority}
        sizes="100vw"
        className={`${fadeClass} ${showBefore ? "opacity-0" : "opacity-100"}`}
      />
      <Image
        src={pair.beforeImage!}
        alt={beforeAlt}
        fill
        sizes="100vw"
        className={`${fadeClass} absolute inset-0 ${
          showBefore ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}

function HeroSlideTrack({
  fromPair,
  toPair,
  direction,
  fallbackAlt,
}: {
  fromPair: HeroSlidePair;
  toPair: HeroSlidePair;
  direction: HeroSlideDirection;
  fallbackAlt: string;
}) {
  const [started, setStarted] = useState(false);
  const isNext = direction === "left";
  const fromAlt = fromPair.afterAlt?.trim() || fallbackAlt;
  const toAlt = toPair.afterAlt?.trim() || fallbackAlt;

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setStarted(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={`flex h-full w-[200%] transition-transform ease-[cubic-bezier(0.4,0,0.2,1)] ${
          started
            ? isNext
              ? "-translate-x-1/2"
              : "translate-x-0"
            : isNext
              ? "translate-x-0"
              : "-translate-x-1/2"
        }`}
        style={{ transitionDuration: `${HERO_PAIR_SLIDE_MS}ms` }}
      >
        <div className="relative h-full w-1/2 shrink-0">
          <PairAfterImage
            pair={isNext ? fromPair : toPair}
            alt={isNext ? fromAlt : toAlt}
          />
        </div>
        <div className="relative h-full w-1/2 shrink-0">
          <PairAfterImage
            pair={isNext ? toPair : fromPair}
            alt={isNext ? toAlt : fromAlt}
          />
        </div>
      </div>
    </div>
  );
}

const ARROW_BTN =
  "absolute top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-page/90 text-ink shadow-sm transition-opacity hover:bg-page hover:opacity-100 opacity-90";

export function HeroSlideshow({
  pairs,
  pair,
  index,
  fromIndex,
  slideDirection,
  showBefore,
  fallbackAlt,
  onGoToPair,
  onNext,
  onPrev,
}: Props) {
  const pairsCount = pairs.length;
  const sliding = slideDirection !== null && fromIndex !== null;
  const fromPair = sliding ? pairs[fromIndex] : null;

  return (
    <div className="absolute inset-0 bg-surface">
      {sliding && fromPair ? (
        <HeroSlideTrack
          fromPair={fromPair}
          toPair={pair}
          direction={slideDirection}
          fallbackAlt={fallbackAlt}
        />
      ) : (
        <PairDissolve
          pair={pair}
          showBefore={showBefore}
          fallbackAlt={fallbackAlt}
          priority={index === 0}
        />
      )}

      {pairsCount > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous project"
            onClick={onPrev}
            className={`${ARROW_BTN} left-4 md:left-6`}
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={onNext}
            className={`${ARROW_BTN} right-4 md:right-6`}
          >
            <ArrowRightIcon className="h-5 w-5" aria-hidden />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {Array.from({ length: pairsCount }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show project ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => onGoToPair(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-page"
                    : "w-1.5 bg-page/50 hover:bg-page/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
