"use client";

import Image from "next/image";
import type { HeroSlidePair } from "@/lib/heroSlideshow";

type Props = {
  pair: HeroSlidePair;
  index: number;
  showBefore: boolean;
  pairsCount: number;
  fallbackAlt: string;
  onGoToPair: (index: number) => void;
};

export function HeroSlideshow({
  pair,
  index,
  showBefore,
  pairsCount,
  fallbackAlt,
  onGoToPair,
}: Props) {
  const beforeAlt = pair.beforeAlt?.trim() || `${fallbackAlt} (before)`;
  const afterAlt = pair.afterAlt?.trim() || fallbackAlt;

  const sizes = "100vw";
  const fadeClass =
    "object-cover object-center pointer-events-none transition-opacity duration-700 ease-in-out";

  return (
    <div className="absolute inset-0 bg-surface">
      <Image
        key={`after-${index}`}
        src={pair.afterImage!}
        alt={afterAlt}
        fill
        priority={index === 0}
        sizes={sizes}
        className={`${fadeClass} ${showBefore ? "opacity-0" : "opacity-100"}`}
      />
      <Image
        key={`before-${index}`}
        src={pair.beforeImage!}
        alt={beforeAlt}
        fill
        sizes={sizes}
        className={`${fadeClass} absolute inset-0 ${
          showBefore ? "opacity-100" : "opacity-0"
        }`}
      />

      {pairsCount > 1 && (
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
      )}
    </div>
  );
}
