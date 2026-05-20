"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HeroSlidePair } from "@/lib/heroSlideshow";

const AFTER_HOLD_MS = 5000;
const BEFORE_HOLD_MS = 5000;

export function useHeroSlideshow(pairs: HeroSlidePair[]) {
  const [index, setIndex] = useState(0);
  const [showBefore, setShowBefore] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const manualTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

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

  const resetTimers = useCallback(() => {
    clearAutoTimer();
    clearManualTimer();
  }, [clearAutoTimer, clearManualTimer]);

  const goToPair = useCallback(
    (next: number) => {
      resetTimers();
      setShowBefore(false);
      setIndex(next);
    },
    [resetTimers],
  );

  useEffect(() => {
    if (pairs.length === 0 || showBefore) return;
    clearAutoTimer();
    autoTimerRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % pairs.length);
    }, AFTER_HOLD_MS);
    return clearAutoTimer;
  }, [index, showBefore, pairs.length, clearAutoTimer]);

  const nextIndex = (index + 1) % pairs.length;
  const nextPair = pairs[nextIndex];
  useEffect(() => {
    for (const src of [nextPair.beforeImage, nextPair.afterImage]) {
      if (!src) continue;
      const img = new window.Image();
      img.src = src;
    }
  }, [nextPair.afterImage, nextPair.beforeImage]);

  useEffect(() => () => resetTimers(), [resetTimers]);

  const showBeforeImage = useCallback(() => {
    if (pairs.length === 0 || showBefore) return;
    clearAutoTimer();
    clearManualTimer();
    setShowBefore(true);

    manualTimerRef.current = window.setTimeout(() => {
      setShowBefore(false);
      setIndex((i) => (i + 1) % pairs.length);
      manualTimerRef.current = null;
    }, BEFORE_HOLD_MS);
  }, [showBefore, clearAutoTimer, clearManualTimer, pairs.length]);

  return {
    index,
    showBefore,
    pair,
    goToPair,
    showBeforeImage,
  };
}
