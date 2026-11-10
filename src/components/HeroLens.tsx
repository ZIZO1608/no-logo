"use client";

import { useEffect, useRef } from "react";

type Props = { text: string; textClassName: string };

/**
 * A paper-coloured disc with the logo's slash that roams over the hero and shows the big
 * wordmark in negative. It follows the pointer, and drifts on its own when there is none.
 * Place it inside the positioned box that holds the wordmark.
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
      <div className="hero-lens-fill">
        <p dir="ltr" className={textClassName}>
          {text}
        </p>
        <span className="hero-lens-slash" />
      </div>
    </div>
  );
}
