"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  /** A second copy of the wordmark, drawn in negative inside the mark. Leave out over a picture or video. */
  children?: ReactNode;
  className?: string;
};

/**
 * The Ø mark, cut out of paper, roaming over its box. Over a wordmark it shows the letters in
 * negative; over a picture or video it inverts whatever is underneath. It follows the pointer,
 * and drifts on its own when there is none. Place it inside the positioned box it should roam.
 */
export function HeroLens({ children, className }: Props) {
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
    <div ref={lensRef} className={`hero-lens ${className ?? ""}`} aria-hidden="true">
      <div className="hero-lens-fill" data-blend={children ? undefined : "true"}>
        {children}
      </div>
    </div>
  );
}
