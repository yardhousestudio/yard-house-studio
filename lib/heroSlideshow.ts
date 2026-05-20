/** Horizontal slide between image pairs (ms). */
export const HERO_PAIR_SLIDE_MS = 1000;

export type HeroSlidePair = {
  beforeImage?: string;
  afterImage?: string;
  beforeAlt?: string;
  afterAlt?: string;
};

export function parseHeroSlidePairs(slides: unknown): HeroSlidePair[] {
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
