"use client";

import { useEffect, useRef } from "react";

type Props = { src: string; className?: string };

/**
 * Silent looping background video.
 * React does not write the `muted` attribute into the page HTML, and browsers refuse to
 * autoplay a video that is not muted, so it is muted and started here once the page loads.
 */
export function HeroVideo({ src, className }: Props) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    element.muted = true;
    // Autoplay can still be refused (data saver, low power mode): the first frame stays as a still.
    element.play().catch(() => undefined);
  }, [src]);

  return <video ref={video} src={src} muted loop playsInline autoPlay preload="auto" className={className} />;
}
