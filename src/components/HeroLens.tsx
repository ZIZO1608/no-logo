"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** The wordmark to redraw in negative inside the mark. Leave out over a picture or video. */
  text?: string;
  textClassName?: string;
};

/**
 * The Ø mark, cut out of paper, roaming over the hero. Over the wordmark it shows the letters in
 * negative; over a picture or video it inverts whatever is underneath. It follows the pointer,
 * and drifts on its own when there is none. Place it inside the positioned box it should roam.
 */
export function HeroLens({ text, textClassName }: Props) {
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lens = lensRef.current;
    const host = lens?.parentElement;
    if (!lens || !host) return;

    const follow = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = host.getBoundingClientRect();
      lens.style.setProperty("--lens-x", `${event.clientX - box.left}px`);
      lens.style.setProperty("--lens-y", `${event.clientY - box.top}px`);
      lens.dataset.live = "true";
    };
    const release = () => {
      delete lens.dataset.live;
    };

    host.addEventListener("pointermove", follow);
    host.addEventListener("pointerleave", release);
    return () => {
      host.removeEventListener("pointermove", follow);
      host.removeEventListener("pointerleave", release);
    };
  }, []);

  return (
    <div ref={lensRef} className="hero-lens" aria-hidden="true">
      <div className="hero-lens-fill" data-blend={text ? undefined : "true"}>
        {text && (
          <p dir="ltr" className={textClassName}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
