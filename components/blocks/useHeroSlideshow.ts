"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HERO_PAIR_SLIDE_MS,
  type HeroSlidePair,
} from "@/lib/heroSlideshow";

const AFTER_HOLD_MS = 7000;
const BEFORE_HOLD_MS = 7000;
const MIN_AFTER_MS = 3000;

export type HeroSlideDirection = "left" | "right";

export function useHeroSlideshow(pairs: HeroSlidePair[]) {
  const [index, setIndex] = useState(0);
  const [fromIndex, setFromIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<HeroSlideDirection | null>(
    null,
  );
  const [showBefore, setShowBefore] = useState(false);
  const indexRef = useRef(index);
  indexRef.current = index;
  const autoTimerRef = useRef<number | null>(null);
  const manualTimerRef = useRef<number | null>(null);
  const slideTimerRef = useRef<number | null>(null);
  /** After returning from “before”, advance after 1s; otherwise 5s on after. */
  const afterHoldModeRef = useRef<"full" | "min">("full");

  const pair = pairs[index] ?? pairs[0]!;

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const clearManualTimer = useCallback(() => {
    if (manualTimerRef.current) {
      window.clearTimeout(manualTimerRef.current);
      manualTimerRef.current = null;
    }
  }, []);

  const clearSlideTimer = useCallback(() => {
    if (slideTimerRef.current) {
      window.clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
  }, []);

  const resetTimers = useCallback(() => {
    clearAutoTimer();
    clearManualTimer();
    clearSlideTimer();
  }, [clearAutoTimer, clearManualTimer, clearSlideTimer]);

  const beginSlide = useCallback(
    (nextIndex: number, direction: HeroSlideDirection) => {
      clearSlideTimer();
      setFromIndex(indexRef.current);
      setSlideDirection(direction);
      setIndex(nextIndex);
      slideTimerRef.current = window.setTimeout(() => {
        setFromIndex(null);
        setSlideDirection(null);
        slideTimerRef.current = null;
      }, HERO_PAIR_SLIDE_MS);
    },
    [clearSlideTimer],
  );

  const goToNextPair = useCallback(() => {
    if (pairs.length <= 1) return;
    resetTimers();
    setShowBefore(false);
    afterHoldModeRef.current = "full";
    beginSlide((index + 1) % pairs.length, "left");
  }, [pairs.length, resetTimers, beginSlide, index]);

  const goToPrevPair = useCallback(() => {
    if (pairs.length <= 1) return;
    resetTimers();
    setShowBefore(false);
    afterHoldModeRef.current = "full";
    beginSlide((index - 1 + pairs.length) % pairs.length, "right");
  }, [pairs.length, resetTimers, beginSlide, index]);

  const scheduleAfterHold = useCallback(() => {
    if (pairs.length <= 1 || showBefore || slideDirection) return;
    clearAutoTimer();
    const delay =
      afterHoldModeRef.current === "min" ? MIN_AFTER_MS : AFTER_HOLD_MS;
    afterHoldModeRef.current = "full";
    autoTimerRef.current = window.setTimeout(() => {
      goToNextPair();
    }, delay);
  }, [
    pairs.length,
    showBefore,
    slideDirection,
    clearAutoTimer,
    goToNextPair,
  ]);

  useEffect(() => {
    if (pairs.length === 0 || showBefore || slideDirection) return;
    scheduleAfterHold();
    return clearAutoTimer;
  }, [
    index,
    showBefore,
    slideDirection,
    pairs.length,
    scheduleAfterHold,
    clearAutoTimer,
  ]);

  const nextIndex = (index + 1) % pairs.length;
  const nextPair = pairs[nextIndex];
  useEffect(() => {
    if (!nextPair) return;
    for (const src of [nextPair.beforeImage, nextPair.afterImage]) {
      if (!src) continue;
      const img = new window.Image();
      img.src = src;
    }
  }, [nextPair?.afterImage, nextPair?.beforeImage]);

  useEffect(() => () => resetTimers(), [resetTimers]);

  const goToPair = useCallback(
    (target: number) => {
      if (
        pairs.length === 0 ||
        target === index ||
        target < 0 ||
        target >= pairs.length
      ) {
        return;
      }
      resetTimers();
      setShowBefore(false);
      afterHoldModeRef.current = "full";
      const direction: HeroSlideDirection =
        target > index ? "left" : "right";
      beginSlide(target, direction);
    },
    [pairs.length, index, resetTimers, beginSlide],
  );

  const showBeforeImage = useCallback(() => {
    if (pairs.length === 0 || showBefore) return;
    clearAutoTimer();
    clearManualTimer();
    setShowBefore(true);

    manualTimerRef.current = window.setTimeout(() => {
      afterHoldModeRef.current = "min";
      setShowBefore(false);
      manualTimerRef.current = null;
    }, BEFORE_HOLD_MS);
  }, [showBefore, clearAutoTimer, clearManualTimer, pairs.length]);

  return {
    index,
    fromIndex,
    slideDirection,
    showBefore,
    pair,
    goToPair,
    goToNextPair,
    goToPrevPair,
    showBeforeImage,
  };
}
