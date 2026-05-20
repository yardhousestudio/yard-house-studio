"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const CROSSFADE_MS = 800;

export type HeroSlidePair = {
  beforeImage?: string;
  afterImage?: string;
  beforeAlt?: string;
  afterAlt?: string;
};

type Props = {
  pairs: HeroSlidePair[];
  beforeDurationSec: number;
  afterDurationSec: number;
  fallbackAlt: string;
};

function durationSec(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export function HeroSlideshow({
  pairs,
  beforeDurationSec,
  afterDurationSec,
  fallbackAlt,
}: Props) {
  const beforeMs = durationSec(beforeDurationSec, 1) * 1000;
  const afterMs = durationSec(afterDurationSec, 5) * 1000;

  const [index, setIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  const pair = pairs[index];
  const beforeAlt = pair.beforeAlt?.trim() || fallbackAlt;
  const afterAlt = pair.afterAlt?.trim() || fallbackAlt;

  const nextIndex = (index + 1) % pairs.length;
  const nextPair = pairs[nextIndex];

  // Preload upcoming slide images to reduce flashes between pairs.
  useEffect(() => {
    for (const src of [nextPair.beforeImage, nextPair.afterImage]) {
      if (!src) continue;
      const img = new window.Image();
      img.src = src;
    }
  }, [nextPair.afterImage, nextPair.beforeImage]);

  useEffect(() => {
    if (pairs.length === 0) return;

    const controller = new AbortController();
    const { signal } = controller;

    async function run() {
      while (!signal.aborted) {
        setShowAfter(false);
        try {
          await sleep(beforeMs, signal);
          setShowAfter(true);
          await sleep(CROSSFADE_MS + afterMs, signal);
          setIndex((i) => (i + 1) % pairs.length);
        } catch {
          break;
        }
      }
    }

    run();
    return () => controller.abort();
  }, [pairs.length, beforeMs, afterMs]);

  const sizes = "100vw";

  return (
    <div className="absolute inset-0 bg-surface">
      <Image
        key={`before-${index}`}
        src={pair.beforeImage!}
        alt={beforeAlt}
        fill
        priority={index === 0}
        sizes={sizes}
        className="object-cover"
      />
      <Image
        key={`after-${index}`}
        src={pair.afterImage!}
        alt={afterAlt}
        fill
        sizes={sizes}
        className={`object-cover transition-opacity duration-700 ease-in-out ${
          showAfter ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export function parseHeroSlidePairs(
  slides: unknown,
): HeroSlidePair[] {
  if (!Array.isArray(slides)) return [];
  return slides.filter(
    (item): item is HeroSlidePair =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as HeroSlidePair).beforeImage === "string" &&
      typeof (item as HeroSlidePair).afterImage === "string" &&
      (item as HeroSlidePair).beforeImage!.trim() !== "" &&
      (item as HeroSlidePair).afterImage!.trim() !== "",
  );
}
