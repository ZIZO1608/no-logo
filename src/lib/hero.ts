import "server-only";
import { cacheTag } from "next/cache";
import { readSetting } from "./db";

export const HERO_TAG = "hero";
export const HERO_SETTING = "hero";

export type HeroMedia = { file: string; kind: "image" | "video" };

/** Only names this app generated itself are ever read from or written to disk. */
export const HERO_FILE_PATTERN = /^hero-\d{10,16}\.(jpg|png|webp|mp4|webm)$/;

export const parseHeroMedia = (raw: string | null): HeroMedia | null => {
  if (!raw) return null;
  try {
    const { file, kind } = JSON.parse(raw) as Partial<HeroMedia>;
    const isValid = typeof file === "string" && HERO_FILE_PATTERN.test(file) && (kind === "image" || kind === "video");
    return isValid ? { file, kind } : null;
  } catch {
    return null;
  }
};

/** Cached so the homepage stays prerendered; the admin upload clears this tag. */
export async function getHeroMedia(): Promise<HeroMedia | null> {
  "use cache";
  cacheTag(HERO_TAG);
  return parseHeroMedia(readSetting(HERO_SETTING));
}
